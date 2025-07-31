import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';

// Ensure __app_id, __firebase_config, and __initial_auth_token are available
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Utility function to convert PCM audio data to WAV format
function pcmToWav(pcmData, sampleRate) {
    const pcm16 = new Int16Array(pcmData);
    const wavBuffer = new ArrayBuffer(44 + pcm16.length * 2);
    const view = new DataView(wavBuffer);

    // RIFF identifier
    writeString(view, 0, 'RIFF');
    // File length
    view.setUint32(4, 36 + pcm16.length * 2, true);
    // RIFF type
    writeString(view, 8, 'WAVE');
    // format chunk identifier
    view.setUint32(12, 16, true);
    // format chunk length
    view.setUint16(20, 1, true);
    // sample format (raw)
    view.setUint16(22, 1, true);
    // channel count
    view.setUint32(24, sampleRate, true);
    // sample rate
    view.setUint32(28, sampleRate * 2, true);
    // byte rate (sample rate * block align)
    view.setUint16(32, 2, true);
    // block align (channels * bytes per sample)
    view.setUint16(34, 16, true);
    // bits per sample
    writeString(view, 36, 'data');
    // data chunk identifier
    view.setUint32(40, pcm16.length * 2, true);
    // data chunk length

    // Write the PCM data
    let offset = 44;
    for (let i = 0; i < pcm16.length; i++, offset += 2) {
        view.setInt16(offset, pcm16[i], true);
    }

    return new Blob([view], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

const defaultPropertyTypes = [
    "Residential Home", "Apartment Building", "Condominium", "Townhouse",
    "Commercial Office", "Retail Store", "Shopping Mall", "Restaurant",
    "Warehouse", "Manufacturing Plant", "Industrial Park", "Farm",
    "Vacant Land", "Hotel", "Motel", "Hospital", "Medical Clinic",
    "School", "University", "Church", "Community Center",
    "Supermarket", "Convenience Store", "Gas Station", "Auto Repair Shop",
    "Daycare Center", "Gym/Fitness Center", "Salon/Spa", "Theater/Cinema",
    "Art Gallery", "Museum", "Library", "Parking Garage",
    "Data Center", "Telecommunications Facility", "Bridge", "Road",
    "Airport", "Seaport", "Railway Station", "Power Plant",
    "Water Treatment Plant", "Waste Management Facility", "Sports Arena",
    "Golf Course", "Amusement Park", "Zoo", "Aquarium",
    "Marina", "Campground", "Ski Resort", "Vineyard", "Brewery"
];

const defaultPolicyCategories = [
    "Commercial Property", "General Liability", "Workers' Compensation",
    "Commercial Auto", "Professional Liability (E&O)", "Cyber Liability",
    "Directors & Officers (D&O)", "Business Interruption", "Umbrella Policy",
    "Builder's Risk", "Inland Marine", "Fidelity Bond", "Surety Bond",
    "Errors & Omissions (E&O)", "Product Liability", "Environmental Liability",
    "Employment Practices Liability (EPLI)", "Crime Insurance", "Boiler & Machinery",
    "Farm & Ranch", "Homeowners", "Renters", "Auto", "Life", "Health", "Disability"
];






// New: Default Carriers
const defaultCarriers = [
    { name: "Allstate", coveredPropertyTypes: ["Residential Home", "Commercial Office", "Retail Store", "Apartment Building"] },
    { name: "Travelers", coveredPropertyTypes: ["Commercial Property", "Manufacturing Plant", "Warehouse", "Hotel"] },
    { name: "Progressive", coveredPropertyTypes: ["Residential Home", "Condominium", "Townhouse", "Auto Repair Shop"] },
    { name: "State Farm", coveredPropertyTypes: ["Residential Home", "Farm", "Restaurant", "Supermarket"] },
    { name: "Liberty Mutual", coveredPropertyTypes: ["Commercial Office", "Shopping Mall", "Hospital", "School"] },
    { name: "Chubb", coveredPropertyTypes: ["Commercial Property", "Industrial Park", "Data Center", "Airport"] },
    { name: "Nationwide", coveredPropertyTypes: ["Residential Home", "Farm", "Retail Store", "Restaurant"] },
    { name: "Farmers Insurance", coveredPropertyTypes: ["Residential Home", "Apartment Building", "Vacant Land"] },
    { name: "Geico", coveredPropertyTypes: ["Residential Home"] }, // Primarily auto, but can have some property
    { name: "Hartford", coveredPropertyTypes: ["Commercial Office", "Manufacturing Plant", "Warehouse"] },
];






const App = () => {
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    const [policies, setPolicies] = useState([]);
    const [carriers, setCarriers] = useState([]);
    const [propertyTypes, setPropertyTypes] = useState([]);
    const [policyCategories, setPolicyCategories] = useState([]);

    // Expanded newPolicy state to include all new metadata fields
    const [newPolicy, setNewPolicy] = useState({
        policyIdSku: '', // Renamed from policyNumber
        carrierName: '', // Renamed from insuranceCarrier
        productLine: '', // Renamed from policyCategory
        policyCoveredPropertyTypes: [], // Changed to array for multi-select
        minPropertySizeSqFt: '',
        maxPropertySizeSqFt: '',
        geographicCoverage: '',
        coverageLimits: '',
        minDeductible: '',
        maxDeductible: '',
        minAnnualPremium: '',
        maxAnnualPremium: '',
        actualAnnualPremium: '', // For the specific policy's premium
        policyPeriodStart: '', // Renamed from startDate
        policyPeriodEnd: '', // Renamed from endDate
        perilsCovered: '',
        majorExclusions: '',
        eligibilityCriteria: '',
        underwritingNotes: '',
        documentLink: '',
    });

    const [newCarrier, setNewCarrier] = useState({
        name: '',
        coveredPropertyTypes: [],
    });
    const [newPropertyTypeName, setNewPropertyTypeName] = useState('');
    const [newPolicyCategoryName, setNewPolicyCategoryName] = useState('');

    const [editingPolicyId, setEditingPolicyId] = useState(null);
    const [editingCarrierId, setEditingCarrierId] = useState(null);
    const [editingPropertyTypeId, setEditingPropertyTypeId] = useState(null);
    const [editingPolicyCategoryId, setEditingPolicyCategoryId] = useState(null);

    const [message, setMessage] = useState('');
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentView, setCurrentView] = useState('policies'); // Default view
    const [selectedCarrierForDetails, setSelectedCarrierForDetails] = useState(null); // New state for carrier details view

    // State for Search and Filter (for main policy list)
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCarrier, setFilterCarrier] = useState('');
    const [filterProductLine, setFilterProductLine] = useState('');
    const [filterPropertyType, setFilterPropertyType] = useState('');
    const [filterMinSize, setFilterMinSize] = useState('');
    const [filterMaxSize, setFilterMaxSize] = useState('');
    const [filterGeo, setFilterGeo] = useState('');


    // State for Sorting (for main policy list)
    const [sortColumn, setSortColumn] = useState('policyIdSku');
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

    // State for Pagination (for main policy list)
    const [currentPage, setCurrentPage] = useState(1);
    const [policiesPerPage] = useState(10); // Number of policies per page

    // New state for Customer Criteria (for policy matching)
    const [customerCriteria, setCustomerCriteria] = useState({
        propertyType: '',
        propertySize: '',
        geographicLocation: '',
        productLine: '',
        desiredCoverageLimitsKeywords: '',
        desiredDeductible: '',
        desiredAnnualPremium: '',
        desiredPerilsKeywords: '',
        avoidExclusionsKeywords: '',
    });

    // State for Policy Summary Modal
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [summaryContent, setSummaryContent] = useState('');

    // State for Carrier Overview Modal
    const [showCarrierOverviewModal, setShowCarrierOverviewModal] = useState(false);
    const [carrierOverviewContent, setCarrierOverviewContent] = useState('');


    // Initialize Firebase and set up authentication
    useEffect(() => {
        const app = initializeApp(firebaseConfig);
        const authInstance = getAuth(app);
        const dbInstance = getFirestore(app);

        setAuth(authInstance);
        setDb(dbInstance);

        const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                try {
                    if (initialAuthToken) {
                        await signInWithCustomToken(authInstance, initialAuthToken);
                    } else {
                        await signInAnonymously(authInstance);
                    }
                } catch (error) {
                    console.error("Error signing in:", error);
                    setMessage("Failed to authenticate. Please try again.");
                }
            }
            setIsAuthReady(true);
        });

        return () => unsubscribe();
    }, []);

    // Fetch policies, carriers, and property types when auth is ready
    useEffect(() => {
        if (!isAuthReady || !db || !userId) {
            return;
        }

        // Policies
        const policiesCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/policies`);
        const unsubscribePolicies = onSnapshot(policiesCollectionRef, (snapshot) => {
            const policiesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPolicies(policiesData);
        }, (error) => {
            console.error("Error fetching policies:", error);
            setMessage("Error loading policies.");
        });

        // Carriers
        const carriersCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/carriers`);
        const unsubscribeCarriers = onSnapshot(query(carriersCollectionRef), async (snapshot) => {
            const carriersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            carriersData.sort((a, b) => a.name.localeCompare(b.name));
            setCarriers(carriersData);

            // If no carriers exist, add defaults
            if (carriersData.length === 0) {
                try {
                    for (const carrier of defaultCarriers) {
                        await addDoc(carriersCollectionRef, carrier);
                    }
                    setMessage('Default carriers added!');
                } catch (error) {
                    console.error("Error adding default carriers:", error);
                    setMessage("Error adding default carriers.");
                }
            }
        }, (error) => {
            console.error("Error fetching carriers:", error);
            setMessage("Error loading carriers.");
        });

        // Property Types
        const propertyTypesCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/propertyTypes`);
        const unsubscribePropertyTypes = onSnapshot(query(propertyTypesCollectionRef), async (snapshot) => {
            const typesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            typesData.sort((a, b) => a.name.localeCompare(b.name));
            setPropertyTypes(typesData);

            // If no property types exist, add defaults
            if (typesData.length === 0) {
                try {
                    for (const typeName of defaultPropertyTypes) {
                        await addDoc(propertyTypesCollectionRef, { name: typeName });
                    }
                    setMessage('Default property types added!');
                } catch (error) {
                    console.error("Error adding default property types:", error);
                    setMessage("Error adding default property types.");
                }
            }
        }, (error) => {
            console.error("Error fetching property types:", error);
            setMessage("Error loading property types.");
        });

        // Policy Categories
        const policyCategoriesCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/policyCategories`);
        const unsubscribePolicyCategories = onSnapshot(query(policyCategoriesCollectionRef), async (snapshot) => {
            const categoriesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            categoriesData.sort((a, b) => a.name.localeCompare(b.name));
            setPolicyCategories(categoriesData);

            // If no policy categories exist, add defaults
            if (categoriesData.length === 0) {
                try {
                    for (const categoryName of defaultPolicyCategories) {
                        await addDoc(policyCategoriesCollectionRef, { name: categoryName });
                    }
                    setMessage('Default policy categories added!');
                } catch (error) {
                    console.error("Error adding default policy categories:", error);
                    setMessage("Error adding default policy categories.");
                }
            }
        }, (error) => {
            console.error("Error fetching policy categories:", error);
            setMessage("Error loading policy categories.");
        });


        return () => {
            unsubscribePolicies();
            unsubscribeCarriers();
            unsubscribePropertyTypes();
            unsubscribePolicyCategories(); // Cleanup for new listener
        };
    }, [db, userId, isAuthReady]);

    // Handlers for Policy Form
    const handlePolicyInputChange = (e) => {
        const { name, value } = e.target;
        setNewPolicy(prev => ({ ...prev, [name]: value }));
    };

    const handlePolicyPropertyTypeChange = (e) => {
        const { value, checked } = e.target;
        setNewPolicy(prev => {
            const updatedTypes = checked
                ? [...prev.policyCoveredPropertyTypes, value]
                : prev.policyCoveredPropertyTypes.filter(type => type !== value);
            return { ...prev, policyCoveredPropertyTypes: updatedTypes };
        });
    };

    const handlePolicySubmit = async (e) => {
        e.preventDefault();
        if (!db || !userId) {
            setMessage("Database not ready or user not authenticated.");
            return;
        }

        setIsLoading(true);
        try {
            const policiesCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/policies`);
            if (editingPolicyId) {
                const policyDocRef = doc(db, `artifacts/${appId}/users/${userId}/policies`, editingPolicyId);
                await updateDoc(policyDocRef, newPolicy);
                setMessage('Policy updated successfully!');
                setEditingPolicyId(null);
            } else {
                await addDoc(policiesCollectionRef, newPolicy);
                setMessage('Policy added successfully!');
            }
            // Reset form
            setNewPolicy({
                policyIdSku: '',
                carrierName: '',
                productLine: '',
                policyCoveredPropertyTypes: [],
                minPropertySizeSqFt: '',
                maxPropertySizeSqFt: '',
                geographicCoverage: '',
                coverageLimits: '',
                minDeductible: '',
                maxDeductible: '',
                minAnnualPremium: '',
                maxAnnualPremium: '',
                actualAnnualPremium: '',
                policyPeriodStart: '',
                policyPeriodEnd: '',
                perilsCovered: '',
                majorExclusions: '',
                eligibilityCriteria: '',
                underwritingNotes: '',
                documentLink: '',
            });
        } catch (error) {
            console.error("Error saving policy:", error);
            setMessage(`Error saving policy: ${error.message}`);
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleEditPolicy = (policy) => {
        // Ensure all fields are present for editing, even if empty in DB
        setNewPolicy({
            policyIdSku: policy.policyIdSku || '',
            carrierName: policy.carrierName || '',
            productLine: policy.productLine || '',
            policyCoveredPropertyTypes: policy.policyCoveredPropertyTypes || [],
            minPropertySizeSqFt: policy.minPropertySizeSqFt || '',
            maxPropertySizeSqFt: policy.maxPropertySizeSqFt || '',
            geographicCoverage: policy.geographicCoverage || '',
            coverageLimits: policy.coverageLimits || '',
            minDeductible: policy.minDeductible || '',
            maxDeductible: policy.maxDeductible || '',
            minAnnualPremium: policy.minAnnualPremium || '',
            maxAnnualPremium: policy.maxAnnualPremium || '',
            actualAnnualPremium: policy.actualAnnualPremium || '',
            policyPeriodStart: policy.policyPeriodStart || '',
            policyPeriodEnd: policy.policyPeriodEnd || '',
            perilsCovered: policy.perilsCovered || '',
            majorExclusions: policy.majorExclusions || '',
            eligibilityCriteria: policy.eligibilityCriteria || '',
            underwritingNotes: policy.underwritingNotes || '',
            documentLink: policy.documentLink || '',
        });
        setEditingPolicyId(policy.id);
        setCurrentView('policies');
    };

    const handleDeletePolicy = async (id) => {
        if (!db || !userId) {
            setMessage("Database not ready or user not authenticated.");
            return;
        }

        setIsLoading(true);
        try {
            const policyDocRef = doc(db, `artifacts/${appId}/users/${userId}/policies`, id);
            await deleteDoc(policyDocRef);
            setMessage('Policy deleted successfully!');
        } catch (error) {
            console.error("Error deleting policy:", error);
            setMessage(`Error deleting policy: ${error.message}`);
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    // Handlers for Carrier Management
    const handleNewCarrierChange = (e) => {
        setNewCarrier({ ...newCarrier, name: e.target.value });
    };

    const handleCoveredPropertyTypeChange = (e) => {
        const { value, checked } = e.target;
        setNewCarrier(prev => {
            const updatedTypes = checked
                ? [...prev.coveredPropertyTypes, value]
                : prev.coveredPropertyTypes.filter(type => type !== value);
            return { ...prev, coveredPropertyTypes: updatedTypes };
        });
    };

    const handleAddCarrier = async (e) => {
        e.preventDefault();
        if (!db || !userId) {
            setMessage("Database not ready or user not authenticated.");
            return;
        }
        if (!newCarrier.name.trim()) {
            setMessage("Carrier name cannot be empty.");
            return;
        }

        setIsLoading(true);
        try {
            const carriersCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/carriers`);
            if (editingCarrierId) {
                const carrierDocRef = doc(db, `artifacts/${appId}/users/${userId}/carriers`, editingCarrierId);
                await updateDoc(carrierDocRef, newCarrier);
                setMessage('Carrier updated successfully!');
                setEditingCarrierId(null);
            } else {
                await addDoc(carriersCollectionRef, newCarrier);
                setMessage('Carrier added successfully!');
            }
            setNewCarrier({ name: '', coveredPropertyTypes: [] }); // Reset form
        } catch (error) {
            console.error("Error saving carrier:", error);
            setMessage(`Error saving carrier: ${error.message}`);
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleEditCarrier = (carrier) => {
        setNewCarrier({ name: carrier.name, coveredPropertyTypes: carrier.coveredPropertyTypes || [] });
        setEditingCarrierId(carrier.id);
        setCurrentView('carriersAndPropertyTypes'); // Go to the management tab
    };

    const handleDeleteCarrier = async (id) => {
        if (!db || !userId) {
            setMessage("Database not ready or user not authenticated.");
            return;
        }

        setIsLoading(true);
        try {
            const carrierDocRef = doc(db, `artifacts/${appId}/users/${userId}/carriers`, id);
            await deleteDoc(carrierDocRef);
            setMessage('Carrier deleted successfully!');
        } catch (error) {
            console.error("Error deleting carrier:", error);
            setMessage(`Error deleting carrier: ${error.message}`);
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    // Handlers for Property Type Management (now integrated)
    const handleNewPropertyTypeNameChange = (e) => {
        setNewPropertyTypeName(e.target.value);
    };

    const handleAddPropertyType = async (e) => {
        e.preventDefault();
        if (!db || !userId) {
            setMessage("Database not ready or user not authenticated.");
            return;
        }
        if (!newPropertyTypeName.trim()) {
            setMessage("Property type name cannot be empty.");
            return;
        }

        setIsLoading(true);
        try {
            const propertyTypesCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/propertyTypes`);
            if (editingPropertyTypeId) {
                const propertyTypeDocRef = doc(db, `artifacts/${appId}/users/${userId}/propertyTypes`, editingPropertyTypeId);
                await updateDoc(propertyTypeDocRef, { name: newPropertyTypeName });
                setMessage('Property type updated successfully!');
                setEditingPropertyTypeId(null);
            } else {
                await addDoc(propertyTypesCollectionRef, { name: newPropertyTypeName });
                setMessage('Property type added successfully!');
            }
            setNewPropertyTypeName('');
        } catch (error) {
            console.error("Error saving property type:", error);
            setMessage(`Error saving property type: ${error.message}`);
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleEditPropertyType = (type) => {
        setNewPropertyTypeName(type.name);
        setEditingPropertyTypeId(type.id);
    };

    const handleDeletePropertyType = async (id) => {
        if (!db || !userId) {
            setMessage("Database not ready or user not authenticated.");
            return;
        }

        setIsLoading(true);
        try {
            const propertyTypeDocRef = doc(db, `artifacts/${appId}/users/${userId}/propertyTypes`, id);
            await deleteDoc(propertyTypeDocRef);
            setMessage('Property type deleted successfully!');
        } catch (error) {
            console.error("Error deleting property type:", error);
            setMessage(`Error deleting property type: ${error.message}`);
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    // Handlers for Policy Category Management (New)
    const handleNewPolicyCategoryNameChange = (e) => {
        setNewPolicyCategoryName(e.target.value);
    };

    const handleAddPolicyCategory = async (e) => {
        e.preventDefault();
        if (!db || !userId) {
            setMessage("Database not ready or user not authenticated.");
            return;
        }
        if (!newPolicyCategoryName.trim()) {
            setMessage("Policy category name cannot be empty.");
            return;
        }

        setIsLoading(true);
        try {
            const policyCategoriesCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/policyCategories`);
            if (editingPolicyCategoryId) {
                const policyCategoryDocRef = doc(db, `artifacts/${appId}/users/${userId}/policyCategories`, editingPolicyCategoryId);
                await updateDoc(policyCategoryDocRef, { name: newPolicyCategoryName });
                setMessage('Policy category updated successfully!');
                setEditingPolicyCategoryId(null);
            } else {
                await addDoc(policyCategoriesCollectionRef, { name: newPolicyCategoryName });
                setMessage('Policy category added successfully!');
            }
            setNewPolicyCategoryName('');
        } catch (error) {
            console.error("Error saving policy category:", error);
            setMessage(`Error saving policy category: ${error.message}`);
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleEditPolicyCategory = (category) => {
        setNewPolicyCategoryName(category.name);
        setEditingPolicyCategoryId(category.id);
    };

    const handleDeletePolicyCategory = async (id) => {
        if (!db || !userId) {
            setMessage("Database not ready or user not authenticated.");
            return;
        }

        setIsLoading(true);
        try {
            const policyCategoryDocRef = doc(db, `artifacts/${appId}/users/${userId}/policyCategories`, id);
            await deleteDoc(policyCategoryDocRef);
            setMessage('Policy category deleted successfully!');
        } catch (error) {
            console.error("Error deleting policy category:", error);
            setMessage(`Error deleting policy category: ${error.message}`);
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleSpeakPolicy = async (policy) => {
        setIsLoading(true);
        const policyText = `Policy ID ${policy.policyIdSku}. Carrier: ${policy.carrierName}. Product Line: ${policy.productLine}. Covered Property Types: ${policy.policyCoveredPropertyTypes.join(', ')}. Property Size Range: ${policy.minPropertySizeSqFt} to ${policy.maxPropertySizeSqFt} square feet. Geographic Coverage: ${policy.geographicCoverage}. Coverage Limits: ${policy.coverageLimits}. Deductible Range: ${policy.minDeductible} to ${policy.maxDeductible} dollars. Annual Premium Range: ${policy.minAnnualPremium} to ${policy.maxAnnualPremium} dollars. Actual Annual Premium: ${policy.actualAnnualPremium} dollars. Policy Period: ${policy.policyPeriodStart} to ${policy.policyPeriodEnd}. Perils Covered: ${policy.perilsCovered}. Major Exclusions: ${policy.majorExclusions}. Eligibility Criteria: ${policy.eligibilityCriteria}. Underwriting Notes: ${policy.underwritingNotes}. Document Link: ${policy.documentLink}.`;

        try {
            const payload = {
                contents: [{
                    parts: [{ text: policyText }]
                }],
                generationConfig: {
                    responseModalities: ["AUDIO"],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: { voiceName: "Kore" }
                        }
                    }
                },
                model: "gemini-2.5-flash-preview-tts"
            };
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} ${response.statusText} - ${errorData.error.message}`);
            }

            const result = await response.json();
            const part = result?.candidates?.[0]?.content?.parts?.[0];
            const audioData = part?.inlineData?.data;
            const mimeType = part?.inlineData?.mimeType;

            if (audioData && mimeType && mimeType.startsWith("audio/")) {
                const sampleRateMatch = mimeType.match(/rate=(\d+)/);
                const sampleRate = sampleRateMatch ? parseInt(sampleRateMatch[1], 10) : 16000;
                const pcmData = base64ToArrayBuffer(audioData);
                const wavBlob = pcmToWav(pcmData, sampleRate);
                const audioUrl = URL.createObjectURL(wavBlob);
                const audio = new Audio(audioUrl);
                audio.play();
            } else {
                setMessage("No audio data received.");
            }
        } catch (error) {
            console.error("Error generating speech:", error);
            setMessage(`Error generating speech: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Handler for Policy Summary with LLM
    const handleSummarizePolicy = async (policy) => {
        setIsLoading(true);
        setSummaryContent('Generating summary...');
        setShowSummaryModal(true);

        const prompt = `Summarize the key coverage details, perils, major exclusions, eligibility criteria, and underwriting notes for the following insurance policy. Focus on the most important points for a broker, keep it concise and actionable, maximum 200 words:

        Coverage Limits: ${policy.coverageLimits || 'N/A'}
        Perils Covered: ${policy.perilsCovered || 'N/A'}
        Major Exclusions: ${policy.majorExclusions || 'N/A'}
        Eligibility Criteria: ${policy.eligibilityCriteria || 'N/A'}
        Underwriting Notes: ${policy.underwritingNotes || 'N/A'}
        `;

        try {
            const payload = {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.2, // Keep it factual and less creative
                    maxOutputTokens: 200, // Limit response length
                },
            };
            const apiKey = ""; // Canvas will provide this at runtime
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} ${response.statusText} - ${errorData.error.message}`);
            }

            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                setSummaryContent(result.candidates[0].content.parts[0].text);
            } else {
                setSummaryContent("Could not generate summary. No content received from AI.");
            }
        } catch (error) {
            console.error("Error generating policy summary:", error);
            setSummaryContent(`Error generating summary: ${error.message}. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    // Handler for Carrier Overview with LLM
    const handleGetCarrierOverview = async (carrier) => {
        setIsLoading(true);
        setCarrierOverviewContent('Generating carrier overview...');
        setShowCarrierOverviewModal(true);

        const carrierPolicies = policies.filter(p => p.carrierName === carrier.name);
        const policySummaries = carrierPolicies.map(p => {
            return `  - Product Line: ${p.productLine}, Policy ID: ${p.policyIdSku}, Covered Types: ${p.policyCoveredPropertyTypes.join(', ')}, Limits: ${p.coverageLimits}`;
        }).join('\n');

        const prompt = `Provide a concise overview of the insurance carrier "${carrier.name}".
        Include:
        - The types of properties they cover: ${carrier.coveredPropertyTypes.join(', ') || 'N/A'}.
        - A summary of some of the policies they offer (Product Line, Policy ID, Covered Types, Limits) based on the following data:
        ${policySummaries || 'No specific policy data available.'}
        Keep the overview to a maximum of 250 words, focusing on key strengths and offerings relevant to a broker.`;

        try {
            const payload = {
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.2,
                    maxOutputTokens: 250,
                },
            };
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} ${response.statusText} - ${errorData.error.message}`);
            }

            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                setCarrierOverviewContent(result.candidates[0].content.parts[0].text);
            } else {
                setCarrierOverviewContent("Could not generate overview. No content received from AI.");
            }
        } catch (error) {
            console.error("Error generating carrier overview:", error);
            setCarrierOverviewContent(`Error generating overview: ${error.message}. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };


    // Filtered and Sorted Policies (for main policy list)
    const filteredAndSortedPolicies = useMemo(() => {
        let filtered = policies.filter(policy => {
            const matchesSearchTerm = searchTerm.toLowerCase() === '' ||
                policy.policyIdSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                policy.coverageLimits.toLowerCase().includes(searchTerm.toLowerCase()) ||
                policy.perilsCovered.toLowerCase().includes(searchTerm.toLowerCase()) ||
                policy.majorExclusions.toLowerCase().includes(searchTerm.toLowerCase()) ||
                policy.eligibilityCriteria.toLowerCase().includes(searchTerm.toLowerCase()) ||
                policy.underwritingNotes.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCarrier = filterCarrier === '' || policy.carrierName === filterCarrier;
            const matchesProductLine = filterProductLine === '' || policy.productLine === filterProductLine;
            const matchesPropertyType = filterPropertyType === '' || (policy.policyCoveredPropertyTypes && policy.policyCoveredPropertyTypes.includes(filterPropertyType));

            const matchesMinSize = filterMinSize === '' || (policy.minPropertySizeSqFt && parseFloat(policy.minPropertySizeSqFt) >= parseFloat(filterMinSize));
            const matchesMaxSize = filterMaxSize === '' || (policy.maxPropertySizeSqFt && parseFloat(policy.maxPropertySizeSqFt) <= parseFloat(filterMaxSize));

            const matchesGeo = filterGeo.toLowerCase() === '' || policy.geographicCoverage.toLowerCase().includes(filterGeo.toLowerCase());


            return matchesSearchTerm && matchesCarrier && matchesProductLine && matchesPropertyType &&
                   matchesMinSize && matchesMaxSize && matchesGeo;
        });

        // Client-side sorting
        filtered.sort((a, b) => {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            // Handle numerical sorting for size and premium fields
            if (['minPropertySizeSqFt', 'maxPropertySizeSqFt', 'minDeductible', 'maxDeductible', 'minAnnualPremium', 'maxAnnualPremium', 'actualAnnualPremium'].includes(sortColumn)) {
                const numA = parseFloat(aValue);
                const numB = parseFloat(bValue);
                if (isNaN(numA) && isNaN(numB)) return 0;
                if (isNaN(numA)) return sortDirection === 'asc' ? 1 : -1;
                if (isNaN(numB)) return sortDirection === 'asc' ? -1 : 1;
                return sortDirection === 'asc' ? numA - numB : numB - numA;
            }
            // Handle date sorting
            if (['policyPeriodStart', 'policyPeriodEnd'].includes(sortColumn)) {
                const dateA = new Date(aValue);
                const dateB = new Date(bValue);
                if (dateA < dateB) return sortDirection === 'asc' ? -1 : 1;
                if (dateA > dateB) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            }

            // Default string comparison
            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [policies, searchTerm, filterCarrier, filterProductLine, filterPropertyType, filterMinSize, filterMaxSize, filterGeo, sortColumn, sortDirection]);

    // Pagination Logic (for main policy list)
    const indexOfLastPolicy = currentPage * policiesPerPage;
    const indexOfFirstPolicy = indexOfLastPolicy - policiesPerPage;
    const currentPolicies = filteredAndSortedPolicies.slice(indexOfFirstPolicy, indexOfLastPolicy);
    const totalPages = Math.ceil(filteredAndSortedPolicies.length / policiesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
        setCurrentPage(1); // Reset to first page on sort change
    };

    const getSortIndicator = (column) => {
        if (sortColumn === column) {
            return sortDirection === 'asc' ? ' ▲' : ' ▼';
        }
        return '';
    };

    // Dashboard Metrics
    const policyCategoryDistribution = useMemo(() => {
        return policies.reduce((acc, policy) => {
            acc[policy.productLine] = (acc[policy.productLine] || 0) + 1;
            return acc;
        }, {});
    }, [policies]);

    const carrierDistribution = useMemo(() => {
        return policies.reduce((acc, policy) => {
            acc[policy.carrierName] = (acc[policy.carrierName] || 0) + 1;
            return acc;
        }, {});
    }, [policies]);

    // Export to CSV
    const handleExportCsv = () => {
        const headers = [
            "Policy ID/SKU", "Carrier Name", "Product Line", "Covered Property Types",
            "Min Property Size (Sq. Ft.)", "Max Property Size (Sq. Ft.)", "Geographic Coverage",
            "Coverage Limits", "Min Deductible", "Max Deductible",
            "Min Annual Premium", "Max Annual Premium", "Actual Annual Premium",
            "Policy Period Start", "Policy Period End", "Perils Covered",
            "Major Exclusions", "Eligibility Criteria", "Underwriting Notes", "Document Link"
        ];
        const rows = filteredAndSortedPolicies.map(policy => [
            policy.policyIdSku,
            policy.carrierName,
            policy.productLine,
            policy.policyCoveredPropertyTypes.join('; '), // Join array for CSV
            policy.minPropertySizeSqFt,
            policy.maxPropertySizeSqFt,
            `"${policy.geographicCoverage.replace(/"/g, '""')}"`,
            `"${policy.coverageLimits.replace(/"/g, '""')}"`,
            policy.minDeductible,
            policy.maxDeductible,
            policy.minAnnualPremium,
            policy.maxAnnualPremium,
            parseFloat(policy.actualAnnualPremium).toFixed(2),
            policy.policyPeriodStart,
            policy.policyPeriodEnd,
            `"${policy.perilsCovered.replace(/"/g, '""')}"`,
            `"${policy.majorExclusions.replace(/"/g, '""')}"`,
            `"${policy.eligibilityCriteria.replace(/"/g, '""')}"`,
            `"${policy.underwritingNotes.replace(/"/g, '""')}"`,
            policy.documentLink
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(e => e.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) { // feature detection
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'insurance_policies.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
        setMessage('Policies exported to CSV!');
        setTimeout(() => setMessage(''), 3000);
    };

    // Handler for customer criteria input changes
    const handleCustomerCriteriaChange = (e) => {
        const { name, value } = e.target;
        setCustomerCriteria(prev => ({ ...prev, [name]: value }));
    };

    // Function to clear customer criteria
    const handleClearCustomerCriteria = () => {
        setCustomerCriteria({
            propertyType: '',
            propertySize: '',
            geographicLocation: '',
            productLine: '',
            desiredCoverageLimitsKeywords: '',
            desiredDeductible: '',
            desiredAnnualPremium: '',
            desiredPerilsKeywords: '',
            avoidExclusionsKeywords: '',
        });
    };

    // Matched Policies Logic
    const matchedPolicies = useMemo(() => {
        return policies.filter(policy => {
            // Property Type Match
            const matchesPropertyType = customerCriteria.propertyType === '' ||
                                        (policy.policyCoveredPropertyTypes && policy.policyCoveredPropertyTypes.includes(customerCriteria.propertyType));

            // Property Size Match
            const customerSize = parseFloat(customerCriteria.propertySize);
            const policyMinSize = parseFloat(policy.minPropertySizeSqFt);
            const policyMaxSize = parseFloat(policy.maxPropertySizeSqFt);
            const matchesPropertySize = isNaN(customerSize) ||
                                        (isNaN(policyMinSize) || customerSize >= policyMinSize) &&
                                        (isNaN(policyMaxSize) || customerSize <= policyMaxSize);

            // Geographic Coverage Match
            const matchesGeo = customerCriteria.geographicLocation.toLowerCase() === '' ||
                               policy.geographicCoverage.toLowerCase().includes(customerCriteria.geographicLocation.toLowerCase());

            // Product Line Match
            const matchesProductLine = customerCriteria.productLine === '' || policy.productLine === customerCriteria.productLine;

            // Desired Coverage Limits Keywords Match
            const matchesCoverageLimits = customerCriteria.desiredCoverageLimitsKeywords.toLowerCase() === '' ||
                                          policy.coverageLimits.toLowerCase().includes(customerCriteria.desiredCoverageLimitsKeywords.toLowerCase());

            // Desired Deductible Match
            const customerDeductible = parseFloat(customerCriteria.desiredDeductible);
            const policyMinDeductible = parseFloat(policy.minDeductible);
            const policyMaxDeductible = parseFloat(policy.maxDeductible);
            const matchesDeductible = isNaN(customerDeductible) ||
                                      (isNaN(policyMinDeductible) || customerDeductible >= policyMinDeductible) &&
                                      (isNaN(policyMaxDeductible) || customerDeductible <= policyMaxDeductible);

            // Desired Annual Premium Match
            const customerPremium = parseFloat(customerCriteria.desiredAnnualPremium);
            const policyMinPremium = parseFloat(policy.minAnnualPremium);
            const policyMaxPremium = parseFloat(policy.maxAnnualPremium);
            const matchesPremium = isNaN(customerPremium) ||
                                   (isNaN(policyMinPremium) || customerPremium >= policyMinPremium) &&
                                   (isNaN(policyMaxPremium) || customerPremium <= policyMaxPremium);

            // Desired Perils Keywords Match
            const matchesPerils = customerCriteria.desiredPerilsKeywords.toLowerCase() === '' ||
                                  policy.perilsCovered.toLowerCase().includes(customerCriteria.desiredPerilsKeywords.toLowerCase());

            // Avoid Exclusions Keywords Match (policy should NOT contain these)
            const avoidExclusionsMatch = customerCriteria.avoidExclusionsKeywords.toLowerCase() === '' ||
                                         !policy.majorExclusions.toLowerCase().includes(customerCriteria.avoidExclusionsKeywords.toLowerCase());

            return matchesPropertyType && matchesPropertySize && matchesGeo && matchesProductLine &&
                   matchesCoverageLimits && matchesDeductible && matchesPremium && matchesPerils &&
                   avoidExclusionsMatch;
        });
    }, [policies, customerCriteria]);

    // Component for Carrier Details Page
    const CarrierDetailsPage = ({ carrier, policies, handleEditPolicy, handleSpeakPolicy, handleSummarizePolicy, handleGetCarrierOverview, isLoading }) => {
        const carrierPolicies = policies.filter(p => p.carrierName === carrier.name);

        return (
            <div className="bg-white p-6 rounded-xl shadow-2xl mt-8">
                <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
                    Details for: {carrier.name}
                </h2>
                <div className="space-y-4 mb-8">
                    <p className="text-lg text-gray-800">
                        <span className="font-semibold">Covered Property Types:</span>{' '}
                        {carrier.coveredPropertyTypes && carrier.coveredPropertyTypes.length > 0
                            ? carrier.coveredPropertyTypes.join(', ')
                            : 'N/A'}
                    </p>
                    <div className="flex justify-center">
                        <button
                            onClick={() => handleGetCarrierOverview(carrier)}
                            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                            disabled={isLoading}
                        >
                            Get AI Overview ✨
                        </button>
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-indigo-600 mb-4 text-center">
                    Policies by {carrier.name} ({carrierPolicies.length})
                </h3>
                {carrierPolicies.length === 0 ? (
                    <p className="text-center text-gray-500">No policies found for this carrier.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-indigo-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Policy ID / SKU</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Product Line</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actual Premium</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {carrierPolicies.map((policy) => (
                                    <tr key={policy.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{policy.policyIdSku}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{policy.productLine}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${parseFloat(policy.actualAnnualPremium).toFixed(2)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleEditPolicy(policy)}
                                                className="text-indigo-600 hover:text-indigo-900 mr-3 transform hover:scale-110 transition duration-150 ease-in-out"
                                                disabled={isLoading}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleSpeakPolicy(policy)}
                                                className="ml-3 text-green-600 hover:text-green-900 transform hover:scale-110 transition duration-150 ease-in-out"
                                                disabled={isLoading}
                                            >
                                                Speak
                                            </button>
                                            <button
                                                onClick={() => handleSummarizePolicy(policy)}
                                                className="ml-3 bg-purple-500 hover:bg-purple-600 text-white font-bold py-1 px-3 rounded-full text-xs shadow-md transform hover:scale-105 transition duration-150 ease-in-out"
                                                disabled={isLoading}
                                            >
                                                Summarize Policy ✨
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        );
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-4 sm:p-6 font-sans text-gray-800 flex">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
            <style>
                {`
                body { font-family: 'Inter', sans-serif; }
                .fade-in-out {
                    animation: fadeEffect 3s forwards;
                }
                @keyframes fadeEffect {
                    0% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { opacity: 0; }
                }
                `}
            </style>

            {/* Sidebar Navigation */}
            <div className="w-64 bg-indigo-700 text-white rounded-xl shadow-lg p-6 flex flex-col items-center mr-6">
                <h2 className="text-2xl font-bold mb-8 text-center">Navigation</h2>
                <nav className="space-y-4 w-full">
                    <button
                        onClick={() => { setCurrentView('policies'); setSelectedCarrierForDetails(null); }}
                        className={`w-full text-left py-3 px-4 rounded-lg font-semibold transition duration-300 ${
                            currentView === 'policies' ? 'bg-indigo-800 text-white shadow-md' : 'hover:bg-indigo-600'
                        }`}
                    >
                        Manage Policies
                    </button>
                    <button
                        onClick={() => { setCurrentView('carriersList'); setSelectedCarrierForDetails(null); }} // New Carriers list view
                        className={`w-full text-left py-3 px-4 rounded-lg font-semibold transition duration-300 ${
                            currentView === 'carriersList' || currentView === 'carrierDetail' ? 'bg-indigo-800 text-white shadow-md' : 'hover:bg-indigo-600'
                        }`}
                    >
                        Carriers
                    </button>
                    <button
                        onClick={() => { setCurrentView('carriersAndPropertyTypes'); setSelectedCarrierForDetails(null); }} // Original Manage Carriers
                        className={`w-full text-left py-3 px-4 rounded-lg font-semibold transition duration-300 ${
                            currentView === 'carriersAndPropertyTypes' ? 'bg-indigo-800 text-white shadow-md' : 'hover:bg-indigo-600'
                        }`}
                    >
                        Manage Carriers & Property Types
                    </button>
                    <button
                        onClick={() => { setCurrentView('matchPolicies'); setSelectedCarrierForDetails(null); }}
                        className={`w-full text-left py-3 px-4 rounded-lg font-semibold transition duration-300 ${
                            currentView === 'matchPolicies' ? 'bg-indigo-800 text-white shadow-md' : 'hover:bg-indigo-600'
                        }`}
                    >
                        Match Policies
                    </button>
                    <button
                        onClick={() => { setCurrentView('dashboard'); setSelectedCarrierForDetails(null); }}
                        className={`w-full text-left py-3 px-4 rounded-lg font-semibold transition duration-300 ${
                            currentView === 'dashboard' ? 'bg-indigo-800 text-white shadow-md' : 'hover:bg-indigo-600'
                        }`}
                    >
                        Reports & Dashboard
                    </button>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full max-w-4xl bg-white rounded-xl shadow-2xl p-6 sm:p-8 space-y-8">
                <h1 className="text-4xl font-extrabold text-center text-indigo-700 mb-8">
                    <span role="img" aria-label="shield" className="mr-2">🛡️</span>
                    Insurance Policy Knowledge Base
                </h1>

                {userId && (
                    <div className="text-center text-sm text-gray-600 mb-4">
                        Logged in as User ID: <span className="font-semibold text-blue-600 break-all">{userId}</span>
                    </div>
                )}

                {message && (
                    <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg relative text-center fade-in-out">
                        {message}
                    </div>
                )}

                {isLoading && (
                    <div className="flex justify-center items-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                        <span className="ml-3 text-indigo-600">Processing...</span>
                    </div>
                )}

                {/* Conditional Rendering based on currentView */}
                {currentView === 'policies' && (
                    <>
                        {/* Policy Input Form */}
                        <div className="bg-indigo-50 p-6 rounded-lg shadow-inner">
                            <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
                                {editingPolicyId ? 'Edit Policy Details' : 'Add New Policy Entry'}
                            </h2>
                            <form onSubmit={handlePolicySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Policy ID / SKU */}
                                <div>
                                    <label htmlFor="policyIdSku" className="block text-sm font-medium text-gray-700 mb-1">Policy ID / SKU</label>
                                    <input
                                        type="text"
                                        id="policyIdSku"
                                        name="policyIdSku"
                                        value={newPolicy.policyIdSku}
                                        onChange={handlePolicyInputChange}
                                        placeholder="e.g., COMM-PL-7890"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                    />
                                </div>
                                {/* Carrier Name */}
                                <div>
                                    <label htmlFor="carrierName" className="block text-sm font-medium text-gray-700 mb-1">Carrier Name</label>
                                    <select
                                        id="carrierName"
                                        name="carrierName"
                                        value={newPolicy.carrierName}
                                        onChange={handlePolicyInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out bg-white"
                                    >
                                        <option value="">Select a Carrier</option>
                                        {carriers.map(carrier => (
                                            <option key={carrier.id} value={carrier.name}>{carrier.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Product Line */}
                                <div>
                                    <label htmlFor="productLine" className="block text-sm font-medium text-gray-700 mb-1">Product Line</label>
                                    <select
                                        id="productLine"
                                        name="productLine"
                                        value={newPolicy.productLine}
                                        onChange={handlePolicyInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out bg-white"
                                    >
                                        <option value="">Select a Product Line</option>
                                        {policyCategories.map(category => (
                                            <option key={category.id} value={category.name}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Covered Property Types (Multi-select) */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Covered Property Types</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-3 border border-gray-300 rounded-md bg-white overflow-y-auto max-h-40">
                                        {propertyTypes.length === 0 ? (
                                            <p className="text-gray-500 text-sm col-span-full">No property types added yet. Add them on the 'Manage Carriers & Property Types' page.</p>
                                        ) : (
                                            propertyTypes.map(type => (
                                                <div key={type.id} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`policyPropType-${type.id}`}
                                                        value={type.name}
                                                        checked={newPolicy.policyCoveredPropertyTypes.includes(type.name)}
                                                        onChange={handlePolicyPropertyTypeChange}
                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                    />
                                                    <label htmlFor={`policyPropType-${type.id}`} className="ml-2 text-sm text-gray-700">{type.name}</label>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                {/* Minimum Property Size */}
                                <div>
                                    <label htmlFor="minPropertySizeSqFt" className="block text-sm font-medium text-gray-700 mb-1">Min Property Size (Sq. Ft.)</label>
                                    <input
                                        type="number"
                                        id="minPropertySizeSqFt"
                                        name="minPropertySizeSqFt"
                                        value={newPolicy.minPropertySizeSqFt}
                                        onChange={handlePolicyInputChange}
                                        placeholder="e.g., 10000"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                    />
                                </div>
                                {/* Maximum Property Size */}
                                <div>
                                    <label htmlFor="maxPropertySizeSqFt" className="block text-sm font-medium text-gray-700 mb-1">Max Property Size (Sq. Ft.)</label>
                                    <input
                                        type="number"
                                        id="maxPropertySizeSqFt"
                                        name="maxPropertySizeSqFt"
                                        value={newPolicy.maxPropertySizeSqFt}
                                        onChange={handlePolicyInputChange}
                                        placeholder="e.g., 50000"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                    />
                                </div>
                                {/* Geographic Coverage */}
                                <div className="md:col-span-2">
                                    <label htmlFor="geographicCoverage" className="block text-sm font-medium text-gray-700 mb-1">Geographic Coverage (States, ZIPs, etc.)</label>
                                    <input
                                        type="text"
                                        id="geographicCoverage"
                                        name="geographicCoverage"
                                        value={newPolicy.geographicCoverage}
                                        onChange={handlePolicyInputChange}
                                        placeholder="e.g., PA, NY, 18301"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                    />
                                </div>
                                {/* Coverage Limits */}
                                <div className="md:col-span-2">
                                    <label htmlFor="coverageLimits" className="block text-sm font-medium text-gray-700 mb-1">Coverage Limits</label>
                                    <textarea
                                        id="coverageLimits"
                                        name="coverageLimits"
                                        value={newPolicy.coverageLimits}
                                        onChange={handlePolicyInputChange}
                                        placeholder="e.g., Per Occurrence: $1M, Aggregate: $2M"
                                        rows="2"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-y"
                                    ></textarea>
                                </div>
                                {/* Minimum Deductible */}
                                <div>
                                    <label htmlFor="minDeductible" className="block text-sm font-medium text-gray-700 mb-1">Min Deductible ($)</label>
                                    <input
                                        type="number"
                                        id="minDeductible"
                                        name="minDeductible"
                                        value={newPolicy.minDeductible}
                                        onChange={handlePolicyInputChange}
                                        placeholder="e.g., 1000"
                                        step="0.01"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                    />
                                </div>
                                {/* Maximum Deductible */}
                                <div>
                                    <label htmlFor="maxDeductible" className="block text-sm font-medium text-gray-700 mb-1">Max Deductible ($)</label>
                                    <input
                                        type="number"
                                        id="maxDeductible"
                                        name="maxDeductible"
                                        value={newPolicy.maxDeductible}
                                        onChange={handlePolicyInputChange}
                                        placeholder="e.g., 5000"
                                        step="0.01"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                    />
                                </div>
                                {/* Minimum Annual Premium */}
                                <div>
                                    <label htmlFor="minAnnualPremium" className="block text-sm font-medium text-gray-700 mb-1">Min Annual Premium ($)</label>
                                    <input
                                        type="number"
                                        id="minAnnualPremium"
                                        name="minAnnualPremium"
                                        value={newPolicy.minAnnualPremium}
                                        onChange={handlePolicyInputChange}
                                        placeholder="e.g., 1000"
                                        step="0.01"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                    />
                                </div>
                                {/* Maximum Annual Premium */}
                                <div>
                                    <label htmlFor="maxAnnualPremium" className="block text-sm font-medium text-gray-700 mb-1">Max Annual Premium ($)</label>
                                    <input
                                        type="number"
                                        id="maxAnnualPremium"
                                        name="maxAnnualPremium"
                                        value={newPolicy.maxAnnualPremium}
                                        onChange={handlePolicyInputChange}
                                        placeholder="e.g., 5000"
                                        step="0.01"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                    />
                                </div>
                                {/* Actual Annual Premium */}
                                <div>
                                    <label htmlFor="actualAnnualPremium" className="block text-sm font-medium text-gray-700 mb-1">Actual Annual Premium ($)</label>
                                    <input
                                        type="number"
                                        id="actualAnnualPremium"
                                        name="actualAnnualPremium"
                                        value={newPolicy.actualAnnualPremium}
                                        onChange={handlePolicyInputChange}
                                        placeholder="e.g., 1200.50"
                                        step="0.01"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                    />
                                </div>
                                {/* Policy Period Start */}
                                <div>
                                    <label htmlFor="policyPeriodStart" className="block text-sm font-medium text-gray-700 mb-1">Policy Period Start</label>
                                    <input
                                        type="date"
                                        id="policyPeriodStart"
                                        name="policyPeriodStart"
                                        value={newPolicy.policyPeriodStart}
                                        onChange={handlePolicyInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                    />
                                </div>
                                {/* Policy Period End */}
                                <div>
                                    <label htmlFor="policyPeriodEnd" className="block text-sm font-medium text-gray-700 mb-1">Policy Period End</label>
                                    <input
                                        type="date"
                                        id="policyPeriodEnd"
                                        name="policyPeriodEnd"
                                        value={newPolicy.policyPeriodEnd}
                                        onChange={handlePolicyInputChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                    />
                                </div>
                                {/* Perils Covered */}
                                <div className="md:col-span-2">
                                    <label htmlFor="perilsCovered" className="block text-sm font-medium text-gray-700 mb-1">Perils Covered</label>
                                    <textarea
                                        id="perilsCovered"
                                        name="perilsCovered"
                                        value={newPolicy.perilsCovered}
                                        onChange={handlePolicyInputChange}
                                        placeholder="e.g., Fire, Theft, Wind, Earthquake"
                                        rows="2"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-y"
                                    ></textarea>
                                </div>
                                {/* Major Exclusions */}
                                <div className="md:col-span-2">
                                    <label htmlFor="majorExclusions" className="block text-sm font-medium text-gray-700 mb-1">Major Exclusions</label>
                                    <textarea
                                        id="majorExclusions"
                                        name="majorExclusions"
                                        value={newPolicy.majorExclusions}
                                        onChange={handlePolicyInputChange}
                                        placeholder="e.g., Flood, Cyber, Acts of God"
                                        rows="2"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-y"
                                    ></textarea>
                                </div>
                                {/* Eligibility Criteria */}
                                <div className="md:col-span-2">
                                    <label htmlFor="eligibilityCriteria" className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria</label>
                                    <textarea
                                        id="eligibilityCriteria"
                                        name="eligibilityCriteria"
                                        value={newPolicy.eligibilityCriteria}
                                        onChange={handlePolicyInputChange}
                                        placeholder="e.g., No older than 20 years, Maximum occupancy 200"
                                        rows="2"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-y"
                                    ></textarea>
                                </div>
                                {/* Underwriting Notes */}
                                <div className="md:col-span-2">
                                    <label htmlFor="underwritingNotes" className="block text-sm font-medium text-gray-700 mb-1">Underwriting Notes</label>
                                    <textarea
                                        id="underwritingNotes"
                                        name="underwritingNotes"
                                        value={newPolicy.underwritingNotes}
                                        onChange={handlePolicyInputChange}
                                        placeholder="Any special underwriting restrictions or endorsements"
                                        rows="2"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-y"
                                    ></textarea>
                                </div>
                                {/* Document Link */}
                                <div className="md:col-span-2">
                                    <label htmlFor="documentLink" className="block text-sm font-medium text-gray-700 mb-1">Document Link (URL)</label>
                                    <input
                                        type="url"
                                        id="documentLink"
                                        name="documentLink"
                                        value={newPolicy.documentLink}
                                        onChange={handlePolicyInputChange}
                                        placeholder="e.g., https://example.com/policy.pdf"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                    />
                                </div>

                                <div className="md:col-span-2 flex justify-center mt-4">
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        disabled={isLoading}
                                    >
                                        {editingPolicyId ? 'Update Policy Entry' : 'Add Policy Entry'}
                                    </button>
                                    {editingPolicyId && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingPolicyId(null);
                                                setNewPolicy({
                                                    policyIdSku: '', carrierName: '', productLine: '',
                                                    policyCoveredPropertyTypes: [], minPropertySizeSqFt: '', maxPropertySizeSqFt: '',
                                                    geographicCoverage: '', coverageLimits: '', minDeductible: '', maxDeductible: '',
                                                    minAnnualPremium: '', maxAnnualPremium: '', actualAnnualPremium: '',
                                                    policyPeriodStart: '', policyPeriodEnd: '', perilsCovered: '',
                                                    majorExclusions: '', eligibilityCriteria: '', underwritingNotes: '', documentLink: '',
                                                });
                                            }}
                                            className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                            disabled={isLoading}
                                        >
                                            Cancel Edit
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Search and Filter Controls */}
                        <div className="bg-white p-6 rounded-xl shadow-2xl mt-8">
                            <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
                                Search & Filter Policies
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {/* Search Term */}
                                <input
                                    type="text"
                                    placeholder="Search Policy ID, Coverage, Perils, Exclusions, Notes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 col-span-full md:col-span-2 lg:col-span-4"
                                />
                                {/* Filter Carrier */}
                                <select
                                    value={filterCarrier}
                                    onChange={(e) => setFilterCarrier(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                >
                                    <option value="">All Carriers</option>
                                    {carriers.map(carrier => (
                                        <option key={carrier.id} value={carrier.name}>{carrier.name}</option>
                                    ))}
                                </select>
                                {/* Filter Product Line */}
                                <select
                                    value={filterProductLine}
                                    onChange={(e) => setFilterProductLine(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                >
                                    <option value="">All Product Lines</option>
                                    {policyCategories.map(category => (
                                        <option key={category.id} value={category.name}>{category.name}</option>
                                    ))}
                                </select>
                                {/* Filter Property Type */}
                                <select
                                    value={filterPropertyType}
                                    onChange={(e) => setFilterPropertyType(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                >
                                    <option value="">All Property Types</option>
                                    {propertyTypes.map(type => (
                                        <option key={type.id} value={type.name}>{type.name}</option>
                                    ))}
                                </select>
                                {/* Filter Geographic Coverage */}
                                <input
                                    type="text"
                                    placeholder="Filter by Geo Coverage (e.g., PA)"
                                    value={filterGeo}
                                    onChange={(e) => setFilterGeo(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                                {/* Filter Min Property Size */}
                                <div>
                                    <label htmlFor="filterMinSize" className="block text-sm font-medium text-gray-700 mb-1">Min Prop. Size (Sq. Ft.)</label>
                                    <input
                                        type="number"
                                        id="filterMinSize"
                                        value={filterMinSize}
                                        onChange={(e) => setFilterMinSize(e.target.value)}
                                        placeholder="Min Size"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                                {/* Filter Max Property Size */}
                                <div>
                                    <label htmlFor="filterMaxSize" className="block text-sm font-medium text-gray-700 mb-1">Max Prop. Size (Sq. Ft.)</label>
                                    <input
                                        type="number"
                                        id="filterMaxSize"
                                        value={filterMaxSize}
                                        onChange={(e) => setFilterMaxSize(e.target.value)}
                                        placeholder="Max Size"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={handleExportCsv}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    disabled={isLoading || filteredAndSortedPolicies.length === 0}
                                >
                                    Export Filtered Policies to CSV
                                </button>
                            </div>
                        </div>






















                        {/* Policies List */}
                        <div className="bg-white p-6 rounded-xl shadow-2xl mt-8">
                            <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
                                Policy Knowledge Base Entries ({filteredAndSortedPolicies.length})
                            </h2>
                            {currentPolicies.length === 0 ? (
                                <p className="text-center text-gray-500">No policies match your criteria.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                                        <thead className="bg-indigo-100">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('policyIdSku')}>
                                                    Policy ID / SKU{getSortIndicator('policyIdSku')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('carrierName')}>
                                                    Carrier{getSortIndicator('carrierName')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('productLine')}>
                                                    Product Line{getSortIndicator('productLine')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Covered Prop. Types</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('minPropertySizeSqFt')}>
                                                    Min Size{getSortIndicator('minPropertySizeSqFt')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('maxPropertySizeSqFt')}>
                                                    Max Size{getSortIndicator('maxPropertySizeSqFt')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Geo Coverage</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Coverage Limits</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('minDeductible')}>
                                                    Min Deductible{getSortIndicator('minDeductible')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('maxDeductible')}>
                                                    Max Deductible{getSortIndicator('maxDeductible')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('minAnnualPremium')}>
                                                    Min Prem.{getSortIndicator('minAnnualPremium')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('maxAnnualPremium')}>
                                                    Max Prem.{getSortIndicator('maxAnnualPremium')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('actualAnnualPremium')}>
                                                    Actual Prem.{getSortIndicator('actualAnnualPremium')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('policyPeriodStart')}>
                                                    Period Start{getSortIndicator('policyPeriodStart')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('policyPeriodEnd')}>
                                                    Period End{getSortIndicator('policyPeriodEnd')}
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Perils Covered</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Major Exclusions</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Eligibility Criteria</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Underwriting Notes</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Document Link</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {currentPolicies.map((policy) => (
                                                <tr key={policy.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{policy.policyIdSku}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{policy.carrierName}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{policy.productLine}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={policy.policyCoveredPropertyTypes.join(', ')}>
                                                        {policy.policyCoveredPropertyTypes.join(', ')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{policy.minPropertySizeSqFt}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{policy.maxPropertySizeSqFt}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={policy.geographicCoverage}>
                                                        {policy.geographicCoverage}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={policy.coverageLimits}>
                                                        {policy.coverageLimits}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{policy.minDeductible}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{policy.maxDeductible}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{policy.minAnnualPremium}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{policy.maxAnnualPremium}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${parseFloat(policy.actualAnnualPremium).toFixed(2)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {policy.policyPeriodStart}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {policy.policyPeriodEnd}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={policy.perilsCovered}>
                                                        {policy.perilsCovered}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={policy.majorExclusions}>
                                                        {policy.majorExclusions}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={policy.eligibilityCriteria}>
                                                        {policy.eligibilityCriteria}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={policy.underwritingNotes}>
                                                        {policy.underwritingNotes}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                                        {policy.documentLink ? <a href={policy.documentLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Link</a> : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => handleEditPolicy(policy)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-3 transform hover:scale-110 transition duration-150 ease-in-out"
                                                            disabled={isLoading}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeletePolicy(policy.id)}
                                                            className="text-red-600 hover:text-red-900 transform hover:scale-110 transition duration-150 ease-in-out"
                                                            disabled={isLoading}
                                                        >
                                                            Delete
                                                        </button>
                                                        <button
                                                            onClick={() => handleSpeakPolicy(policy)}
                                                            className="ml-3 text-green-600 hover:text-green-900 transform hover:scale-110 transition duration-150 ease-in-out"
                                                            disabled={isLoading}
                                                        >
                                                            Speak
                                                        </button>
                                                        <button
                                                            onClick={() => handleSummarizePolicy(policy)}
                                                            className="ml-3 bg-purple-500 hover:bg-purple-600 text-white font-bold py-1 px-3 rounded-full text-xs shadow-md transform hover:scale-105 transition duration-150 ease-in-out"
                                                            disabled={isLoading}
                                                        >
                                                            Summarize Policy ✨
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination Controls */}
                            {filteredAndSortedPolicies.length > policiesPerPage && (
                                <nav className="mt-6 flex justify-center">
                                    <ul className="flex items-center space-x-2">
                                        <li>
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1 || isLoading}
                                                className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Previous
                                            </button>
                                        </li>
                                        {Array.from({ length: totalPages }, (_, i) => (
                                            <li key={i}>
                                                <button
                                                    onClick={() => paginate(i + 1)}
                                                    className={`px-3 py-1 rounded-md ${
                                                        currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                                    disabled={isLoading}
                                                >
                                                    {i + 1}
                                                </button>
                                            </li>
                                        ))}
                                        <li>
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={currentPage === totalPages || isLoading}
                                                className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </div>
                    </>
                )}

                {currentView === 'carriersAndPropertyTypes' && (
                    <>
                        {/* Carrier Input Form */}
                        <div className="bg-indigo-50 p-6 rounded-lg shadow-inner mb-8">
                            <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
                                {editingCarrierId ? 'Edit Insurance Carrier' : 'Add New Insurance Carrier'}
                            </h2>
                            <form onSubmit={handleAddCarrier} className="grid grid-cols-1 gap-6">
                                <div>
                                    <label htmlFor="carrierName" className="block text-sm font-medium text-gray-700 mb-1">Carrier Name</label>
                                    <input
                                        type="text"
                                        id="carrierName"
                                        name="carrierName"
                                        value={newCarrier.name}
                                        onChange={handleNewCarrierChange}
                                        placeholder="e.g., Allstate, Travelers"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Covered Property Types:</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        {propertyTypes.length === 0 ? (
                                            <p className="text-gray-500 text-sm col-span-full">No property types added yet. Add one below!</p>
                                        ) : (
                                            propertyTypes.map(type => (
                                                <div key={type.id} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`propType-${type.id}`}
                                                        value={type.name}
                                                        checked={newCarrier.coveredPropertyTypes.includes(type.name)}
                                                        onChange={handleCoveredPropertyTypeChange}
                                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                                    />
                                                    <label htmlFor={`propType-${type.id}`} className="ml-2 text-sm text-gray-700">{type.name}</label>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-center mt-4">
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        disabled={isLoading}
                                    >
                                        {editingCarrierId ? 'Update Carrier' : 'Add Carrier'}
                                    </button>
                                    {editingCarrierId && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingCarrierId(null);
                                                setNewCarrier({ name: '', coveredPropertyTypes: [] });
                                            }}
                                            className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                            disabled={isLoading}
                                        >
                                            Cancel Edit
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* Property Type Management (Moved Here) */}
                        <div className="bg-white p-6 rounded-xl shadow-2xl mt-8">
                            <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
                                {editingPropertyTypeId ? 'Edit Property Type' : 'Add New Property Type'}
                            </h2>
                            <form onSubmit={handleAddPropertyType} className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6">
                                <input
                                    type="text"
                                    id="newPropertyTypeName"
                                    name="newPropertyTypeName"
                                    value={newPropertyTypeName}
                                    onChange={handleNewPropertyTypeNameChange}
                                    placeholder="e.g., Supermarket, Office Building"
                                    required
                                    className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out w-full sm:w-auto"
                                />
                                <button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full sm:w-auto"
                                    disabled={isLoading}
                                >
                                    {editingPropertyTypeId ? 'Update Property Type' : 'Add Property Type'}
                                </button>
                                {editingPropertyTypeId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingPropertyTypeId(null);
                                            setNewPropertyTypeName('');
                                        }}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                        disabled={isLoading}
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </form>

                            <h3 className="text-xl font-bold text-indigo-600 mb-4 text-center">
                                All Available Property Types ({propertyTypes.length})
                            </h3>
                            {propertyTypes.length === 0 ? (
                                <p className="text-center text-gray-500">No property types added yet.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                                        <thead className="bg-indigo-100">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Property Type Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {propertyTypes.map((type) => (
                                                <tr key={type.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{type.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => handleEditPropertyType(type)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-3 transform hover:scale-110 transition duration-150 ease-in-out"
                                                            disabled={isLoading}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeletePropertyType(type.id)}
                                                            className="text-red-600 hover:text-red-900 transform hover:scale-110 transition duration-150 ease-in-out"
                                                            disabled={isLoading}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Carriers List (Existing from previous version) */}
                        <div className="bg-white p-6 rounded-xl shadow-2xl mt-8">
                            <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
                                Existing Insurance Carriers ({carriers.length})
                            </h2>
                            {carriers.length === 0 ? (
                                <p className="text-center text-gray-500">No carriers added yet. Add one above!</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                                        <thead className="bg-indigo-100">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Carrier Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Covered Property Types</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {carriers.map((carrier) => (
                                                <tr key={carrier.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{carrier.name}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700">
                                                        {carrier.coveredPropertyTypes && carrier.coveredPropertyTypes.length > 0
                                                            ? carrier.coveredPropertyTypes.join(', ')
                                                            : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => handleEditCarrier(carrier)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-3 transform hover:scale-110 transition duration-150 ease-in-out"
                                                            disabled={isLoading}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteCarrier(carrier.id)}
                                                            className="text-red-600 hover:text-red-900 transform hover:scale-110 transition duration-150 ease-in-out"
                                                            disabled={isLoading}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}







                {currentView === 'carriersList' && (
                    <div className="bg-white p-6 rounded-xl shadow-2xl mt-8">
                        <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
                            All Insurance Carriers ({carriers.length})
                        </h2>
                        {carriers.length === 0 ? (
                            <p className="text-center text-gray-500">No carriers added yet. Go to 'Manage Carriers & Property Types' to add some.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                                    <thead className="bg-indigo-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Carrier Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Covered Property Types</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {carriers.map((carrier) => (
                                            <tr key={carrier.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    <button
                                                        onClick={() => { setCurrentView('carrierDetail'); setSelectedCarrierForDetails(carrier); }}
                                                        className="text-blue-600 hover:text-blue-900 hover:underline font-semibold"
                                                    >
                                                        {carrier.name}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {carrier.coveredPropertyTypes && carrier.coveredPropertyTypes.length > 0
                                                        ? carrier.coveredPropertyTypes.join(', ')
                                                        : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => handleGetCarrierOverview(carrier)}
                                                        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-1 px-3 rounded-full text-xs shadow-md transform hover:scale-105 transition duration-150 ease-in-out"
                                                        disabled={isLoading}
                                                    >
                                                        Get AI Overview ✨
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {currentView === 'carrierDetail' && selectedCarrierForDetails && (
                    <CarrierDetailsPage
                        carrier={selectedCarrierForDetails}
                        policies={policies}
                        handleEditPolicy={handleEditPolicy}
                        handleSpeakPolicy={handleSpeakPolicy}
                        handleSummarizePolicy={handleSummarizePolicy}
                        handleGetCarrierOverview={handleGetCarrierOverview}
                        isLoading={isLoading}
                    />
                )}

                {currentView === 'matchPolicies' && (
                    <div className="bg-white p-6 rounded-xl shadow-2xl mt-8">
                        <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
                            Find Policies for Customer Needs
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Customer Property Type */}
                            <div>
                                <label htmlFor="customerPropertyType" className="block text-sm font-medium text-gray-700 mb-1">Customer Property Type</label>
                                <select
                                    id="customerPropertyType"
                                    name="propertyType"
                                    value={customerCriteria.propertyType}
                                    onChange={handleCustomerCriteriaChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out bg-white"
                                >
                                    <option value="">Select Property Type</option>
                                    {propertyTypes.map(type => (
                                        <option key={type.id} value={type.name}>{type.name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Customer Property Size */}
                            <div>
                                <label htmlFor="customerPropertySize" className="block text-sm font-medium text-gray-700 mb-1">Customer Property Size (Sq. Ft.)</label>
                                <input
                                    type="number"
                                    id="customerPropertySize"
                                    name="propertySize"
                                    value={customerCriteria.propertySize}
                                    onChange={handleCustomerCriteriaChange}
                                    placeholder="e.g., 20000"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                />
                            </div>
                            {/* Customer Geographic Location */}
                            <div className="md:col-span-2">
                                <label htmlFor="customerGeographicLocation" className="block text-sm font-medium text-gray-700 mb-1">Customer Geographic Location (State, ZIP, etc.)</label>
                                <input
                                    type="text"
                                    id="customerGeographicLocation"
                                    name="geographicLocation"
                                    value={customerCriteria.geographicLocation}
                                    onChange={handleCustomerCriteriaChange}
                                    placeholder="e.g., Pocono, PA or 18301"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                />
                            </div>
                            {/* Desired Product Line */}
                            <div>
                                <label htmlFor="customerProductLine" className="block text-sm font-medium text-gray-700 mb-1">Desired Product Line</label>
                                <select
                                    id="customerProductLine"
                                    name="productLine"
                                    value={customerCriteria.productLine}
                                    onChange={handleCustomerCriteriaChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out bg-white"
                                >
                                    <option value="">Select Product Line</option>
                                    {policyCategories.map(category => (
                                        <option key={category.id} value={category.name}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Desired Coverage Limits Keywords */}
                            <div>
                                <label htmlFor="desiredCoverageLimitsKeywords" className="block text-sm font-medium text-gray-700 mb-1">Desired Coverage Limits Keywords</label>
                                <input
                                    type="text"
                                    id="desiredCoverageLimitsKeywords"
                                    name="desiredCoverageLimitsKeywords"
                                    value={customerCriteria.desiredCoverageLimitsKeywords}
                                    onChange={handleCustomerCriteriaChange}
                                    placeholder="e.g., $1M, aggregate"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                />
                            </div>
                            {/* Desired Deductible */}
                            <div>
                                <label htmlFor="desiredDeductible" className="block text-sm font-medium text-gray-700 mb-1">Desired Deductible ($)</label>
                                <input
                                    type="number"
                                    id="desiredDeductible"
                                    name="desiredDeductible"
                                    value={customerCriteria.desiredDeductible}
                                    onChange={handleCustomerCriteriaChange}
                                    placeholder="e.g., 2500"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                />
                            </div>
                            {/* Desired Annual Premium */}
                            <div>
                                <label htmlFor="desiredAnnualPremium" className="block text-sm font-medium text-gray-700 mb-1">Desired Annual Premium ($)</label>
                                <input
                                    type="number"
                                    id="desiredAnnualPremium"
                                    name="desiredAnnualPremium"
                                    value={customerCriteria.desiredAnnualPremium}
                                    onChange={handleCustomerCriteriaChange}
                                    placeholder="e.g., 1500"
                                    step="0.01"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                />
                            </div>
                            {/* Desired Perils Keywords */}
                            <div>
                                <label htmlFor="desiredPerilsKeywords" className="block text-sm font-medium text-gray-700 mb-1">Desired Perils Keywords</label>
                                <input
                                    type="text"
                                    id="desiredPerilsKeywords"
                                    name="desiredPerilsKeywords"
                                    value={customerCriteria.desiredPerilsKeywords}
                                    onChange={handleCustomerCriteriaChange}
                                    placeholder="e.g., Fire, Wind"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                />
                            </div>
                            {/* Avoid Exclusions Keywords */}
                            <div>
                                <label htmlFor="avoidExclusionsKeywords" className="block text-sm font-medium text-gray-700 mb-1">Avoid Exclusions Keywords</label>
                                <input
                                    type="text"
                                    id="avoidExclusionsKeywords"
                                    name="avoidExclusionsKeywords"
                                    value={customerCriteria.avoidExclusionsKeywords}
                                    onChange={handleCustomerCriteriaChange}
                                    placeholder="e.g., Flood, Cyber"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={handleClearCustomerCriteria}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                disabled={isLoading}
                            >
                                Clear Criteria
                            </button>
                        </div>

                        {/* Matched Policies List */}
                        <div className="bg-indigo-50 p-6 rounded-lg shadow-inner mt-8">
                            <h3 className="text-xl font-bold text-indigo-700 mb-4 text-center">
                                Matched Policies ({matchedPolicies.length})
                            </h3>
                            {matchedPolicies.length === 0 ? (
                                <p className="text-center text-gray-600">No policies match the current criteria. Try adjusting your inputs.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                                        <thead className="bg-indigo-100">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Policy ID / SKU</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Carrier</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Product Line</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Covered Prop. Types</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Size Range (Sq. Ft.)</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Geo Coverage</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actual Premium</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {matchedPolicies.map((policy) => (
                                                <tr key={policy.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{policy.policyIdSku}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{policy.carrierName}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{policy.productLine}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={policy.policyCoveredPropertyTypes.join(', ')}>
                                                        {policy.policyCoveredPropertyTypes.join(', ')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {policy.minPropertySizeSqFt || 'N/A'} - {policy.maxPropertySizeSqFt || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={policy.geographicCoverage}>
                                                        {policy.geographicCoverage}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${parseFloat(policy.actualAnnualPremium).toFixed(2)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => handleEditPolicy(policy)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-3 transform hover:scale-110 transition duration-150 ease-in-out"
                                                            disabled={isLoading}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleSpeakPolicy(policy)}
                                                            className="ml-3 text-green-600 hover:text-green-900 transform hover:scale-110 transition duration-150 ease-in-out"
                                                            disabled={isLoading}
                                                        >
                                                            Speak
                                                        </button>
                                                        <button
                                                            onClick={() => handleSummarizePolicy(policy)}
                                                            className="ml-3 bg-purple-500 hover:bg-purple-600 text-white font-bold py-1 px-3 rounded-full text-xs shadow-md transform hover:scale-105 transition duration-150 ease-in-out"
                                                            disabled={isLoading}
                                                        >
                                                            Summarize Policy ✨
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {currentView === 'dashboard' && (
                    <div className="bg-white p-6 rounded-xl shadow-2xl mt-8">
                        {/* Dashboard Header */}
                        <h2 className="text-2xl font-bold text-indigo-600 mb-6 text-center">
                            Reports & Dashboard Overview
                        </h2>
                        {/* Key Metrics Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Total Policies Card */}
                            <div className="bg-blue-50 p-4 rounded-lg shadow-md text-center">
                                <h3 className="text-xl font-semibold text-blue-700">Total Policies</h3>
                                <p className="text-4xl font-bold text-blue-900">{policies.length}</p>
                            </div>
                            {/* Total Carriers Card */}
                            <div className="bg-green-50 p-4 rounded-lg shadow-md text-center">
                                <h3 className="text-xl font-semibold text-green-700">Total Carriers</h3>
                                <p className="text-4xl font-bold text-green-900">{carriers.length}</p>
                            </div>
                        </div>

                        {/* Distribution Charts/Lists Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Policies by Category Distribution */}
                            <div className="bg-purple-50 p-4 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold text-purple-700 mb-4">Policies by Product Line</h3>
                                {Object.keys(policyCategoryDistribution).length === 0 ? (
                                    <p className="text-gray-600">No product lines to display yet.</p>
                                ) : (
                                    <ul className="list-disc list-inside text-gray-800">
                                        {Object.entries(policyCategoryDistribution).map(([category, count]) => (
                                            <li key={category} className="mb-1">
                                                <span className="font-medium">{category}:</span> {count} policies
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {/* Policies by Carrier Distribution */}
                            <div className="bg-yellow-50 p-4 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold text-yellow-700 mb-4">Policies by Carrier</h3>
                                {Object.keys(carrierDistribution).length === 0 ? (
                                    <p className="text-gray-600">No carriers to display yet.</p>
                                ) : (
                                    <ul className="list-disc list-inside text-gray-800">
                                        {Object.entries(carrierDistribution).map(([carrier, count]) => (
                                            <li key={carrier} className="mb-1">
                                                <span className="font-medium">{carrier}:</span> {count} policies
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Policy Summary Modal */}
                {showSummaryModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                            <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">Policy Summary ✨</h2>
                            <div className="max-h-96 overflow-y-auto text-gray-800 text-sm leading-relaxed">
                                {summaryContent}
                            </div>
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => setShowSummaryModal(false)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Carrier Overview Modal */}
                {showCarrierOverviewModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                            <h2 className="text-2xl font-bold text-indigo-700 mb-4 text-center">Carrier AI Overview ✨</h2>
                            <div className="max-h-96 overflow-y-auto text-gray-800 text-sm leading-relaxed">
                                {carrierOverviewContent}
                            </div>
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => setShowCarrierOverviewModal(false)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;

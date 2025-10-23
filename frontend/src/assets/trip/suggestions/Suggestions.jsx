
import { useState, useEffect } from "react";
const API_URL = 'https://trip-production-fa70.up.railway.app/api';
//let api = 'http://localhost:3020/api';
import styles from './suggestions.module.css';
import { GridLoader, ClipLoader } from "react-spinners";
import { useTripInfo } from "../context";
import { useNavigate } from "react-router-dom";

export const Suggestions = () => {
    const navigate = useNavigate();
    const {currentTripId, loadingUserInfo, firstName} = useTripInfo();
    const [suggestions, setSuggestions] = useState([]);


    const [loading, setLoading] = useState(true);
    const [basedOnBudget, setBasedOnBudget] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [moreSuggestionsLoading, setMoreSuggestionsLoading] = useState(false);

    useEffect(() => {
        const getSuggestions = async () => {

            try {
                setLoading(true);
                /*    const response = await fetch(`${API_URL}/suggestions?BudgetBased=${basedOnBudget}`, { */
                const response = await fetch(`${API_URL}/suggestions`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!response.ok) {
                    console.warn('Error fetching suggestions');
                }

                const data = await response.json();
                console.log('Suggestions fetched:', data);
                setSuggestions(data.suggestions);
                setBasedOnBudget(data.BudgetBased);

            } catch (error) {
                console.error('Error fetching suggestions:', error.message);
            } finally {
                setLoading(false);

            }


        };
      
       
         if (loadingUserInfo) return;
        if (currentTripId)
        {
       
            getSuggestions();
        } else{
            navigate('/all_trips');
            
        } 
         
        

    }, [basedOnBudget, currentTripId, loadingUserInfo, firstName]);
 

    const openOptions = () => {

        setIsOptionsOpen((prev) => !prev);
    }

    const changeBasedOnBudget = async () => {





        try {

            const response = await fetch(`${API_URL}/suggestions/changeBudgetBased?BudgetBased=${!basedOnBudget}`, {

                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                console.warn('Error fetching suggestions');
            }

            const data = await response.json();
            console.log(data);
            setBasedOnBudget((prev) => !prev);


        } catch (error) {
            console.error('Error fetching suggestions:', error.message);
        }




    }
    

    const generateMoreSuggestions = async () => {
        console.log('Generating more suggestions...');

        setMoreSuggestionsLoading(true);
        try {

            const response = await fetch(`${API_URL}/suggestions/generateMore`, {

                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                console.warn('Error fetching suggestions');
                return;
            }

            const data = await response.json();
            console.log('More suggestions fetched:', data);
            setSuggestions((prev) => [...prev, ...data.suggestions.suggestions]);
            

        } catch (error) {
            console.error('Error fetching suggestions:', error.message);
        } finally {
            setMoreSuggestionsLoading(false);
        }


    }

    return (
        <>



            <section className={styles.suggestionsSection}>



                {/*  <button onClick={getSuggestions}>Suggested Activities</button> */}


                {suggestions && typeof suggestions === 'object' && suggestions.length > 0 &&
                    <>


                        <div className={styles.suggestionsHeader}>
                            <h2 className={styles.suggestionsTitle}>Suggested Activities.</h2>
                            <div className={styles.optionsCon} onClick={openOptions}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill="#6b7280"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" /></svg>
                                {isOptionsOpen &&

                                    <div className={styles.options} onClick={(e) => e.stopPropagation()}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }} >
                                            <svg onClick={() => setIsOptionsOpen(false)} style={{ cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z" /></svg>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            Based On Budget
                                            <label className={styles.switch}>
                                                <input type="checkbox" onChange={changeBasedOnBudget} checked={basedOnBudget} />
                                                <span className={styles.slider}></span>
                                            </label>


                                        </div>
                                    </div>
                                }

                            </div>


                        </div>

                        {loading ? <div className="loading-indicator"><GridLoader color="#d4ebfb" size={25} /></div> :


                            <>
                                <div className={styles.suggestions}>
                                    {suggestions.map((suggestion, index) => (
                                        // Create a URL for Google Maps

                                        <div key={index} className={styles.eachSuggestion}>
                                            {suggestion.image_url && <img src={`${API_URL}/place-photo?photoRef=${suggestion.image_url}`} alt={suggestion.activityName} onError={(e) => { console.error(e.target.src) }} referrerPolicy="no-referrer" />}
                                            <div className={styles.suggestionInfo}>
                                                <div className="title">{suggestion.activity_name}</div>
                                                <div className={`${styles.cost} mb-2`}>Est. Cost: {suggestion.estimated_cost}</div>
                                                <p className="text-gray-700 text-sm mt-1">{suggestion.description}</p>
                                                <a href={`https://www.google.com/maps/place/?q=place_id:${suggestion.place_id}`} target="_blank" rel="noopener noreferrer"
                                                    className="mt-2 inline-block px-4 py-2 text-xs font-semibold text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-colors">
                                                    <i className="fa-solid fa-map-location-dot mr-1"></i>
                                                    Get Directions
                                                </a>
                                            </div>


                                        </div>



                                    ))}
                                </div>

                                <div className={styles.generateMoreButtonContainer}>
                                    <button className={`${styles.generateMoreButton} ${moreSuggestionsLoading ? styles.disabled : ''}`} onClick={generateMoreSuggestions} disabled={moreSuggestionsLoading} >
                                        {moreSuggestionsLoading ? <ClipLoader size={20} color="#ffffff" /> : 'Generate More'}
                                    </button>
                                </div>
                            </>
                        }
                    </>

                }
            </section>
        </>
    )
}
import styles from './new-trip.module.css';
import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DateRange } from "react-date-range";
//import { TheApp } from '../../calendar/calendar';

import "../../calendar/styles.css";
import "../../calendar/default.css";
import { ClipLoader } from "react-spinners";

import { useTripInfo } from '../context';




const API_URL = 'https://trip-production-fa70.up.railway.app/api';






// 📅 Calendar Component for Trip Dates
const TripCalendar = ({ setDateRange, dateRange }) => {
    const [range, setRange] = useState([
        dateRange || {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);





    return (
        <DateRange
            ranges={range}
            onChange={(item) => {
                setRange([item.selection]);
                setDateRange(item.selection);
                console.log("Selected range:", item.selection);
            }}
            months={2}
            /*   direction={direction} */
            direction='horizontal'
            showDateDisplay={false}
            rangeColors={['#3b82f6']}
        />
    );
};

export function NewTrip() {
    const [suggestions, setSuggestions] = useState([]);
    const [destination, setDestination] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [dateRange, setDateRange] = useState(null);
    const [waitingForNewTrip, setWaitingForNewTrip] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const {  setTrip_name } = useTripInfo();

    const dateInputRef = useRef(null);
    const formatDate = (date) => {
        if (!date) return '';
        const options = { month: 'short', day: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    /* async function createImg(destination) {
        try {
            const response = await fetch(`${API_URL}/img/${destination}`, { credentials: 'include' });
            const data = await response.json();
            return data.imageUrl;
        } catch (error) {
            console.error("Image generation failed:", error);
            return null;
        }
    } */

    const handleNewTripSubmit = async (e) => {
        e.preventDefault();
        setWaitingForNewTrip(true);
        setErrorMessage('');

        // const imageUrl = await createImg(destination);

        const destination = e.target.elements['destination'].value;
        const newTripData = {
            name: e.target.elements['trip-name'].value,
            destination: destination,
            startDate: dateRange?.startDate.toISOString().split('T')[0],
            endDate: dateRange?.endDate.toISOString().split('T')[0],
            budget: parseFloat(e.target.elements['budget'].value),
            travelers: parseInt(e.target.elements['travelers'].value),
            //   image: imageUrl
        };






        try {
            const response = await fetch(`${API_URL}/newTrip`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTripData)
            });


            if (!response.ok) {
                const data = await response.json();
                console.error(data);
                setErrorMessage(data.message || 'Failed to create new trip');
                return;
            }
            const data = await response.text();
            console.log(data);

            e.target.reset();
            setTrip_name(newTripData.name);

            navigate('/add_expense');
        } catch (error) {
            console.error('Error adding new trip:', error);
        } finally {
            setWaitingForNewTrip(false);
        }
        
    };

    let timerId;
    const handleInputChange = (e) => {
        setDestination(e.target.value);
        clearTimeout(timerId);
        timerId = setTimeout(async () => {
            const destination = e.target.value;
            if (destination.length < 1) {
                setSuggestions([]);
                return;
            }
            try {
                const response = await fetch(`${API_URL}/maps/autocomplete/${destination}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (!response.ok) {
                    const data = await response.json();
                    console.error(data);
                    return;
                }
                const data = await response.json();
                setSuggestions(data.suggestions);
            } catch (error) {
                console.error('Error adding new trip:', error);
            }
        }, 300);
    };

    const handleSelectedInput = async (place_id) => {
        try {
            const response = await fetch(`${API_URL}/maps/placeInfo/${place_id}`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                const data = await response.json();
                console.error(data);
                return;
            }
            const data = await response.json();
            setDestination(data.name);
            setSuggestions([]);
        } catch (error) {
            console.error('Error adding new trip:', error);
        }
    };

    const Suggestions = () => {
        return (
            suggestions.length > 0 && (<div className={styles.suggestions}>
                <ul>
                    {suggestions.map((s) => <li key={s.place_id} onClick={() => handleSelectedInput(s.place_id)}> {s.description}</li>)}
                </ul>
            </div>)
        );
    };

    return (<>

        <div id="new-trip-modal" className={styles.fullPageModal}>
            <Link to="/all_trips" id="back-to-app-btn" className="absolute top-8 left-8 text-white text-lg z-10 hover:text-gray-300 transition-colors">
                <i className="fa-solid fa-arrow-left mr-2"></i>Back
            </Link>
            <div className={`${styles.fullPageContent} `}>
                <div className={styles.header}>
                    <h3 className="text-4xl md:text-5xl font-extrabold mb-8 drop-shadow-md">Plan Your  <br /> Next Adventure! 🗺️</h3>

                </div>
                {/* <div onClick={handleNewTripSubmit} style={{border: '2px solid black'}}>yuvgufvuvfujvgvguvfggfv</div> */}
                <form id="new-trip-form" className={`${styles.form} space-y-6 text-left`} onSubmit={handleNewTripSubmit}>
                    <p className="text-black mb-8 text-lg font-light">Tell us a bit about your new trip to get started.</p>

                    <div className={styles.inputGroup}>
                        <input type="text" id="new-trip-name" name="trip-name" required placeholder=" "
                            className="w-full px-2 py-2 text-white rounded-lg focus:outline-none transition-all" />
                        <label htmlFor="new-trip-name">Trip Name</label>
                    </div>
                    <div className={styles.inputGroup}>
                        <input type="text" id="new-trip-destination" onChange={handleInputChange} name="destination" required value={destination} placeholder=" " autoComplete='off'
                            className="w-full px-2 py-2 text-white rounded-lg focus:outline-none transition-all" />
                        <Suggestions />
                        <label htmlFor="new-trip-destination">Destination</label>
                    </div>



                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            id="date-range-input"
                            readOnly
                            onClick={() => {
                                setShowCalendar(true);
                                setTimeout(() => {
                                    dateInputRef.current?.scrollIntoView({ behavior: 'smooth' });
                                }, 100); // tweak delay as needed



                            }}
                            value={dateRange && dateRange.startDate && dateRange.endDate
                                ? `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
                                : ''
                            }
                            placeholder=" "
                            className="w-full px-2 py-2 text-white rounded-lg focus:outline-none transition-all"
                        />
                        <label htmlFor="date-range-input">Select Trip Dates</label>
                    </div>
                    {showCalendar && (
                        <div ref={dateInputRef} className={styles.calendar}>



                            <TripCalendar
                                setDateRange={setDateRange}
                                dateRange={dateRange}
                            />

                            <button
                                type="button"
                                onClick={() => setShowCalendar(false)}
                                className={` ${styles.calendarButton} px-4 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors`}
                            >
                                Done
                            </button>

                        </div>
                    )}



                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className={styles.inputGroup}>
                            <input type="number" id="new-trip-budget" name="budget" required step="1" min="1" placeholder=" "
                                className="w-full px-2 py-2 text-white rounded-lg focus:outline-none transition-all" />
                            <label htmlFor="new-trip-budget">Starting Budget ($)</label>
                        </div>
                        <div className={styles.inputGroup}>
                            <input type="number" id="new-trip-travelers" name="travelers" required step="1" min="1" placeholder=" "
                                className="w-full px-2 py-2 text-white rounded-lg focus:outline-none transition-all" />
                            <label htmlFor="new-trip-travelers">Number of Travelers</label>
                        </div>
                    </div>
                      <span style={{color: 'red', fontSize: '13px'}}>{errorMessage}</span>
                    <div className={`${styles.myContainer} `}>
                      
                        <button type="submit" id="start-new-trip-form-btn" className="w-full px-8 py-4 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:shadow-xl transition-all text-lg" 
                            disabled={waitingForNewTrip}
                            style={waitingForNewTrip ? { cursor: 'not-allowed' } : {}}
                        >
                           {waitingForNewTrip ? <ClipLoader size={24} color={"#000"} /> : "Start Trip"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </>)
}
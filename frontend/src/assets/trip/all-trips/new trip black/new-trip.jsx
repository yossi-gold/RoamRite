
import styles from './new-trip.module.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = 'https://trip-production-fa70.up.railway.app/api';
//const API_URL2 = 'http://localhost:3020/api';



export function NewTrip() {

    const [hovered, setHovered] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [destination, setDestination] = useState('');
    const navigate = useNavigate();



    async function createImg(destination){
     try {
       /*  const destination = 'Toms River nj'; */
   // const response = await fetch(`http://localhost:3020/api/img/${destination}`);
    const response = await fetch(`${API_URL}/img/${destination}`,{credentials: 'include'});
    const data = await response.json();
    console.log("Image URL:", data.imageUrl);
    return data.imageUrl;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }


 }


    const handleNewTripSubmit = async (e) => {
        e.preventDefault();
        const destination = e.target.elements['destination'].value;
        const imageUrl = await createImg(destination);
        console.log("Generated Image URL:", imageUrl);
        const newTripData = {
            name: e.target.elements['trip-name'].value,
            destination: destination,
            startDate: e.target.elements['start-date'].value,
            endDate: e.target.elements['end-date'].value,
            budget: parseFloat(e.target.elements['budget'].value),
            travelers: parseInt(e.target.elements['travelers'].value),
            image: imageUrl
        };

        console.log(newTripData);


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
                return;
            }
            const data = await response.json();

            e.target.reset();
            localStorage.setItem('tripId', data.info.id);
            navigate('/add_expense');
        } catch (error) {
            console.error('Error adding new trip:', error);
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
            //console.log(destination);
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
                console.log(data);
                setSuggestions(data.suggestions);

                
            } catch (error) {
                console.error('Error adding new trip:', error);
            }

        }, 300);
    };
    const handleSelectedInput = async (place_id)=>{
        console.log(place_id);

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

                console.log(data);
            } catch (error) {
                console.error('Error adding new trip:', error);
            }
    }

    const Suggestions = () => {
        
        console.log(suggestions);
        return (
            suggestions.length > 0 && (<div className={styles.suggestions}>
                <ul>
                    {suggestions.map((s) => <li key={s.place_id} onClick={() => handleSelectedInput(s.place_id)}> {s.description}</li>)}


                </ul>
            </div>)
        )
    }

    
    

    return (<>

        <div id="new-trip-modal" className={styles.fullPageModal}>
            <Link to="/all_trips" id="back-to-app-btn" className="absolute top-8 left-8 text-white text-lg z-10 hover:text-gray-300 transition-colors">
                <i className="fa-solid fa-arrow-left mr-2"></i>Back
            </Link>
            
            <div className={`${styles.fullPageContent} container mx-auto p-2 lg:p-12`}>
                <h3 className="text-4xl md:text-5xl font-extrabold mb-8 drop-shadow-md">Plan Your Next Adventure! 🗺️</h3>
                <p className="text-white mb-8 text-lg font-light">Tell us a bit about your new trip to get started.</p>
                <form id="new-trip-form" className="space-y-6 text-left" onSubmit={handleNewTripSubmit}>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className={styles.inputGroup}>
                            <input type="date" id="new-trip-start-date" name="start-date" required placeholder=" "
                                className="w-full px-2 py-2 text-white rounded-lg focus:outline-none transition-all" />
                            <label htmlFor="new-trip-start-date">Start Date</label>
                        </div>
                        <div className={styles.inputGroup}>
                            <input type="date" id="new-trip-end-date" name="end-date" required placeholder=" "
                                className="w-full px-2 py-2 text-white rounded-lg focus:outline-none transition-all" />
                            <label htmlFor="new-trip-end-date">End Date</label>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className={styles.inputGroup}>
                            <input type="number" id="new-trip-budget" name="budget" required step="1" min="0" placeholder=" "
                                className="w-full px-2 py-2 text-white rounded-lg focus:outline-none transition-all" />
                            <label htmlFor="new-trip-budget">Starting Budget ($)</label>
                        </div>
                        <div className={styles.inputGroup}>
                            <input type="number" id="new-trip-travelers" name="travelers" required step="1" min="1" placeholder=" "
                                className="w-full px-2 py-2 text-white rounded-lg focus:outline-none transition-all" />
                            <label htmlFor="new-trip-travelers">Number of Travelers</label>
                        </div>
                    </div>
                    <div className={`${hovered ? '' : styles.myContainer} `}>

                        <button type="submit" onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)} id="start-new-trip-form-btn" className="w-full px-8 py-4 bg-white text-blue-600 font-bold rounded-full shadow-lg hover:shadow-xl transition-all text-lg">
                            Start Trip
                        </button>
                    </div>


                </form>

            </div>
        </div>




    </>)
}
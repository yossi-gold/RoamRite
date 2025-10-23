import styles from "./dashboard.module.css";
import '../mainPage/trip.css';
import { GridLoader } from "react-spinners";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from 'react-spinners';
import { convert } from "../utils/dateConverter";
import { fetchAndRenderAllData } from '../utils/fatch'

//const API_URL2 = 'http://localhost:3020/api';

export function AllTrips() {

    const API_URL = 'https://trip-production-fa70.up.railway.app/api';
    const navigate = useNavigate();



    const [allTrips, setAllTrips] = useState([]);
    const [historySummary, setHistorySummary] = useState({ isSummary: false, text: '' });
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [tripHovered, setTripHovered] = useState({ id: null });
    const [loading, setLoading] = useState(false);




    async function fetchAndRenderData() {
        setLoading(true);
        const { data, status } = await fetchAndRenderAllData();
        if (status === 401){
             navigate('/login');
             return
        }
        if (status !== 404) {

            setAllTrips(data.trips);

        }



        setLoading(false);

    }





    const generateSummary = async () => {
        const haha = false;
        if (!haha) return;
        try {
            // Fetch budget
            setSummaryLoading(true);
            const response = await fetch(`${API_URL}/ai/historySummary`,
                {
                    method: 'GET', // Use 'POST' for login
                    credentials: 'include', // ✅ Required for cookies

                }
            );

            if (!response.ok) {
                console.log(response.status);

            }
            const data = await response.json();
            console.log(data);
            setHistorySummary({ isSummary: true, text: data.output });







        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setSummaryLoading(false);
        }
    }

    useEffect(() => {
        fetchAndRenderData();
        generateSummary();
    }, [])



    return (<>

        {/* {console.log(currentTripId)} */}
        {loading && <div className="loading-indicator"><GridLoader color="#d4ebfb" size={25} /></div>}




        {!loading &&


            <div className={styles.tripContent}>


                <div className={styles.tripsInfoHeader}>
                   
                    {allTrips.length > 0 && <div style={{ width: '153px' }} className={styles.tripsButtons}></div>}
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Trips - Total of ({allTrips.length}) Trips</h2>
                    {allTrips.length > 0 && <div className={styles.tripsButtons}>
                        <Link to="/new_trip" className={styles.addnewTrip}>
                            Start a New Trip
                        </Link>
                        {/*  <button className={styles.generateHistorySummary} onClick={generateSummary}>
                                    ✨ Generate Summary
                                </button> */}



                    </div>}
                </div>
                {!allTrips.length && <div className={styles.noTrips}>

                    <img src="/noTrips3.png" alt="no trips pic" style={{width: '35vw' , height: 'auto', maxWidth: '300px'}}/>
                    <h3 >No journeys on the horizon. Time to plan one! 🏝️</h3>
                    <br />
                    <Link to="/new_trip" style={{ textAlign: 'center' }}>
                        Start a New Trip
                    </Link>




                </div>}

                <div className={styles.summaryAllTripsContainer}>
                    {/*   {(historySummary.isSummary || summaryLoading) && */}
                    {allTrips.length > 0 && <>
                        <div className={styles.historySummary}>
                            <div className={styles.historySummaryHeader}>
                                <div className={styles.iconContainer} style={{ visibility: 'hidden' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" /></svg>

                                </div>
                                <h1>Summary</h1>
                                <Link to="/new_trip" className={styles.add}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg>
                                </Link>
                            </div>
                            {summaryLoading && <ClipLoader size={20} />}






                            {(historySummary.isSummary || summaryLoading) &&


                                <div className="p-6 bg-gray-50 rounded-xl" style={{ marginTop: '5px' }}>
                                    <div id="history-summary-loader" className="loader mx-auto"></div>
                                    <p style={{ textAlign: "left", whiteSpace: "pre-wrap" }} className="text-gray-700 leading-relaxed">{historySummary.text}</p>
                                </div>
                            }



                            {/* 


                                
                                <p style={{ textAlign: "left",  whiteSpace: "pre-wrap" }}>
                                    {historySummary.text}</p> */}
                        </div>

                        <section className={`${styles.AllTripsContainer} mb-6`}>
                            {allTrips.map((trip) => {



                                const startAt = convert(trip.start_date);
                                const endAt = convert(trip.end_date);


                                return (<Link to={`/trip/${trip.id}`} key={trip.id} onMouseEnter={() => setTripHovered({ id: trip.id })} onMouseLeave={() => setTripHovered({ id: null })} className={`${styles.tripItem}   bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow`}>

                                    <div className={styles.eachTripInfo}>
                                        <h3 className="font-bold text-gray-800">{trip.trip_name}</h3>


                                        <p className="text-gray-600 text-sm">Date: {startAt.year === endAt.year ?
                                            startAt.month === endAt.month ? startAt.month + ' ' + startAt.year : `${startAt.month} - ${endAt.month} ${endAt.year}`
                                            : `${startAt.fullDate} - ${endAt.fullDate}`}
                                        </p>

                                        <p className="text-sm font-semibold text-gray-700 mt-2">Total Spent: ${Number(trip.total_spent).toFixed(2)}</p>
                                    </div>
                                    {/* <div className={styles.setAsCurrentTripButton}>
                                                {currentTripId === trip.id ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg> :
                                                    <button className={styles.setAsCurrentTrip} onClick={() => {
                                                        setCurrentTrip(trip);


                                                    }}>{loading === trip.id ? <ClipLoader size={10} /> : 'Set as current trip'}</button>
                                                }

                                            </div> */}
                                    <div className={styles.tripImage} style={{ backgroundImage: `url(${trip.img ? trip.img : './1.jpg'})` }} >
                                        <div className={styles.tripImageOverlay} style={tripHovered.id === trip.id ? { display: 'flex' } : { display: 'none' }} >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"  ><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" /></svg>
                                        </div>
                                    </div>
                                </Link>
                                )
                            }






                            )}
                        </section>
                    </>
                    }


                </div>
                <div id="history-list" className="space-y-4 text-left">
                    {/*   <!-- History items will be dynamically added here --> */}
                </div>




            </div>

        }






    </>)
}
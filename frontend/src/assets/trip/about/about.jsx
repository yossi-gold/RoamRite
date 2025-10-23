


import styles from './about.module.css';
import { Link } from 'react-router-dom';
import { sendMessage, checkIfLoggedIn } from '../utils/fatch.jsx';
import { useState, useEffect } from 'react';
import { ClipLoader } from "react-spinners";




// Basic usage







export const About = () => {

    const features = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q146 0 255.5 91.5T872-559h-82q-19-73-68.5-130.5T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h80v120h-40L168-552q-3 18-5.5 36t-2.5 36q0 131 92 225t228 95v80Zm364-20L716-228q-21 12-45 20t-51 8q-75 0-127.5-52.5T440-380q0-75 52.5-127.5T620-560q75 0 127.5 52.5T800-380q0 27-8 51t-20 45l128 128-56 56ZM620-280q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Z" /></svg>,
            name: 'All-in-One Trip Manager',
            description: 'Manage all your trip details in one place, from flights and accommodations to activities and itineraries.'
        }, {
            icon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M120-120v-80l80-80v160h-80Zm160 0v-240l80-80v320h-80Zm160 0v-320l80 81v239h-80Zm160 0v-239l80-80v319h-80Zm160 0v-400l80-80v480h-80ZM120-327v-113l280-280 160 160 280-280v113L560-447 400-607 120-327Z" /></svg>,
            name: 'Smart Budget Tracking',
            description: 'Stay on top of your travel expenses with our intuitive budget tracking tools and insightful spending reports.'
        }, {
            icon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" /></svg>,
            name: 'Collaborative Planning',
            description: 'Plan trips together with friends and family, seamlessly sharing itineraries, preferences, and updates.'
        }, {
            icon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M80-560q0-100 44.5-183.5T244-882l47 64q-60 44-95.5 111T160-560H80Zm720 0q0-80-35.5-147T669-818l47-64q75 55 119.5 138.5T880-560h-80ZM160-200v-80h80v-280q0-83 50-147.5T420-792v-28q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v28q80 20 130 84.5T720-560v280h80v80H160Zm320-300Zm0 420q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM320-280h320v-280q0-66-47-113t-113-47q-66 0-113 47t-47 113v280Z" /></svg>,
            name: 'Real-Time Updates',
            description: 'Receive real-time notifications about flight changes, gate updates, and other important travel information.'
        }, {
            icon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M19 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h4l3 3 3-3h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 16h-4.83l-.59.59L12 20.17l-1.59-1.59-.58-.58H5V4h14v14zm-7-1l1.88-4.12L18 11l-4.12-1.88L12 5l-1.88 4.12L6 11l4.12 1.88z" /></svg>,
            name: 'Personalized Recommendations',
            description: 'Get personalized recommendations for destinations, activities, and dining based on your interests and travel style.'
        }, {
            icon: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#FFFFFF"><path d="M0 0h24v24H0V0z" fill="none" /><path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM10 5.47l4 1.4v11.66l-4-1.4V5.47zm-5 .99l3-1.01v11.7l-3 1.16V6.46zm14 11.08l-3 1.01V6.86l3-1.16v11.84z" /></svg>,
            name: 'Offline Maps & Guides',
            description: 'Access your maps and travel guides even without an internet connection, ensuring you&apos;re never lost.'
        }
    ]

    const [loggedIn, setLoggedIn] = useState(false);
  

    useEffect(() => {
        const checkLogin = async () => {
            const result = await checkIfLoggedIn();
            console.log(result);
            setLoggedIn(result);
        };
        checkLogin();
    }, []);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [userMessage, setUserMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [sent, setSent] = useState(false);
    const [waiting, setWaiting] = useState(false);

    async function submitMessage(e) {

        e.preventDefault();
        setWaiting(true);
        setErrorMessage('');
        const response = await sendMessage(name, email, userMessage);
        setWaiting(false);
        console.log(response);
        if (response.error) {
            setErrorMessage(response.error);
        }
        if(response.success){
            setSent(true);
            setTimeout(() => {
                setSent(false);
            }, 2000);

        }

    }







    return (<>



        <div className={` ${styles.main} bg-background-light dark:bg-background-dark font-display text-[#101d22] dark:text-background-light`}>
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">


                <main className="flex flex-1 flex-col">
                    <section className={`${styles.section1} relative flex min-h-[60vh] items-center justify-center bg-cover bg-center py-20 text-white`}>
                        <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center">
                            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">Travel Smarter with RoamRite</h1>
                            <p className="max-w-2xl text-lg font-light md:text-xl">Your all-in-one trip management app for seamless planning and unforgettable journeys.</p>
                        </div>
                    </section>
                    <section className="py-16 sm:py-24">
                        <div className="container mx-auto flex flex-col gap-12 px-4">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold sm:text-4xl">About RoamRite</h2>
                                <p className="mt-4 max-w-3xl mx-auto text-[#101d22]/70 dark:text-background-light/70">RoamRite was born from a passion for travel and a frustration with the complexities of trip planning. We believe that every journey should be an adventure, not a logistical headache. Our mission is to empower travelers with intuitive tools that simplify planning, enhance the experience, and create lasting memories.</p>
                            </div>
                            <div>
                                <h3 className="mb-4 text-center text-2xl font-bold sm:text-3xl">Our Vision</h3>
                                <p className="text-center max-w-3xl mx-auto text-[#101d22]/70 dark:text-background-light/70">To become the leading trip management app, trusted by travelers worldwide for its ease of use, comprehensive features, and commitment to enhancing every aspect of the travel experience.</p>
                            </div>
                        </div>
                    </section>
                    <section className={`bg-primary/10 dark:bg-primary/20 ${styles.featuresSection}`}>
                        <div className="container mx-auto px-4">
                            <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">Why Choose Us</h2>



                            <div className={`grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 ${styles.gridContainer}`}>


                                {features.map((feature) => (
                                    <div key={feature.name} className={`group transform rounded-xl bg-background-light p-6 shadow-md transition-all hover:-translate-y-2 hover:shadow-xl dark:bg-background-dark ${styles.gridItem}`}>
                                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white" style={{ backgroundColor: '#13b6ec' }}>{feature.icon}</div>
                                        <h3 className="mb-2 text-xl font-bold">{feature.name}</h3>
                                        <p className="text-[#101d22]/70 dark:text-background-light/70">{feature.description}</p>
                                    </div>
                                ))}



                            </div>
                        </div>
                    </section>
                    <section className="py-16 sm:py-24">
                        <div className="container mx-auto px-4">
                            <h2 className={styles.contectUsH2}>Contact Us</h2>
                            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                                <form className="flex flex-col gap-6" onSubmit={(e) => submitMessage(e)}>
                                    {!loggedIn && <>
                                        <div>
                                            <label className={styles.formLabel} htmlFor="name">Your Name</label>
                                            <input className={styles.formInput} onChange={(e) => setName(e.target.value)} value={name} id="name" placeholder="Enter your name" type="text" required/>
                                        </div>
                                        <div>
                                            <label className={styles.formLabel} htmlFor="email">Your Email</label>
                                            <input className={styles.formInput} onChange={(e) => setEmail(e.target.value)} value={email}  id="email" placeholder="Enter your email" type="email" required/>
                                        </div>

                                    </>}

                                    <div>
                                        <label className={styles.formLabel} htmlFor="message">Your Message</label>
                                        <textarea className={styles.formTextarea} onChange={(e) => setUserMessage(e.target.value)} value={userMessage} id="message" placeholder="Enter your message" rows="5" required></textarea>













                                    </div>
                                    <span style={{ fontSize: '13px', color: 'red' }}>{errorMessage} </span>
                                        {sent?   
                                        <p className={styles.thankYou}>Thank You</p> : 
                                          <button className={`${styles.submitForm} ${waiting? styles.submitFormWaiting: ''}`} disabled={waiting}  type="submit">
                                           {waiting? <ClipLoader size={20}/> :'Send Message'}
                                           
                                            
                                            </button>
                                        }
                                        {console.log(sent)}
                                  
                                </form>
                                <div className="flex flex-col gap-8">
                                    <div className="flex items-start gap-4">
                                        <div className={styles.contectUsIcon}>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#13b6ec"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" /></svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">Email</h3>
                                            <p className={styles.eachContectUsInfo}>info@softgear.dev</p>
                                        </div>
                                    </div>




                                    <Link to='https://www.linkedin.com/in/yossi-goldberger-28811b341' target="_blank" rel="noopener noreferrer" className="flex items-start gap-4">
                                        <div className={styles.contectUsIcon}>
                                            <svg aria-hidden="true" className="h-6 w-6" fill="#13b6ec" viewBox="0 0 24 24"><path clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fillRule="evenodd"></path></svg>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">LinkedIn</h3>
                                            <p className={styles.eachContectUsInfo}>Joseph Goldberger</p>
                                        </div>
                                    </Link>
                                    <Link to='https://github.com/yossi-gold' target="_blank" rel="noopener noreferrer" className="flex items-start gap-4">
                                        <div className={styles.contectUsIcon}>
                                            <svg aria-hidden="true" className="icon" viewBox="0 0 24 24" fill="#13b6ec">
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 
                                                        3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 
                                                        0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61 
                                                        -.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.084-.729.084-.729 
                                                        1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.305 3.492.998 
                                                        .108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 
                                                        0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.523.116-3.176 
                                                        0 0 1.008-.322 3.3 1.23a11.52 11.52 0 013.003-.404c1.02.005 
                                                        2.045.138 3.003.404 2.29-1.552 3.297-1.23 3.297-1.23 
                                                        .653 1.653.241 2.873.118 3.176.77.84 
                                                        1.235 1.91 1.235 3.22 0 4.61-2.803 5.628-5.475 
                                                        5.922.43.372.823 1.102.823 2.222 
                                                        0 1.606-.014 2.896-.014 3.286 
                                                        0 .317.218.687.825.57C20.565 22.092 24 
                                                        17.592 24 12.297c0-6.627-5.373-12-12-12"
                                                />
                                            </svg>

                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">GitHub</h3>
                                            <p className={styles.eachContectUsInfo}>https://github.com/yossi-gold</p>
                                        </div>
                                    </Link>

                                    {/* hidden   */}
                                    <div style={{ display: 'none' }}>
                                        <div className="flex items-start gap-4">
                                            <div className={styles.contectUsIcon}>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#13b6ec"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" /></svg>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold">Location</h3>
                                                <p className={styles.eachContectUsInfo}>123 Wanderlust Way, Travelville, CA 90210</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className={styles.contectUsIcon}>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#13b6ec"><path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z" /></svg>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold">Phone</h3>
                                                <p className={styles.eachContectUsInfo}>+1 (555) 123-4567</p>
                                            </div>
                                        </div>

                                    </div>


                                    {/* hidden   */}
                                    <div style={{ display: 'none' }} className="mt-4">
                                        <h3 className="text-lg font-bold">Follow Us</h3>
                                        <div className="mt-2 flex gap-4">
                                            <a className="text-[#101d22] dark:text-background-light hover:text-primary dark:hover:text-primary transition-colors" href="#">
                                                <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fillRule="evenodd"></path></svg>
                                            </a>
                                            <a className="text-[#101d22] dark:text-background-light hover:text-primary dark:hover:text-primary transition-colors" href="#">
                                                <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.323-1.325z"></path></svg>
                                            </a>
                                            <a className="text-[#101d22] dark:text-background-light hover:text-primary dark:hover:text-primary transition-colors" href="#">
                                                <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.298 1.634 4.212 3.793 4.649-.65.177-1.353.23-2.063.136.604 1.884 2.352 3.267 4.422 3.305-1.727 1.349-3.882 2.155-6.223 1.833 2.126 1.365 4.658 2.164 7.34 2.164 8.55 0 13.23-7.078 12.996-13.562.91-.657 1.696-1.477 2.322-2.408z"></path></svg>
                                            </a>
                                            <a className="text-[#101d22] dark:text-background-light hover:text-primary dark:hover:text-primary transition-colors" href="#">
                                                <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.25-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.359 2.618 6.78 6.98 6.98 1.28.058 1.688.072 4.948.072s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.947s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z" fillRule="evenodd"></path></svg>
                                            </a>
                                        </div>
                                    </div>





                                </div>
                            </div>
                        </div>
                    </section>


                    {/* hidden */}
                    <section className="bg-primary py-16 sm:py-24 text-white" style={{ display: 'none' }}>
                        <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl max-w-3xl">Your next adventure starts here. Let RoamRite be your trusted travel companion.</h2>
                            <button className="mt-4 rounded-lg bg-white px-8 py-3 text-base font-bold text-primary shadow-lg transition-transform hover:scale-105">Get Started with RoamRite</button>
                        </div>
                    </section>
                </main>
                {/* hidden */}
                <div className="sticky bottom-0 z-40 w-full bg-primary/90 py-4 px-4 backdrop-blur-sm sm:px-10" style={{ display: 'none' }}>
                    <div className="container mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h3 className="text-lg font-bold text-white">Ready to plan your next trip?</h3>
                        </div>
                        <button className="rounded-lg bg-white px-6 py-2 text-base font-bold text-primary shadow-md transition-transform hover:scale-105">
                            Get Started
                        </button>
                    </div>
                </div>

                <footer className={`${styles.footer} bg-background-light dark:bg-background-dark border-t border-primary/20`}>
                    <div className="container mx-auto px-4 py-8">
                        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                            <p className="text-sm  ">© 2025 RoamRite. All rights reserved.</p>
                            <div className="flex gap-6">
                                <a className="text-sm   hover:text-primary" href="#">Privacy Policy</a>
                                <a className="text-sm   hover:text-primary" href="#">Terms of Service</a>
                                {/*  <a className="text-sm text-[#101d22]/70  hover:text-primary" href="#">Contact Us</a> */}
                            </div>
                        </div>
                    </div>


                </footer>
            </div>


        </div>







    </>)
}

















/*  tailwind.config = {
   darkMode: 'class',
   theme: {
     extend: {
       colors: {
         primary: '#13b6ec',
         'background-light': '#f6f8f8',
         'background-dark': '#101d22',
       },
       fontFamily: {
         display: ['Spline Sans'],
       },
       borderRadius: {
         DEFAULT: '0.5rem',
         lg: '1rem',
         xl: '1.5rem',
         full: '9999px',
       },
     },
   },
 };
</script>
<style>
 .material-symbols-outlined {
   font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;

 }
</style>
*/

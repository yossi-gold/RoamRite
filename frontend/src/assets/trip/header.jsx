import styles from './header.module.css';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripInfo } from './context';








export function Header(props) {
    const { trip_name, firstName } = useTripInfo();
    const Navigate = useNavigate();
    //console.log(props);

    const [settingsOpen, setSettingsOpen] = useState(false);

    const UserSettingsRef = useRef(null);








    async function logout() {

        try {
            const API_URL = 'https://trip-production-fa70.up.railway.app/api';
            const response = await fetch(API_URL + '/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            console.log('Logout successful');
            Navigate('/');



        } catch (error) {


            console.error('Logout error:', error);
        }
    }

    function UserSettings() {
        return (
            <div className={styles.userSettings}>

                <div>
                    <div className={styles.userSettingsprofileContainer}>


                        <div className={styles.profileInSettings}>
                            <p>{firstName?.[0] || '—'}</p>

                        </div>
                    </div>
                    <p style={{ textAlign: 'center' }}>
  Hi
  {firstName
    ? ', ' + firstName.charAt(0).toUpperCase() + firstName.slice(1)
    : ''}
</p>
                </div>
                <div className={styles.userSettingsBottom}>
                    <div style={{display: 'none'}}>

                    
                    <div className={styles.buttonContainer}>
                        <button onClick={() => setSettingsOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" /></svg>
                            <p>Settings</p>
                        </button>
                    </div>
                    <div className={styles.buttonContainer}>

                        <button onClick={() => setSettingsOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
                            <p>Help</p>
                        </button>
                    </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <Link to={'/about'} onClick={() => setSettingsOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-400q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400ZM320-240h320v-23q0-24-13-44t-36-30q-26-11-53.5-17t-57.5-6q-30 0-57.5 6T369-337q-23 10-36 30t-13 44v23ZM720-80H240q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80Zm0-80v-446L526-800H240v640h480Zm-480 0v-640 640Z" /></svg>
                            <p>About</p>
                        </Link>
                    </div>
                    {/*     <button>contact</button> */}
                    <hr />
                    <div className={styles.buttonContainer}>
                        <button onClick={() => {
                            setSettingsOpen(false);
                            logout();
                        }} >
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" /></svg>
                            <p>Logout</p></button>
                    </div>
                </div>

            </div>
        )

    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                !UserSettingsRef.current.contains(event.target)
            ) {
                setSettingsOpen(false);
            
            }
        }

        document.addEventListener("click", handleClickOutside);

        // ✅ cleanup on unmount
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);



    return (
        <>

            <header className={styles.infoHeader}>

                {!props.loading && (<> <div className={styles.leftSection}>
                    <Link to="/all_trips" className={styles.tripsButton}>
                        <p>
                            My Trips
                        </p>


                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M160-120q-33 0-56.5-23.5T80-200v-440q0-33 23.5-56.5T160-720h160v-80q0-33 23.5-56.5T400-880h160q33 0 56.5 23.5T640-800v80h160q33 0 56.5 23.5T880-640v440q0 33-23.5 56.5T800-120H160Zm240-600h160v-80H400v80Zm-160 80h-80v440h80v-440Zm400 440v-440H320v440h320Zm80-440v440h80v-440h-80ZM480-420Z" /></svg>
                    </Link>


                    <Link to="/add_expense" className={styles.locationButton}>
                        {<p>{trip_name}</p>}

                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-42v-80q-125-14-214.5-103.5T122-440H42v-80h80q14-125 103.5-214.5T440-838v-80h80v80q125 14 214.5 103.5T838-520h80v80h-80q-14 125-103.5 214.5T520-122v80h-80Zm40-158q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-120q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Zm0-80Z" /></svg>

                    </Link>


                       <Link to="/all_trips" className={styles.tripsButtonSmall}>
                        


                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M160-120q-33 0-56.5-23.5T80-200v-440q0-33 23.5-56.5T160-720h160v-80q0-33 23.5-56.5T400-880h160q33 0 56.5 23.5T640-800v80h160q33 0 56.5 23.5T880-640v440q0 33-23.5 56.5T800-120H160Zm240-600h160v-80H400v80Zm-160 80h-80v440h80v-440Zm400 440v-440H320v440h320Zm80-440v440h80v-440h-80ZM480-420Z" /></svg>
                    </Link>


                    <Link to="/add_expense" className={styles.locationButtonSmall}>
                    

                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-42v-80q-125-14-214.5-103.5T122-440H42v-80h80q14-125 103.5-214.5T440-838v-80h80v80q125 14 214.5 103.5T838-520h80v80h-80q-14 125-103.5 214.5T520-122v80h-80Zm40-158q116 0 198-82t82-198q0-116-82-198t-198-82q-116 0-198 82t-82 198q0 116 82 198t198 82Zm0-120q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T560-480q0-33-23.5-56.5T480-560q-33 0-56.5 23.5T400-480q0 33 23.5 56.5T480-400Zm0-80Z" /></svg>

                    </Link>
                    {/*     <div className="profileButton flex items-center px-4 py-2 border-2 border-black rounded-md cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.33-8 4v2h16v-2c0-2.67-5.33-4-8-4z" />
                        </svg>
                    </div> */}

                    {/*   <div>
                        <p>More</p>
                   
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.97.89 1.66.89H22c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14z"/><circle cx="9" cy="12" r="1.5"/><circle cx="14" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
                 </div> */}
                </div>

                    <div className={styles.rightSection} ref={UserSettingsRef}>
                        <div className={styles.profile} onClick={() => setSettingsOpen(!settingsOpen)}>
                            <p>{firstName?.[0] || '—'}</p>

                        </div>
                        {settingsOpen && <UserSettings />}


                    </div>

                </>)}

            </header>



        </>
    )


}
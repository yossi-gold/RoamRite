import { Routes, Route } from 'react-router-dom';
import { MainPage } from './assets/trip/mainPage/trip';
import { ExpensesPage } from './assets/trip/expenses/expenses';
import { Login } from './assets/trip/login/login';
import { Signup } from './assets/trip/login/signup';
import { AllTrips } from './assets/trip/all-trips/dashboard';
import { NewTrip } from './assets/trip/newTrip/new-trip';
import { EachTripHistory } from './assets/trip/all-trips/dashboard_for_each_trip_from_history/tripHistory';
import { useState, useEffect } from 'react';
import { HeaderPage } from './assets/trip/header/headerpage';
import { TripContext } from './assets/trip/context';
import { getUserInfo } from './assets/trip/utils/fatch';
import { Suggestions } from './assets/trip/suggestions/Suggestions';
import { About } from './assets/trip/about/about';
import { Website } from './assets/website/website';



function App() {
    const [loadingUserInfo, setLoadingUserInfo] = useState(true);

    const [currentTripId, setCurrentTripId] = useState(null);
    const [firstName, setFirstName] = useState(null);
    const [trip_name, setTrip_name] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);


    useEffect(() => {
        const getData = async () => {
            try {
                const responce = await getUserInfo();
                console.log(responce);
                if (responce.loggedIn) {
                    if (responce.trips) {
                        setCurrentTripId(responce.data.currentTripInfo.current_trip_id);
                        setTrip_name(responce.data.currentTripInfo.trip_name)
                    }else{
                        setCurrentTripId(null);
                    }


                    setFirstName(responce.data.firstName)
                    setLoggedIn(true);
                    
                    
                } else {
                    setLoggedIn(false)

                }

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally{
                setLoadingUserInfo(false);
            }
        };

        getData();



    }, [loggedIn])

    return (
        <>
            {console.log(loggedIn)}
            <TripContext.Provider value={{ currentTripId, setCurrentTripId, firstName, trip_name, setTrip_name, setLoggedIn, loggedIn, loadingUserInfo}}>
                <Routes>
                    {/*   <Route path="/" element={<Navigate to="/login" replace />} /> */}
                    <Route path="/" element={<Website />} />
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />


                    <Route element={<HeaderPage />} >

                        <Route path="add_expense" element={<MainPage />} />
                        <Route path="my_expenses" element={<ExpensesPage />} />
                        <Route path="all_trips" element={<AllTrips />} />
                        <Route path="trip/:id" element={<EachTripHistory />} />
                        <Route path="suggestions" element={<Suggestions />} />
                        <Route path="about" element={<About />} />

                    </Route>




                    <Route path="new_trip" element={<NewTrip />} />


                    {/*   <Route path="*" element={<Navigate to="/login" replace />} /> */}
                </Routes>
            </TripContext.Provider>
        </>
    );
}


export default App

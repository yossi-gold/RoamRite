import { Routes, Route } from 'react-router-dom';
import { MainPage } from './assets/trip/trip';
import { ExpensesPage } from './assets/trip/expenses';
import { Login } from './assets/trip/login';
import { Signup } from './assets/trip/signup';
import { AllTrips } from './assets/trip/all-trips/dashboard';
import { NewTrip } from './assets/trip/all-trips/new-trip';
import { EachTripHistory } from './assets/trip/all-trips/dashboard_for_each_trip_from_history/tripHistory';
import { useState, useEffect } from 'react';
import { HeaderPage } from './assets/trip/headerpage';
import { TripContext } from './assets/trip/context';
import { getUserInfo } from './assets/trip/utils/fatch';
import { Suggestions } from './assets/trip/all-trips/Suggestions';
import { About } from './assets/trip/about/about';
import { Website } from './assets/website/website';



function App() {
  const [currentTripId, setCurrentTripId] = useState(NaN);
  const [firstName, setFirstName] = useState(null);
  const [trip_name, setTrip_name] = useState('');


  useEffect(() => {
    const getData = async () => {
      try {
        const data = await getUserInfo();
        console.log(data.currentTripInfo.current_trip_id);

        setCurrentTripId(data.currentTripInfo.current_trip_id);
        setFirstName(data.firstName)
        setTrip_name(data.currentTripInfo.trip_name)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getData();



  }, [])

  return (
    <>
      <TripContext.Provider value={{ currentTripId, setCurrentTripId, firstName, trip_name, setTrip_name }}>
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

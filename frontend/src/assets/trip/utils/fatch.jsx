




const API_URL = 'https://trip-production-fa70.up.railway.app/api';


export async function fetchAndRenderData(id) {


    try {
        // Fetch budget

        const response = await fetch(`${API_URL}/tripTotalInfo/${id}`,
            {
                method: 'GET', // Use 'POST' for login
                credentials: 'include', // ✅ Required for cookies

            }
        );

        if (!response.ok) {
            console.log(response.status);
            return null;


        }

        const data = await response.json();
        console.log(data);


        return data;



    } catch (error) {
        console.error("Error fetching data:", error);
        return null;

    }
}


export async function setCurrentTrip(trip) {

    try {
        // const responce = await  fetch(`http://localhost:3020/api/setCurrentTrip?currentTripId=${encodeURIComponent(currentTripId)}`, {

        const responce = await fetch(`${API_URL}/setCurrentTrip?currentTripId=${encodeURIComponent(trip)}`, {


            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!responce.ok) {
            console.error('Network response was not ok');
            const data = await responce.json();
            console.log(data);
            return NaN
        }

        const data = await responce.json();
        console.log(data.message.current_trip_id);
        return (data.message.current_trip_id);

    } catch (error) {
        console.error(error);
        return NaN
    }



}






//need to make sure i pass navigate as a parameter always when i call this function

/* this function returns  
    currentTripInfo
    total - total Trips
    totalExpenses - based on currant trip
    trips - all trips info
*/




export async function fetchAndRenderAllData(navigate) {


    try {
        // Fetch budget

        const budgetResponse = await fetch(`${API_URL}/totalTrips`,
            {
                method: 'GET', // Use 'POST' for login
                credentials: 'include', // ✅ Required for cookies

            }
        );
        // console.log(budgetResponse.status);
        if (!budgetResponse.ok) {
            console.log(budgetResponse.status);
            if (budgetResponse.status === 401) {
                navigate(); // or show a login modal
            }
        }
        const budgetData = await budgetResponse.json();
        console.log(budgetData);

        return budgetData;


    } catch (error) {
        console.error("Error fetching data:", error);
        return null;

    }
}


/* 
this function returns 
  users current trip id
  current trip_name
  users first Name

*/

export const getUserInfo = async () => {
    try {
        const response = await fetch(`${API_URL}/userInfo`, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.warn('User not logged in');
                return; // Exit early, don't set state
            }

            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);


        return data;
    } catch (error) {
        console.error('Error fetching user info:', error);
    }
};




export async function fetchAndRenderExpenses(navigate, currentTripId) {
    console.log(currentTripId);
    if (!currentTripId) return
    try {

        // Fetch budget
        const expensesResponse = await fetch(`${API_URL}/expenses?tripId=${currentTripId}`, {
            method: 'GET', // Use 'POST' for login
            credentials: 'include', // ✅ Required for cookies

        });
        console.log(expensesResponse.status);
        if (!expensesResponse.ok) {
            console.log(expensesResponse.status);
            if (expensesResponse.status === 401) {
                navigate;
            }
            return null;
        }
        if (expensesResponse.status === 204) {
            return null
        }

        const expensesData = await expensesResponse.json();

        return expensesData;






    } catch (error) {
        console.error("Error fetching data:", error);
        return null;

    }
}


export async function sendMessage(userMessage) {

    console.log(userMessage);

    try {

        // Fetch budget
        const response = await fetch(`${API_URL}/messages`, {
            method: 'POST', // Use 'POST' for login
            credentials: 'include', // ✅ Required for cookies
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userMessage })


        });

        if (!response.ok) {
            console.log(response.status);
            const data = await response.json();
            const error = data.message;
            return { error };
        }


        const data = await response.json();
        console.log(data);


        return [{ error: '' }]





    } catch (error) {
        console.error("Error fetching data:", error.message);
        return error.message;

    }

}


export async function checkIfLoggedIn() {
  try {
    const response = await fetch(`${API_URL}/test`, {
      method: 'GET',
      credentials: 'include',
    });

    console.log('Login check status:', response.status);
    return response.ok; // true if status is 2xx, false otherwise
    
  } catch (error) {
    console.error('Login check failed:', error);
    return false;
  }
}

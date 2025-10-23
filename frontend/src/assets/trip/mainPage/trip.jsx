
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './trip.css';
import { GridLoader } from 'react-spinners';



//const API_URL1 = 'http://localhost:3020/api';
const API_URL = 'https://trip-production-fa70.up.railway.app/api';
import { useNavigate } from 'react-router-dom';
import { fetchAndRenderAllData } from '../utils/fatch';















export function MainPage() {



    const navigate = useNavigate();
    const [StartingBudget, setStartingBudget] = useState(0.00);
    const [expenses, setExpenses] = useState(0.00);
    const [remainingBalance, setRemainingBalance] = useState(0.00);
    const [percentage, setPercentage] = useState(0);
    const [trip_name, setTrip_name] = useState('');
    const [destination, setDestination] = useState('');

    const [image, setImage] = useState('1.jpg');



    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setRemainingBalance((StartingBudget - expenses).toFixed(2));
        setPercentage(Math.min((expenses / StartingBudget) * 100, 100));
    }, [StartingBudget, expenses])



    useEffect(() => {
        const getDataOnPageLoad = async () => {
            setLoading(true);
            const {data, status} = await fetchAndRenderAllData();
             if (status === 401){
             navigate('/login');
             return
        }
            if(status !== 404){
                 const initialBudget = parseFloat(data.currentTripInfo.budget);
            setStartingBudget(initialBudget);

            const totalExpenses = parseFloat(data.totalExpenses.toFixed(2));

            setExpenses(totalExpenses);

            setTrip_name(data.currentTripInfo.trip_name);
            setDestination(data.currentTripInfo.destination);
            if (data.currentTripInfo.img) {
                setImage(data.currentTripInfo.img);
            }

            }else{
                
                navigate('/all_trips');
            }
           

            
            setLoading(false);
        }
        getDataOnPageLoad();

    }, [])
    const [isVisible, setIsVisible] = useState(false);


    const handleOpenModal = () => setIsVisible(true);





    const handleCloseModal = async (e) => {
        e.preventDefault();
        setIsVisible(false);
        const amountToUpdate = parseFloat(e.target.elements['initial-budget'].value);
        if (isNaN(amountToUpdate) || amountToUpdate < 0) {

            return;
        }
        try {
            const response = await fetch(`${API_URL}/budget`, {
                method: 'POST',
                credentials: 'include', // ✅ Required for cookies
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: amountToUpdate }),
            });
            if (!response.ok) {
                console.error('Error updating budget:', response.statusText);
                return;
            }
            const data = await response.json();
          
            const initialBudget = parseFloat(data.budget);
            setStartingBudget(initialBudget);


        } catch (error) {
            console.error('Error updating budget:', error);
        }

    };


    async function handleFormSubmit(e) {

        e.preventDefault();

        const expenseData = {
            description: e.target.description.value,
            amount: parseFloat(e.target.amount.value),
            category: e.target.category.value,
        };

        try {
            const response = await fetch(`${API_URL}/expenses`,
                {
                    method: 'POST', // 
                    credentials: 'include', // ✅ Required for cookies
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(expenseData)

                });


            const data = await response.json();
            console.log(data, expenseData.amount);
            setExpenses((prev) => parseFloat((prev + expenseData.amount).toFixed(2)));
            e.target.reset();

        } catch (error) {
            console.error("Error adding new expense:", error);
        }




    }





    //  console.log(props);





    return (<>




        {/*  <Header trip_name={trip_name} loading={loading} /> */}
        <div className='headers-and-content'>
            <div className='headers'>


                {/*  <Header trip_name={trip_name} loading={loading} /> */}
                {/*  <!-- UPDATED: The background image is now on the header itself --> */}
              
                {!loading && <header className="text-center header-with-image" style={{ backgroundImage: `url(${image})` }}>

                    <div className="relative z-10">
                        {/*    <!-- Updated header text and added script font class --> */}
                        <h1 className="golden-text script-font-header">
                            <span>{trip_name} to</span>
                            <span className="large-town-text">{destination}</span>
                        </h1>
                        <p className="text-gray-200 mt-2 text-lg">Keep track of your spending with ease.</p>
                    </div>
                </header>}
            </div>
            {loading && <div className="loading-indicator"><GridLoader color="#d4ebfb" size={25} /></div>}
            {!loading && <div className='content'>
                {/*  <!-- Navigation Links --> */}
                <nav className="flex justify-center space-x-4 mb-8 text-lg font-medium activitiesExpensesButtons">
                    <Link to="/Suggestions" className={`bg-gray-50 p-6 rounded-xl shadow-md activitiesExpensesLink`}>

                        <h2 className={`text-2xl font-bold text-gray-800 mb-4 flex items-center`} >
                                <div className='svgCon'>
                            <svg
                                xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#f93928ff"
                                
                            >
                                <path d="M80-120v-80h160v-160h-80v-80h84q12-75 66.5-129.5T440-636v-204h280v160H520v44q75 12 129.5 66.5T716-440h84v80h-80v160h160v80H80Zm240-80h120v-160H320v160Zm200 0h120v-160H520v160Z" />
                            </svg>
                            </div>
                            <span className="text-2xl font-bold">Suggested Activities</span>
                        </h2>
                    </Link>
                    <Link to="/my_expenses" className="bg-gray-50 p-6 rounded-xl shadow-md activitiesExpensesLink">

                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                            <div className='svgCon'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#82ff5bff"><path d="M240-80q-50 0-85-35t-35-85v-120h120v-560l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v680q0 50-35 85t-85 35H240Zm480-80q17 0 28.5-11.5T760-200v-560H320v440h360v120q0 17 11.5 28.5T720-160ZM360-600v-80h240v80H360Zm0 120v-80h240v80H360Zm320-120q-17 0-28.5-11.5T640-640q0-17 11.5-28.5T680-680q17 0 28.5 11.5T720-640q0 17-11.5 28.5T680-600Zm0 120q-17 0-28.5-11.5T640-520q0-17 11.5-28.5T680-560q17 0 28.5 11.5T720-520q0 17-11.5 28.5T680-480Z" /></svg>
                           </div>
                            <span className="text-2xl font-bold">View Expenses</span>
                        </h2>
                    </Link>



                </nav>



                {/*  <!-- Budget Summary Section --> */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-blue-50 p-6 rounded-xl text-center flex flex-col justify-between items-center relative">
                        <h2 className="text-xl font-medium text-blue-700">{/* Starting */}Total Budget</h2>
                        <p id="total-budget" className="text-3xl font-bold mt-2 text-blue-800">${StartingBudget}</p>
                        {/*  <button id="edit-budget-btn" className="absolute top-2 right-2 text-blue-400 hover:text-blue-600 transition-colors">
                    <i className="fas fa-bars text-lg"></i>
                </button> */}
                        <button id="edit-budget-btn" onClick={handleOpenModal} className="text-blue-400 hover:text-blue-600 mt-2 text-sm"><i className="fa-solid fa-pen-to-square mr-1"></i> Edit Budget</button>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-xl text-center">
                        <h2 className="text-xl font-medium text-orange-700">Total Spent</h2>
                        <p id="total-spent" className="text-3xl font-bold mt-2 text-orange-800">${expenses}</p>
                    </div>
                    <div className="bg-emerald-50 p-6 rounded-xl text-center">
                        <h2 className="text-xl font-medium text-emerald-700">Remaining Balance</h2>
                        <p id="remaining-balance" className="text-3xl font-bold mt-2 text-emerald-800">${remainingBalance}</p>
                    </div>
                </section>

                {/*     <!-- Budget Progress Bar --> */}
                <section className="mb-10">
                    <div className="bg-gray-200 rounded-full h-4 relative overflow-hidden">
                        <div id="budget-bar" className={`h-full ${percentage >= 100 ? 'bg-red-500' : 'bg-teal-500'} rounded-full transition-all duration-500 ease-out`} style={{ width: `${percentage}%` }}></div>
                    </div>
                </section>

                {/*  <!-- Expense Form Section --> */}
                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Add a New Expense</h2>
                    <form id="expense-form" className="space-y-4" onSubmit={handleFormSubmit}>
                        <div className="input-group">
                            <input type="text" id="description" name="description" required placeholder=" "

                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all" />
                            <label htmlFor="description">Description</label>
                        </div>
                        <div className="input-group">
                            <input type="number" id="amount" name="amount" required step="0.01" min="0" placeholder=" "

                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all" />
                            <label htmlFor="amount">Amount ($)</label>
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select id="category" name="category" required

                                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all">
                                <option value="Food">Food</option>
                                <option value="Lodging">Lodging</option>
                                <option value="Activities">Activities</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Transportation">Transportation</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div id="form-buttons" className="flex space-x-4">
                            <button type="submit" id="submit-btn"
                                className="fancy-button flex-1 px-6 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                            >
                                Add Expense
                            </button>
                        </div>
                    </form>
                </section>

            </div>}

        </div>



        {/*  <!-- The Budget Edit Modal --> */}
        <div id="budget-modal" className={`modal-overlay ${isVisible ? 'visible' : ''}`}>{/* className="modal-overlay" */}
            <form className="modal-content" onSubmit={handleCloseModal}>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Set Your Total Budget</h3>
                <div className="input-group mb-4">
                    <input type="number" id="initial-budget-input" name="initial-budget" required step="1" min="0" placeholder=" "
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all" />
                    <label htmlFor="initial-budget-input">Starting Budget ($)</label>
                </div>
                <button type='submit' className="fancy-button w-full px-6 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                    Done
                </button>
            </form>
        </div>

        {/*  <script src="./app.js"></script> */}
        {/*  <!-- aws qzP6DvXa8CugduM --> */}


    </>)
}





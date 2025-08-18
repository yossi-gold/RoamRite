
import { useState, useEffect } from "react";
import "./expenses.css";
import { RenderCategoryCards } from "./categoryCards";
import { Link } from 'react-router-dom';

import { getCategoryColor } from "./colors";
//import styles from './expenses.css';
const API_URL = 'https://trip-production-fa70.up.railway.app/api';





export function ExpensesPage() {

    const [StartingBudget, setStartingBudget] = useState('0.00');
    const [expenses, setExpenses] = useState('0.00');
    const [remainingBalance, setRemainingBalance] = useState('0.00');
    const [percentage, setPercentage] = useState(0);
    const [expensesDemo, setExpensesDemo] = useState([]);
    const [categories, setCategories] = useState([]);
    //console.log(categories);

    //console.log('percentage', percentage);

    const [circleTextPrimaryEl, setCircleTextPrimaryEl] = useState(expenses);
    const [circleTextSecondaryEl, setCircleTextSecondaryEl] = useState('Total Spent');
    const [circleTextTertiaryEl, setCircleTextTertiaryEl] = useState(percentage); //'0.0% of Budget'
    const [totalOrBudget, setTotalOrBudget] = useState('Budget');




    async function fetchAndRenderData() {
        try {
            // Fetch budget
            const budgetResponse = await fetch(`${API_URL}/budget`);
            const budgetData = await budgetResponse.json();

            const initialBudget = parseFloat(budgetData.budget);

            setStartingBudget(initialBudget);
            const totalExpenses = parseFloat(budgetData.totalExpenses);

            setExpenses(totalExpenses);
            setRemainingBalance((initialBudget - totalExpenses).toFixed(2));
            setPercentage(((totalExpenses / initialBudget) * 100).toFixed(1));




        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    async function fetchAndRenderExpenses() {
        try {
            // Fetch budget
            const expensesResponse = await fetch(`${API_URL}/expenses`);
            const expensesData = await expensesResponse.json();

            console.log(expensesData);

            setCategories(expensesData.categories);
            setExpensesDemo(expensesData.expenses);




        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }


    useEffect(() => {
        fetchAndRenderData();
        fetchAndRenderExpenses();
       
       

    }, [])

    function mouseHover(category) {

        console.log(category);
        setCircleTextPrimaryEl(category.total);
        setCircleTextSecondaryEl(category.category);
        setCircleTextTertiaryEl((category.percentage));
        setTotalOrBudget('total')
    }
    function mouseOut() {
        setCircleTextPrimaryEl(expenses);
        setCircleTextSecondaryEl(`Total Spent`);
        setCircleTextTertiaryEl(percentage);
        setTotalOrBudget('Budget');

    }
 useEffect(()=>{
    async function getAssiment() {  
const res = await fetch('/api/assignments');
const data =await res.json() ;
console.log('data', data);
//return data 
}
getAssiment();

 },[])
    
    useEffect(() => {
    
            mouseOut();
       

    }, [expenses, percentage])




    function RenderSpendingCircle() {


        const circumference = 2 * Math.PI * 45; // Circumference for a radius of 45
        let dashOffset = 0;
        return (
            categories.map((category) => {
                const total = category.total;

                const percentageOfTotal = expenses > 0 ? (total / expenses) * 100 : 0;
                const color = getCategoryColor(category.category);
                const dashArray = (percentageOfTotal / 100) * circumference;
                console.log('l', dashArray);
                dashOffset += dashArray;
                return (
                    <path key={category.category} onMouseOver={() => { mouseHover(category) }} onMouseOut={mouseOut} d="M 50 50 m 0 -45 a 45 45 0 0 1 0 90 a 45 45 0 0 1 0 -90" fill="none" stroke={color.ringColor} strokeWidth="10" strokeDasharray={`${dashArray} ${circumference - dashArray}`} strokeDashoffset={'-' + dashOffset} strokeLinecap="round" className="transition-all duration-300 ease-in-out cursor-pointer"></path>
                )
            }
            )
        )

    }



    function RenderExpensesPage() {


        // Render the interactive spending circle
        //renderSpendingCircle();

        // NEW: Render the category summary cards
        // renderCategoryCards();

        //expenseList.innerHTML = ''; // Clear existing list items
        return (
            expensesDemo.map((expense) => (


                <li key={expense.id} className="expense-item bg-gray-50 p-4 rounded-xl flex items-center justify-between transition-all hover:shadow-md">
                    <div className="flex-1">
                        <p className="text-lg font-medium text-gray-800">{expense.description}</p>
                        <p className="text-gray-500 text-sm">Category: {expense.category}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <p className="text-xl font-bold text-orange-600">${parseFloat(expense.amount).toFixed(2)}</p>
                        <button className="edit-btn text-gray-400 hover:text-teal-500 transition-all" data-id="${expense.id}">
                            <i className="fa-solid fa-pen-to-square text-xl"></i>
                        </button>
                        <button className="delete-btn text-gray-400 hover:text-red-500 transition-all" data-id="${expense.id}">
                            <i className="fa-solid fa-xmark text-xl"></i>
                        </button>
                    </div>
                </li>


            ))
        )
    }







    return (<>

        <div className="flex items-center justify-center min-h-screen p-4">
            <div className="container  p-6 lg:p-12">
                <div className="fancy-card">
                    <header className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Your Expenses</h1>
                        <p className="text-lg text-gray-600">A detailed breakdown of your trip spending.</p>
                    </header>

                    <section className="mb-10 text-center spending-summary-card">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Spending by Category</h2>
                        <div className="spending-ring-container">
                            {/*    <!-- SVG ring will be dynamically added here by JavaScript --> */}
                            <div id="spending-circle">
                                <svg viewBox="0 0 100 100" className="w-full h-full"><circle cx="50" cy="50" r="45" fill="transparent" stroke="#E5E7EB" strokeWidth="10"></circle>
                                    <RenderSpendingCircle />
                                </svg>


                            </div>
                            <div className="spending-ring-center">
                                <p id="circle-text-primary" className="text-3xl lg:text-4xl font-bold text-gray-800">${circleTextPrimaryEl}</p>
                                <p id="circle-text-secondary" className="text-lg text-gray-500">{circleTextSecondaryEl}</p>
                                <p id="circle-text-tertiary" className="text-sm text-blue-500 font-semibold">{circleTextTertiaryEl} % of {totalOrBudget}</p>
                            </div>
                        </div>
                    </section>

                    <hr className="my-10 border-gray-200" />
                      <nav className="flex justify-center space-x-4 mb-8 text-lg font-medium">
                        <Link to="/add_expense" className="text-gray-600 hover:text-teal-600 hover:border-b-2 hover:border-teal-600 pb-1 transition-colors">Add Expense</Link>
                        <Link to="/my_expenses" className="text-teal-600 border-b-2 border-teal-600 pb-1" >View All Expenses</Link>
                    </nav>

                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Category Breakdown</h2>
                        <div id="category-summary-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <RenderCategoryCards categories={categories} />
                        </div>
                    </section>

                    <hr className="my-10 border-gray-200" />

                    <section>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Expense List</h2>
                            <button id="clear-expenses"
                                className="fancy-button px-4 py-2 text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-all">
                                <i className="fa-solid fa-trash-can mr-2"></i>Clear All
                            </button>
                        </div>
                        <ul id="expense-list" className="space-y-4">
                            {/*  <!-- Expenses will be dynamically added here by JavaScript --> */}
                            <RenderExpensesPage />
                        </ul>
                    </section>
                </div>
            </div>
            <script type="module" src="app.js"></script>
        </div>

    </>)
}
{/*  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
    */}



import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './trip.css';
// To this line (using your actual URL)
const API_URL = 'https://trip-production-fa70.up.railway.app/api';




// --- Event Listeners ---
/* 
editBudgetBtn.addEventListener('click', () => {
    budgetModal.classList.add('visible');
});

closeModalBtn.addEventListener('click', () => {
    budgetModal.classList.remove('visible');
});

initialBudgetInput.addEventListener('input', async (e) => {
    const newBudget = parseFloat(e.target.value) || 0;
    try {
        await fetch(`${API_URL}/budget`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: newBudget })
        });
        fetchAndRenderData();
    } catch (error) {
        console.error("Error updating budget:", error);
    }
}); */








export function MainPage() {


    const [StartingBudget, setStartingBudget] = useState('0.00');
    const [expenses, setExpenses] = useState('0.00');
    const [remainingBalance, setRemainingBalance] = useState('0.00');
    const [percentage, setPercentage] = useState(0);






    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');

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
            setPercentage(Math.min((totalExpenses / initialBudget) * 100, 100))




        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    useEffect(() => {
        fetchAndRenderData();
    }, [])
     const [isVisible, setIsVisible] = useState(false);
 

  const handleOpenModal = () => setIsVisible(true);

  

   const handleBudgetChange = (e) => {
     
    setStartingBudget(e.target.value);
   
   
  };

  const handleCloseModal = async() => {
    setIsVisible(false);
     
    try {
      await fetch(`${API_URL}/budget`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(StartingBudget) }),
      });
      fetchAndRenderData();
    } catch (error) {
      console.error('Error updating budget:', error);
    }

};
   

    async function handleFormSubmit(e) {

        e.preventDefault();

        const expenseData = {
            description,
            amount: parseFloat(amount),
            category,
        };



        console.log(expenseData);



        try {
            await fetch(`${API_URL}/expenses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expenseData)
            });

            fetchAndRenderData();
            // ✅ Reset state
            setDescription('');
            setAmount('');
            setCategory('');


        } catch (error) {
            console.error("Error adding new expense:", error);
        }




    }








    return (<>
        <div className="flex items-center justify-center min-h-screen">
            <div className="container mx-auto p-2 lg:p-12">
                <div className="fancy-card relative overflow-hidden">
                    {/*  <!-- UPDATED: The background image is now on the header itself --> */}
                    <header className="text-center header-with-image">
                        <div className="relative z-10">
                            {/*    <!-- Updated header text and added script font class --> */}
                            <h1 className="golden-text script-font-header">
                                <span>Yossi And Frady`s trip to</span>
                                <span className="large-town-text">Tannersville N.Y.</span>
                            </h1>
                            <p className="text-gray-200 mt-2 text-lg">Keep track of your spending with ease.</p>
                        </div>
                    </header>
                    {/*  <!-- Navigation Links --> */}
                    <nav className="flex justify-center space-x-4 mb-8 text-lg font-medium">
                        <Link to="/add_expense" className="text-teal-600 border-b-2 border-teal-600 pb-1">Add Expense</Link>
                        <Link to="/my_expenses" className="text-gray-600 hover:text-teal-600 hover:border-b-2 hover:border-teal-600 pb-1 transition-colors">View All Expenses</Link>
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
                                <input type="text" id="description" name="description" required placeholder=" " value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all" />
                                <label htmlFor="description">Description</label>
                            </div>
                            <div className="input-group">
                                <input type="number" id="amount" name="amount" required step="0.01" min="0" placeholder=" " value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all" />
                                <label htmlFor="amount">Amount ($)</label>
                            </div>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select id="category" name="category" required value={category}
                                    onChange={(e) => setCategory(e.target.value)}
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
                                    className="fancy-button flex-1 px-6 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                                    Add Expense
                                </button>
                            </div>
                        </form>
                    </section>


                </div>
            </div>

            {/*  <!-- The Budget Edit Modal --> */}
            <div id="budget-modal" className={`modal-overlay ${isVisible? 'visible' : ''}`}>{/* className="modal-overlay" */}
                <div className="modal-content">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Set Your Total Budget</h3>
                    <div className="input-group mb-4">
                        <input type="number" id="initial-budget-input" name="initial-budget" required step="1" min="0" placeholder=" " onChange={handleBudgetChange}
                            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all" />
                        <label htmlFor="initial-budget-input">Starting Budget ($)</label>
                    </div>
                    <button id="close-modal-btn" onClick={handleCloseModal} className="fancy-button w-full px-6 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
                        Done
                    </button>
                </div>
            </div>
            
           {/*  <script src="./app.js"></script> */}
            {/*  <!-- aws qzP6DvXa8CugduM --> */}
        </div>

    </>)
}



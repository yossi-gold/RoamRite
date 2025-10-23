
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./expenses.module.css";
import { RenderCategoryCards } from "../categoryCards/categoryCards";

import { useTripInfo } from "../context";
import { DeleteExpense } from "./deleteExpense";
import { fetchAndRenderExpenses, fetchAndRenderAllData } from '../utils/fatch';



export function RenderExpensesPage(props) {

    return (



        <>


            {props.expensesDemo.map((expense) => (

                <li key={expense.id} className={`${styles.expenseItem} bg-gray-50 p-4 rounded-xl flex items-center justify-between transition-all hover:shadow-md`}>
                    <div className="flex-1">
                        <p className="text-lg font-medium text-gray-800">{expense.description}</p>
                        <p className="text-gray-500 text-sm">Category: {expense.category}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <p className="text-xl font-bold text-orange-600">${parseFloat(expense.amount).toFixed(2)}</p>
                        <button className="edit-btn text-gray-400 hover:text-teal-500 transition-all" data-id="${expense.id}" onClick={() => props.setVisibleEditModal({ state: true, id: expense.id })}>
                            <i className="fa-solid fa-pen-to-square text-xl"></i>
                        </button>
                        <button className="delete-btn text-gray-400 hover:text-red-500 transition-all" data-id="${expense.id}" onClick={() => props.setVisibleDeleteModal({ state: true, id: expense.id, name: expense.description })}>
                            <i className="fa-solid fa-xmark text-xl" ></i>
                        </button>
                    </div>
                </li>


            ))}



        </>

    )
}


export function ExpensesPage() {
    const { currentTripId, loadingUserInfo } = useTripInfo();


    const navigate = useNavigate();
    //   const [StartingBudget, setStartingBudget] = useState('0.00');
    const [expenses, setExpenses] = useState('0.00');
    // const [remainingBalance, setRemainingBalance] = useState('0.00');
    const [percentage, setPercentage] = useState(0);
    const [expensesDemo, setExpensesDemo] = useState([]);
    const [categories, setCategories] = useState([]);

    const [seeCategories, setSeeCategories] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    const [seeAllExpenses, setSeeAllExpenses] = useState(false);
    const [expensesFadeOut, setExpensesFadeOut] = useState(false);

    const [visibleDeleteModal, setVisibleDeleteModal] = useState({ state: false, id: null, name: '' });
    const [visibleEditModal, setVisibleEditModal] = useState({ state: false, id: null });


    async function fetchAndRenderData() {

        const { data, status } = await fetchAndRenderAllData();
        if (status === 401) {
            navigate('/login');
            return
        }
        if (status !== 404) {


            const initialBudget = parseFloat(data.currentTripInfo.budget);

            // setStartingBudget(initialBudget);
            const totalExpenses = (parseFloat(data.totalExpenses)).toFixed(2);

            setExpenses(totalExpenses);
            // setRemainingBalance((initialBudget - totalExpenses).toFixed(2));
            setPercentage(((totalExpenses / initialBudget) * 100).toFixed(1));



        }





    }








    useEffect(() => {


        async function fetchExpensesData() {
            try {

                const data = await fetchAndRenderExpenses(() => { navigate('/login') }, currentTripId)

                setCategories(data.categories);
                setExpensesDemo(data.expenses);


            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        if (loadingUserInfo) return;
        if (currentTripId) {
            fetchAndRenderData();
            fetchExpensesData();
        } else {
            navigate('/all_trips');
        }



    }, [currentTripId, loadingUserInfo])



    /* 
        useEffect(() => {
    
            mouseOut();
    
    
        }, [expenses, percentage])
    
     */













    return (<>



        {/*    <Header trip_name={'trip_name'} /> */}
        <div className={styles.fancyCard}>
            <header className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Your Expenses</h1>
                <p className="text-lg text-gray-600">A detailed breakdown of your trip spending.</p>
            </header>
            <hr className="my-10 border-gray-200" />
            <nav className="flex justify-center space-x-4 mb-8 text-lg font-medium">
                <Link to="/add_expense" className="text-gray-600 hover:text-teal-600 hover:border-b-2 hover:border-teal-600 pb-1 transition-colors">Add Expense</Link>
            </nav>


            {!expensesDemo.length && (
                <li className={`${styles.expenseItem} bg-gray-50 p-4 rounded-xl flex items-center justify-between transition-all hover:shadow-md`}>
                    <div className="flex-1">
                        <p className="text-lg font-medium text-gray-800" style={{ textAlign: 'center' }}>No expenses found yet, Start adding to see them in action!
                        </p>
                    </div>
                </li>
            )}
            {expensesDemo.length > 0 && (<>
                <button className={styles.seeCategoriesButton} onClick={() => {
                    if (fadeOut) return; // ignore clicks during fade-out
                    if (!seeCategories) { setSeeCategories(true) }
                    else {
                        setFadeOut(true);
                        setTimeout(() => {
                            setFadeOut(false)
                            setSeeCategories(false);

                        }, 600);
                    }
                }}>
                    <p> {!seeCategories && 'See by category'}{seeCategories && 'Close categories'}</p>
                    <span className={seeCategories ? (fadeOut ? styles.fadeOutSvg : styles.seeCategoriesSvg) : ''}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" /></svg></span>
                </button>


                {seeCategories &&
                    <div className={`${styles.categoryCardsContainer} ${fadeOut ? styles.fadeOut : ''}`}>

                        <RenderCategoryCards categories={categories} expenses={expenses} percentage={percentage} />
                    </div>
                }


                <button className={styles.seeCategoriesButton} onClick={() => {
                    if (fadeOut) return; // ignore clicks during fade-out
                    if (!seeAllExpenses) { setSeeAllExpenses(true) }
                    else {
                        setExpensesFadeOut(true);
                        setTimeout(() => {
                            setExpensesFadeOut(false)
                            setSeeAllExpenses(false);

                        }, 600);
                    }
                }}>
                    <p>All expenses</p>
                    <span className={seeAllExpenses ? (expensesFadeOut ? styles.fadeOutSvg : styles.seeCategoriesSvg) : ''}><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" /></svg></span>
                </button>

                {seeAllExpenses &&
                    <div className={`${styles.categoryCardsContainer} ${expensesFadeOut ? styles.fadeOut : ''}`}>
                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">Expense List</h2>
                                <button id="clear-expenses"
                                    className={`${styles.fancyButton} px-4 py-2 text-red-600 border-2 border-red-600 rounded-lg hover:bg-red-50 transition-all`}>
                                    <i className="fa-solid fa-trash-can mr-2"></i>Clear All
                                </button>
                            </div>
                            <ul id="expense-list" className="space-y-4">


                                <RenderExpensesPage expensesDemo={expensesDemo} setVisibleDeleteModal={setVisibleDeleteModal} setVisibleEditModal={setVisibleEditModal} />
                            </ul>
                        </section>
                    </div>
                }

            </>)}






        </div>



        {visibleDeleteModal.state &&
            <div className={`${styles.deleteModalOverlay} ${styles.visible}`}>
                <DeleteExpense setVisibleDeleteModal={setVisibleDeleteModal} visibleDeleteModal={visibleDeleteModal} setExpensesDemo={setExpensesDemo} expensesDemo={expensesDemo} />
            </div>}
        {visibleEditModal.state &&
           <div className={`${styles.deleteModalOverlay} ${styles.visible}`}>
        {/*  <DeleteExpense setVisibleEditModal={setVisibleEditModal} visibleEditModal={visibleEditModal} setExpensesDemo={setExpensesDemo} expensesDemo={expensesDemo} />  */}
       </div>
         }




    </>)
}
{/*  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
    */}


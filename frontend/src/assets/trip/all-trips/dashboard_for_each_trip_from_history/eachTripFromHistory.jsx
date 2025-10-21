
import { useEffect, useState } from "react";
import { fetchAndRenderData, setCurrentTrip } from "../../utils/fatch";
import { useParams } from "react-router-dom";
import { ClipLoader } from 'react-spinners';
import { useTripInfo } from "../../context";
import styles from './eachTripFromHistory.module.css';
import { convert } from "../../utils/dateConverter";
import { useNavigate } from "react-router-dom";
import { fetchAndRenderExpenses } from '../../utils/fatch';
import { CategoryBreakdown } from '../../categoryCards';
import { RenderExpensesPage } from '../../expenses'


export function OldTripDashboard() {
    const navigate = useNavigate
    const { currentTripId, setCurrentTripId, setTrip_name } = useTripInfo();
    // const [data, setData] = useState([]);
    const id = Number(useParams().id);
    const [totalSpent, setTotalSpent] = useState(NaN);
    const [budget, setBudget] = useState(NaN);
    const [currentTripName, setCurrentTripName] = useState('');
    const [tripImg, setTripImg] = useState('/tripCoin/1.jpg');
    const [startDate, setStartDate] = useState(false);
    const [endDate, setEndDate] = useState(false);
    /* const [currentTripId, setCurrentTripId] = useState(NaN); */
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [destination, setDestination] = useState('unknown');

    const [categoryBox, setCategoryBox] = useState(false);
    const [expensesBox, setExpensesBox] = useState(false);
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        try {
            const getData = async () => {
                const data = await fetchAndRenderData(id);


                console.log(data);
                if (data) {
                    setTotalSpent(data.totalSpent);
                    //setCurrentTripId(data.currentTripId)

                    setCurrentTripName(data.trip.trip_name);
                    setDestination(data.trip.destination);

                    setStartDate(convert(data.trip.start_date));
                    setEndDate(convert(data.trip.end_date));

                    setBudget(Number(data.trip.budget));
                    data.trip.img ? setTripImg(data.trip.img) : setTripImg('/tripCoin/1.jpg');

                } else {
                    console.log('invalid')
                }




            }
            getData();
        } catch (error) {
            console.error("Error fetching data:", error);
        }

    }, [])


    useEffect(() => {
        fetchAndRenderData();

        async function fetchExpensesData() {
            try {

                const data = await fetchAndRenderExpenses(() => { navigate('/login') }, id)
                if (!data) {
                    return;
                }
                console.log(id);
                setCategories(data.categories);
                setExpenses(data.expenses);


            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchExpensesData();



    }, [id])


    return (

        <>





            <div className="bg-white rounded-2xl shadow-lg p-6">

                <div className={styles.tripHeader}>
                    <div className={styles.tripInfo}>
                        <h1 className="text-3xl font-bold text-gray-800">{currentTripName}</h1>







                        <p className="text-gray-500">Date:  {startDate.year === endDate.year ?
                            startDate.month === endDate.month ? startDate.month + ' ' + startDate.year : `${startDate.month} - ${endDate.month} ${endDate.year}`
                            : `${startDate.fullDate} - ${endDate.fullDate}`}</p>

                        <p className="text-gray-500">Total Spent: <span className="font-semibold text-gray-700">${totalSpent}</span></p>
                    </div>

                    <div className={styles.current_setCurrent}>

                        {id === currentTripId ?
                            <div className="bg-gray-100 text-gray-800 font-semibold py-2 px-6 rounded-xl shadow  flex items-center">
                                Current Trip
                            </div> :
                            <button className={`bg-blue-500 text-white font-semibold py-2 px-6 rounded-full shadow hover:bg-blue-600 transition duration-300 flex items-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={loading}
                            onClick={async () => {
                                    setLoading(true);
                                    const newId = await setCurrentTrip(id);
                                    console.log(typeof newId);
                                    if (newId) {
                                        setCurrentTripId(newId);
                                        setTrip_name(currentTripName);

                                    }
                                    setLoading(false);
                                }}>

                                {loading ? <ClipLoader size={10} /> : 'Set as current trip'}
                            </button>
                        }

                        <button className="text-gray-500 hover:text-gray-700" style={{ display: 'none' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#6b7280"><path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" /></svg>
                        </button>
                    </div>
                </div>

                <div className={styles.imgAndBudgetInfo} >
                    <div className={`${styles.tripImage} mb-6`} style={{ backgroundImage: `url(${tripImg})` }} >
                        <div className={styles.destination}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q152 0 263.5 98T876-538q-20-10-41.5-15.5T790-560q-19-73-68.5-130T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h240q11 0 20.5 5.5T595-459q-17 27-26 57t-9 62q0 63 32.5 117T659-122q-41 20-86 31t-93 11Zm-40-82v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm340 82q-7 0-12-4t-7-10q-11-35-31-65t-43-59q-21-26-34-57t-13-65q0-58 41-99t99-41q58 0 99 41t41 99q0 34-13.5 64.5T873-218q-23 29-43 59t-31 65q-2 6-7 10t-12 4Zm0-113q10-17 22-31.5t23-29.5q14-19 24.5-40.5T860-340q0-33-23.5-56.5T780-420q-33 0-56.5 23.5T700-340q0 24 10.5 45.5T735-254q12 15 23.5 29.5T780-193Zm0-97q-21 0-35.5-14.5T730-340q0-21 14.5-35.5T780-390q21 0 35.5 14.5T830-340q0 21-14.5 35.5T780-290Z" /></svg>
                            {destination}</div>
                    </div>


                    <div className={`${styles.budgetInfo} grid grid-cols-1 md:grid-cols-3 gap-6 mb-6`}>
                        <div className={`${styles.eachBudgetInfo} bg-gray-100 p-4 rounded-xl text-center`}>
                            <p className="text-gray-500 text-sm">Budget</p>
                            <p className="text-2xl font-bold text-gray-800">${budget}</p>
                        </div>
                        <div className={`${styles.eachBudgetInfo} bg-gray-100 p-4 rounded-xl text-center`}>
                            <p className="text-gray-500 text-sm">Spent</p>
                            <p className="text-2xl font-bold text-green-500">${totalSpent}</p>
                        </div>
                        <div className={`${styles.eachBudgetInfo} bg-gray-100 p-4 rounded-xl text-center`}>
                            <p className="text-gray-500 text-sm">Remaining</p>
                            <p className="text-2xl font-bold text-red-500">${(budget - totalSpent).toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                {console.log(categories)}


                {categories.length > 0 && <>
                    <div className={styles.categoryExpensesButton}>
                        <div className={styles.categoryButtonCon}>
                            <button onClick={() => (setCategoryBox((prev) => !prev))}
                                className={styles.categoryButton}>
                                Category Breakdown
                            </button>
                            <div className={styles.categoryBox} style={categoryBox ? { display: 'block' } : { display: 'none' }}>
                                <CategoryBreakdown categories={categories} />
                            </div>
                        </div>

                        <div className={styles.expensesButtonCon}>
                            <button onClick={() => (setExpensesBox((prev) => !prev))}
                                className={styles.expensesButton}>
                                Expenses Table
                            </button>
                            <div className={styles.expensesBox} style={expensesBox ? { display: 'block' } : { display: 'none' }}>

                                <RenderExpensesPage expensesDemo={expenses} />


                            </div>

                        </div>


                    </div>

                    {/* <div className={styles.categoryExpensesBox}>

                        
                    </div> */}
                </>
                }





                {/*
                <div className="mb-6">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h2 className="text-2xl font-bold text-gray-800">Photo Gallery</h2>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z" /></svg>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="relative group">
                            <img alt="Eiffel Tower" className="rounded-lg object-cover w-full h-48" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyTqhrhR5M6vEmKcbyrmW_6nF66H_pLbc5j6atRY7sefe5M5EJK_VKFUgmS6sYZiZyXm9tLsCuzuxh03tpHW2lFK4Mk6ZDRYiKbnVbr3WvX6WwDj7tciScr_TqibPrFvd_YyVHJ3F9sS7yG6sVazv0pRN1UOMyFrAi2n9_eyYq4GEQNsIEbt3HzbiV4g4OQ_EWSNVnJsnUYsyXKn40q6qec14mFiF5E-dHPJ97rQA4rYimtT7LFjFzQ2nnI2wK7CceMo5opc8h4DE" />
                        </div>
                        <div className="relative group">
                            <img alt="Louvre Museum" className="rounded-lg object-cover w-full h-48" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo7HG-DXkLeFHLBXKg8sa_Mz68_dIjBHyMMJAFmGmNjIeiuoWzbzxawKK4wsLYrZAxkWfK_1iuZ2Q8Qz-oRuJCwrD67c6I-3LgxvSZB9scp8U-63RHRwHivUbCH8QHAyhTOLTDVX8grlofDDgHjh2LCuZbcoetVXCpgrnhnl-xUJn2mnQdm22CKCTJLQ6d8Eg14A0bkBReodfzoJzOsay0b36tH8JoVEzlAcBWWQyAhKa8R4p6I6eXW-6QpVTWZwqszSwIuk4hCRY" />
                        </div>
                        <div className="relative group">
                            <img alt="French pastries" className="rounded-lg object-cover w-full h-48" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_t6tVPf9egZqwx5i0fwcPaINWSgDRDUojL0pk0p18tclPS7Y7TLumw7US2ZRaa1FvkUzVRfaZqu9NauxU4MdV73r4GTvbm0IVVBvZSDhJiDDeImqoIIemdaURBHSymVvX5KsvQ5glcwt3bKAVKxIm-HZc6nqTHoLrKS5jdJMHhxBVE8XMZL-h2Ro0z-Obgr-ZuUETeCljpFOZWb8cS0LzMmNrrajb-dSvNwy5HUHYDDgavEuepFkuvc0XeW-DGEjlLteMYpZaOAg" />
                        </div>
                        <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-gray-600 transition-colors h-48" htmlFor="photo-upload">

                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#6a7282"><path d="M760-680v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80ZM440-260q75 0 127.5-52.5T620-440q0-75-52.5-127.5T440-620q-75 0-127.5 52.5T260-440q0 75 52.5 127.5T440-260Zm0-80q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM120-120q-33 0-56.5-23.5T40-200v-480q0-33 23.5-56.5T120-760h126l74-80h280v160h80v80h160v400q0 33-23.5 56.5T760-120H120Z" /></svg>
                            <span className="mt-2 text-sm font-medium">Add Photo</span>
                            <input className="sr-only" id="photo-upload" type="file" />
                        </label>
                    </div>
                </div> */}


            </div>





        </>
    );
}

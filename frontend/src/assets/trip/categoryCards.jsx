

import styles from "./expenses.module.css";
import { useState } from "react";


import { getCategoryColor } from "./colors";
export function CategoryBreakdown({categories}) {
    
    let i = 0;
    return(
       <section style={{ marginBottom: '40px' }}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Category Breakdown</h2>
            <main id="category-summary-cards" className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${styles.categorySummaryCards}`}>



                {categories.map((category) => {
                    // const total = category.total;
                    i++

                    const color = getCategoryColor(category.category);
                    return (<>
                     



                        <div key={i} className={`p-6 rounded-2xl shadow-lg transition-transform hover:scale-105 ${color.bgColor}`}>
                            <div className="flex items-center justify-start mb-2">
                                <div className="p-3 rounded-full mr-4" style={{ backgroundColor: color.ringColor }}>
                                    {/* <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M280-80v-366q-51-14-85.5-56T160-600v-280h80v280h40v-280h80v280h40v-280h80v280q0 56-34.5 98T360-446v366h-80Zm400 0v-320H560v-280q0-83 58.5-141.5T760-880v800h-80Z" /></svg>
                                   */} {color.svg} 
                                </div>
                                <span className="text-xl font-bold text-gray-800">{category.category}</span>

                            </div>

                            <div>
                                <span className={`text-lg font-semibold ${color.totalText}`}>${category.total}</span>
                            </div>
                            <div className={styles.percentageBox}>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="h-2.5 rounded-full" style={{ width: `${category.percentage}%`, backgroundColor: color.ringColor }}  ></div>

                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    {Number(category.percentage).toFixed(1)}%
                                </p>
                            </div>

                        </div>
                    </>

                    )


                }
                )}
            </main>
        </section>
)
}


export function RenderCategoryCards({ categories, expenses, percentage }) {
    console.log(expenses, typeof expenses);
    const [circleTextPrimaryEl, setCircleTextPrimaryEl] = useState(expenses);
    const [circleTextSecondaryEl, setCircleTextSecondaryEl] = useState('Total Spent');
    const [circleTextTertiaryEl, setCircleTextTertiaryEl] = useState(percentage); //'0.0% of Budget'
    const [totalOrBudget, setTotalOrBudget] = useState('Budget');

    function mouseHover(category) {

        //  console.log(category);
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
    /*   function RenderSpendingCircle() {
  
  
          const circumference = 2 * Math.PI * 45; // Circumference for a radius of 45
          let dashOffset = 0;
          return (
              categories.map((category) => {
                  const total = category.total;
  
                  const percentageOfTotal = expenses > 0 ? (total / expenses) * 100 : 0;
                  const color = getCategoryColor(category.category);
                  const dashArray = (percentageOfTotal / 100) * circumference;
                  //     console.log('l', dashArray);
                  dashOffset += dashArray;
                  return (
                      <path key={category.category} onMouseOver={() => { mouseHover(category) }} onMouseOut={mouseOut} d="M 50 50 m 0 -45 a 45 45 0 0 1 0 90 a 45 45 0 0 1 0 -90" fill="none" stroke={color.ringColor} strokeWidth="10" strokeDasharray={`${dashArray} ${circumference - dashArray}`} strokeDashoffset={'-' + dashOffset} strokeLinecap="round" className="transition-all duration-300 ease-in-out cursor-pointer"></path>
                  )
              }
              )
          )
  
      } */




    function RenderSpendingCircle() {
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        let accumulatedPercent = 0;

        return (
            <div id="spending-circle" className="w-full h-full">
                <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"
                    className="w-full h-full">
                    {/* Background circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="transparent"
                        stroke="#E5E7EB"
                        strokeWidth="10"
                    />

                    {/* Dynamic segments */}
                    {categories.map((category) => {
                        const total = category.total;
                        const percentage = expenses > 0 ? (total / expenses) * 100 : 0;
                        const color = getCategoryColor(category.category);
                        const dashArray = (percentage / 100) * circumference;
                        const dashOffset = circumference * 0.25; // Start at top
                        const rotation = (accumulatedPercent / 100) * 360;
                        accumulatedPercent += percentage;

                        return (
                            <circle
                                key={category.category}
                                r={radius}
                                cx="50"
                                cy="50"
                                fill="none"
                                stroke={color.ringColor}
                                strokeWidth="10"
                                strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                                strokeDashoffset={dashOffset}
                                strokeLinecap="round"
                                transform={`rotate(${rotation} 50 50)`}
                                className="transition-all duration-300 ease-in-out cursor-pointer"
                                onMouseOver={() => mouseHover(category)}
                                onMouseOut={mouseOut}
                            />
                        );
                    })}
                </svg>
            </div>
        );
    }
    

    return (<>

        <section className={`mb-10 text-center ${styles.spendingSummaryCard}`}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Spending by Category</h2>
            <div className={styles.spendingRingContainer}>
                {/*    <!-- SVG ring will be dynamically added here by JavaScript --> */}
                <div id="spending-circle" className="w-full h-[300px]">

                    <RenderSpendingCircle />



                </div>
                <div className={styles.spendingRingCenter}>
                    <p
                        id="circle-text-primary"
                        className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800"
                    >
                        ${circleTextPrimaryEl}
                    </p>

                    <p
                        id="circle-text-secondary"
                        className="text-sm sm:text-base md:text-lg text-gray-500"
                    >
                        {circleTextSecondaryEl}
                    </p>

                    <p
                        id="circle-text-tertiary"
                        className="text-xs sm:text-sm md:text-base text-blue-500 font-semibold"
                    >
                        {circleTextTertiaryEl} % of {totalOrBudget}
                    </p>
                </div>
            </div>
        </section>

     <CategoryBreakdown categories={categories} />

        <hr className="mb-10 border-gray-200" />
    </>)
}
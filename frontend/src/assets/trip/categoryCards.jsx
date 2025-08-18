import "./expenses.css";



import {getCategoryColor} from "./colors";

export function RenderCategoryCards({categories}) {
   console.log(categories);

     let i = 0;
    return (
        
    
  categories.map((category) => {
               // const total = category.total;
    i++
   
        const color = getCategoryColor(category.category);
return(
        <div key={i} className={`p-6 rounded-2xl shadow-lg transition-transform hover:scale-105 ${color.bgColor}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-bold text-gray-800">{category.category}</span>
                <span className="text-lg font-semibold ${'color.totalText'}">${category.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="h-2.5 rounded-full" style={{width: `${category.percentage}%`, backgroundColor: color.ringColor}}  ></div>
            </div>
           <p className="text-sm text-gray-500 mt-2">
  {Number(category.percentage).toFixed(1)}% of total spent
</p>
        </div>
)
        
      
    }
) 
)
}
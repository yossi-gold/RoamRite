export function getCategoryColor(category) {
  //console.log(category);
  switch (category) {
    case 'Food':
      return {
        ringColor: '#F43F5E', // rose-500
        text: 'text-rose-600',
        totalText: 'text-rose-800',
        bgColor: 'bg-rose-100',
        svg:  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M280-80v-366q-51-14-85.5-56T160-600v-280h80v280h40v-280h80v280h40v-280h80v280q0 56-34.5 98T360-446v366h-80Zm400 0v-320H560v-280q0-83 58.5-141.5T760-880v800h-80Z" /></svg>
      };
    case 'Lodging':
      return {
        ringColor: '#06B6D4', // cyan-500
        text: 'text-cyan-600',
        totalText: 'text-cyan-800',
        bgColor: 'bg-cyan-100',
          svg: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M40-200v-600h80v400h320v-320h320q66 0 113 47t47 113v360h-80v-120H120v120H40Zm240-240q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Z"/></svg>
      };
    case 'Transportation':
      return {
        ringColor: '#38B2AC', // teal-500
        text: 'text-teal-600',
        totalText: 'text-teal-800',
        bgColor: 'bg-teal-100',
          svg: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M240-120q-17 0-28.5-11.5T200-160v-82q-18-20-29-44.5T160-340v-380q0-83 77-121.5T480-880q172 0 246 37t74 123v380q0 29-11 53.5T760-242v82q0 17-11.5 28.5T720-120h-40q-17 0-28.5-11.5T640-160v-40H320v40q0 17-11.5 28.5T280-120h-40Zm0-440h480v-120H240v120Zm100 240q25 0 42.5-17.5T400-380q0-25-17.5-42.5T340-440q-25 0-42.5 17.5T280-380q0 25 17.5 42.5T340-320Zm280 0q25 0 42.5-17.5T680-380q0-25-17.5-42.5T620-440q-25 0-42.5 17.5T560-380q0 25 17.5 42.5T620-320Z"/></svg>
      };
    case 'Activities':
      return {
        ringColor: '#9F7AEA', // purple-500
        text: 'text-purple-600',
        totalText: 'text-purple-800',
        bgColor: 'bg-purple-100',
          svg: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M80-40v-80h40q32 0 62-10t58-30q28 20 58 30t62 10q32 0 62.5-10t57.5-30q28 20 58 30t62 10q32 0 62.5-10t57.5-30q27 20 57.5 30t62.5 10h40v80h-40q-31 0-61-7.5T720-70q-29 15-59 22.5T600-40q-31 0-61-7.5T480-70q-29 15-59 22.5T360-40q-31 0-61-7.5T240-70q-29 15-59 22.5T120-40H80Zm280-160q-36 0-67-17t-53-43q-17 18-37.5 32.5T157-205q-41-11-83-26T0-260q54-23 132-47t153-36l54-167q11-34 41.5-45t57.5 3l102 52 113-60 66-148-20-53 53-119 128 57-53 119-53 20-148 334q93 11 186.5 38T960-260q-29 13-73.5 28.5T803-205q-25-7-45.5-21.5T720-260q-22 26-53 43t-67 17q-36 0-67-17t-53-43q-22 26-53 43t-67 17Zm203-157 38-85-61 32-70-36-28 86h38q21 0 42 .5t41 2.5Zm-83-223q-33 0-56.5-23.5T400-660q0-33 23.5-56.5T480-740q33 0 56.5 23.5T560-660q0 33-23.5 56.5T480-580Z"/></svg>
      };
    case 'Shopping':
      return {
        ringColor: '#F97316', // orange-500
        text: 'text-orange-600',
        totalText: 'text-orange-800',
        bgColor: 'bg-orange-100',
          svg: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM208-800h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Z"/></svg>
      };
    case 'Other':
    default:
      return {
        ringColor: '#6B7280', // gray-500
        text: 'text-gray-600',
        totalText: 'text-gray-800',
        bgColor: 'bg-gray-50',
          svg: <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m260-520 220-360 220 360H260ZM700-80q-75 0-127.5-52.5T520-260q0-75 52.5-127.5T700-440q75 0 127.5 52.5T880-260q0 75-52.5 127.5T700-80Zm-580-20v-320h320v320H120Z"/></svg>
      };
  }
}

 export function getCategoryColor1(category) {
    console.log(category);
        switch (category) {
            case 'Food':
                // Added a new bgColor property
                return { ringColor: '#F43F5E', text: 'text-yellow-600', totalText: 'text-yellow-800', bgColor: 'bg-rose-100' };
            case 'Lodging':
                // Added a new bgColor property
                return { ringColor: '#06B6D4', text: 'text-blue-600', totalText: 'text-blue-800', bgColor: 'bg-cyan-100' };
            case 'Transportation':
                // Added a new bgColor property
                return { ringColor: '#38B2AC', text: 'text-purple-600', totalText: 'text-purple-800', bgColor: 'bg-teal-100' };
            case 'Activities':
                // Added a new bgColor property
                return { ringColor: '#9F7AEA', text: 'text-green-600', totalText: 'text-green-800', bgColor: 'bg-purple-100' };
            case 'Shopping':
                // Added a new bgColor property
                return { ringColor: '#F97316', text: 'text-red-600', totalText: 'text-red-800', bgColor: 'bg-orange-100' };
            case 'Other':
            default:
                // Added a new bgColor property
                return { ringColor: '#6B7280', text: 'text-gray-600', totalText: 'text-gray-800', bgColor: 'bg-gray-50' };
        }
    }

 export function getCategoryColor2(category) {
        switch (category) {
            case 'Food':
                // Added a new bgColor property
                return { ringColor: '#F59E0B', text: 'text-yellow-600', totalText: 'text-yellow-800', bgColor: 'bg-yellow-50' };
            case 'Lodging':
                // Added a new bgColor property
                return { ringColor: '#3B82F6', text: 'text-blue-600', totalText: 'text-blue-800', bgColor: 'bg-blue-50' };
            case 'Transportation':
                // Added a new bgColor property
                return { ringColor: '#8B5CF6', text: 'text-purple-600', totalText: 'text-purple-800', bgColor: 'bg-purple-50' };
            case 'Entertainment':
                // Added a new bgColor property
                return { ringColor: '#10B981', text: 'text-green-600', totalText: 'text-green-800', bgColor: 'bg-green-50' };
            case 'Shopping':
                // Added a new bgColor property
                return { ringColor: '#EF4444', text: 'text-red-600', totalText: 'text-red-800', bgColor: 'bg-red-50' };
            case 'Other':
            default:
                // Added a new bgColor property
                return { ringColor: '#6B7280', text: 'text-gray-600', totalText: 'text-gray-800', bgColor: 'bg-gray-50' };
        }
    }
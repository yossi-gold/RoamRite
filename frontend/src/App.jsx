import { Routes, Route } from 'react-router-dom';
import {MainPage} from './assets/trip/trip';
import {ExpensesPage} from './assets/trip/expenses';
import { Login } from './assets/trip/login';
function App() {


    return (
        <>

            <Routes>
                <Route path="/" element={<Login /> } />
                <Route path="/add_expense" element={<MainPage /> } />
                 <Route path="/my_expenses" element={<ExpensesPage /> } />
               
            </Routes>

        </>
    )
}

export default App

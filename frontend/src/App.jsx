import { Routes, Route } from 'react-router-dom';
import { Login } from './assets/login/login';
import { Spinners } from './assets/spiners';
import { Dashboard } from './assets/dashboard/dashboard';
import {DashboardApp} from './assets/dashboard/ai/ai.jsx'; // Assuming you want to use the AI dashboard app
import { InsuranceCarriers} from './assets/dashboard/option1'; 
import {AllCarriers} from './assets/dashboard/carries'; // Assuming you want to use the default carriers


function App() {


    return (
        <>

            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />}>
                    <Route index element={<InsuranceCarriers />} />
                    <Route path='carriers' element={<AllCarriers />} />

                    <Route path="ai" element={<p>hello</p>} />
                </Route>
                
                
                <Route path="/spinners" element={<Spinners />} />
                <Route path="/profile" element={<DashboardApp />} />

                <Route path="*" element={<h1>404 Not Found</h1>} />
                {/*   <Route path="/about" element={<h1>About Us</h1>}/>
        <Route path="/contact" element={<h1>Contact Us</h1>}/>
        <Route path="/services" element={<h1>Our Services</h1>}/>
        <Route path="/blog" element={<h1>Blog</h1>}/>
        <Route path="/blog/:postId" element={<h1>Blog Post</h1>}/>
        <Route path="/login" element={<h1>Login</h1>}/>     
        <Route path="/register" element={<h1>Register</h1>}/>
        
        
        <Route path="/settings" element={<h1>Settings</h1>}/>
        <Route path="/404" element={<h1>404 Not Found</h1>}/>
         */}
            </Routes>

        </>
    )
}

export default App

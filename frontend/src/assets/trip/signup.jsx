//import { useLocation } from "react-router-dom";
import { LoginSignUpForm } from './log-sinup-form';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export function Signup() {
    
const navigate = useNavigate();


    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({
            hasError: false,
            message: null
        });
    const [success, setSuccess] = useState(false);
    const [notSuccess, setNotSuccess] = useState({
            wasntSuccess: false,
            message: null
        });


    const handleSignUp = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError({ hasError: false, message: null });
        setSuccess(false);
        setNotSuccess({
                wasntSuccess: false,
                message: null
            });
        const firstName = event.target['first-name'].value;
        const lastName = event.target['last-name'].value;
        console.log('Login attempted with:', { firstName, lastName });
        const email = event.target.username.value;
        const password = event.target.password.value;
        console.log('Login attempted with:', { email, password });
        try {
            const API_URL = 'https://trip-production-fa70.up.railway.app/api';
           // const local = 'http://localhost:3020/api';
            const response = await fetch(API_URL + '/signup', {
                method: 'POST', // Use 'POST' for login
                credentials: 'include', // ✅ Required for cookies

                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({firstName, lastName, email, password }),
            });

             if (!response.ok) {
            
            const data = await response.json();
            console.log(data);
                setNotSuccess({
                wasntSuccess: true,
                message: data.message
            });
                setSuccess(false);
                setError({ hasError: false, message: null });
               return;

            } 

            const data = await response.json();
            
            console.log('Login successful:', data);
            
            setSuccess(true);
            setNotSuccess({
                wasntSuccess: false,
                message: null
            });
            setError({ hasError: false, message: null });
            // Redirect to dashboard or another page
           // window.location.href = '/dashboard'; // Change this to your desired redirect path
           navigate('/new_trip');

        } catch (error) {
            setError({ hasError: true, message: error?.message || 'Something went wrong.' });
            setNotSuccess({
                wasntSuccess: false,
                message: null
            });
            setSuccess(false);
            console.error('Login error:', error);
        } finally {
            {
                setLoading(false);
            }

        }
    }

    return (<>

        <LoginSignUpForm type="signup" handleSignUp={handleSignUp} loading={loading} error={error} success={success} notSuccess={notSuccess} />
    </>)
}
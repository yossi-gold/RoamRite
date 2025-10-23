

import styles from './login.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTripInfo } from '../context';



import { LoginSignUpForm } from './log-sinup-form';
const API_URL = 'https://trip-production-fa70.up.railway.app/api';

export function Login() {
const { setLoggedIn} = useTripInfo();
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

    useEffect(() => {
        document.title = "Login";
        document.body.classList.add(styles.loginBody);
        return () => {
            document.body.classList.remove(styles.loginBody);
        };
    }, []);





    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError({ hasError: false, message: null });
        setSuccess(false);
        setNotSuccess({
            wasntSuccess: false,
            message: null
        });

        const email = event.target.username.value;
        const password = event.target.password.value;

        try {
            
          
            const response = await fetch(API_URL + '/login', {
                method: 'POST', // Use 'POST' for login
                credentials: 'include', // ✅ Required for cookies

                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
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
            setLoggedIn(true);

            setSuccess(true);
            setNotSuccess({
                wasntSuccess: false,
                message: null
            });
            setError({ hasError: false, message: null });
            // Redirect to dashboard or another page

            navigate('/add_expense');

        } catch (error) {
            console.error('Login failed:', error.message);
            setError({ hasError: true, message: error?.message || 'Something went wrong.' });
            setNotSuccess({
                wasntSuccess: false,
                message: null
            });
            setSuccess(false);

        } finally {

            setLoading(false);


        }
    }

 
    return (<>
        
   
        <LoginSignUpForm type="login" loading={loading} handleLogin={handleLogin} error={error} success={success} notSuccess={notSuccess} />
    </>
    );
}





import styles from './login.module.css';
import { useState, useEffect } from 'react';
import {  BeatLoader } from 'react-spinners'; // Or choose another spinner!

export function Login() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [notSuccess, setNotSuccess] = useState(false);

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
        const username = event.target.username.value;
        const password = event.target.password.value;
        console.log('Login attempted with:', { username, password });
        try {
            const response = await fetch('http://localhost:3010/api/login', {
                method: 'POST', // Use 'POST' for login
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
            
                setNotSuccess(true);
                setSuccess(false);
                setError(null);
               return;

            }
        
            const data = await response.json();
            console.log('Login successful:', data);
            setSuccess(true);
            setNotSuccess(false);
            setError(null);
            // Redirect to dashboard or another page
            window.location.href = '/dashboard'; // Change this to your desired redirect path
           
        } catch (error) {
            setError(error);
            setNotSuccess(false);
            setSuccess(false);
            console.error('Login error:', error);
        } finally {
            {
                setLoading(false);
            }

        }
    }

   

    return (
        <div className={styles.loginContainer}>

            <div>
                <img src="/GNP-insurance-logo.png" alt="logo" />
            </div>



            <form className={styles.loginForm} onSubmit={handleLogin}>

                <div className={styles.formGroup}>
                    <label htmlFor="username">Username or Email:</label>
                    <input type="text" id="username" name="username" placeholder='Username or Email' required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" placeholder='Password' required />
                </div>
                <div className={styles.loginCheck}>


               
                 {loading && (
                    <div className={styles.spinnerContainer}>
                         <BeatLoader color="black" size={10} />
                    </div>
                )}
                {success && (
                    <div>
                        <p>Login successful!</p>
                    </div>
                )}
                {notSuccess && (
                    <div>
                        <p>Login failed. Please check your credentials.</p>
                    </div>
                )}
                {error && (
                    <div>
                        <p>{error.message}</p>
                    </div>
                )}
                <button type="submit">Login</button>
                 </div>
               
            </form>





          
        </div>
    ); 
}






/* 
🎨 Spinner Components in react-spinners
| Spinner Name      | Style Description |

| ClipLoader        | Classic rotating circle | 
| BeatLoader        | Bouncing dots | 
| BounceLoader      | Single bouncing ball | 
| CircleLoader      | Smooth circular spinner | 
| ClimbingBoxLoader | Animated box climbing a wall | 
| DotLoader         | Pulsing dots in a circle | 
| FadeLoader        | Fading vertical bars | 
| GridLoader        | 3x3 grid of pulsing squares | 
| HashLoader        | Rotating hash symbol | 
| MoonLoader        | Crescent moon-style spinner | 
| PacmanLoader      | Pac-Man chomping animation | 
| PropagateLoader   | Ripple-like wave animation | 
| PuffLoader        | Expanding puff effect | 
| PulseLoader       | Pulsing dots in a line | 
| RingLoader        | Rotating ring | 
| RiseLoader        | Rising vertical bars | 
| RotateLoader      | Rotating lines | 
| ScaleLoader       | Scaling vertical bars | 
| SyncLoader        | Synchronized bouncing dots | 
 */


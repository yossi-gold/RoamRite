
import styles from './login.module.css';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { BeatLoader } from 'react-spinners'; 
import { useTripInfo } from '../context';
import { useNavigate } from 'react-router-dom';


export function LoginSignUpForm(props) {

    const {loggedIn} = useTripInfo();
    const [login, setLogin] = useState(false);
    const [signup, setSignup] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const passwordInput = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        if (props.type == 'login') {
            setLogin(true);
            setSignup(false);
            console.log(props.type);
        }
        else {
            setLogin(false);
            setSignup(true);
            console.log(props.type);
        }
    }, [props.type])
    useEffect(() => {
        document.title = "Login";
        document.body.classList.add(styles.loginBody);
        return () => {
            document.body.classList.remove(styles.loginBody);
        };
    }, []);
     useEffect(() => {
       if(loggedIn){
        navigate('/add_expense');
          
       }
    }, [loggedIn]);
const [timer, setTimer]= useState();
    
   const handleShowPassword = (showPassword)=>{
    
    clearTimeout(timer);

     if(showPassword === true){
                setShowPassword(false);
            }
            else{
                
             let  newTimer= setTimeout(() => {
                     setShowPassword(false);
                     console.log('j');
                }, 10000);
                setTimer(newTimer);

                setShowPassword(true);
            }
        
   }
   useEffect(()=>{
    if (showPassword) {
         passwordInput.current.type = 'text';
    } else{
        passwordInput.current.type = 'password';
    }
       
   },[showPassword])
   
    
    return (
        <>
            <div className={styles.loginContainer}>

                <Link to={'/'} className={styles.logoContainer}>
                    <img className={styles.logoImg} src="preview.png" alt="logo" />
                </Link>



                <form className={styles.loginForm} onSubmit={signup ? props.handleSignUp : props.handleLogin}>
                    {signup && <div className={styles.signupOnly}>
                        <div className={styles.formGroup2}>
                            <label htmlFor="first-name">First Name:</label>
                            <input type="text" id="first-name" name="first-name" placeholder='First Name' required />
                        </div>
                        <div className={styles.formGroup2}>
                            <label htmlFor="last-name">Last Name:</label>
                            <input type="text" id="last-name" name="last-name" placeholder='Last Name' required />
                        </div>
                    </div>}

                    <div className={styles[login ? 'formGroup' : 'formGroup2']}>
                        <label htmlFor="username">Email:</label>
                        <input type="email" id="username" name="username" placeholder='Email' required />
                    </div>
                    <div className={styles[login ? 'formGroup' : 'formGroup2']}>
                        <label htmlFor="password">{login ? 'Password' : 'Create strong Password'}:</label>
                        <div className={styles.passwordAndSvg}>
                            <input type="password" id="password" ref={passwordInput} className={styles.password} name="password" placeholder='Password' required />
                            <div className={styles.passwordSvg} onClick={()=> handleShowPassword(showPassword)}>
                                {showPassword ?
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#999999"><path d="M480-392q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q141 0 257.5 76T912-520h-91q-52-93-143-146.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280q20 0 40-2t40-6v81q-20 3-40 5t-40 2Zm0-120q22 0 42.5-5t38.5-14q5-50 31.5-90t67.5-64v-7q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm-5-180Zm205 380q-17 0-28.5-11.5T640-160v-120q0-17 11.5-28.5T680-320v-40q0-33 23.5-56.5T760-440q33 0 56.5 23.5T840-360v40q17 0 28.5 11.5T880-280v120q0 17-11.5 28.5T840-120H680Zm40-200h80v-40q0-17-11.5-28.5T760-400q-17 0-28.5 11.5T720-360v40Z"/></svg>
                                :
                                 <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#999999"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>
                                 }
                            </div>

                        </div>

                    </div>
                    <div className={styles.loginCheck}>



                        {props.loading && (
                            <div className={styles.spinnerContainer}>
                                <BeatLoader color="black" size={10} />
                            </div>
                        )}
                        {props.success && (
                            <div>
                                <p>{login ? 'Login' : 'Signup'} successful!</p>
                            </div>
                        )}
                        {props.notSuccess.wasntSuccess && (
                            <div>
                                <p>{login && props.notSuccess.message}
                                    {signup && props.notSuccess.message}
                                </p>
                            </div>
                        )}
                        {props.error.hasError && (
                            <div>
                                <p>{props.error.message}</p>
                            </div>
                        )}
                        <button type="submit">{login ? 'Login' : 'Sign Up'}</button>
                    </div>
                    {login && <p>Dont have an account? <a href="signup">Sign up</a></p>}
                    {signup && <p>Already have an account? <a href="login">Login</a></p>}

                </form>






            </div></>
    )
}
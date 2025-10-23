import styles from './header.module.css';


import { Outlet} from 'react-router-dom';
import { Header } from './header';






export function HeaderPage() {
    

   



 

  

    
    return (<>

        {/* {console.log(currentTripId)} */}

        <div className="flex items-center justify-center min-h-screen">
            <div className={`container mx-auto px-4  ${styles.container}`} >
                <div className={`${styles.fancyCard1} relative overflow-hidden`} style={{ height: '95vh' }}>
                    <div className={styles.headers}>
                        

<Header/>
                      
            


                        {/*  <!-- UPDATED: The background image is now on the header itself --> */}

                    </div>
                 
                        <Outlet/>
                </div>

            </div>


        </div>





    </>)
}
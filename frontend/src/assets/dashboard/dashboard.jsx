import styles from './dashboard.module.css';

import { Link, Outlet } from 'react-router-dom';


export function Dashboard() {
    return (<>
        <div className={styles.dashboardSidebar}>
            <div className={styles.sidebarHeader}>
                 <img src="/GNP-insurance-logo.png" alt="logo" />
               {/*  <h2>Dashboard</h2> */}
            </div>
            <hr />

            <Link to="" className={styles.sidebarItem}>
                <p>Insurance Carriers</p>
            </Link>
            <Link to="carriers" className={styles.sidebarItem}>
                <p>Carriers</p>
            </Link>
            <Link to="/policies" className={styles.sidebarItem}>
                <p>Policies</p>
            </Link>

            <Link to="/reports" className={styles.sidebarItem}>
                <p>Reports & Dashboard</p>
            </Link>
            <Link    to="/ai-insights" className={styles.sidebarItem}>
                <p>AI Insights</p>
            </Link>
            <Link to="/settings" className={styles.sidebarItem}>
                <p>Settings</p>
            </Link>
        </div>

        <div className={styles.dashboardContent}>
            
             <Outlet />

        </div>
    </>
    );
}



import styles from './carries.module.css'
// New: Default Carriers
const defaultCarriers = [
    { id: 1, name: "Allstate", 
        coveredPropertyTypes: ["Residential Home", "Commercial Office", "Retail Store", "Apartment Building"],
        logo: ''
    },
    { id: 2, name: "Travelers", coveredPropertyTypes: ["Commercial Property", "Manufacturing Plant", "Warehouse", "Hotel"], logo: '' },
    { id: 3, name: "Progressive", coveredPropertyTypes: ["Residential Home", "Condominium", "Townhouse", "Auto Repair Shop"], logo: '' },
    { id: 4, name: "State Farm", coveredPropertyTypes: ["Residential Home", "Farm", "Restaurant", "Supermarket"], logo: '' },
    { id: 5, name: "Liberty Mutual", coveredPropertyTypes: ["Commercial Office", "Shopping Mall", "Hospital", "School"], logo: 'https://cdn.worldvectorlogo.com/logos/liberty-mutual-1.svg' },
    { id: 6, name: "Chubb", coveredPropertyTypes: ["Commercial Property", "Industrial Park", "Data Center", "Airport"], logo: '' },
    { id: 7, name: "Nationwide", coveredPropertyTypes: ["Residential Home", "Farm", "Retail Store", "Restaurant"], logo: '' },
    { id: 8, name: "Farmers Insurance", coveredPropertyTypes: ["Residential Home", "Apartment Building", "Vacant Land"], logo: '' },
    { id: 9, name: "Geico", coveredPropertyTypes: ["Residential Home"], logo: '' }, // Primarily auto, but can have some property
    { id: 10, name: "Hartford", coveredPropertyTypes: ["Commercial Office", "Manufacturing Plant", "Warehouse"], logo: '' },

    { id: 11,  name: "Allstate", coveredPropertyTypes: ["Residential Home", "Commercial Office", "Retail Store", "Apartment Building"], logo: '' },
    { id: 12, name: "Travelers", coveredPropertyTypes: ["Commercial Property", "Manufacturing Plant", "Warehouse", "Hotel"], logo: '' },
    { id: 13, name: "Progressive", coveredPropertyTypes: ["Residential Home", "Condominium", "Townhouse", "Auto Repair Shop"], logo: '' },
    { id: 14, name: "State Farm", coveredPropertyTypes: ["Residential Home", "Farm", "Restaurant", "Supermarket"], logo: '' },
    { id: 15, name: "Liberty Mutual", coveredPropertyTypes: ["Commercial Office", "Shopping Mall", "Hospital", "School"], logo: '' },
    { id: 16, name: "Chubb", coveredPropertyTypes: ["Commercial Property", "Industrial Park", "Data Center", "Airport"], logo: '' },
    { id: 17, name: "Nationwide", coveredPropertyTypes: ["Residential Home", "Farm", "Retail Store", "Restaurant"], logo: '' },
    { id: 18, name: "Farmers Insurance", coveredPropertyTypes: ["Residential Home", "Apartment Building", "Vacant Land"], logo: '' },
    { id: 19, name: "Geico", coveredPropertyTypes: ["Residential Home"], logo: '' }, // Primarily auto, but can have some property
    { id: 20, name: "Hartford", coveredPropertyTypes: ["Commercial Office", "Manufacturing Plant", "Warehouse"], logo: '' },
];

export function AllCarriers() {
    return(

        <div>
        <div className={styles.searchContainer}>
            <input type="text" placeholder="Search carriers..." />
            <button>Search</button>
        </div>
        <hr />

        <div className={styles.carriersContainer}>
        {defaultCarriers.map((company)=>(
        
        <div className={styles.eachCarrier} key={company.id}>
            <div className={styles.logoContainer}>
           <div className={styles.logoImage}>
                  <img src={`/insure/${company.name.toLowerCase().replace(/\s+/g, '-')}.png`} alt="logo" />
           </div>
                    
                <p>{company.name}</p>  
            </div>
              
        </div>
        
        
    
    ) )}
    </div>
    </div>



    )
}
/*  <div className={styles.eachCarrier} key={company.id}>
            <div className={styles.logoContainer}>
                <img src={`/logos/${company.name.toLowerCase().replace(/\s+/g, '-')}.svg`} alt={`${company.name} logo`} />
            </div>
            <div className={styles.companyName}>
                <img src="https://cdn.worldvectorlogo.com/logos/liberty-mutual-1.svg" alt="logo" />
                <p>{company.name}</p>  
            </div>
              
        </div> */
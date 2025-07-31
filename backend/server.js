
import express from 'express';




import bcrypt from 'bcrypt';
import { Pool } from 'pg';
/* 
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); */

const app = express();

app.use(express.json());
import cors from 'cors';
app.use(cors({ origin: 'http://localhost:5173' }));

/* 
still need to understand this
app.use(express.urlencoded({ extended: true })); 
*/



const pool = new Pool({
    user: 'postgres',      // e.g., 'postgres' or your specific user
    host: 'localhost',
    database: 'yeshivatube',         // The database you created
    password: '242yossi', // Your PostgreSQL user's password
    port: 5432,
});
let theEmail = 'user@example.com';
let thePassword = 'my123456'; 

/* 
//convert thePassword to a hashed password
//This is just an example, in a real application you would not hardcode the password like this, but why not in real life?, because it can lead to security vulnerabilities
try{
 const hashedPassword = await bcrypt.hash(thePassword, 10); 
    console.log('Hashed Password:', hashedPassword);
}
catch (error) {
    console.error('Error hashing password:', error);
}  */

let savedEmail = 'user@example.com';
let savedPassword = '$2b$10$7l5W4vvcOXfD7p5S7o84TOWLetPP2TMH8/ekc2SZ0SRIOvaHxfeqy';

const isMatch = await bcrypt.compare(thePassword, savedPassword);
console.log('Match:', isMatch); // true if it matches


app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Login attempt:', { username, password });

    if (username === savedEmail) {
        console.log('Username matches saved email:', savedEmail);
        const isMatch = await bcrypt.compare(password, savedPassword);
        if (isMatch) {
            console.log('Password matches saved password');
            // will change the users url to the dashboard
           // return res.status(200);//redirect('/dashboard'); // Uncomment this line if you want to redirect to a dashboard
            return res.status(200).json({ message: 'Login successful' });
        }
    }
    return res.status(401).json({ message: 'Invalid credentials' });
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

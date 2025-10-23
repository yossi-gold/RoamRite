// server.js - The backend for the budget app, configured for Railway deployment


import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';


import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import cookieParser from 'cookie-parser';


import { setToken } from './setTokens.js';
//import createImg from './imagePipeline/imgGeneration.js'; // Notice the .js file extension is required for ES modules

import mapRoutes from './maps/mapsApi.js';
import aiRoutes from './ai/gemini.js';
import fullTripHistory from './allTripInfo.js';
//import activitiesSuggestions from './suggestions/createSuggestions.js';
import createTrip from './newTrip/createTrip.js';

import getSuggestions from './suggestions/getSuggestions.js';

import messageRoutes from './messages/postMessage.js';




const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // ✅ Exact match required
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
// This is necessary because the frontend is on a different domain (localhost)


//const SECRET_KEY = process.env.SECRET_KEY;
//console.log('Loaded secret key:', SECRET_KEY);


// =======================================================================
// ============= IMPORTANT: UPDATED DATABASE CONFIG FOR RAILWAY ==========
// =======================================================================
// We are now using the DATABASE_URL environment variable provided by Railway.
// The `pg` library is smart enough to parse this URL and connect to the
// PostgreSQL database service automatically.
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Function to create the necessary tables if they don't exist

console.log('hello');









app.post('/api/signup', async (req, res) => {
    

    const requiredFields = ['firstName', 'lastName', 'email', 'password'];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        return res.status(400).json({
            message: `Missing fields: ${missingFields.join(', ')}`
        });
    }

    const { firstName, lastName, email, password } = req.body;
    console.log('Received signup request:', { firstName, lastName, email });




    try {
        // Check if user already exists
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'Email already registered.' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const result = await pool.query(
            `INSERT INTO users (firstname, lastname,email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, email`,
            [firstName.toLowerCase(), lastName.toLowerCase(), email.toLowerCase(), passwordHash]
        );
        const user = result.rows[0];

        setToken(user, res, jwt);

        res.status(201).json({
            message: 'User registered successfully.',
            user: { id: user.id, email: user.email, firstName: user.firstname }
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Server error during signup.', error: err.message });
    }
});



// Route for user login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        setToken(user, res, jwt);

        res.status(200).json({ message: 'Login successful.', user: { id: user.id, email: user.email, firstName: user.firstname } });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error during login.' });
    }
});



//app.use('/api/img', createImg);


app.get("/api/place-photo", async (req, res) => {
  const { photoRef } = req.query;
  if (!photoRef) return res.status(400).send("Missing photo reference");

  const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  try {
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) throw new Error(`Google returned ${imageRes.status}`);

    res.set("Content-Type", imageRes.headers.get("Content-Type"));
    const buffer = await imageRes.arrayBuffer();
    console.log('it works');
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Image proxy failed:", err.message);
    res.status(500).send("Image fetch failed");
  }
});

app.use('/api/messages', messageRoutes);

app.use((req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
       
        let url = req.originalUrl;
        console.log('No token provided', url);

        return res.status(401).json({ message: 'Not authenticated.', url: url });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { userId, email }
        console.log('Decoded token:', decoded);
        next();
    } catch (err) {
        console.error('JWT verification failed:', err);
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
});
app.get('/test', (req, res) => {
   
    res.status(200).json({ message: 'logged in' });
});

app.post('/api/logout', (req, res) => {
    try {
        res.clearCookie('authToken', {
            httpOnly: true,
            secure: true, // true in production with HTTPS
            sameSite: 'none', // match your login settings
            path: '/',
        });

        res.status(200).json({ message: 'Logged out successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Logout failed', error: error.message });

    }

});




app.use('/api/maps', mapRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/tripTotalInfo/', fullTripHistory);
app.use('/api/newTrip', createTrip);
app.use('/api/suggestions', getSuggestions);


app.get('/api/userInfo', async (req, res) => {

    try {
        const firstName = req.user.firstName;

        const currentTripInfo = await pool.query(
            `SELECT 
                t.trip_name,
                u.current_trip_id
                FROM users u
                JOIN trips t ON t.id = u.current_trip_id
                WHERE u.id = $1;`, [req.user.userId]);

        if (currentTripInfo.rowCount === 0) {
            return res.status(202).json({ firstName, userId: req.user.userId });
        }


        res.status(200).json({ firstName, currentTripInfo: currentTripInfo.rows[0] , userId: req.user.userId});
    } catch (err) {
        console.error('Invalid or expired token');
        res.status(401).json({ error: 'Unauthorized' });
    }
});

app.put('/api/setCurrentTrip', async (req, res) => {
    const theId = req.query.currentTripId;

    console.log(typeof theId);
    try {

        const result = await pool.query(
            `UPDATE users
       SET current_trip_id = $1
       WHERE id = $2
       RETURNING current_trip_id`,
            [Number(theId), req.user.userId]
        );



        res.status(200).json({ message: result.rows[0] });

    } catch (err) {
        console.error('error:', err);
        res.status(500).json({ message: err.message });
    }
});


app.get('/api/totalTrips', async (req, res) => {

    try {
/* 
        const tripToken = JSON.parse(req.cookies.currentTripToken);
        const tripId = tripToken.currentTripId; */

        const tripsResult = await pool.query(`SELECT 
                trips.*,
                COALESCE(SUM(expenses.amount), 0) AS total_spent
                FROM trips
                LEFT JOIN expenses ON expenses.trip_id = trips.id
                WHERE trips.user_id = $1
                GROUP BY trips.id
                ORDER BY trips.start_date ASC;`, [req.user.userId]);

        const currentTripInfo = await pool.query(
            `SELECT * FROM trips WHERE user_id = $1 AND id = (
                SELECT current_trip_id FROM users WHERE id = $1
             )`,
            [req.user.userId]
        );
        if (currentTripInfo.rowCount === 0) {
            return res.status(204).json({ message: 'No current trip selected' });
        }
        // const expensesResult = await pool.query('SELECT SUM(amount) AS total_amount FROM expenses WHERE user_id = $1 and trip_id = $2', [req.user.userId,  req.query.currentTripId]);
        const expensesResult = await pool.query('SELECT expenses.* FROM expenses JOIN users ON users.current_trip_id = expenses.trip_id WHERE user_id = $1 ', [req.user.userId]);


        const totalExpenses = expensesResult.rows.reduce((acc, item) => {
            return acc + parseFloat(item.amount) || 0;
        }, 0);

        res.status(200).json({
            currentTripInfo: currentTripInfo.rows[0],
            total: tripsResult.rowCount,
            trips: tripsResult.rows,
            totalExpenses: totalExpenses
        });
    } catch (err) {
        console.error('Invalid or expired token');
        res.status(401).json({ error: err.message });
    }
});


app.get('/api/budget', async (req, res) => {
    try {
        const budgetResult = await pool.query('SELECT amount FROM budget WHERE id = 1');
        const expensesResult = await pool.query('SELECT SUM(amount) AS total_amount FROM expenses');




        res.status(200).json({
            budget: budgetResult.rows[0].amount,
            totalExpenses: expensesResult.rows[0].total_amount
        });
    } catch (err) {
        console.error('Error fetching budget:', err);
        res.status(500).send('Server Error');
    }
});


// Update the budget
app.post('/api/budget', async (req, res) => {
    const { amount } = req.body;
    if (!amount) {
        return res.status(400).json({ message: 'Amount is required' });
    }
    try {
        const result = await pool.query('UPDATE trips SET budget = $1 WHERE user_id = $2 AND id = (SELECT current_trip_id FROM users WHERE id = $2) RETURNING budget', [amount, req.user.userId]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating budget:', err);
        res.status(500).send('Server Error');
    }
});

// Get all expenses
app.get('/api/expenses', async (req, res) => {
    const tripId = req.query.tripId;
if (!tripId) return res.status(500).send('no trip found');
    try {
        const result = await pool.query(`SELECT * FROM expenses WHERE user_id = $1 AND trip_id =$2
           
            ORDER BY timestamp DESC`, [req.user.userId, tripId]);

        if (result.rowCount === 0) {
            return res.status(204).send();
        }



        const categoryTotals = await pool.query(`
            SELECT 
            category, 
            SUM(amount) AS total,
            ROUND(
            SUM(amount) * 100.0 / (
                SELECT SUM(amount)
                FROM expenses
                WHERE user_id = $1 AND trip_id = $2
            ),
            2
            ) AS percentage

            FROM expenses
            WHERE user_id = $1 AND trip_id = $2
            GROUP BY category
            ORDER BY total DESC;`, [req.user.userId, tripId]);


        res.status(200).json({
            expenses: result.rows,
            categories: categoryTotals.rows
        });
    } catch (err) {
        console.error('Error fetching expenses:', err);
        res.status(500).send('Server Error');
    }
});

// Add a new expense
app.post('/api/expenses', async (req, res) => {
  const { description, amount, category } = req.body;
  const timestamp = Date.now();
  const { userId } = req.user;
  

  try {
    const result = await pool.query(
      `INSERT INTO expenses(description, amount, category, timestamp, user_id, trip_id)
       VALUES (
         $1, $2, $3, $4, $5,
         (SELECT current_trip_id FROM users WHERE id = $5 LIMIT 1)
       )`,
      [description, amount, category, timestamp, userId]
    );

    if (result.rowCount === 1) {
      return res.status(201).json({ success: true, expense: result.rows[0] });
    } else {
      return res.status(400).json({ success: false, message: 'Insert failed' });
    }
  } catch (err) {
    console.error('Error adding expense:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});











// Update an existing expense
app.put('/api/expenses/:id', async (req, res) => {
    const { id } = req.params;
    const { description, amount, category } = req.body;
    try {
        const result = await pool.query(
            'UPDATE expenses SET description = $1, amount = $2, category = $3 WHERE id = $4 RETURNING *',
            [description, amount, category, id]
        );
        if (result.rows.length > 0) {
            res.status(200).json(result.rows[0]);
        } else {
            res.status(404).send('Expense not found');
        }
    } catch (err) {
        console.error('Error updating expense:', err);
        res.status(500).send('Server Error');
    }
});

// Delete a specific expense
app.delete('/api/expenses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *', [id, req.user.userId]);
        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Expense deleted successfully' });
        } else {
            res.status(404).send('Expense not found');
        }
    } catch (err) {
        console.error('Error deleting expense:', err);
        res.status(500).send('Server Error');
    }
});

// Delete all expenses
app.delete('/api/expenses', async (req, res) => {
    try {
        await pool.query('DELETE FROM expenses');
        res.status(200).json({ message: 'All expenses cleared' });
    } catch (err) {
        console.error('Error clearing expenses:', err);
        res.status(500).send('Server Error');
    }
});



// Start the server
const PORT = process.env.PORT || 3020;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
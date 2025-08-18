// server.js - The backend for the budget app, configured for Railway deployment
import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';


import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';


dotenv.config();


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
// This is necessary because the frontend is on a different domain (localhost)


const SECRET_KEY = process.env.SECRET_KEY;
console.log('Loaded secret key:', SECRET_KEY);


// =======================================================================
// ============= IMPORTANT: UPDATED DATABASE CONFIG FOR RAILWAY ==========
// =======================================================================
// We are now using the DATABASE_URL environment variable provided by Railway.
// The `pg` library is smart enough to parse this URL and connect to the
// PostgreSQL database service automatically.
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Function to create the necessary tables if they don't exist

console.log('hello');



const SESSION_DURATION_SECONDS = 60 * 60 * 24; // 1 day

app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email`,
      [email, passwordHash]
    );
    const user = result.rows[0];

    // Create JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: SESSION_DURATION_SECONDS }
    );

    // Set cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: SESSION_DURATION_SECONDS * 1000
    });

    res.status(201).json({
      message: 'User registered successfully.',
      user: { id: user.id, email: user.email }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup.' });
  }
});

app.get('/api/login',  async (req, res) => {

    



    
    try {
        


      

        res.json({

          
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to load content' });
    }

});

// Get the budget

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
    try {
        const result = await pool.query('UPDATE budget SET amount = $1 WHERE id = 1 RETURNING *', [amount]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Error updating budget:', err);
        res.status(500).send('Server Error');
    }
});

// Get all expenses
app.get('/api/expenses', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM expenses ORDER BY timestamp DESC');
        const categoryTotals = await pool.query(`SELECT 
  category, 
  SUM(amount) AS total,
  ROUND(SUM(amount) * 100.0 / (SELECT SUM(amount) FROM expenses), 2) AS percentage
FROM expenses
GROUP BY category
ORDER BY total DESC;`);
        

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
    try {
        const result = await pool.query(
            'INSERT INTO expenses(description, amount, category, timestamp) VALUES($1, $2, $3, $4) RETURNING *',
            [description, amount, category, timestamp]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding expense:', err);
        res.status(500).send('Server Error');
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
        const result = await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING *', [id]);
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
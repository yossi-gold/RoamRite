// server.js - The backend for the budget app
import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://127.0.0.1:5500' }));

// A simple way to parse URL-encoded bodies for requests
// It allows you to access form data submitted via POST requests.
app.use(express.urlencoded({ extended: true }));



// PostgreSQL database connection pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

/* 
const pool = new Pool({
    user: 'postgres1',
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
}); */

// --- API Routes ---

// Get the budget
app.get('/api/budget', async (req, res) => {
    try {
        const result = await pool.query('SELECT amount FROM budget WHERE id = 1');
        res.status(200).json(result.rows[0]);
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
        res.status(200).json(result.rows);
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

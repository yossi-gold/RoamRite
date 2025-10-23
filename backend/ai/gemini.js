import { GoogleGenAI } from "@google/genai";
import { Router } from "express";
const router = Router();

import {pool} from '../server.js'

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({});

async function main(tripHistory) {

        

    if (!tripHistory.length) return 'bla bla';

  let prompt = `You're a friendly travel assistant. Analyze the following trip history data:\n\n`;

prompt += tripHistory
  .map(trip =>
       `- Trip: ${trip.name}\n  Date: ${trip.date}\n  Total Spent: $${Number(trip.total_spent).toFixed(2)}\n`
  )
  .join('\n');

prompt += `\n\nBased on this, write a concise, conversational and insightful summary of the spending habits over time. Mention the total number of trips and the total amount spent across all trips.

    Do not mention yourself, the user, or that you're analyzing data. Just present the insights.
        "Format this as a travel expense report. Avoid any mention of the assistant or the user."`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        return response.text


    } catch (error) {
        console.error("Autocomplete error:", error.response?.data || error.message);
        return error;
    }
}




router.get("/historySummary", async (req, res) => {
try {
      const tripHistory = await pool.query(`SELECT 
                trips.*,
                COALESCE(SUM(expenses.amount), 0) AS total_spent
                FROM trips
                LEFT JOIN expenses ON expenses.trip_id = trips.id
                WHERE trips.user_id = $1
                GROUP BY trips.id
                ORDER BY trips.start_date ASC;`, [req.user.userId]);


    const output = await main(tripHistory.rows);
    console.log(output);
    res.json({ output });
    
} catch (error) {
    console.error("Error fetching trip history:", error);
    res.status(500).json({ error: error.message });
}
   
})



export default router
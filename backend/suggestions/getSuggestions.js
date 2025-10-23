

import { pool } from "../server.js";
import { Router } from "express";
import { handleSuggestions } from '../newTrip/createTrip.js';



const router = Router();





async function fetchSuggestions(req, BudgetBased, tripId) {
    try {
        const suggestions = await pool.query(
            `SELECT 
                activity_name,
                estimated_cost,	
                description,
                image_url, 
                place_id
              
                FROM activity_suggestions
                WHERE isbudgetbased = $1
                AND user_id = $2 AND trip_id = $3;
                `, [BudgetBased, req.user.userId, Number(tripId)]);

        return suggestions

    } catch (error) {
        throw new Error(error.message);

    }

}




router.get("/", async (req, res) => {
   
    try {


        const tripIdQu = await pool.query(
            `SELECT current_trip_id FROM users WHERE id = $1 LIMIT 1;`
            , [req.user.userId]);

        const tripId = tripIdQu.rows[0]?.current_trip_id;

        const result = await pool.query(
            ` SELECT suggestions_based_on_budget FROM trips
                WHERE user_id = $1
                AND id = $2;
                `, [req.user.userId, tripId]);
        const BudgetBased = result.rows[0]?.suggestions_based_on_budget;

        if (result.rowCount === 0) {
            throw new Error("Trip not found or not updated");
        }



        const suggestions = await fetchSuggestions(req, BudgetBased, tripId);
        if (suggestions.rowCount === 0) {

            const suggestionsSuccsess = await handleSuggestions(req, tripId);
            const suggestions2 = await fetchSuggestions(req, BudgetBased, tripId);

            if (suggestions2.rowCount === 0) {

                return res.status(404).json({ message: 'suggestions not found' })
            }
          return res.status(200).json({ suggestions: suggestions2.rows, suggestionsSuccsess, BudgetBased });
        }
        res.status(200).json({ suggestions: suggestions.rows ,BudgetBased});

    } catch (error) {
        res.status(500).json({ message: error.message });

    }

})



router.get("/changeBudgetBased", async (req, res) => {
    let { BudgetBased = false } = req.query;

    // Convert from string to boolean
    BudgetBased = BudgetBased === "true";
    try {

        const tripIdQu = await pool.query(
            `SELECT current_trip_id FROM users WHERE id = $1 LIMIT 1;`
            , [req.user.userId]);

        const tripId = tripIdQu.rows[0]?.current_trip_id;

        const result = await pool.query(
            ` UPDATE trips 
                SET suggestions_based_on_budget = $1
                WHERE user_id = $2 
                AND id = $3;
                `, [BudgetBased, req.user.userId, tripId]);

        if (result.rowCount === 0) {
            throw new Error("Trip not found or not updated");
        }



       
       
        res.status(200).json({ message: 'Budget preference updated successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });

    }

})






router.post("/generateMore", async (req, res) => {
  
    try {


        const tripIdQu = await pool.query(
            `SELECT current_trip_id FROM users WHERE id = $1 LIMIT 1;`
            , [req.user.userId]);

        const tripId = tripIdQu.rows[0]?.current_trip_id;

      const newSuggestions = await handleSuggestions(req, tripId);

        res.status(200).json({ message: 'hello', suggestions: newSuggestions });

    } catch (error) {
        res.status(500).json({ message: error.message });

    }

})
export default router




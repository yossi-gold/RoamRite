
import { Router } from "express";
const router = Router();

import { pool } from "../server.js";
import { createAndUploadImage } from "../imagePipeline/imgGeneration.js";
import { getActivitiesSuggestions } from "../suggestions/createSuggestions.js";




export const handleSuggestions = async (req, tripId) => {
    const suggestions = await getActivitiesSuggestions(req);
    if (suggestions && typeof suggestions === 'object') {
        try {



            const basedOnBudgetResult = await pool.query(`
            SELECT suggestions_based_on_budget
            FROM trips
            WHERE user_id = $1 AND id = (SELECT current_trip_id from users WHERE id = $1 )
            `, [req.user.userId]);

            const isBudgetBased = basedOnBudgetResult.rows[0]?.suggestions_based_on_budget;


            const insertPromises = suggestions.map((suggestion) => {
                const { activityName, estimatedCost, description, officialPlaceName, imageUrl, placeId } = suggestion;




                return pool.query(
                    `INSERT INTO activity_suggestions (
          user_id, trip_id, activity_name, estimated_cost, description,
          official_place_name, image_url, place_id, isbudgetbased
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *;`,
                    [req.user.userId, Number(tripId), activityName, estimatedCost, description, officialPlaceName, imageUrl, placeId, isBudgetBased]
                );
            });

         const results = await Promise.all(insertPromises);
const insertedSuggestions = results.map((r) => r.rows[0]);
            return { message: "Suggestions handled successfully" , suggestions: insertedSuggestions};

        } catch (error) {
            console.warn("Insert error:", error.message);
            return { message: error.message };
        }
    }



}




const create = async (req, res) => {

    try {


        const { name, destination, budget, startDate, endDate, travelers } = req.body;



        const requiredFields = { name, destination, budget, startDate, endDate, travelers };

        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) {
                console.log(`Missing field: ${key}`);
                return res.status(400).json({ message: `${key} is missing` });
            }
            console.log(`Received ${key}:`, value);
        }
        if (isNaN(budget) || budget <= 0) {
            return res.status(400).json({ message: 'Budget must be a positive number' });
        }
        if (isNaN(travelers) || travelers <= 0) {
            return res.status(400).json({ message: 'travelers must be a positive number' });
        }
        if (name.trim() === '') {
            return res.status(400).json({ message: 'Name is required' });
        }
        if (destination.trim() === '') {
            return res.status(400).json({ message: 'destination is required' });
        }
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ message: 'Invalid start or end date' });
        }
        if (start > end) {
            return res.status(400).json({ message: 'Start date must be before end date' });
        }

        const image = await createAndUploadImage(destination);

        const result = await pool.query(
            `INSERT INTO trips(trip_name, destination, budget, start_date, end_date, travelers, img, user_id) 
            VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
            [name, destination, budget, startDate, endDate, travelers, image, req.user.userId]

        );

        const tripId = result.rows[0].id;

       const currentTripIdResult = await pool.query(
            `UPDATE users
       SET current_trip_id = $1
       WHERE id = $2 RETURNING current_trip_id`,
            [Number(tripId), req.user.userId]




        );
       const currentTripId = currentTripIdResult.rows[0].current_trip_id;

        const suggestionsSuccsess = await handleSuggestions(req, tripId);

        res.status(200).json({ info: 'success', suggestionsSuccsess, currentTripId });

    } catch (error) {
        res.status(500).json({ message: 'Error processing trip ' + error.message });
    }



};


router.post("/", create);





export default router;



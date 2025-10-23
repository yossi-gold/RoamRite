import { pool } from "../server.js";
import { Router } from "express";
import {x_ai_agent} from '../X-AI/xai_agent.js'

const router = Router();




const mapsApiKey = process.env.GOOGLE_MAPS_API_KEY;


async function generateImg(activity, query) {

    try {
        const placeSearchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=photos,place_id&key=${mapsApiKey}`;
        const placeRes = await fetch(placeSearchUrl);
        const placeData = await placeRes.json();
        const candidate = placeData?.candidates?.[0];


        const photos = candidate?.photos || [];



        /*  // Filter for horizontal images
         const horizontalPhotos = photos.filter(p => p.width > p.height);
         const bestPhoto = horizontalPhotos[0] || photos[0]; // fallback to first if none are horizontal 
          */

        const bestPhoto = photos[0];

        let imageUrl = null;
        if(bestPhoto?.photo_reference){
         
         imageUrl = bestPhoto?.photo_reference

        }

        

        const placeId = candidate?.place_id || null;


        return { ...activity, imageUrl, placeId };
    } catch (err) {
        console.error("Image fetch failed:", err.message);
        return { ...activity, imageUrl: null, placeId, error: err.message };
    }


}




const getInfoFromDatabase = async (req) => {

    const BalanceResult = await pool.query(`SELECT 
            t.budget - COALESCE(SUM(e.amount), 0) AS remaining_balance
            FROM users u
            JOIN trips t ON u.current_trip_id = t.id
            LEFT JOIN expenses e ON e.trip_id = t.id
            WHERE u.id = $1
            GROUP BY t.budget;`, [req.user.userId]);


    const remainingBalance = BalanceResult.rows[0]?.remaining_balance;
    const destinationResult = await pool.query(`
            SELECT 
            destination from trips 
            join users on users.current_trip_id = trips.id
            where users.id = $1 LIMIT 1;`
        , [req.user.userId])


    const tripDestination = destinationResult.rows[0]?.destination;
        const basedOnBudgetResult = await pool.query(`
                SELECT suggestions_based_on_budget
                FROM trips
                WHERE user_id = $1 AND id = (SELECT current_trip_id from users WHERE id = $1 )
                `,[req.user.userId]);

    const isBudgetBased = basedOnBudgetResult.rows[0]?.suggestions_based_on_budget;


    const alreadySuggestedResults = await pool.query(`
            SELECT official_place_name FROM activity_suggestions
            WHERE user_id = $1 and isbudgetbased = $2 AND trip_id = (SELECT current_trip_id from users WHERE id = $1 );
        `, [req.user.userId,  isBudgetBased]);
        const alreadySuggested = alreadySuggestedResults.rows || [];
    return { remainingBalance, tripDestination, isBudgetBased, alreadySuggested };
}





export async function getActivitiesSuggestions(req) {
    try {






        //const response = await axios.get('');
        const {isBudgetBased, remainingBalance, tripDestination , alreadySuggested} = await getInfoFromDatabase(req);
        const jsonText = await x_ai_agent(isBudgetBased, remainingBalance, tripDestination, alreadySuggested);
        let activities;

        try {
            activities = JSON.parse(jsonText);

        } catch (error) {
            console.error("Error parsing JSON:", error.message);
            const jsonText = await x_ai_agent(isBudgetBased, remainingBalance, tripDestination);
            activities = JSON.parse(jsonText);



        }




        if (!activities) return null



        const enriched = await Promise.all(
            activities.map(async (activity) => {
                const query = encodeURIComponent(`${activity.officialPlaceName} ${tripDestination}`);

                const res = await generateImg(activity, query);
                if (!res.imageUrl) {
                    const fallbackQuery = encodeURIComponent(`${activity.activityName} ${tripDestination}`);

                    const res2 = await generateImg(activity, fallbackQuery);
                    return res2;
                }
                return res;

            })
        );










        return enriched


        // return response.data;
    } catch (error) {
        console.error("Activities Suggestions error:", error.message);

        return null;

    }
}





router.get("/", async (req, res) => {
    try {



        const suggestions = await getActivitiesSuggestions(req);
        res.json({ suggestions });

    } catch (error) {
        res.status(500).json({ errorMessage: error.message });

    }

})




export default router;



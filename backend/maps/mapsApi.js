
import { Router } from "express";
const router = Router();

import axios from "axios";


async function getAutocompleteSuggestions(input){
  try {
    const response = await axios.get("https://maps.googleapis.com/maps/api/place/autocomplete/json", {
      params: {
        input,
        key: process.env.GOOGLE_MAPS_API_KEY,
       // types: "(cities)", // optional: restrict to cities
        language: "en",
      },
    });
    //console.log(JSON.stringify(response.data, null, 2));


    return response.data.predictions.map(p => ({
      description: p.description,
      place_id: p.place_id,
    }));
  } catch (error) {
    console.error("Autocomplete error:", error.response?.data || error.message);
    throw error;
  }
}





router.get("/autocomplete/:input", async(req, res)=>{
   // console.log('i got your maps api');
    const {input} = req.params;
    if (!input) return res.status(400).json({ error: "Missing input" });
    const suggestions = await getAutocompleteSuggestions(input);
    res.json({  suggestions });
})


router.get("/placeInfo/:id", async(req, res)=>{
    
    const {id} = req.params;
    if (!id) return res.status(400).json({ error: "Missing id" });
   
    
try {
    console.time("Google Place Details"); // ⏱ Start timer

    const response = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
  params: {
    place_id: id,
    key: process.env.GOOGLE_MAPS_API_KEY,
    fields: "name"
  }
}); 
    console.timeEnd("Google Place Details"); // ⏱ End timer and log duration


    const name = response.data.result?.name;
    if (!name) return res.status(404).json({ error: "Place name not found" });
//console.log(name);
    res.json({ name });
    
} catch (error) {
     console.error("Place details error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch place details" });
 
    
}



    
})

export default router;
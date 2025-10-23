








import { GoogleGenAI } from "@google/genai";


async function generateActivitySuggestions(basedOnBudget, remainingBalance, tripDestination) {

    const ai = new GoogleGenAI({});


    // Construct the prompt and the JSON schema for a structured response

    const prompt = `
        You are an API backend responding to a frontend client.

        ${basedOnBudget ? `Based on a remaining budget of $${Number(remainingBalance).toFixed(2)},` : ``} suggest 6 fun activities to do in ${tripDestination}. Provide the name and estimated cost for each activity.${basedOnBudget ? 'If the remaining budget is low, suggest low-cost activities. If the remaining budget is very low, suggest free activities.' : ''}  
        Return ONLY a valid JSON array of 6 objects. Each object must include:
        - "activityName" (string)
        - "estimatedCost" (string)
        - "description" (string)
        - "officialPlaceName" (string)
        the description should be a nice explanation of the activity.
        official place name should be as listed on Google Maps.


        Do NOT include markdown formatting, explanations, or any text outside the array.
        `;
    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        "activityName": { "type": "STRING" },
                        "estimatedCost": { "type": "STRING" },
                        "description": { "type": "STRING" },
                        "officialPlaceName": { "type": "STRING" }

                    },
                    "propertyOrdering": ["activityName", "estimatedCost", "description", "officialPlaceName"]
                }
            }
        }
    };

    // Gemini API call for structured response
    //  const apiKey = process.env.GEMINI_API_KEY;
    // const apiUrl1 = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    //const apiUrl =
    /*  const response = await axios.post(apiUrl, payload,{
         
         headers: { 'Content-Type': 'application/json' }
        
     }); */
    try {


        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: payload.contents,
            generationConfig: payload.generationConfig,
        });




        // console.log("Gemini raw result:", result);

        const jsonText = result.candidates[0].content.parts[0].text;

        // console.log('1', jsonText);
        console.log('1', jsonText, typeof jsonText);

        return jsonText;



        //  return JSON.parse(jsonText);


    } catch (error) {
        console.error("Error calling Gemini API:", error.message);
        return "Sorry, something went wrong while generating suggestions. " + error.message;


    }
}
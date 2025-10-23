import client from "./x-ai-client.js";


export const x_ai_agent = async (basedOnBudget, remainingBalance, tripDestination, alreadySuggested) => {


    try {
        
        const completion = await client.chat.completions.create({
            model: "grok-code-fast-1",
            messages: [
                { role: "system", content: `You are a backend API that acts as a travel guide and returns structured JSON.
                    do not mention yourself or the user in any way.
                        only provide correcrt info about activities and attractions, if you cannot find attractions in the specified destination, try to suggest attractions in the nearby.
                           Return ONLY a valid JSON array of 6 objects. Each object must include:
                  - "activityName" (string)
                  - "estimatedCost" (string)
                  - "description" (string)
                  - "officialPlaceName" (string)
                  the description should be a nice explanation of the attraction, it should be about 300 characters.
                  estimatedCost should be in us currency.
                  official place name should be as listed on Google Maps.
               

                  


                  Do NOT include markdown formatting, explanations, or any text outside the array.
                    ` },
                {
                    /* You are an API backend responding to a frontend client. */
                    role: "user", content: `
                  

                  ${basedOnBudget ? `Based on a remaining budget of $${Number(remainingBalance).toFixed(2)},` : ``} suggest 6 fun attractions in ${tripDestination}. Provide the name and estimated cost for each attraction.${basedOnBudget ? 'If the remaining budget is low, suggest low-cost attractions. If the remaining budget is very low, suggest free activities/attractions.' : ''}  
               

                  ${alreadySuggested && alreadySuggested.length ? `Do not include any attractions that have already been suggested: ${alreadySuggested.map(item => item.official_place_name).join(', ')}.` : ''}
      `}
            ],
        });

        const response = completion.choices[0].message.content;
        return response;
    }
    catch (error) {
        console.error("Error calling Grok API:", error.message);
        return "Sorry, something went wrong while generating suggestions. " + error.message;


    }
}
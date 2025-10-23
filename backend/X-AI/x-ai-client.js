



import OpenAI from "openai";



const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.x.ai/v1", // 👈 This points to xAI instead of OpenAI
  timeout: 360000, // Grok models need breathing room
});
export default client


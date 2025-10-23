



import { Router } from "express";
const router = Router();

import { Client } from "@gradio/client";
import fetch from "node-fetch";
import uploadToS3 from "../imagePipeline/uploadToS3.js"; // adjust path as needed

export async function createAndUploadImage(destination) {
  try {
    const client = await Client.connect("black-forest-labs/FLUX.1-schnell");

    const result = await client.predict("/infer", {
      prompt: `A beautiful scenic high quality landscape of ${destination}, please note that that this img will be used for a travel website, and this pic need to be the best possible, making the user feel relaxed and happy so it should be inviting and appealing, with attention to detail.`,
      seed: 0,
      randomize_seed: true,
      width: 1024,
      height: 512,
      num_inference_steps: 4,
    });

    const imageUrl = result.data[0].url;
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filename = `destination-${destination}-${Date.now()}.webp`;
    const s3Url = await uploadToS3(buffer, filename);

    console.log(`✅ Uploaded to S3: ${s3Url}`);
    return s3Url;
  } catch (error) {
    console.error("Error generating or uploading image:", error);
    return null;
  }
}

/* 
router.get("/:destination", async (req, res) => {
  try {
    const imageUrl = await createAndUploadImage(req.params.destination);
    //console.log('Generated image URL:');
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: "Image generation failed" });
  }
}); */

//export default router;

/* 
import { Router } from 'express';

const router = Router();

import { Client } from "@gradio/client";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";





async function createTables(destination) {


    try {
        const client = await Client.connect("black-forest-labs/FLUX.1-schnell");

        
        const result = await client.predict("/infer", {
            prompt: `A beautiful scenic high quality landscape of ${destination}`,
            seed: 0,
            randomize_seed: true,
            width: 1024,
            height: 512,
            num_inference_steps: 4,
        });

        const imageUrl = result.data[0].url;

        // ✅ Use arrayBuffer() instead of buffer()
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const filename = `hh_destination-${destination}-${Date.now()}.webp`;
        const filepath = path.join(process.cwd(), filename);
        fs.writeFileSync(filepath, buffer);

        console.log(`✅ Image saved as: ${filepath}`);
    }
    catch (error) {
        console.error('Error creating tables:', error);
    }
}


router.get('/:destination', async (req, res) => {
    createTables(req.params.destination);
});

export default router; */
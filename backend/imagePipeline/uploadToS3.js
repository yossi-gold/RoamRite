import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import dotenv from "dotenv";
dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export default async function uploadToS3(buffer, filename) {
  const upload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: "image/webp",
      //ACL: "public-read", // Makes the image publicly accessible
    },
  });

  const result = await upload.done();
  return result.Location; // Public URL of the uploaded image
}
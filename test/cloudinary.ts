import { v2 as cloudinary } from "cloudinary";

if (process.env.CLOUD_API_KEY === undefined || process.env.CLOUD_API_SECRET === undefined || process.env.CLOUD_NAME === undefined) {
  console.error("Cloudinary config not found");
  process.exit(1);
}

export default cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

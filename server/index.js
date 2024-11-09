require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;
// Check for required environment variables
const segmindApiUrl = process.env.SEGMIND_API_URL;
const segmindApiKey = process.env.SEGMIND_API_KEY;
if (!segmindApiUrl || !segmindApiKey) {
  console.error(
    "Error: SEGMIND_API_URL and SEGMIND_API_KEY must be set in the environment."
  );
  process.exit(1);
}
// CORS setup
const corsOptions = {
  origin: "https://gif-generator-six-alpha.vercel.app/", // Adjust if needed
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "x-api-key"],
};
app.use(cors(corsOptions));
// Body parser middleware (Express built-in for json)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// Serve static files
app.use(express.static(path.join(__dirname))); // Serve static files from the current directory
// Helper function to validate Base64 data
function isValidBase64Image(base64String) {
  const regex = /^data:image\/(jpeg|png|gif);base64,/;
  return regex.test(base64String);
}
app.post("/api/generate-gif", async (req, res) => {
  console.log("Received request body:", req.body);
  const { imageData } = req.body;
  // Check if imageData is provided
  if (!imageData) {
    console.error("No image data received");
    return res.status(400).json({
      error: "No image data provided",
      details: "Please upload an image first",
    });
  }
  try {
    console.log("Processing image data...");
    // Validate and clean the base64 image data
    if (!isValidBase64Image(imageData)) {
      return res.status(400).json({
        error: "Invalid base64 data",
        details: "The provided image data is not in valid base64 format",
      });
    }
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
    // Prepare form data for the API request
    const form = new FormData();
    form.append("face_image", base64Data);
    form.append(
      "driving_video",
      "https://segmind-sd-models.s3.amazonaws.com/display_images/liveportrait-video.mp4"
    );
    form.append("live_portrait_dsize", "512");
    form.append("live_portrait_scale", "2.3");
    form.append("video_frame_load_cap", "128");
    form.append("live_portrait_lip_zero", "true");
    form.append("live_portrait_relative", "true");
    form.append("live_portrait_vy_ratio", "-0.12");
    form.append("live_portrait_stitching", "true");
    form.append("video_select_every_n_frames", "1");
    // Set headers for the API request
    const headers = {
      ...form.getHeaders(),
      "x-api-key": segmindApiKey,
    };
    console.log("Sending request to Segmind API...");
    // Make the API request to generate the GIF
    const response = await axios.post(segmindApiUrl, form, {
      headers,
      responseType: "arraybuffer", // Expect binary data
      timeout: 120000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    // Log the response headers and data length
    console.log("API Response Headers:", response.headers);
    console.log("Response data length:", response.data.length);
    // Save the GIF to a file for inspection
    const gifBuffer = Buffer.from(response.data, "binary");
    const gifFilePath = path.join(__dirname, "generated.gif");
    fs.writeFileSync(gifFilePath, gifBuffer);
    console.log("GIF saved to generated.gif");
    // Check the file size
    const stats = fs.statSync(gifFilePath);
    console.log("GIF file size:", stats.size); // Log the file size in bytes
    // Send the URL of the saved GIF back to the client
    // Correct the URL string here
    return res.status(200).json({
      gifUrl: `http://localhost:${port}/generated.gif`, // Use template literal here
      status: "success",
      message: "GIF generated successfully",
    });
  } catch (error) {
    console.error("Error during Segmind API call:", error.message);
    // Handle specific error cases
    if (error.code === "ECONNABORTED") {
      return res.status(504).json({
        error: "Request is taking longer than expected",
        status: "processing",
      });
    }
    // General error response
    return res.status(500).json({
      error: "Failed to process request",
      details: error.message,
      status: "failed",
    });
  }
});
// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

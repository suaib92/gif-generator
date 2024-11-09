require('dotenv').config();  // Load environment variables from .env file
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Check for required environment variables
const segmindApiUrl = process.env.SEGMIND_API_URL;
const segmindApiKey = process.env.SEGMIND_API_KEY;

if (!segmindApiUrl || !segmindApiKey) {
    console.error("Error: SEGMIND_API_URL and SEGMIND_API_KEY must be set in the environment.");
    process.exit(1);
}

// CORS setup
const corsOptions = {
    origin: 'http://localhost:5173',  // Adjust if needed
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'x-api-key'],
};

app.use(cors(corsOptions));

// Body parser middleware (Express built-in for json)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Helper function to validate Base64 data
function isValidBase64Image(base64String) {
    const regex = /^data:image\/(jpeg|png|gif);base64,/;
    return regex.test(base64String);
}

// Helper function to convert an image file from the filesystem to base64
function imageFileToBase64(imagePath) {
    const imageData = fs.readFileSync(path.resolve(imagePath));
    return Buffer.from(imageData).toString('base64');
}

// Helper function to fetch an image from a URL and convert it to base64
async function imageUrlToBase64(imageUrl) {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary').toString('base64');
}

app.post('/api/generate-gif', async (req, res) => {
    const { imageData } = req.body;

    // Check if imageData is provided
    if (!imageData) {
        console.error('No image data received');
        return res.status(400).json({ error: 'No image data provided. Please include "imageData" in your request body.' });
    }

    // Ensure imageData starts with the MIME type
    if (!isValidBase64Image(imageData)) {
        console.error('Invalid image data format');
        return res.status(400).json({ error: 'Invalid image data format. Ensure it includes the MIME type (e.g., data:image/jpeg;base64,).' });
    }

    try {
        console.log('Sending image data to Segmind API...');

        // Create a new FormData instance
        const form = new FormData();
        form.append('face_image', imageData); // Append the image data to the form

        const headers = {
            ...form.getHeaders(),
            'x-api-key': segmindApiKey,
        };

        // Send the request using axios with form-data
        const response = await axios.post(segmindApiUrl, form, { headers });

        console.log('Segmind API response:', response.data);

        // Check for the expected output URL in the response
        if (response.data && response.data.output_url) {
            return res.status(200).json({ gifUrl: response.data.output_url });
        } else {
            console.error('Unexpected response format from Segmind API:', response.data);
            return res.status(500).json({
                error: 'Unexpected response format from Segmind API',
                details: response.data,
            });
        }
    } catch (error) {
        console.error('Error during Segmind API call:', error.message);

        if (error.response) {
            console.error('Segmind API error response:', error.response.data);
            return res.status(error.response.status || 500).json({
                error: 'Failed to generate GIF from Segmind API',
                details: error.response.data,
            });
        } else if (error.code === 'ECONNABORTED') {
            console.error('Request to Segmind API timed out');
            return res.status(504).json({ error: 'Request to Segmind API timed out. Please try again.' });
        } else {
            console.error('Network or unknown error:', error.message);
            return res.status(500).json({
                error: 'Failed to generate GIF',
                details: error.message,
            });
        }
    }
});

// Function to test Segmind API with a direct image URL converted to Base64
async function testSegmindApi() {
    const apiKey = process.env.SEGMIND_API_KEY; // Make sure you set your API key
    const imageUrl = "https://segmind-sd-models.s3.amazonaws.com/display_images/liveportrait-input.jpg"; // Example image URL

    try {
        const imageData = await imageUrlToBase64(imageUrl);

        const data = {
            face_image: imageData,
            driving_video: "https://segmind-sd-models.s3.amazonaws.com/display_images/liveportrait-video.mp4",
            live_portrait_dsize: 512,
            live_portrait_scale: 2.3,
            video_frame_load_cap: 128,
            live_portrait_lip_zero: true,
            live_portrait_relative: true,
            live_portrait_vx_ratio: 0,
            live_portrait_vy_ratio: -0.12,
            live_portrait_stitching: true,
            video_select_every_n_frames: 1,
            live_portrait_eye_retargeting: false,
            live_portrait_lip_retargeting: false,
            live_portrait_lip_retargeting_multiplier: 1,
            live_portrait_eyes_retargeting_multiplier: 1
        };

        const response = await axios.post(segmindApiUrl, data, {
            headers: { 'x-api-key': apiKey },
        });
        console.log(response.data); // Check the response here
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

// Uncomment this line for manual testing (remove after confirming it's working)
// testSegmindApi();

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

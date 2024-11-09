# GIF Generator - Face to GIF

This project allows users to upload or capture a selfie and generate a custom animated GIF using the Segmind API. The backend handles image data and interfaces with the Segmind API to create a personalized GIF. The frontend provides an intuitive UI to upload, capture, and view the generated GIF.

## Features

- Upload an image or capture a selfie using the webcam.
- Generate a personalized GIF from the uploaded image using the Segmind API.
- Display the generated GIF directly on the frontend.
- Handle errors with helpful messages.
- Responsive UI built using React and Tailwind CSS.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Axios
- **Backend**: Node.js, Express, Axios, FormData
- **API Integration**: Segmind API
- **Webcam Integration**: HTML5 MediaDevices API

## Setup and Installation

### Prerequisites

Before you begin, ensure that you have the following installed:

- [Node.js](https://nodejs.org/en/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/gif-generator.git
   cd gif-generator
   ```

2. Install the backend dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and set the required environment variables:

   ```env
   SEGMIND_API_URL=your-segmind-api-url
   SEGMIND_API_KEY=your-segmind-api-key
   ```

4. Run the backend server:
   ```bash
   npm start
   ```

   The backend will run on `http://localhost:5000` (or a different port if specified).

### Frontend Setup

1. In the same repository folder, navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install the frontend dependencies:
   ```bash
   npm install
   ```

3. Run the frontend:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`.

### Deployment

This project has been deployed on Render (backend) and Vercel (frontend). You can access the live version of the app:

- **Frontend**: [https://gif-generator-six-alpha.vercel.app](https://gif-generator-six-alpha.vercel.app)
- **Backend**: [https://gif-generator-wbgn.onrender.com](https://gif-generator-wbgn.onrender.com)

## How to Use

1. **Upload Image**: Click the "Upload" button to select an image from your device.
2. **Capture Selfie**: Click the "Capture" button to take a selfie using your webcam.
3. **Generate GIF**: After uploading or capturing the image, click "Generate GIF" to process the image and generate the GIF.
4. **GIF Preview**: The generated GIF will be displayed below the button once it's ready.
5. **Clear**: Use the "Clear" button to reset the uploaded image and generated GIF.

## Error Handling

- If the uploaded image is not in a valid format, you will receive an error message.
- If there is an issue with the Segmind API or a network error, the system will display an appropriate error message.

## Contribution Guidelines

We welcome contributions! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- **Segmind**: For providing the API that powers the GIF generation.
- **React**: For the frontend framework.
- **Node.js & Express**: For the backend setup.
- **Tailwind CSS**: For the beautiful and responsive UI.
- **Vercel & Render**: For deployment.
```

### Key Points:
- The README covers project setup, tech stack, usage, deployment, and contribution guidelines.
- It provides instructions for both frontend and backend setup and includes environment variable setup.
- Links to live versions and licenses are included for clarity.

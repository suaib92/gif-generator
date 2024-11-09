import React, { useState, useRef } from 'react';
import { FaUpload, FaTrashAlt, FaCamera, FaSpinner } from 'react-icons/fa'; // Import the spinner icon
import axios from 'axios';

const App = () => {
    const [imageData, setImageData] = useState('');
    const [gifUrl, setGifUrl] = useState('');
    const [error, setError] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageData(reader.result);
                setGifUrl('');
                setError('');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSelfieCapture = async () => {
        setIsCameraActive(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            videoRef.current.play();
        } catch (err) {
            console.error("Error accessing the camera:", err);
            setError("Could not access the camera. Please check your permissions.");
        }
    };

    const captureImageFromVideo = () => {
        const video = videoRef.current;
        if (video) {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            setImageData(canvas.toDataURL('image/png'));
            setGifUrl('');
            setError('');
            stopCamera();
        }
    };

    const stopCamera = () => {
        const stream = videoRef.current.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraActive(false);
    };

    const clearImage = () => {
        setImageData('');
        setGifUrl('');
        setError('');
        stopCamera();
    };

    const generateGif = async () => {
        if (isGenerating) return;

        if (!imageData) {
            setError('Please upload an image or capture a selfie first.');
            return;
        }

        setIsGenerating(true);

        try {
            const response = await axios.post('https://gif-generator-wbgn.onrender.com/api/generate-gif', 
            { imageData });

            if (response.data.status === "success") {
                setGifUrl(response.data.gifUrl);
                setError('');
            } else {
                setError('Failed to generate GIF: ' + response.data.error);
            }
        } catch (err) {
            setError('Failed to generate GIF: ' + (err.response ? err.response.data.error : err.message));
            setGifUrl('');
        }

        setIsGenerating(false);
    };

    return (
        <div className="flex flex-col lg:flex-row items-center justify-center p-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 min-h-screen">
            <div className="w-full max-w-sm bg-white rounded-lg shadow-xl p-6 mb-4 lg:mb-0">
                <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Upload or Capture Face Image</h1>

                {imageData ? (
                    <img
                        src={imageData}
                        alt="Preview"
                        className="w-full h-64 object-cover rounded-lg mb-6 shadow-lg"
                    />
                ) : isCameraActive ? (
                    <video
                        ref={videoRef}
                        className="w-full h-64 object-cover rounded-lg mb-6 shadow-lg"
                    ></video>
                ) : (
                    <div
                        className="w-full h-64 flex items-center justify-center border-4 border-dashed border-gray-300 rounded-lg text-gray-400 cursor-pointer mb-6 hover:border-indigo-600 transition-all"
                        onClick={() => fileInputRef.current.click()}
                    >
                        <p className="text-center">Click or Drag-n-Drop</p>
                    </div>
                )}

                <div className="flex justify-center gap-6 mb-6">
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 focus:outline-none transition-all"
                    >
                        <FaUpload size={20} />
                    </button>
                    <button
                        onClick={clearImage}
                        className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700 focus:outline-none transition-all"
                    >
                        <FaTrashAlt size={20} />
                    </button>
                    {isCameraActive ? (
                        <button
                            onClick={captureImageFromVideo}
                            className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 focus:outline-none transition-all"
                        >
                            Capture
                        </button>
                    ) : (
                        <button
                            onClick={handleSelfieCapture}
                            className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 focus:outline-none transition-all"
                        >
                            <FaCamera size={20} />
                        </button>
                    )}
                </div>

                <button
                    onClick={generateGif}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-lg hover:from-green-600 hover:to-blue-600 focus:outline-none mb-6 transition-all"
                >
                    {isGenerating ? (
                        <div className="flex justify-center items-center">
                            <FaSpinner className="animate-spin mr-2" /> Generating...
                        </div>
                    ) : (
                        'Generate GIF'
                    )}
                </button>

                {error && <p className="text-red-600 text-center mt-6">{error}</p>}

                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
                <p className="text-center text-gray-500 mt-4 text-sm">
                    PNG, JPG or GIF, Up to 2048 × 2048 px
                </p>
            </div>

            <div className="w-full max-w-sm bg-white rounded-lg shadow-xl p-6 ml-4">
                <h2 className="text-xl font-semibold text-center mb-6">Generated GIF:</h2>
                {gifUrl ? (
                    <video src={gifUrl} alt="Generated GIF" className="w-full h-auto rounded-lg mt-6 shadow-lg" controls />
                ) : (
                    <div className="w-full h-64 flex items-center justify-center border-4 border-dashed border-gray-300 rounded-lg text-gray-400 mt-6">
                        <p>GIF Preview will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;

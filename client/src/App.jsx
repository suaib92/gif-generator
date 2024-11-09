import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [imageData, setImageData] = useState('');
    const [gifUrl, setGifUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageData(reader.result);
                setGifUrl(''); // Clear previous gif when a new image is uploaded
                setError('');
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setImageData('');
        setGifUrl('');
        setError('');
    };

    const generateGif = async () => {
        if (!imageData) {
            setError('Please upload an image.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/generate-gif', { imageData });
            setGifUrl(response.data.gifUrl);
        } catch (err) {
            console.error('Error generating GIF:', err);
            setError('Failed to generate GIF: ' + (err.response ? err.response.data.error : err.message));
            setGifUrl('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">GIF Generator</h1>

            <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
                <div className="flex flex-col items-center">
                    {imageData ? (
                        <img
                            src={imageData}
                            alt="Uploaded"
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                    ) : (
                        <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded-lg mb-4">
                            <span className="text-gray-500">Click "Upload" to select an image</span>
                        </div>
                    )}
                    <div className="flex space-x-3 mt-2">
                        <label className="bg-purple-600 text-white px-3 py-2 rounded-md cursor-pointer">
                            <input type="file" onChange={handleImageChange} className="hidden" />
                            Upload
                        </label>
                        <button onClick={clearImage} className="bg-red-600 text-white px-3 py-2 rounded-md">
                            Clear
                        </button>
                        <button onClick={generateGif} disabled={loading} className="bg-blue-600 text-white px-3 py-2 rounded-md">
                            {loading ? 'Generating...' : 'Generate'}
                        </button>
                    </div>
                </div>
            </div>

            {gifUrl && (
                <div className="mt-6 w-full max-w-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Generated GIF:</h2>
                    <img src={gifUrl} alt="Generated GIF" className="w-full rounded-lg shadow-lg" />
                </div>
            )}

            {error && <p className="mt-4 text-red-600">{error}</p>}
        </div>
    );
};

export default App;

import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [imageData, setImageData] = useState('');
    const [gifUrl, setGifUrl] = useState('');
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageData(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const generateGif = async () => {
        if (!imageData) {
            setError('Please upload an image.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/generate-gif', { imageData });
            setGifUrl(response.data.gifUrl);
            setError('');
        } catch (err) {
            console.error('Error generating GIF:', err);
            setError('Failed to generate GIF: ' + (err.response ? err.response.data.error : err.message));
            setGifUrl('');
        }
    };

    return (
        <div>
            <h1>GIF Generator</h1>
            <input type="file" onChange={handleImageChange} />
            <button onClick={generateGif}>Generate GIF</button>

            {gifUrl && (
                <div>
                    <h2>Generated GIF:</h2>
                    <img src={gifUrl} alt="Generated GIF" />
                </div>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default App;

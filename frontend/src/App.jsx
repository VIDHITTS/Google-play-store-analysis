import { useState, useEffect } from 'react';

import './index.css';

function App() {
    const [formData, setFormData] = useState({
        category: '',
        size: '',
        type: 'Free',
        price: '0',
        contentRating: ''
    });

    const [metadata, setMetadata] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        // Fetch metadata on component mount
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/metadata`);
            if (!response.ok) {
                throw new Error('Failed to fetch metadata');
            }
            const data = await response.json();
            setMetadata(data);
            // Set default values
            if (data.categories.length > 0) {
                setFormData(prev => ({ ...prev, category: data.categories[0] }));
            }
            if (data.content_ratings.length > 0) {
                setFormData(prev => ({ ...prev, contentRating: data.content_ratings[0] }));
            }
        } catch (err) {
            setError('Failed to load metadata. Please ensure the backend is running.');
            console.error('Metadata fetch error:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Reset price to 0 if type is Free
        if (name === 'type' && value === 'Free') {
            setFormData(prev => ({ ...prev, price: '0' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setPrediction(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category: formData.category,
                    size: parseFloat(formData.size),
                    type: formData.type,
                    price: parseFloat(formData.price),
                    contentRating: formData.contentRating
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Prediction failed');
            }

            setPrediction(data);
        } catch (err) {
            setError(err.message || 'Prediction failed. Please try again.');
            console.error('Prediction error:', err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setPrediction(null);
        setError(null);
    };

    if (!metadata) {
        return (
            <div className="app">
                <div className="loading-screen">
                    <div className="spinner"></div>
                    <p>Loading predictor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <div className="container">
                <header className="header">
                    <h1 className="title">App Success Predictor</h1>
                    <p className="subtitle">
                        Predict your Google Play Store app's success using AI-powered analytics
                    </p>
                </header>

                <div className="content">
                    <form onSubmit={handleSubmit} className="form">
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="category">App Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {metadata.categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="size">App Size (MB)</label>
                                <input
                                    type="number"
                                    id="size"
                                    name="size"
                                    value={formData.size}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 25.5"
                                    step="0.1"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="type">App Type</label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {metadata.types.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="price">Price (USD)</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 2.99"
                                    step="0.01"
                                    min="0"
                                    disabled={formData.type === 'Free'}
                                    required
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="contentRating">Content Rating</label>
                                <select
                                    id="contentRating"
                                    name="contentRating"
                                    value={formData.contentRating}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {metadata.content_ratings.map(rating => (
                                        <option key={rating} value={rating}>{rating}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-small"></span>
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    Predict Success
                                </>
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="result-card error-card">
                            <h3>Error</h3>
                            <p>{error}</p>
                        </div>
                    )}

                    {prediction && (
                        <div className={`result-card ${prediction.success ? 'success-card' : 'failure-card'}`}>
                            <h3 className="result-title">{prediction.prediction}</h3>

                            <p className="result-message">{prediction.message}</p>

                            <div className="result-details">
                                <h4>Input Summary</h4>
                                <div className="details-grid">
                                    <div className="detail-item">
                                        <span className="detail-label">Category:</span>
                                        <span className="detail-value">{prediction.details.category}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Size:</span>
                                        <span className="detail-value">{prediction.details.size} MB</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Type:</span>
                                        <span className="detail-value">{prediction.details.type}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Price:</span>
                                        <span className="detail-value">${prediction.details.price}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Rating:</span>
                                        <span className="detail-value">{prediction.details.contentRating}</span>
                                    </div>
                                </div>
                            </div>

                            <button onClick={resetForm} className="reset-btn">
                                Try Another Prediction
                            </button>
                        </div>
                    )}
                </div>

                <footer className="footer">
                    <p>Powered by K-Nearest Neighbors Machine Learning</p>
                    <p className="footer-note">Predictions based on Google Play Store historical data</p>
                </footer>
            </div>
        </div>
    );
}

export default App;

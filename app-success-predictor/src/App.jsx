import { useState } from 'react'

function App() {
    const [formData, setFormData] = useState({
        appName: '',
        category: '',
        size: '',
        type: 'Free',
        price: '',
        genres: '',
        contentRating: ''
    })

    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        if (name === 'type' && value === 'Free') {
            setFormData(prev => ({
                ...prev,
                price: ''
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setResult(null)
        setLoading(true)

        try {
            const response = await fetch('YOUR_BACKEND_API_URL', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                throw new Error('Failed to get prediction')
            }

            const data = await response.json()
            setResult(data.message || data)
        } catch (err) {
            setError(err.message || 'An error occurred while making the prediction')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="app-container">
            <header className="header">
                <h1>App Success Predictor</h1>
                <p>Predict your app's success with data-driven insights</p>
            </header>

            <div className="main-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="appName">App Name</label>
                        <input
                            type="text"
                            id="appName"
                            name="appName"
                            value={formData.appName}
                            onChange={handleChange}
                            placeholder="Enter app name"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select category</option>
                                <option value="ART_AND_DESIGN">Art & Design</option>
                                <option value="AUTO_AND_VEHICLES">Auto & Vehicles</option>
                                <option value="BEAUTY">Beauty</option>
                                <option value="BOOKS_AND_REFERENCE">Books & Reference</option>
                                <option value="BUSINESS">Business</option>
                                <option value="COMICS">Comics</option>
                                <option value="COMMUNICATION">Communication</option>
                                <option value="DATING">Dating</option>
                                <option value="EDUCATION">Education</option>
                                <option value="ENTERTAINMENT">Entertainment</option>
                                <option value="EVENTS">Events</option>
                                <option value="FINANCE">Finance</option>
                                <option value="FOOD_AND_DRINK">Food & Drink</option>
                                <option value="HEALTH_AND_FITNESS">Health & Fitness</option>
                                <option value="HOUSE_AND_HOME">House & Home</option>
                                <option value="LIBRARIES_AND_DEMO">Libraries & Demo</option>
                                <option value="LIFESTYLE">Lifestyle</option>
                                <option value="GAME">Game</option>
                                <option value="FAMILY">Family</option>
                                <option value="MEDICAL">Medical</option>
                                <option value="SOCIAL">Social</option>
                                <option value="SHOPPING">Shopping</option>
                                <option value="PHOTOGRAPHY">Photography</option>
                                <option value="SPORTS">Sports</option>
                                <option value="TRAVEL_AND_LOCAL">Travel & Local</option>
                                <option value="TOOLS">Tools</option>
                                <option value="PERSONALIZATION">Personalization</option>
                                <option value="PRODUCTIVITY">Productivity</option>
                                <option value="PARENTING">Parenting</option>
                                <option value="WEATHER">Weather</option>
                                <option value="VIDEO_PLAYERS">Video Players & Editors</option>
                                <option value="NEWS_AND_MAGAZINES">News & Magazines</option>
                                <option value="MAPS_AND_NAVIGATION">Maps & Navigation</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="type">Type</label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="Free">Free</option>
                                <option value="Paid">Paid</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="size">Size (MB)</label>
                            <input
                                type="number"
                                id="size"
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                placeholder="e.g., 25"
                                step="0.1"
                                min="0"
                                required
                            />
                        </div>

                        {formData.type === 'Paid' && (
                            <div className="form-group">
                                <label htmlFor="price">Price ($)</label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="e.g., 4.99"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="genres">Genres</label>
                        <input
                            type="text"
                            id="genres"
                            name="genres"
                            value={formData.genres}
                            onChange={handleChange}
                            placeholder="e.g., Education;Creativity"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contentRating">Content Rating</label>
                        <select
                            id="contentRating"
                            name="contentRating"
                            value={formData.contentRating}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select content rating</option>
                            <option value="Everyone">Everyone</option>
                            <option value="Everyone 10+">Everyone 10+</option>
                            <option value="Teen">Teen</option>
                            <option value="Mature 17+">Mature 17+</option>
                            <option value="Adults only 18+">Adults only 18+</option>
                            <option value="Unrated">Unrated</option>
                        </select>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading && <span className="loading-spinner"></span>}
                        {loading ? 'Predicting...' : 'Predict Success'}
                    </button>
                </form>

                {error && (
                    <div className="error-message">
                        ⚠️ {error}
                    </div>
                )}

                {result && (
                    <div className="result-card">
                        <h2>🎯 Prediction Result</h2>
                        <p>{typeof result === 'string' ? result : JSON.stringify(result, null, 2)}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default App

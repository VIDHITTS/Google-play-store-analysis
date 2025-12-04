# Frontend - App Success Predictor

Modern React frontend for the Google Play Store App Success Predictor.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

3. **Build for production:**
   ```bash
   npm run build
   ```

## Features

- 🎨 Modern, premium UI with glassmorphism effects
- 📱 Fully responsive design
- ⚡ Real-time predictions via API
- 🎯 Input validation and error handling
- 📊 Visual confidence indicators
- 🌈 Smooth animations and transitions

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls
- **CSS3** - Modern styling with animations

## Usage

1. Ensure the backend server is running on `http://localhost:5000`
2. Fill in the app details:
   - Select a category
   - Enter app size in MB
   - Choose Free or Paid
   - Set price (if paid)
   - Select content rating
3. Click "Predict Success"
4. View the prediction results with confidence score

## API Integration

The frontend communicates with the Flask backend through:
- `/api/metadata` - Fetches available options
- `/api/predict` - Submits prediction requests

Vite proxy configuration handles API routing automatically.

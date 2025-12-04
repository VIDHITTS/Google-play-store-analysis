# Google Play Store App Success Predictor

A full-stack machine learning application that predicts the success of Google Play Store apps using K-Nearest Neighbors (KNN) algorithm.

## 🎯 Overview

This project analyzes app features (category, size, type, price, content rating) to predict whether an app will be successful on the Google Play Store. The prediction is based on historical data and uses a trained KNN model.

## 🏗️ Architecture

```
├── backend/          # Flask API server
│   ├── app.py       # Main API application
│   ├── model_trainer.py  # Model training script
│   └── requirements.txt
│
├── frontend/        # React web application
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
└── google_play_store_dataset.csv  # Training data
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Copy the dataset:**
   - Place `google_play_store_dataset.csv` in the `backend/` directory
   - Or download from Kaggle: [Google Play Store Dataset](https://www.kaggle.com/datasets)

4. **Train the model:**
   ```bash
   python model_trainer.py
   ```
   This creates:
   - `knn_model.pkl` - Trained model
   - `encoders.pkl` - Feature encoders
   - `scaler.pkl` - Feature scaler
   - `model_metadata.json` - Model metadata

5. **Start the API server:**
   ```bash
   python app.py
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

4. **Open in browser:**
   Visit `http://localhost:3000`

## 📊 Features

### Backend
- ✅ RESTful API with Flask
- ✅ KNN machine learning model
- ✅ Input validation and error handling
- ✅ CORS enabled for frontend communication
- ✅ Model metadata endpoint
- ✅ Health check endpoint

### Frontend
- ✅ Modern, responsive UI
- ✅ Real-time predictions
- ✅ Interactive form with validation
- ✅ Visual confidence indicators
- ✅ Glassmorphism design
- ✅ Smooth animations
- ✅ Error handling

## 🎨 UI Preview

The frontend features:
- **Gradient background** with purple/blue theme
- **Glassmorphism cards** with backdrop blur
- **Animated elements** for better UX
- **Responsive design** for all devices
- **Visual feedback** for predictions

## 🔌 API Endpoints

### GET `/api/metadata`
Returns available categories, types, and content ratings.

**Response:**
```json
{
  "categories": ["GAME", "TOOLS", ...],
  "types": ["Free", "Paid"],
  "content_ratings": ["Everyone", "Teen", ...],
  "accuracy": 0.85,
  "best_k": 7
}
```

### POST `/api/predict`
Predicts app success.

**Request:**
```json
{
  "category": "GAME",
  "size": 95.0,
  "type": "Paid",
  "price": 2.99,
  "contentRating": "Everyone"
}
```

**Response:**
```json
{
  "prediction": "Hit",
  "success": true,
  "confidence": 78.5,
  "message": "Good potential for success based on similar apps. ✅",
  "details": { ... }
}
```

## 🧪 Model Details

- **Algorithm:** K-Nearest Neighbors (KNN)
- **Features:** Category, Size, Type, Price, Content Rating
- **Target:** Success (based on installs vs category median)
- **Preprocessing:** Label encoding + Standard scaling
- **Accuracy:** ~85% (varies by dataset)

## 📝 Usage Example

1. Select app category (e.g., "GAME")
2. Enter app size in MB (e.g., 95.0)
3. Choose type (Free or Paid)
4. Set price if paid (e.g., 2.99)
5. Select content rating (e.g., "Everyone")
6. Click "Predict Success"
7. View results with confidence score

## 🛠️ Development

### Backend Development
```bash
cd backend
python app.py  # Runs with auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Hot module replacement enabled
```

### Production Build
```bash
cd frontend
npm run build  # Creates optimized build in dist/
```

## 📦 Dependencies

### Backend
- Flask 3.0.0
- Flask-CORS 4.0.0
- scikit-learn 1.3.2
- pandas 2.1.4
- numpy 1.26.2

### Frontend
- React 18.2.0
- Axios 1.6.2
- Vite 5.0.8

## 🤝 Contributing

This project is part of a Google Play Store data mining analysis. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- Dataset: Google Play Store Apps (Kaggle)
- ML Algorithm: K-Nearest Neighbors
- UI Inspiration: Modern glassmorphism design trends

---

**Built with ❤️ using Flask, React, and Machine Learning**

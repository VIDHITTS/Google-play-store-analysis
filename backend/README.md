# Backend - Google Play Store App Success Predictor

Flask API server for the KNN-based app success prediction model.

## Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Download the dataset:**
   - Place `google_play_store_dataset.csv` in the `backend` directory
   - You can download it from Kaggle or use your existing dataset

3. **Train the model:**
   ```bash
   python model_trainer.py
   ```
   This will create:
   - `knn_model.pkl` - Trained KNN model
   - `encoders.pkl` - Label encoders for categorical features
   - `scaler.pkl` - StandardScaler for feature scaling
   - `model_metadata.json` - Metadata for frontend

4. **Start the server:**
   ```bash
   python app.py
   ```
   Server will run on `http://localhost:5000`

## API Endpoints

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
Predict app success based on features.

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

### GET `/health`
Health check endpoint.

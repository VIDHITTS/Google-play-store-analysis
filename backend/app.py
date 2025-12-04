from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
import json
import os

app = Flask(__name__)
CORS(app)

# Load model components
print("Loading model components...")
with open('knn_model.pkl', 'rb') as f:
    knn_model = pickle.load(f)

with open('encoders.pkl', 'rb') as f:
    encoders = pickle.load(f)

with open('scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

with open('model_metadata.json', 'r') as f:
    metadata = json.load(f)

print("Model loaded successfully!")

@app.route('/api/metadata', methods=['GET'])
def get_metadata():
    """
    Return metadata including available categories, types, and content ratings.
    """
    return jsonify(metadata)

@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Predict app success based on input features.
    
    Expected JSON body:
    {
        "category": "GAME",
        "size": 95.0,
        "type": "Paid",
        "price": 2.99,
        "contentRating": "Everyone"
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['category', 'size', 'type', 'price', 'contentRating']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Extract features
        category = data['category']
        size = float(data['size'])
        app_type = data['type']
        price = float(data['price'])
        content_rating = data['contentRating']
        
        # Validate inputs
        if size < 0:
            return jsonify({'error': 'Size must be positive'}), 400
        if price < 0:
            return jsonify({'error': 'Price must be positive'}), 400
        if app_type not in metadata['types']:
            return jsonify({'error': f'Invalid type. Must be one of: {metadata["types"]}'}), 400
        if category not in metadata['categories']:
            return jsonify({'error': f'Invalid category'}), 400
        if content_rating not in metadata['content_ratings']:
            return jsonify({'error': f'Invalid content rating'}), 400
        
        # Prepare input DataFrame
        input_df = pd.DataFrame({
            'Category': [category],
            'Size': [size],
            'Type': [app_type],
            'Price': [price],
            'Content Rating': [content_rating]
        })
        
        # Encode categorical variables
        for col in ['Category', 'Type', 'Content Rating']:
            input_df[col] = encoders[col].transform(input_df[col])
        
        # Scale input
        input_scaled = scaler.transform(input_df)
        
        # Make prediction
        prediction = knn_model.predict(input_scaled)[0]
        probabilities = knn_model.predict_proba(input_scaled)[0]
        confidence = float(probabilities[1])  # Probability of success
        
        # Get nearest neighbors for additional context
        distances, indices = knn_model.kneighbors(input_scaled, n_neighbors=5)
        
        result = {
            'prediction': 'Hit' if prediction == 1 else 'Flop',
            'success': bool(prediction == 1),
            'confidence': round(confidence * 100, 1),
            'message': get_prediction_message(prediction, confidence),
            'details': {
                'category': category,
                'size': size,
                'type': app_type,
                'price': price,
                'contentRating': content_rating
            }
        }
        
        return jsonify(result)
    
    except ValueError as e:
        return jsonify({'error': f'Invalid input value: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

def get_prediction_message(prediction, confidence):
    """
    Generate a user-friendly message based on prediction and confidence.
    """
    if prediction == 1:
        if confidence >= 0.8:
            return "Strong indicators suggest this app will be highly successful! 🚀"
        elif confidence >= 0.6:
            return "Good potential for success based on similar apps. ✅"
        else:
            return "Moderate success potential. Consider optimizing features. 📊"
    else:
        if confidence <= 0.2:
            return "High risk of underperformance. Significant changes recommended. ⚠️"
        elif confidence <= 0.4:
            return "Low success probability. Review your app strategy. 📉"
        else:
            return "Uncertain outcome. Consider market research. 🤔"

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'model': 'KNN App Success Predictor'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)

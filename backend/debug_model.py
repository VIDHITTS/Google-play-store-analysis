import pickle
import pandas as pd
import numpy as np

# Load model components
with open('knn_model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('encoders.pkl', 'rb') as f:
    encoders = pickle.load(f)

with open('scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

print("Model loaded successfully!")
print(f"Model type: {type(model)}")
print(f"Model K: {model.n_neighbors}")

# Test with different inputs
test_cases = [
    {"category": "GAME", "size": 95.0, "type": "Paid", "price": 2.99, "contentRating": "Everyone"},
    {"category": "PRODUCTIVITY", "size": 10.0, "type": "Free", "price": 0.0, "contentRating": "Everyone"},
    {"category": "SOCIAL", "size": 50.0, "type": "Free", "price": 0.0, "contentRating": "Teen"},
    {"category": "FINANCE", "size": 20.0, "type": "Free", "price": 0.0, "contentRating": "Everyone"},
]

for i, test in enumerate(test_cases, 1):
    print(f"\n{'='*60}")
    print(f"Test Case {i}: {test['category']} - {test['type']} - ${test['price']}")
    print(f"{'='*60}")
    
    # Prepare input
    input_df = pd.DataFrame({
        'Category': [test['category']],
        'Size': [test['size']],
        'Type': [test['type']],
        'Price': [test['price']],
        'Content Rating': [test['contentRating']]
    })
    
    print(f"Input DataFrame:\n{input_df}")
    
    # Encode
    for col in ['Category', 'Type', 'Content Rating']:
        encoded = encoders[col].transform(input_df[col])
        print(f"{col} encoded: {input_df[col].values[0]} -> {encoded[0]}")
        input_df[col] = encoded
    
    print(f"\nAfter encoding:\n{input_df}")
    
    # Scale
    input_scaled = scaler.transform(input_df)
    print(f"\nAfter scaling:\n{input_scaled}")
    
    # Predict
    prediction = model.predict(input_scaled)[0]
    probabilities = model.predict_proba(input_scaled)[0]
    
    print(f"\nPrediction: {prediction} ({'Hit' if prediction == 1 else 'Flop'})")
    print(f"Probabilities: [Flop: {probabilities[0]:.3f}, Hit: {probabilities[1]:.3f}]")
    print(f"Confidence: {probabilities[1]*100:.1f}%")
    
    # Get neighbors
    distances, indices = model.kneighbors(input_scaled, n_neighbors=6)
    print(f"\nNearest neighbor distances: {distances[0]}")
    print(f"Nearest neighbor indices: {indices[0]}")

print("\n" + "="*60)
print("Checking training data distribution...")
df = pd.read_csv('google_play_store_dataset.csv')
print(f"Total apps: {len(df)}")
print(f"Success=1 (Hits): {(df['Success']==1).sum()} ({(df['Success']==1).sum()/len(df)*100:.1f}%)")
print(f"Success=0 (Flops): {(df['Success']==0).sum()} ({(df['Success']==0).sum()/len(df)*100:.1f}%)")

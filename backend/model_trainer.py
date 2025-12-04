import pandas as pd
import numpy as np
import pickle
import json
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score

def train_and_save_model():
    """
    Train the KNN model using the ALREADY PROCESSED dataset from your notebook.
    No need to redo all the cleaning - just use the cleaned data!
    """
    print("Loading pre-processed dataset...")
    df = pd.read_csv("google_play_store_dataset.csv")
    
    print(f"Dataset shape: {df.shape}")
    print(f"Columns: {list(df.columns)}")
    
    # Verify required columns exist
    required_cols = ['Category', 'Size', 'Type', 'Price', 'Content Rating', 'Installs']
    missing = [col for col in required_cols if col not in df.columns]
    if missing:
        print(f"❌ Error: Missing columns: {missing}")
        print("\nPlease export your cleaned dataframe from the notebook with:")
        print("df.to_csv('google_play_store_dataset.csv', index=False)")
        return None
    
    # Define Success metric (same as in your notebook)
    print("\nDefining success metric...")
    df['Category_Median'] = df.groupby('Category')['Installs'].transform('median')
    df['Success'] = (df['Installs'] > df['Category_Median']).astype(int)
    
    print(f"Success distribution:")
    print(f"  Hits (Success=1): {(df['Success']==1).sum()}")
    print(f"  Flops (Success=0): {(df['Success']==0).sum()}")
    
    # Select features (same 5 features as your notebook)
    features = ['Category', 'Size', 'Type', 'Price', 'Content Rating']
    
    X = df[features].copy()
    y = df['Success']
    
    # Encode categorical variables
    print("\nEncoding categorical features...")
    encoders = {}
    for col in ['Category', 'Type', 'Content Rating']:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col])
        encoders[col] = le
        print(f"  {col}: {len(le.classes_)} unique values")
    
    # Scale the data
    print("\nScaling features...")
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y, test_size=0.2, random_state=42
    )
    print(f"Training set: {len(X_train)} samples")
    print(f"Test set: {len(X_test)} samples")
    
    # Find best K (same as your notebook)
    print("\nFinding optimal K value...")
    scores = []
    k_range = range(1, 21)
    
    for k in k_range:
        knn = KNeighborsClassifier(n_neighbors=k)
        knn.fit(X_train, y_train)
        scores.append(knn.score(X_test, y_test))
    
    best_k = k_range[np.argmax(scores)]
    print(f"✅ Optimal K found: {best_k}")
    
    # Train final model
    print("\nTraining final KNN model...")
    knn_model = KNeighborsClassifier(n_neighbors=best_k)
    knn_model.fit(X_train, y_train)
    
    y_pred = knn_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"✅ Model Accuracy: {accuracy:.1%}")
    
    # Save model components
    print("\nSaving model components...")
    with open('knn_model.pkl', 'wb') as f:
        pickle.dump(knn_model, f)
    print("  ✓ knn_model.pkl")
    
    with open('encoders.pkl', 'wb') as f:
        pickle.dump(encoders, f)
    print("  ✓ encoders.pkl")
    
    with open('scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    print("  ✓ scaler.pkl")
    
    # Save metadata for frontend
    metadata = {
        'categories': sorted(df['Category'].unique().tolist()),
        'types': sorted(df['Type'].unique().tolist()),
        'content_ratings': sorted(df['Content Rating'].unique().tolist()),
        'accuracy': float(accuracy),
        'best_k': int(best_k)
    }
    
    with open('model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    print("  ✓ model_metadata.json")
    
    print("\n🎉 Model training complete!")
    return metadata

if __name__ == "__main__":
    metadata = train_and_save_model()
    if metadata:
        print("\n📊 Model Summary:")
        print(f"  Accuracy: {metadata['accuracy']:.1%}")
        print(f"  Best K: {metadata['best_k']}")
        print(f"  Categories: {len(metadata['categories'])}")
        print(f"  Types: {len(metadata['types'])}")
        print(f"  Content Ratings: {len(metadata['content_ratings'])}")
        print("\n✅ Ready to start the API server with: python app.py")

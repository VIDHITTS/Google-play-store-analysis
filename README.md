# Google Play Store App Success Predictor

A data mining project that predicts the success of Google Play Store applications using K-Nearest Neighbors (KNN) machine learning algorithm.

## 📋 Project Overview

This project analyzes historical Google Play Store data to predict whether a new app will be successful based on its features such as category, size, type, price, and content rating. The system consists of a Flask backend API with a trained KNN model and a React frontend for user interaction.

**Live Demo:** [https://frontend-model.netlify.app](https://frontend-model.netlify.app)

## 🎯 Objectives

- Predict app success using machine learning techniques
- Analyze the relationship between app features and installation counts
- Provide developers with data-driven insights for pre-launch decision making
- Perform sentiment analysis on user reviews to understand user satisfaction

## 📁 Repository Structure

```
├── backend/                    # Flask API server
│   ├── app.py                 # Main API application
│   ├── model_trainer.py       # KNN model training script
│   ├── knn_model.pkl          # Trained KNN model
│   ├── encoders.pkl           # Feature encoders
│   ├── scaler.pkl             # Feature scaler
│   └── requirements.txt       # Python dependencies
│
├── frontend/                   # React web application
│   ├── src/                   # Source files
│   └── package.json           # Node dependencies
│
├── initial_datasets/           # Raw Kaggle datasets
│   ├── googleplaystore.csv
│   └── googleplaystore_user_reviews.csv
│
├── google-play-store-analysis-2.ipynb  # Jupyter notebook with analysis
├── model.csv                   # Processed dataset
└── README.md                   # Project documentation
```

## 🔬 Methodology

### Dataset
- **Source:** Kaggle - Google Play Store Apps dataset
- **Size:** ~10,000 app records
- **Features:** App Name, Category, Rating, Reviews, Size, Installs, Type, Price, Content Rating, Genres

### Data Preprocessing
1. Removed duplicates and handled missing values
2. Normalized size values to MB
3. Converted install counts and prices to numeric format
4. Imputed missing ratings using Random Forest Regressor
5. Applied label encoding for categorical variables
6. Standardized features using Standard Scaler

### Feature Engineering
- Created binary target variable: **Success** (Hit/Flop)
- Definition: App is a "Hit" if installs > category median installs
- Engineered temporal features like `Days_Since_Update`
- Created engagement metrics: `Reviews/Installs` ratio

### Model Training
- **Algorithm:** K-Nearest Neighbors (KNN)
- **Train/Test Split:** 80/20
- **Hyperparameter Tuning:** Tested K values from 1-20
- **Optimal K:** 7 neighbors
- **Accuracy:** ~85%

## � Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

The API will run on `http://localhost:5001`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## � Results

- **Model Accuracy:** 85%
- **Optimal K Value:** 7
- **Key Findings:**
  - Category and install count are strong predictors of success
  - Paid apps tend to have higher ratings than free apps
  - App size shows moderate correlation with success
  - Sentiment analysis reveals bugs and ads are common negative factors

## 🌐 Deployment

- **Frontend:** Deployed on Netlify - [https://frontend-model.netlify.app](https://frontend-model.netlify.app)
- **Backend API:** Deployed on Render - [https://google-play-store-analysis.onrender.com](https://google-play-store-analysis.onrender.com)

## 📄 Documentation

For detailed analysis and methodology, refer to:
- **Project Report:** `report.pdf` (in repository)
- **Analysis Notebook:** `google-play-store-analysis-2.ipynb`

## 👥 Team

**Vidhitt S**  
Google Play Store Analysis Team

## 🙏 Acknowledgments

- Dataset: [Google Play Store Apps - Kaggle](https://www.kaggle.com/datasets)
- Machine Learning: scikit-learn library
- Framework: Flask & React

---

**Data Mining Project - 2024**

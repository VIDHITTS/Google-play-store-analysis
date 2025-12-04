"""
Script to extract the cleaned dataset from the Jupyter notebook
and save it for model training.

Run this script to generate the dataset CSV file needed by the backend.
"""

import pandas as pd
import numpy as np

print("Loading dataset...")

# You need to provide the path to your original dataset
# This should be the same dataset used in your Jupyter notebook
# Common locations:
# - /kaggle/input/google-play-store/google_play_store_dataset.csv
# - ./googleplaystore.csv
# - Downloaded from Kaggle

# For now, let's check if we can find it
import os

possible_paths = [
    "../google_play_store_dataset.csv",
    "./google_play_store_dataset.csv",
    "./googleplaystore.csv",
    "../googleplaystore.csv",
]

dataset_path = None
for path in possible_paths:
    if os.path.exists(path):
        dataset_path = path
        break

if dataset_path:
    print(f"Found dataset at: {dataset_path}")
    df = pd.read_csv(dataset_path)
else:
    print("Dataset not found in common locations.")
    print("\nPlease download the dataset from:")
    print("https://www.kaggle.com/datasets/lava18/google-play-store-apps")
    print("\nOr extract it from your Jupyter notebook by running:")
    print("df.to_csv('google_play_store_dataset.csv', index=False)")
    exit(1)

print(f"Dataset loaded: {df.shape}")
print("\nPerforming basic cleaning...")

# Basic cleaning (same as in notebook)
df = df.drop_duplicates()
print(f"After removing duplicates: {df.shape}")

# Save the dataset
output_file = "google_play_store_dataset.csv"
df.to_csv(output_file, index=False)
print(f"\n✅ Dataset saved as: {output_file}")
print(f"   Rows: {len(df)}")
print(f"   Columns: {len(df.columns)}")
print(f"\nYou can now run: python model_trainer.py")

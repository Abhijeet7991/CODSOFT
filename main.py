#!/usr/bin/env python3
"""
Movie Rating Prediction System
Main script to run the complete analysis and modeling pipeline
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from src.data_loader import DataLoader
from src.data_cleaner import DataCleaner
from src.eda_analyzer import EDAAnalyzer
from src.feature_engineer import FeatureEngineer
from src.ml_models import MovieRatingPredictor
import warnings
warnings.filterwarnings('ignore')

def main():
    """Main function to run the complete pipeline"""
    print("="*60)
    print("MOVIE RATING PREDICTION SYSTEM")
    print("="*60)
    
    # Step 1: Load Data
    print("\n1. LOADING DATA...")
    data_loader = DataLoader('data/IMDb Movies India.csv')
    df = data_loader.load_data()
    
    if df is None:
        print("Failed to load data. Please check the file path.")
        return
    
    # Display data info
    data_loader.get_data_info()
    data_loader.get_basic_stats()
    
    # Step 2: Clean Data
    print("\n2. CLEANING DATA...")
    cleaner = DataCleaner(df)
    df_clean = cleaner.clean_data()
    
    # Display cleaning summary
    summary = cleaner.get_cleaned_summary()
    print(f"\nCleaning Summary:")
    print(f"Final shape: {summary['shape']}")
    print(f"Missing values: {summary['missing_values']}")
    
    # Step 3: Exploratory Data Analysis
    print("\n3. EXPLORATORY DATA ANALYSIS...")
    eda = EDAAnalyzer(df_clean)
    eda_report = eda.generate_comprehensive_report()
    
    # Step 4: Feature Engineering
    print("\n4. FEATURE ENGINEERING...")
    feature_engineer = FeatureEngineer(df_clean)
    df_features = feature_engineer.create_features()
    
    # Prepare data for ML
    X, y = feature_engineer.prepare_for_ml(target_col='rating')
    
    # Step 5: Machine Learning Models
    print("\n5. MACHINE LEARNING MODELING...")
    predictor = MovieRatingPredictor(X, y)
    
    # Train models
    predictor.train_models()
    
    # Evaluate models
    results_df = predictor.evaluate_models()
    
    # Plot comparisons
    predictor.plot_model_comparison()
    predictor.plot_predictions()
    
    # Feature importance
    importance_df = predictor.get_feature_importance()
    
    # Hyperparameter tuning for best model
    print("\n6. HYPERPARAMETER TUNING...")
    predictor.hyperparameter_tuning('Random Forest')
    predictor.hyperparameter_tuning('Gradient Boosting')
    
    # Final evaluation
    final_results = predictor.evaluate_models()
    
    # Step 6: Generate Final Report
    print("\n" + "="*60)
    print("FINAL ANALYSIS REPORT")
    print("="*60)
    
    print(f"\nDataset Summary:")
    print(f"- Total movies analyzed: {len(df_clean):,}")
    print(f"- Features engineered: {X.shape[1]}")
    print(f"- Average rating: {y.mean():.2f}")
    print(f"- Rating standard deviation: {y.std():.2f}")
    
    print(f"\nBest Model Performance:")
    best_model_row = final_results.iloc[0]
    print(f"- Model: {best_model_row['Model']}")
    print(f"- Test R²: {best_model_row['Test R²']:.4f}")
    print(f"- Test RMSE: {best_model_row['Test RMSE']:.4f}")
    print(f"- Test MAE: {best_model_row['Test MAE']:.4f}")
    
    print(f"\nKey Insights:")
    if 'yearly_ratings' in eda_report and eda_report['yearly_ratings'] is not None:
        best_year = eda_report['yearly_ratings'].loc[eda_report['yearly_ratings']['mean'].idxmax()]
        print(f"- Best year for movies: {best_year['year']} (avg rating: {best_year['mean']:.2f})")
    
    print(f"- Model can predict movie ratings with {best_model_row['Test R²']:.1%} accuracy")
    print(f"- Average prediction error: ±{best_model_row['Test RMSE']:.2f} rating points")
    
    print("\n" + "="*60)
    print("ANALYSIS COMPLETED SUCCESSFULLY!")
    print("="*60)
    
    return {
        'cleaned_data': df_clean,
        'features': X,
        'target': y,
        'model_results': final_results,
        'eda_report': eda_report,
        'predictor': predictor
    }

if __name__ == "__main__":
    # Run the complete analysis
    results = main()
    
    # Additional analysis suggestions
    print("\n" + "="*60)
    print("ADDITIONAL ANALYSIS SUGGESTIONS")
    print("="*60)
    
    print("\n1. Future Predictions:")
    print("   - Predict ratings for upcoming movies")
    print("   - Analyze trends in movie preferences")
    print("   - Identify factors that lead to high ratings")
    
    print("\n2. Business Applications:")
    print("   - Help producers understand what makes a successful movie")
    print("   - Assist in movie recommendation systems")
    print("   - Guide investment decisions in film production")
    
    print("\n3. Further Analysis:")
    print("   - Sentiment analysis of movie descriptions")
    print("   - Network analysis of actor-director collaborations")
    print("   - Time series analysis of rating trends")
    print("   - Regional preferences analysis")
    
    print("\n4. Model Improvements:")
    print("   - Ensemble methods combining multiple models")
    print("   - Deep learning approaches")
    print("   - Feature selection optimization")
    print("   - Cross-validation with time-based splits")
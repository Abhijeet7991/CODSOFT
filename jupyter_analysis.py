#!/usr/bin/env python3
"""
Jupyter Notebook Alternative Analysis
Interactive analysis script for movie rating prediction
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

# Set up plotting
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")
plt.rcParams['figure.figsize'] = (12, 8)

def load_and_explore_data():
    """Load and perform initial exploration"""
    print("Loading and exploring data...")
    
    # Load data
    loader = DataLoader('data/IMDb Movies India.csv')
    df = loader.load_data()
    
    if df is None:
        print("Error: Could not load data file")
        return None
    
    # Basic info
    loader.get_data_info()
    
    return df

def clean_and_preprocess(df):
    """Clean and preprocess the data"""
    print("\nCleaning and preprocessing data...")
    
    cleaner = DataCleaner(df)
    df_clean = cleaner.clean_data()
    
    print(f"Cleaned data shape: {df_clean.shape}")
    print(f"Columns: {list(df_clean.columns)}")
    
    return df_clean

def perform_eda(df):
    """Perform comprehensive EDA"""
    print("\nPerforming Exploratory Data Analysis...")
    
    analyzer = EDAAnalyzer(df)
    
    # Generate comprehensive report
    report = analyzer.generate_comprehensive_report()
    
    return report

def build_and_evaluate_models(df):
    """Build and evaluate ML models"""
    print("\nBuilding and evaluating machine learning models...")
    
    # Feature engineering
    engineer = FeatureEngineer(df)
    df_features = engineer.create_features()
    X, y = engineer.prepare_for_ml()
    
    # Build models
    predictor = MovieRatingPredictor(X, y)
    predictor.train_models()
    
    # Evaluate
    results = predictor.evaluate_models()
    
    # Visualizations
    predictor.plot_model_comparison()
    predictor.plot_predictions()
    
    # Feature importance
    importance = predictor.get_feature_importance()
    
    return predictor, results, importance

def generate_insights(df, eda_report, model_results):
    """Generate key insights and recommendations"""
    print("\n" + "="*50)
    print("KEY INSIGHTS AND RECOMMENDATIONS")
    print("="*50)
    
    # Data insights
    print(f"\n1. DATASET OVERVIEW:")
    print(f"   - Total movies: {len(df):,}")
    print(f"   - Average rating: {df['rating'].mean():.2f}")
    print(f"   - Rating range: {df['rating'].min():.1f} - {df['rating'].max():.1f}")
    
    # Year insights
    if 'yearly_ratings' in eda_report and eda_report['yearly_ratings'] is not None:
        yearly_data = eda_report['yearly_ratings']
        best_year = yearly_data.loc[yearly_data['mean'].idxmax()]
        print(f"\n2. TEMPORAL INSIGHTS:")
        print(f"   - Best year for movies: {best_year['year']} (avg: {best_year['mean']:.2f})")
        print(f"   - Most productive year: {yearly_data.loc[yearly_data['count'].idxmax(), 'year']}")
    
    # Genre insights
    if 'genre_analysis' in eda_report and len(eda_report['genre_analysis']) > 0:
        print(f"\n3. GENRE INSIGHTS:")
        top_genre = eda_report['genre_analysis'].iloc[0]
        print(f"   - Highest rated genre: {top_genre.name if hasattr(top_genre, 'name') else 'N/A'}")
    
    # Model insights
    print(f"\n4. MODEL PERFORMANCE:")
    best_model = model_results.iloc[0]
    print(f"   - Best model: {best_model['Model']}")
    print(f"   - Prediction accuracy (R²): {best_model['Test R²']:.1%}")
    print(f"   - Average error (RMSE): ±{best_model['Test RMSE']:.2f} points")
    
    # Recommendations
    print(f"\n5. RECOMMENDATIONS:")
    print(f"   - Focus on factors that correlate with high ratings")
    print(f"   - Consider ensemble methods for better predictions")
    print(f"   - Collect more recent data for trend analysis")
    print(f"   - Include additional features like budget, box office")

def interactive_analysis():
    """Run interactive analysis"""
    print("="*60)
    print("INTERACTIVE MOVIE RATING ANALYSIS")
    print("="*60)
    
    # Step 1: Load data
    df = load_and_explore_data()
    if df is None:
        return
    
    # Step 2: Clean data
    df_clean = clean_and_preprocess(df)
    
    # Step 3: EDA
    eda_report = perform_eda(df_clean)
    
    # Step 4: ML Models
    predictor, model_results, importance = build_and_evaluate_models(df_clean)
    
    # Step 5: Insights
    generate_insights(df_clean, eda_report, model_results)
    
    return {
        'data': df_clean,
        'eda_report': eda_report,
        'model_results': model_results,
        'predictor': predictor,
        'feature_importance': importance
    }

if __name__ == "__main__":
    # Run interactive analysis
    results = interactive_analysis()
    
    print("\n" + "="*60)
    print("ANALYSIS COMPLETE!")
    print("="*60)
    print("\nYou can now:")
    print("1. Examine the results dictionary for detailed outputs")
    print("2. Use the trained models for predictions")
    print("3. Explore additional visualizations")
    print("4. Extend the analysis with new features")
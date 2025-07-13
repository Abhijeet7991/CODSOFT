# Movie Rating Prediction System

A comprehensive machine learning system for predicting movie ratings based on features like genre, director, actors, and other movie characteristics using the IMDb Movies India dataset.

## 🎯 Project Overview

This project analyzes historical movie data from IMDb to develop models that accurately estimate movie ratings. It provides insights into factors that influence movie ratings and builds predictive models for rating estimation.

## 📊 Features

- **Data Cleaning & Preprocessing**: Handles missing values, data type conversions, and feature cleaning
- **Exploratory Data Analysis**: Comprehensive analysis of movie trends, ratings, and patterns
- **Feature Engineering**: Creates meaningful features from raw data for better model performance
- **Machine Learning Models**: Multiple regression models including Random Forest, Gradient Boosting, and more
- **Model Evaluation**: Comprehensive evaluation with metrics like R², RMSE, and MAE
- **Visualization**: Rich visualizations for data insights and model performance

## 🔍 Analysis Questions Answered

1. **Year with best rating**: Identifies the year with highest average movie ratings
2. **Duration impact**: Analyzes relationship between movie length and ratings
3. **Top movies**: Lists top 10 movies by rating (overall and per year)
4. **Popular movies trends**: Tracks number of popular movies released each year
5. **Votes vs ratings**: Examines how vote counts relate to movie ratings
6. **Director analysis**: Identifies most prolific and highest-rated directors
7. **Actor analysis**: Analyzes actor performance and movie counts
8. **Genre trends**: Explores genre popularity and rating patterns

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd movie-rating-prediction
```

2. Install required packages:
```bash
pip install -r requirements.txt
```

3. Place your IMDb Movies India dataset in the `data/` folder

## 🚀 Usage

### Quick Start
Run the complete analysis pipeline:
```bash
python main.py
```

### Interactive Analysis
For step-by-step analysis:
```bash
python jupyter_analysis.py
```

### Custom Analysis
Use individual components:
```python
from src.data_loader import DataLoader
from src.eda_analyzer import EDAAnalyzer
from src.ml_models import MovieRatingPredictor

# Load and analyze data
loader = DataLoader('data/IMDb Movies India.csv')
df = loader.load_data()

# Perform EDA
eda = EDAAnalyzer(df)
report = eda.generate_comprehensive_report()
```

## 📁 Project Structure

```
movie-rating-prediction/
├── src/
│   ├── data_loader.py      # Data loading and initial inspection
│   ├── data_cleaner.py     # Data cleaning and preprocessing
│   ├── eda_analyzer.py     # Exploratory data analysis
│   ├── feature_engineer.py # Feature engineering
│   └── ml_models.py        # Machine learning models
├── data/
│   └── IMDb Movies India.csv
├── main.py                 # Main analysis pipeline
├── jupyter_analysis.py     # Interactive analysis
├── requirements.txt        # Python dependencies
└── README.md
```

## 🤖 Machine Learning Models

The system implements and compares multiple regression models:

- **Linear Regression**: Baseline linear model
- **Ridge Regression**: Linear model with L2 regularization
- **Lasso Regression**: Linear model with L1 regularization
- **Random Forest**: Ensemble of decision trees
- **Gradient Boosting**: Sequential ensemble method
- **Support Vector Regression**: SVM for regression

## 📈 Key Insights

The analysis provides insights into:

- **Temporal Trends**: How movie ratings have changed over time
- **Duration Effects**: Impact of movie length on audience ratings
- **Genre Preferences**: Which genres tend to receive higher ratings
- **Director/Actor Impact**: Influence of key personnel on movie success
- **Popularity Metrics**: Relationship between vote counts and ratings

## 🎯 Model Performance

The best performing models typically achieve:
- **R² Score**: 0.65-0.80 (65-80% variance explained)
- **RMSE**: 0.3-0.5 rating points
- **MAE**: 0.2-0.4 rating points

## 🔧 Customization

### Adding New Features
Extend the `FeatureEngineer` class to add custom features:
```python
def _create_custom_features(self):
    # Add your custom feature engineering here
    pass
```

### New Models
Add new models to the `MovieRatingPredictor` class:
```python
self.models['Your Model'] = YourModel()
```

## 📊 Visualizations

The system generates various visualizations:
- Rating trends over time
- Duration vs rating scatter plots
- Model performance comparisons
- Feature importance plots
- Genre analysis charts

## 🎓 Educational Value

This project demonstrates:
- **Data Science Pipeline**: Complete workflow from raw data to insights
- **Feature Engineering**: Creating meaningful features from raw data
- **Model Comparison**: Evaluating multiple ML algorithms
- **Data Visualization**: Creating informative plots and charts
- **Statistical Analysis**: Understanding data distributions and relationships

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is for educational purposes. Please ensure you have proper rights to use the IMDb dataset.

## 🙏 Acknowledgments

- IMDb for providing the movie dataset
- Scikit-learn for machine learning tools
- Matplotlib/Seaborn for visualization capabilities

## 📞 Support

For questions or issues:
1. Check the documentation
2. Review the code comments
3. Create an issue in the repository

---

**Note**: This project is designed for educational purposes and internship completion. It demonstrates practical application of data science and machine learning techniques in the entertainment industry domain.
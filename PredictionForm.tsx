import React, { useState } from 'react';
import { User, Ship, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { TitanicPassenger, PredictionResult } from '../types/titanic';
import { DataProcessor } from '../utils/dataProcessor';
import { LogisticRegression, RandomForest } from '../utils/mlModels';

interface PredictionFormProps {
  model: LogisticRegression | RandomForest | null;
  modelType: string;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({ model, modelType }) => {
  const [formData, setFormData] = useState({
    name: '',
    pclass: 3,
    sex: 'male',
    age: 30,
    sibsp: 0,
    parch: 0,
    fare: 15,
    embarked: 'S'
  });
  
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pclass' || name === 'age' || name === 'sibsp' || name === 'parch' || name === 'fare'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handlePredict = async () => {
    if (!model) return;
    
    setIsLoading(true);
    
    try {
      // Create passenger object
      const passenger: TitanicPassenger = {
        PassengerId: 999,
        Pclass: formData.pclass,
        Name: formData.name || "Unknown, Mr. John",
        Sex: formData.sex,
        Age: formData.age,
        SibSp: formData.sibsp,
        Parch: formData.parch,
        Ticket: "PREDICT",
        Fare: formData.fare,
        Embarked: formData.embarked
      };

      // Process the passenger data
      const processed = DataProcessor.processPassengers([passenger]);
      const normalized = DataProcessor.normalizeFeatures(processed);
      
      // Make prediction
      const result = model.predict(normalized[0]);
      setPrediction(result);
      
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'High': return 'text-green-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <User className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Survival Prediction</h2>
      </div>

      {!model ? (
        <div className="text-center py-8">
          <Ship className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Model Available</h3>
          <p className="text-gray-500">
            Please train a model first to make predictions
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-900">
                Using {modelType === 'logistic' ? 'Logistic Regression' : 'Random Forest'} model
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passenger Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Smith, Mr. John"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passenger Class
                </label>
                <select
                  name="pclass"
                  value={formData.pclass}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={1}>1st Class</option>
                  <option value={2}>2nd Class</option>
                  <option value={3}>3rd Class</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="sex"
                  value={formData.sex}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Siblings/Spouses Aboard
                </label>
                <input
                  type="number"
                  name="sibsp"
                  value={formData.sibsp}
                  onChange={handleInputChange}
                  min="0"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parents/Children Aboard
                </label>
                <input
                  type="number"
                  name="parch"
                  value={formData.parch}
                  onChange={handleInputChange}
                  min="0"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fare (£)
                </label>
                <input
                  type="number"
                  name="fare"
                  value={formData.fare}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Port of Embarkation
                </label>
                <select
                  name="embarked"
                  value={formData.embarked}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="C">Cherbourg</option>
                  <option value="Q">Queenstown</option>
                  <option value="S">Southampton</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handlePredict}
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Predicting...
              </>
            ) : (
              'Predict Survival'
            )}
          </button>

          {prediction && (
            <div className={`p-6 rounded-lg border-2 ${
              prediction.survived 
                ? 'border-green-200 bg-green-50' 
                : 'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-center mb-4">
                {prediction.survived ? (
                  <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-600 mr-3" />
                )}
                <div>
                  <h3 className={`text-lg font-semibold ${
                    prediction.survived ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {prediction.survived ? 'Likely to Survive' : 'Unlikely to Survive'}
                  </h3>
                  <p className={`text-sm ${
                    prediction.survived ? 'text-green-700' : 'text-red-700'
                  }`}>
                    Probability: {(prediction.probability * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Confidence Level:</span>
                  <span className={`ml-2 font-semibold ${getConfidenceColor(prediction.confidence)}`}>
                    {prediction.confidence}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Model Used:</span>
                  <span className="ml-2 text-gray-900">
                    {modelType === 'logistic' ? 'Logistic Regression' : 'Random Forest'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

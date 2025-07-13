import React, { useState, useEffect } from 'react';
import { TitanicPassenger, ProcessedPassenger, ModelMetrics } from '../types/titanic';
import { DataProcessor } from '../utils/dataProcessor';
import { LogisticRegression, RandomForest } from '../utils/mlModels';
import { Brain, Zap, Target, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

interface ModelTrainingProps {
  data: TitanicPassenger[];
  onModelTrained: (model: LogisticRegression | RandomForest, modelType: string) => void;
}

export const ModelTraining: React.FC<ModelTrainingProps> = ({ data, onModelTrained }) => {
  const [isTraining, setIsTraining] = useState(false);
  const [trainedModels, setTrainedModels] = useState<{
    logistic?: { model: LogisticRegression; metrics: ModelMetrics };
    randomForest?: { model: RandomForest; metrics: ModelMetrics };
  }>({});
  const [selectedModel, setSelectedModel] = useState<'logistic' | 'randomForest'>('logistic');

  const trainModels = async () => {
    setIsTraining(true);
    
    try {
      // Process the data
      const processedData = DataProcessor.processPassengers(data);
      const normalizedData = DataProcessor.normalizeFeatures(processedData);
      
      // Filter out data without survival information for training
      const trainingData = normalizedData.filter(p => p.Survived !== undefined);
      
      if (trainingData.length === 0) {
        throw new Error('No training data available. Please ensure your dataset includes survival information.');
      }

      // Split data (80% train, 20% test)
      const shuffled = [...trainingData].sort(() => Math.random() - 0.5);
      const splitIndex = Math.floor(shuffled.length * 0.8);
      const trainSet = shuffled.slice(0, splitIndex);
      const testSet = shuffled.slice(splitIndex);

      // Train Logistic Regression
      const logisticModel = new LogisticRegression();
      logisticModel.train(trainSet);
      const logisticMetrics = logisticModel.evaluate(testSet);

      // Train Random Forest
      const randomForestModel = new RandomForest();
      randomForestModel.train(trainSet);
      const randomForestMetrics = randomForestModel.evaluate(testSet);

      setTrainedModels({
        logistic: { model: logisticModel, metrics: logisticMetrics },
        randomForest: { model: randomForestModel, metrics: randomForestMetrics }
      });

      // Select the best model by default
      const bestModel = logisticMetrics.accuracy > randomForestMetrics.accuracy ? 'logistic' : 'randomForest';
      setSelectedModel(bestModel);
      
    } catch (error) {
      console.error('Training failed:', error);
    } finally {
      setIsTraining(false);
    }
  };

  const handleModelSelection = (modelType: 'logistic' | 'randomForest') => {
    setSelectedModel(modelType);
    const selectedModelData = trainedModels[modelType];
    if (selectedModelData) {
      onModelTrained(selectedModelData.model, modelType);
    }
  };

  useEffect(() => {
    if (trainedModels[selectedModel]) {
      onModelTrained(trainedModels[selectedModel]!.model, selectedModel);
    }
  }, [selectedModel, trainedModels, onModelTrained]);

  const formatMetric = (value: number) => (value * 100).toFixed(1) + '%';

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Brain className="h-6 w-6 text-indigo-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Model Training</h2>
        </div>
        
        <button
          onClick={trainModels}
          disabled={isTraining || data.length === 0}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isTraining ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Training...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Train Models
            </>
          )}
        </button>
      </div>

      {isTraining && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
            <div>
              <p className="text-sm font-medium text-blue-900">Training machine learning models...</p>
              <p className="text-xs text-blue-700">This may take a few moments</p>
            </div>
          </div>
        </div>
      )}

      {Object.keys(trainedModels).length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-900">Models trained successfully!</span>
          </div>

          {/* Model Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainedModels.logistic && (
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedModel === 'logistic'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleModelSelection('logistic')}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">Logistic Regression</h3>
                  {selectedModel === 'logistic' && (
                    <CheckCircle className="h-5 w-5 text-indigo-600" />
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="font-medium">{formatMetric(trainedModels.logistic.metrics.accuracy)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precision:</span>
                    <span className="font-medium">{formatMetric(trainedModels.logistic.metrics.precision)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recall:</span>
                    <span className="font-medium">{formatMetric(trainedModels.logistic.metrics.recall)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">F1-Score:</span>
                    <span className="font-medium">{formatMetric(trainedModels.logistic.metrics.f1Score)}</span>
                  </div>
                </div>
              </div>
            )}

            {trainedModels.randomForest && (
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedModel === 'randomForest'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleModelSelection('randomForest')}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">Random Forest</h3>
                  {selectedModel === 'randomForest' && (
                    <CheckCircle className="h-5 w-5 text-indigo-600" />
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="font-medium">{formatMetric(trainedModels.randomForest.metrics.accuracy)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precision:</span>
                    <span className="font-medium">{formatMetric(trainedModels.randomForest.metrics.precision)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recall:</span>
                    <span className="font-medium">{formatMetric(trainedModels.randomForest.metrics.recall)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">F1-Score:</span>
                    <span className="font-medium">{formatMetric(trainedModels.randomForest.metrics.f1Score)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confusion Matrix */}
          {trainedModels[selectedModel] && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confusion Matrix - {selectedModel === 'logistic' ? 'Logistic Regression' : 'Random Forest'}</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-2 max-w-xs">
                  <div></div>
                  <div className="text-center text-sm font-medium text-gray-700">Predicted No</div>
                  <div className="text-center text-sm font-medium text-gray-700">Predicted Yes</div>
                  
                  <div className="text-sm font-medium text-gray-700">Actual No</div>
                  <div className="bg-white p-3 rounded text-center font-medium">
                    {trainedModels[selectedModel]!.metrics.confusionMatrix[0][0]}
                  </div>
                  <div className="bg-white p-3 rounded text-center font-medium">
                    {trainedModels[selectedModel]!.metrics.confusionMatrix[0][1]}
                  </div>
                  
                  <div className="text-sm font-medium text-gray-700">Actual Yes</div>
                  <div className="bg-white p-3 rounded text-center font-medium">
                    {trainedModels[selectedModel]!.metrics.confusionMatrix[1][0]}
                  </div>
                  <div className="bg-white p-3 rounded text-center font-medium">
                    {trainedModels[selectedModel]!.metrics.confusionMatrix[1][1]}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!isTraining && Object.keys(trainedModels).length === 0 && (
        <div className="text-center py-8">
          <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Train</h3>
          <p className="text-gray-500 mb-4">
            Click "Train Models" to build machine learning models for survival prediction
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Training Process:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Data preprocessing and feature engineering</li>
                  <li>Training Logistic Regression and Random Forest models</li>
                  <li>Model evaluation and comparison</li>
                  <li>Hyperparameter optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

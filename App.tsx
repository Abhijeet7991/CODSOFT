import React, { useState } from 'react';
import { Ship, Database, Brain, User, BarChart3 } from 'lucide-react';
import { TitanicPassenger } from './types/titanic';
import { DataUpload } from './components/DataUpload';
import { DataAnalysis } from './components/DataAnalysis';
import { ModelTraining } from './components/ModelTraining';
import { PredictionForm } from './components/PredictionForm';
import { LogisticRegression, RandomForest } from './utils/mlModels';

type TabType = 'upload' | 'analysis' | 'training' | 'prediction';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [data, setData] = useState<TitanicPassenger[]>([]);
  const [trainedModel, setTrainedModel] = useState<LogisticRegression | RandomForest | null>(null);
  const [modelType, setModelType] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleDataLoaded = (newData: TitanicPassenger[]) => {
    setData(newData);
    setError('');
    setActiveTab('analysis');
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleModelTrained = (model: LogisticRegression | RandomForest, type: string) => {
    setTrainedModel(model);
    setModelType(type);
  };

  const tabs = [
    { id: 'upload', name: 'Data Upload', icon: Database, disabled: false },
    { id: 'analysis', name: 'Analysis', icon: BarChart3, disabled: data.length === 0 },
    { id: 'training', name: 'Model Training', icon: Brain, disabled: data.length === 0 },
    { id: 'prediction', name: 'Prediction', icon: User, disabled: !trainedModel },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Ship className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Titanic Survival Prediction</h1>
                <p className="text-sm text-gray-500">Machine Learning Analysis & Prediction System</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {data.length > 0 && `${data.length} passengers loaded`}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id as TabType)}
                  disabled={tab.disabled}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : tab.disabled
                      ? 'border-transparent text-gray-400 cursor-not-allowed'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' && (
          <DataUpload onDataLoaded={handleDataLoaded} onError={handleError} />
        )}
        
        {activeTab === 'analysis' && data.length > 0 && (
          <DataAnalysis data={data} />
        )}
        
        {activeTab === 'training' && data.length > 0 && (
          <ModelTraining data={data} onModelTrained={handleModelTrained} />
        )}
        
        {activeTab === 'prediction' && (
          <PredictionForm model={trainedModel} modelType={modelType} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Titanic Survival Prediction System - Built with React, TypeScript & Machine Learning</p>
            <p className="mt-1">Dataset acknowledgment: Kaggle Titanic Competition</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

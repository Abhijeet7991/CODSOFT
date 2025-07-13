import React, { useCallback } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { TitanicPassenger } from '../types/titanic';
import { CSVParser } from '../utils/csvParser';

interface DataUploadProps {
  onDataLoaded: (data: TitanicPassenger[]) => void;
  onError: (error: string) => void;
}

export const DataUpload: React.FC<DataUploadProps> = ({ onDataLoaded, onError }) => {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      onError('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string;
        const data = CSVParser.parseCSV(csvText);
        
        if (data.length === 0) {
          onError('The CSV file appears to be empty');
          return;
        }

        // Validate required columns
        const requiredColumns = ['PassengerId', 'Pclass', 'Name', 'Sex', 'Age', 'SibSp', 'Parch', 'Fare', 'Embarked'];
        const firstRow = data[0];
        const missingColumns = requiredColumns.filter(col => !(col in firstRow));
        
        if (missingColumns.length > 0) {
          onError(`Missing required columns: ${missingColumns.join(', ')}`);
          return;
        }

        onDataLoaded(data);
      } catch (error) {
        onError('Error parsing CSV file. Please check the file format.');
      }
    };

    reader.onerror = () => {
      onError('Error reading file');
    };

    reader.readAsText(file);
  }, [onDataLoaded, onError]);

  const handleUseSampleData = () => {
    const sampleData = CSVParser.generateSampleData();
    onDataLoaded(sampleData);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Titanic Dataset</h3>
        <p className="text-sm text-gray-500 mb-6">
          Upload a CSV file containing passenger data to begin analysis
        </p>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="mx-auto flex max-w-lg justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10 hover:border-gray-400 transition-colors">
                <div className="text-center">
                  <FileText className="mx-auto h-8 w-8 text-gray-400" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <span className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 hover:text-indigo-500">
                      Upload a file
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">CSV files only</p>
                </div>
              </div>
            </label>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              accept=".csv"
              onChange={handleFileUpload}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">or</span>
            </div>
          </div>
          
          <button
            onClick={handleUseSampleData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <FileText className="mr-2 h-4 w-4" />
            Use Sample Data
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-700 text-left">
              <p className="font-medium mb-1">Expected CSV Format:</p>
              <p>PassengerId, Survived, Pclass, Name, Sex, Age, SibSp, Parch, Ticket, Fare, Cabin, Embarked</p>
              <p className="mt-2 text-xs">
                The 'Survived' column is optional for prediction-only datasets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

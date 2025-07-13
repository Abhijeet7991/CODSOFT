import React from 'react';
import { TitanicPassenger } from '../types/titanic';
import { BarChart3, Users, Percent, TrendingUp } from 'lucide-react';

interface DataAnalysisProps {
  data: TitanicPassenger[];
}

export const DataAnalysis: React.FC<DataAnalysisProps> = ({ data }) => {
  const totalPassengers = data.length;
  const survivedCount = data.filter(p => p.Survived === 1).length;
  const survivalRate = totalPassengers > 0 ? (survivedCount / totalPassengers * 100).toFixed(1) : '0';
  
  const classSurvival = [1, 2, 3].map(pclass => {
    const classPassengers = data.filter(p => p.Pclass === pclass);
    const classSurvived = classPassengers.filter(p => p.Survived === 1).length;
    return {
      class: pclass,
      total: classPassengers.length,
      survived: classSurvived,
      rate: classPassengers.length > 0 ? (classSurvived / classPassengers.length * 100).toFixed(1) : '0'
    };
  });

  const genderSurvival = ['male', 'female'].map(gender => {
    const genderPassengers = data.filter(p => p.Sex === gender);
    const genderSurvived = genderPassengers.filter(p => p.Survived === 1).length;
    return {
      gender,
      total: genderPassengers.length,
      survived: genderSurvived,
      rate: genderPassengers.length > 0 ? (genderSurvived / genderPassengers.length * 100).toFixed(1) : '0'
    };
  });

  const ageGroups = [
    { name: 'Children (0-12)', min: 0, max: 12 },
    { name: 'Teenagers (13-19)', min: 13, max: 19 },
    { name: 'Adults (20-59)', min: 20, max: 59 },
    { name: 'Elderly (60+)', min: 60, max: 150 }
  ].map(group => {
    const groupPassengers = data.filter(p => p.Age !== null && p.Age >= group.min && p.Age <= group.max);
    const groupSurvived = groupPassengers.filter(p => p.Survived === 1).length;
    return {
      ...group,
      total: groupPassengers.length,
      survived: groupSurvived,
      rate: groupPassengers.length > 0 ? (groupSurvived / groupPassengers.length * 100).toFixed(1) : '0'
    };
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <BarChart3 className="h-6 w-6 text-indigo-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-900">Data Analysis</h2>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Passengers</p>
              <p className="text-2xl font-semibold text-gray-900">{totalPassengers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Survived</p>
              <p className="text-2xl font-semibold text-gray-900">{survivedCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center">
            <Percent className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Survival Rate</p>
              <p className="text-2xl font-semibold text-gray-900">{survivalRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Survival by Class */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Survival by Passenger Class</h3>
        <div className="space-y-3">
          {classSurvival.map(item => (
            <div key={item.class} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900 w-16">
                  Class {item.class}
                </span>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{item.survived}/{item.total} survived</span>
                    <span>{item.rate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Survival by Gender */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Survival by Gender</h3>
        <div className="space-y-3">
          {genderSurvival.map(item => (
            <div key={item.gender} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900 w-16 capitalize">
                  {item.gender}
                </span>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{item.survived}/{item.total} survived</span>
                    <span>{item.rate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        item.gender === 'female' ? 'bg-pink-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Survival by Age Group */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Survival by Age Group</h3>
        <div className="space-y-3">
          {ageGroups.map(item => (
            <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900 w-32">
                  {item.name}
                </span>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{item.survived}/{item.total} survived</span>
                    <span>{item.rate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${item.rate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

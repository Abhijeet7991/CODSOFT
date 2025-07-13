export interface TitanicPassenger {
  PassengerId: number;
  Survived?: number;
  Pclass: number;
  Name: string;
  Sex: string;
  Age: number | null;
  SibSp: number;
  Parch: number;
  Ticket: string;
  Fare: number | null;
  Cabin?: string;
  Embarked: string;
}

export interface ProcessedPassenger {
  PassengerId: number;
  Survived?: number;
  Pclass: number;
  Sex_male: number;
  Age: number;
  SibSp: number;
  Parch: number;
  Fare: number;
  Embarked_Q: number;
  Embarked_S: number;
  FamilySize: number;
  IsAlone: number;
  Title_Master: number;
  Title_Miss: number;
  Title_Mr: number;
  Title_Mrs: number;
  Title_Other: number;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: number[][];
}

export interface PredictionResult {
  survived: boolean;
  probability: number;
  confidence: 'Low' | 'Medium' | 'High';
}

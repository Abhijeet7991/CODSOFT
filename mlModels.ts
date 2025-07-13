import { ProcessedPassenger, ModelMetrics, PredictionResult } from '../types/titanic';

export class LogisticRegression {
  private weights: number[] = [];
  private bias: number = 0;
  private learningRate: number = 0.01;
  private iterations: number = 1000;

  private sigmoid(z: number): number {
    return 1 / (1 + Math.exp(-Math.max(-250, Math.min(250, z))));
  }

  private getFeatures(passenger: ProcessedPassenger): number[] {
    return [
      passenger.Pclass,
      passenger.Sex_male,
      passenger.Age,
      passenger.SibSp,
      passenger.Parch,
      passenger.Fare,
      passenger.Embarked_Q,
      passenger.Embarked_S,
      passenger.FamilySize,
      passenger.IsAlone,
      passenger.Title_Master,
      passenger.Title_Miss,
      passenger.Title_Mr,
      passenger.Title_Mrs,
      passenger.Title_Other,
    ];
  }

  train(data: ProcessedPassenger[]): void {
    const features = data.map(d => this.getFeatures(d));
    const labels = data.map(d => d.Survived!);
    const m = data.length;
    const n = features[0].length;

    // Initialize weights
    this.weights = new Array(n).fill(0);
    this.bias = 0;

    // Gradient descent
    for (let iter = 0; iter < this.iterations; iter++) {
      const predictions = features.map(f => {
        const z = f.reduce((sum, val, i) => sum + val * this.weights[i], this.bias);
        return this.sigmoid(z);
      });

      // Calculate gradients
      const dw = new Array(n).fill(0);
      let db = 0;

      for (let i = 0; i < m; i++) {
        const error = predictions[i] - labels[i];
        db += error;
        for (let j = 0; j < n; j++) {
          dw[j] += error * features[i][j];
        }
      }

      // Update weights
      for (let j = 0; j < n; j++) {
        this.weights[j] -= (this.learningRate * dw[j]) / m;
      }
      this.bias -= (this.learningRate * db) / m;
    }
  }

  predict(passenger: ProcessedPassenger): PredictionResult {
    const features = this.getFeatures(passenger);
    const z = features.reduce((sum, val, i) => sum + val * this.weights[i], this.bias);
    const probability = this.sigmoid(z);
    
    let confidence: 'Low' | 'Medium' | 'High';
    if (probability > 0.8 || probability < 0.2) {
      confidence = 'High';
    } else if (probability > 0.65 || probability < 0.35) {
      confidence = 'Medium';
    } else {
      confidence = 'Low';
    }

    return {
      survived: probability > 0.5,
      probability,
      confidence,
    };
  }

  evaluate(testData: ProcessedPassenger[]): ModelMetrics {
    const predictions = testData.map(d => this.predict(d));
    const actual = testData.map(d => d.Survived!);
    
    let tp = 0, tn = 0, fp = 0, fn = 0;
    
    predictions.forEach((pred, i) => {
      if (pred.survived && actual[i] === 1) tp++;
      else if (!pred.survived && actual[i] === 0) tn++;
      else if (pred.survived && actual[i] === 0) fp++;
      else if (!pred.survived && actual[i] === 1) fn++;
    });

    const accuracy = (tp + tn) / (tp + tn + fp + fn);
    const precision = tp / (tp + fp) || 0;
    const recall = tp / (tp + fn) || 0;
    const f1Score = 2 * (precision * recall) / (precision + recall) || 0;

    return {
      accuracy,
      precision,
      recall,
      f1Score,
      confusionMatrix: [[tn, fp], [fn, tp]],
    };
  }
}

export class RandomForest {
  private trees: DecisionTree[] = [];
  private numTrees: number = 100;
  private maxDepth: number = 10;
  private minSamplesSplit: number = 2;

  train(data: ProcessedPassenger[]): void {
    this.trees = [];
    
    for (let i = 0; i < this.numTrees; i++) {
      // Bootstrap sampling
      const bootstrapData = [];
      for (let j = 0; j < data.length; j++) {
        const randomIndex = Math.floor(Math.random() * data.length);
        bootstrapData.push(data[randomIndex]);
      }
      
      const tree = new DecisionTree(this.maxDepth, this.minSamplesSplit);
      tree.train(bootstrapData);
      this.trees.push(tree);
    }
  }

  predict(passenger: ProcessedPassenger): PredictionResult {
    const predictions = this.trees.map(tree => tree.predict(passenger));
    const survivedCount = predictions.filter(p => p.survived).length;
    const probability = survivedCount / this.trees.length;
    
    let confidence: 'Low' | 'Medium' | 'High';
    if (probability > 0.8 || probability < 0.2) {
      confidence = 'High';
    } else if (probability > 0.65 || probability < 0.35) {
      confidence = 'Medium';
    } else {
      confidence = 'Low';
    }

    return {
      survived: probability > 0.5,
      probability,
      confidence,
    };
  }

  evaluate(testData: ProcessedPassenger[]): ModelMetrics {
    const predictions = testData.map(d => this.predict(d));
    const actual = testData.map(d => d.Survived!);
    
    let tp = 0, tn = 0, fp = 0, fn = 0;
    
    predictions.forEach((pred, i) => {
      if (pred.survived && actual[i] === 1) tp++;
      else if (!pred.survived && actual[i] === 0) tn++;
      else if (pred.survived && actual[i] === 0) fp++;
      else if (!pred.survived && actual[i] === 1) fn++;
    });

    const accuracy = (tp + tn) / (tp + tn + fp + fn);
    const precision = tp / (tp + fp) || 0;
    const recall = tp / (tp + fn) || 0;
    const f1Score = 2 * (precision * recall) / (precision + recall) || 0;

    return {
      accuracy,
      precision,
      recall,
      f1Score,
      confusionMatrix: [[tn, fp], [fn, tp]],
    };
  }
}

class DecisionTree {
  private root: TreeNode | null = null;

  constructor(
    private maxDepth: number = 10,
    private minSamplesSplit: number = 2
  ) {}

  private getFeatures(passenger: ProcessedPassenger): number[] {
    return [
      passenger.Pclass,
      passenger.Sex_male,
      passenger.Age,
      passenger.SibSp,
      passenger.Parch,
      passenger.Fare,
      passenger.Embarked_Q,
      passenger.Embarked_S,
      passenger.FamilySize,
      passenger.IsAlone,
      passenger.Title_Master,
      passenger.Title_Miss,
      passenger.Title_Mr,
      passenger.Title_Mrs,
      passenger.Title_Other,
    ];
  }

  private calculateGini(labels: number[]): number {
    if (labels.length === 0) return 0;
    
    const counts = labels.reduce((acc, label) => {
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    let gini = 1;
    for (const count of Object.values(counts)) {
      const prob = count / labels.length;
      gini -= prob * prob;
    }
    
    return gini;
  }

  private findBestSplit(data: ProcessedPassenger[]): { featureIndex: number; threshold: number; gain: number } | null {
    if (data.length < this.minSamplesSplit) return null;
    
    const features = data.map(d => this.getFeatures(d));
    const labels = data.map(d => d.Survived!);
    const numFeatures = features[0].length;
    
    let bestGain = 0;
    let bestFeatureIndex = -1;
    let bestThreshold = 0;
    
    const parentGini = this.calculateGini(labels);
    
    for (let featureIndex = 0; featureIndex < numFeatures; featureIndex++) {
      const values = features.map(f => f[featureIndex]);
      const uniqueValues = [...new Set(values)].sort((a, b) => a - b);
      
      for (let i = 0; i < uniqueValues.length - 1; i++) {
        const threshold = (uniqueValues[i] + uniqueValues[i + 1]) / 2;
        
        const leftIndices: number[] = [];
        const rightIndices: number[] = [];
        
        values.forEach((value, index) => {
          if (value <= threshold) {
            leftIndices.push(index);
          } else {
            rightIndices.push(index);
          }
        });
        
        if (leftIndices.length === 0 || rightIndices.length === 0) continue;
        
        const leftLabels = leftIndices.map(i => labels[i]);
        const rightLabels = rightIndices.map(i => labels[i]);
        
        const leftGini = this.calculateGini(leftLabels);
        const rightGini = this.calculateGini(rightLabels);
        
        const weightedGini = (leftLabels.length * leftGini + rightLabels.length * rightGini) / labels.length;
        const gain = parentGini - weightedGini;
        
        if (gain > bestGain) {
          bestGain = gain;
          bestFeatureIndex = featureIndex;
          bestThreshold = threshold;
        }
      }
    }
    
    return bestGain > 0 ? { featureIndex: bestFeatureIndex, threshold: bestThreshold, gain: bestGain } : null;
  }

  private buildTree(data: ProcessedPassenger[], depth: number = 0): TreeNode {
    const labels = data.map(d => d.Survived!);
    
    // Check stopping criteria
    if (depth >= this.maxDepth || data.length < this.minSamplesSplit || new Set(labels).size === 1) {
      const survivedCount = labels.filter(l => l === 1).length;
      return {
        isLeaf: true,
        prediction: survivedCount > labels.length / 2 ? 1 : 0,
        probability: survivedCount / labels.length,
      };
    }
    
    const bestSplit = this.findBestSplit(data);
    if (!bestSplit) {
      const survivedCount = labels.filter(l => l === 1).length;
      return {
        isLeaf: true,
        prediction: survivedCount > labels.length / 2 ? 1 : 0,
        probability: survivedCount / labels.length,
      };
    }
    
    const leftData: ProcessedPassenger[] = [];
    const rightData: ProcessedPassenger[] = [];
    
    data.forEach(passenger => {
      const features = this.getFeatures(passenger);
      if (features[bestSplit.featureIndex] <= bestSplit.threshold) {
        leftData.push(passenger);
      } else {
        rightData.push(passenger);
      }
    });
    
    return {
      isLeaf: false,
      featureIndex: bestSplit.featureIndex,
      threshold: bestSplit.threshold,
      left: this.buildTree(leftData, depth + 1),
      right: this.buildTree(rightData, depth + 1),
    };
  }

  train(data: ProcessedPassenger[]): void {
    this.root = this.buildTree(data);
  }

  predict(passenger: ProcessedPassenger): PredictionResult {
    if (!this.root) {
      return { survived: false, probability: 0, confidence: 'Low' };
    }
    
    const result = this.predictNode(this.root, passenger);
    
    let confidence: 'Low' | 'Medium' | 'High';
    if (result.probability > 0.8 || result.probability < 0.2) {
      confidence = 'High';
    } else if (result.probability > 0.65 || result.probability < 0.35) {
      confidence = 'Medium';
    } else {
      confidence = 'Low';
    }
    
    return {
      survived: result.prediction === 1,
      probability: result.probability,
      confidence,
    };
  }

  private predictNode(node: TreeNode, passenger: ProcessedPassenger): { prediction: number; probability: number } {
    if (node.isLeaf) {
      return { prediction: node.prediction!, probability: node.probability! };
    }
    
    const features = this.getFeatures(passenger);
    if (features[node.featureIndex!] <= node.threshold!) {
      return this.predictNode(node.left!, passenger);
    } else {
      return this.predictNode(node.right!, passenger);
    }
  }
}

interface TreeNode {
  isLeaf: boolean;
  featureIndex?: number;
  threshold?: number;
  prediction?: number;
  probability?: number;
  left?: TreeNode;
  right?: TreeNode;
}

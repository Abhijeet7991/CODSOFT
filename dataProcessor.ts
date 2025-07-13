import { TitanicPassenger, ProcessedPassenger } from '../types/titanic';

export class DataProcessor {
  static extractTitle(name: string): string {
    const titleMatch = name.match(/,\s*([^.]+)\./);
    if (!titleMatch) return 'Other';
    
    const title = titleMatch[1].trim();
    
    // Group rare titles
    if (['Lady', 'Countess', 'Capt', 'Col', 'Don', 'Dr', 'Major', 'Rev', 'Sir', 'Jonkheer'].includes(title)) {
      return 'Other';
    }
    if (['Mlle', 'Ms'].includes(title)) {
      return 'Miss';
    }
    if (['Mme'].includes(title)) {
      return 'Mrs';
    }
    
    return title;
  }

  static fillMissingAge(passengers: TitanicPassenger[]): TitanicPassenger[] {
    // Calculate median age by title and class
    const ageByTitleClass = new Map<string, number[]>();
    
    passengers.forEach(p => {
      if (p.Age !== null && !isNaN(p.Age)) {
        const title = this.extractTitle(p.Name);
        const key = `${title}_${p.Pclass}`;
        if (!ageByTitleClass.has(key)) {
          ageByTitleClass.set(key, []);
        }
        ageByTitleClass.get(key)!.push(p.Age);
      }
    });

    // Calculate medians
    const medianAges = new Map<string, number>();
    ageByTitleClass.forEach((ages, key) => {
      ages.sort((a, b) => a - b);
      const median = ages[Math.floor(ages.length / 2)];
      medianAges.set(key, median);
    });

    // Fill missing ages
    return passengers.map(p => {
      if (p.Age === null || isNaN(p.Age)) {
        const title = this.extractTitle(p.Name);
        const key = `${title}_${p.Pclass}`;
        const medianAge = medianAges.get(key) || 29; // Overall median
        return { ...p, Age: medianAge };
      }
      return p;
    });
  }

  static fillMissingFare(passengers: TitanicPassenger[]): TitanicPassenger[] {
    // Calculate median fare by class
    const fareByClass = new Map<number, number[]>();
    
    passengers.forEach(p => {
      if (p.Fare !== null && !isNaN(p.Fare)) {
        if (!fareByClass.has(p.Pclass)) {
          fareByClass.set(p.Pclass, []);
        }
        fareByClass.get(p.Pclass)!.push(p.Fare);
      }
    });

    const medianFares = new Map<number, number>();
    fareByClass.forEach((fares, pclass) => {
      fares.sort((a, b) => a - b);
      const median = fares[Math.floor(fares.length / 2)];
      medianFares.set(pclass, median);
    });

    return passengers.map(p => {
      if (p.Fare === null || isNaN(p.Fare)) {
        const medianFare = medianFares.get(p.Pclass) || 14.45; // Overall median
        return { ...p, Fare: medianFare };
      }
      return p;
    });
  }

  static processPassengers(passengers: TitanicPassenger[]): ProcessedPassenger[] {
    // Fill missing values
    let processed = this.fillMissingAge(passengers);
    processed = this.fillMissingFare(processed);

    return processed.map(p => {
      const title = this.extractTitle(p.Name);
      const familySize = p.SibSp + p.Parch + 1;
      
      return {
        PassengerId: p.PassengerId,
        Survived: p.Survived,
        Pclass: p.Pclass,
        Sex_male: p.Sex === 'male' ? 1 : 0,
        Age: p.Age!,
        SibSp: p.SibSp,
        Parch: p.Parch,
        Fare: p.Fare!,
        Embarked_Q: p.Embarked === 'Q' ? 1 : 0,
        Embarked_S: p.Embarked === 'S' ? 1 : 0,
        FamilySize: familySize,
        IsAlone: familySize === 1 ? 1 : 0,
        Title_Master: title === 'Master' ? 1 : 0,
        Title_Miss: title === 'Miss' ? 1 : 0,
        Title_Mr: title === 'Mr' ? 1 : 0,
        Title_Mrs: title === 'Mrs' ? 1 : 0,
        Title_Other: !['Master', 'Miss', 'Mr', 'Mrs'].includes(title) ? 1 : 0,
      };
    });
  }

  static normalizeFeatures(data: ProcessedPassenger[]): ProcessedPassenger[] {
    const features = ['Age', 'Fare'];
    const stats = new Map<string, { mean: number; std: number }>();

    // Calculate mean and std for each feature
    features.forEach(feature => {
      const values = data.map(d => (d as any)[feature]);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
      const std = Math.sqrt(variance);
      stats.set(feature, { mean, std });
    });

    // Normalize
    return data.map(d => {
      const normalized = { ...d };
      features.forEach(feature => {
        const { mean, std } = stats.get(feature)!;
        (normalized as any)[feature] = std > 0 ? ((d as any)[feature] - mean) / std : 0;
      });
      return normalized;
    });
  }
}

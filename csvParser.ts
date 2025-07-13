import { TitanicPassenger } from '../types/titanic';

export class CSVParser {
  static parseCSV(csvText: string): TitanicPassenger[] {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    return lines.slice(1).map(line => {
      const values = this.parseCSVLine(line);
      const passenger: any = {};
      
      headers.forEach((header, index) => {
        let value: any = values[index]?.trim().replace(/"/g, '');
        
        // Convert numeric fields
        if (['PassengerId', 'Survived', 'Pclass', 'SibSp', 'Parch'].includes(header)) {
          passenger[header] = value ? parseInt(value) : 0;
        } else if (['Age', 'Fare'].includes(header)) {
          passenger[header] = value && value !== '' ? parseFloat(value) : null;
        } else {
          passenger[header] = value || '';
        }
      });
      
      return passenger as TitanicPassenger;
    });
  }

  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  static generateSampleData(): TitanicPassenger[] {
    return [
      {
        PassengerId: 1,
        Survived: 0,
        Pclass: 3,
        Name: "Braund, Mr. Owen Harris",
        Sex: "male",
        Age: 22,
        SibSp: 1,
        Parch: 0,
        Ticket: "A/5 21171",
        Fare: 7.25,
        Cabin: "",
        Embarked: "S"
      },
      {
        PassengerId: 2,
        Survived: 1,
        Pclass: 1,
        Name: "Cumings, Mrs. John Bradley (Florence Briggs Thayer)",
        Sex: "female",
        Age: 38,
        SibSp: 1,
        Parch: 0,
        Ticket: "PC 17599",
        Fare: 71.2833,
        Cabin: "C85",
        Embarked: "C"
      },
      {
        PassengerId: 3,
        Survived: 1,
        Pclass: 3,
        Name: "Heikkinen, Miss. Laina",
        Sex: "female",
        Age: 26,
        SibSp: 0,
        Parch: 0,
        Ticket: "STON/O2. 3101282",
        Fare: 7.925,
        Cabin: "",
        Embarked: "S"
      },
      {
        PassengerId: 4,
        Survived: 1,
        Pclass: 1,
        Name: "Futrelle, Mrs. Jacques Heath (Lily May Peel)",
        Sex: "female",
        Age: 35,
        SibSp: 1,
        Parch: 0,
        Ticket: "113803",
        Fare: 53.1,
        Cabin: "C123",
        Embarked: "S"
      },
      {
        PassengerId: 5,
        Survived: 0,
        Pclass: 3,
        Name: "Allen, Mr. William Henry",
        Sex: "male",
        Age: 35,
        SibSp: 0,
        Parch: 0,
        Ticket: "373450",
        Fare: 8.05,
        Cabin: "",
        Embarked: "S"
      }
    ];
  }
}

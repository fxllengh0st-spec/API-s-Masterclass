export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
}

export interface ApiDefinition {
  id: string;
  name: string;
  category: string;
  authRequired: boolean;
  authType: 'None' | 'API Key' | 'OAuth';
  description: string;
  endpoint: string;
  docsUrl: string;
  codeSnippet: string;
  jsonExplanation: Record<string, string>; // key: explanation
  securityChecklist: string[];
  exercise: string;
  quiz: QuizQuestion[];
  mockResponse: any;
}

export interface ApiStat {
  name: string;
  value: number;
}
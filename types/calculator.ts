export interface CalculatorInput {
  label: string;
  type: 'text' | 'number' | 'select' | 'toggle';
  value?: string | number;
  options?: string[];
}

export interface CalculatorExample {
  label: string;
  inputs: Record<string, number | string | boolean>;
  output: string;
}

export interface CalculatorFAQ {
  question: string;
  answer: string;
}

export interface Calculator {
  slug: string;
  category: string;
  title: string;
  description: string;
  formula: string;
  inputs: CalculatorInput[];
  result: string;
  examples: CalculatorExample[];
  faq?: CalculatorFAQ[];
  relatedCalculators?: string[];
}

export interface CalculatorCategory {
  slug: string;
  name: string;
  description: string;
  icon: string;
}

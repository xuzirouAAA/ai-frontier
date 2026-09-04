'use client';

import { useState } from 'react';
import { Calculator } from '@/types/calculator';

interface CalculatorShellProps {
  calculator: Calculator;
}

export default function CalculatorShell({ calculator }: CalculatorShellProps) {
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // 初始化输入值
  useState(() => {
    const initialInputs: Record<string, any> = {};
    calculator.inputs.forEach((input) => {
      if (input.value !== undefined) {
        initialInputs[input.label] = input.value;
      }
    });
    setInputs(initialInputs);
  });

  const handleInputChange = (label: string, value: any) => {
    setInputs((prev) => ({ ...prev, [label]: value }));
    setResult(null);
  };

  const calculate = () => {
    setIsCalculating(true);
    // 模拟计算
    setTimeout(() => {
      const firstValue = calculator.inputs[0]?.value || inputs[calculator.inputs[0]?.label] || 0;
      const secondValue = calculator.inputs[1]?.value || inputs[calculator.inputs[1]?.label] || 0;
      const simpleResult = parseFloat(firstValue) + parseFloat(secondValue);
      setResult({
        result: `${simpleResult.toFixed(2)}`,
        explanation: `基于公式 ${calculator.formula}`,
      });
      setIsCalculating(false);
    }, 500);
  };

  return (
    <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-700">
      <div className="mb-6">
        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white">输入参数</h3>
        <div className="space-y-4">
          {calculator.inputs.map((input) => (
            <div key={input.label}>
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {input.label}
              </label>
              {input.type === 'select' ? (
                <select
                  value={inputs[input.label] || input.value || ''}
                  onChange={(e) => handleInputChange(input.label, e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  {input.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : input.type === 'toggle' ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleInputChange(input.label, !inputs[input.label])}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      inputs[input.label]
                        ? 'bg-blue-600'
                        : 'bg-zinc-300 dark:bg-zinc-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        inputs[input.label] ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    {inputs[input.label] ? '已开启' : '已关闭'}
                  </span>
                </div>
              ) : (
                <input
                  type={input.type === 'number' ? 'number' : 'text'}
                  value={inputs[input.label] || input.value?.toString() || ''}
                  onChange={(e) => handleInputChange(input.label, e.target.value)}
                  placeholder={input.value?.toString() || input.label}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={calculate}
        disabled={isCalculating}
        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:dark:bg-blue-600"
      >
        {isCalculating ? '计算中...' : '计算'}
      </button>

      {result && (
        <div className="mt-6 rounded-lg bg-green-50 p-4 dark:bg-green-900">
          <p className="text-sm text-green-700 dark:text-green-300">{result.explanation}</p>
          <p className="mt-2 text-2xl font-bold text-green-900 dark:text-green-100">{result.result}</p>
        </div>
      )}
    </div>
  );
}

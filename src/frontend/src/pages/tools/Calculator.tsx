import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Delete } from 'lucide-react';

interface CalculatorProps {
  onBack: () => void;
}

export default function Calculator({ onBack }: CalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.');
      setNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(current);
    } else if (operation) {
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }
    
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case '+':
        return prev + current;
      case '-':
        return prev - current;
      case '×':
        return prev * current;
      case '÷':
        return current !== 0 ? prev / current : 0;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const current = parseFloat(display);
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handlePercent = () => {
    const current = parseFloat(display);
    setDisplay(String(current / 100));
    setNewNumber(true);
  };

  const handleSquareRoot = () => {
    const current = parseFloat(display);
    if (current >= 0) {
      setDisplay(String(Math.sqrt(current)));
      setNewNumber(true);
    }
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setNewNumber(true);
    }
  };

  const buttonClass = "h-16 sm:h-20 text-xl sm:text-2xl font-bold rounded-xl transition-all duration-200 hover:scale-105 active:scale-95";

  return (
    <div className="max-w-2xl mx-auto">
      <Button
        onClick={onBack}
        variant="outline"
        className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Araçlara Dön
      </Button>

      <Card className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              🧮 Hesap Makinesi
            </h2>
            <p className="text-white/80">Matematiksel işlemlerini kolayca yap!</p>
          </div>

          {/* Display */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 mb-6 min-h-[100px] flex items-center justify-end">
            <div className="text-right">
              {operation && previousValue !== null && (
                <div className="text-white/60 text-lg mb-1">
                  {previousValue} {operation}
                </div>
              )}
              <div className="text-white text-4xl sm:text-5xl font-bold break-all">
                {display}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-3">
            {/* Row 1 */}
            <Button
              onClick={handleClear}
              className={`${buttonClass} bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white col-span-2`}
            >
              C
            </Button>
            <Button
              onClick={handleBackspace}
              className={`${buttonClass} bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white`}
            >
              <Delete className="w-6 h-6" />
            </Button>
            <Button
              onClick={() => handleOperation('÷')}
              className={`${buttonClass} bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white`}
            >
              ÷
            </Button>

            {/* Row 2 */}
            <Button onClick={() => handleNumber('7')} className={`${buttonClass} bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white`}>7</Button>
            <Button onClick={() => handleNumber('8')} className={`${buttonClass} bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white`}>8</Button>
            <Button onClick={() => handleNumber('9')} className={`${buttonClass} bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white`}>9</Button>
            <Button
              onClick={() => handleOperation('×')}
              className={`${buttonClass} bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white`}
            >
              ×
            </Button>

            {/* Row 3 */}
            <Button onClick={() => handleNumber('4')} className={`${buttonClass} bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white`}>4</Button>
            <Button onClick={() => handleNumber('5')} className={`${buttonClass} bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white`}>5</Button>
            <Button onClick={() => handleNumber('6')} className={`${buttonClass} bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white`}>6</Button>
            <Button
              onClick={() => handleOperation('-')}
              className={`${buttonClass} bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white`}
            >
              -
            </Button>

            {/* Row 4 */}
            <Button onClick={() => handleNumber('1')} className={`${buttonClass} bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white`}>1</Button>
            <Button onClick={() => handleNumber('2')} className={`${buttonClass} bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white`}>2</Button>
            <Button onClick={() => handleNumber('3')} className={`${buttonClass} bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white`}>3</Button>
            <Button
              onClick={() => handleOperation('+')}
              className={`${buttonClass} bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white`}
            >
              +
            </Button>

            {/* Row 5 */}
            <Button onClick={handlePercent} className={`${buttonClass} bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white`}>%</Button>
            <Button onClick={() => handleNumber('0')} className={`${buttonClass} bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white`}>0</Button>
            <Button onClick={handleDecimal} className={`${buttonClass} bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white`}>.</Button>
            <Button
              onClick={handleEquals}
              className={`${buttonClass} bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white`}
            >
              =
            </Button>

            {/* Row 6 */}
            <Button
              onClick={handleSquareRoot}
              className={`${buttonClass} bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white col-span-4`}
            >
              √ Karekök
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

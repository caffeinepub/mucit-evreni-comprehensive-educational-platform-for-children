import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

interface ShapeDrawingProps {
  onBack: () => void;
}

type ShapeType = 'circle' | 'square' | 'rectangle' | 'triangle';

export default function ShapeDrawing({ onBack }: ShapeDrawingProps) {
  const [shapeType, setShapeType] = useState<ShapeType>('circle');
  const [size, setSize] = useState(100);
  const [color, setColor] = useState('#3b82f6');

  const calculateArea = () => {
    switch (shapeType) {
      case 'circle':
        return (Math.PI * (size / 2) ** 2).toFixed(2);
      case 'square':
        return (size * size).toFixed(2);
      case 'rectangle':
        return (size * size * 0.6).toFixed(2);
      case 'triangle':
        return ((size * size * 0.866) / 2).toFixed(2);
      default:
        return '0';
    }
  };

  const calculatePerimeter = () => {
    switch (shapeType) {
      case 'circle':
        return (Math.PI * size).toFixed(2);
      case 'square':
        return (size * 4).toFixed(2);
      case 'rectangle':
        return (size * 2 + size * 0.6 * 2).toFixed(2);
      case 'triangle':
        return (size * 3).toFixed(2);
      default:
        return '0';
    }
  };

  const renderShape = () => {
    const style = { fill: color, stroke: '#000', strokeWidth: 2 };
    
    switch (shapeType) {
      case 'circle':
        return <circle cx="150" cy="150" r={size / 2} {...style} />;
      case 'square':
        return <rect x={150 - size / 2} y={150 - size / 2} width={size} height={size} {...style} />;
      case 'rectangle':
        return <rect x={150 - size / 2} y={150 - size * 0.3} width={size} height={size * 0.6} {...style} />;
      case 'triangle':
        const height = (size * Math.sqrt(3)) / 2;
        return (
          <polygon
            points={`150,${150 - height / 2} ${150 - size / 2},${150 + height / 2} ${150 + size / 2},${150 + height / 2}`}
            {...style}
          />
        );
      default:
        return null;
    }
  };

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
              📐 Şekil Çizimi
            </h2>
            <p className="text-white/80">Geometrik şekiller çiz ve ölç!</p>
          </div>

          {/* Controls */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-white font-semibold mb-2 block">Şekil Türü:</label>
              <Select value={shapeType} onValueChange={(value) => setShapeType(value as ShapeType)}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="circle">Daire</SelectItem>
                  <SelectItem value="square">Kare</SelectItem>
                  <SelectItem value="rectangle">Dikdörtgen</SelectItem>
                  <SelectItem value="triangle">Üçgen</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-white font-semibold mb-2 block">Boyut: {size}px</label>
              <input
                type="range"
                min="50"
                max="200"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-white font-semibold mb-2 block">Renk:</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-10 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Drawing Area */}
          <div className="bg-white rounded-xl p-6 mb-6">
            <svg width="300" height="300" className="mx-auto">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="300" height="300" fill="url(#grid)" />
              {renderShape()}
            </svg>
          </div>

          {/* Measurements */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 text-center">
              <p className="text-white text-lg mb-2">Alan:</p>
              <p className="text-white text-3xl font-bold">{calculateArea()} px²</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-center">
              <p className="text-white text-lg mb-2">Çevre:</p>
              <p className="text-white text-3xl font-bold">{calculatePerimeter()} px</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

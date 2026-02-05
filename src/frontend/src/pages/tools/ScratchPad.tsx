import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Eraser, Trash2 } from 'lucide-react';

interface ScratchPadProps {
  onBack: () => void;
}

export default function ScratchPad({ onBack }: ScratchPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);

  const colors = [
    '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00',
    '#ff00ff', '#00ffff', '#ffa500', '#800080', '#ffc0cb'
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Fill with dark background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = isEraser ? '#1a1a2e' : color;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="max-w-4xl mx-auto">
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
              📝 Karalama Alanı
            </h2>
            <p className="text-white/80">Hayal gücünü serbest bırak ve çiz!</p>
          </div>

          {/* Color Palette */}
          <div className="mb-4 flex flex-wrap gap-2 justify-center">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setColor(c);
                  setIsEraser(false);
                }}
                className={`w-10 h-10 rounded-full border-4 transition-transform hover:scale-110 ${
                  color === c && !isEraser ? 'border-white scale-110' : 'border-white/30'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          {/* Tools */}
          <div className="mb-4 flex flex-wrap gap-2 justify-center items-center">
            <Button
              onClick={() => setIsEraser(!isEraser)}
              variant={isEraser ? 'default' : 'outline'}
              className={isEraser ? 'bg-purple-600 hover:bg-purple-700' : 'bg-white/10 hover:bg-white/20'}
            >
              <Eraser className="w-4 h-4 mr-2" />
              Silgi
            </Button>
            
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
              <span className="text-white text-sm">Kalınlık:</span>
              <input
                type="range"
                min="1"
                max="20"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-24"
              />
              <span className="text-white text-sm font-bold">{brushSize}</span>
            </div>
            
            <Button
              onClick={clearCanvas}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Temizle
            </Button>
          </div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
            onTouchMove={draw}
            className="w-full rounded-xl border-4 border-white/20 cursor-crosshair touch-none"
            style={{ height: '500px' }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, RotateCw } from 'lucide-react';

interface RulerAngleProps {
  onBack: () => void;
}

export default function RulerAngle({ onBack }: RulerAngleProps) {
  const [rulerPosition, setRulerPosition] = useState({ x: 50, y: 50 });
  const [protractorAngle, setProtractorAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleRulerDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const container = e.currentTarget.parentElement;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    
    setRulerPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const rotateProtractor = () => {
    setProtractorAngle((prev) => (prev + 15) % 360);
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
              📏 Cetvel & Açı
            </h2>
            <p className="text-white/80">Ölçüm yap ve açıları keşfet!</p>
          </div>

          <Tabs defaultValue="ruler" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="ruler">Cetvel</TabsTrigger>
              <TabsTrigger value="protractor">Açı Ölçer</TabsTrigger>
            </TabsList>

            <TabsContent value="ruler">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-4 text-white text-center">
                  <p className="text-lg font-semibold">Cetveli sürükleyerek hareket ettir!</p>
                  <p className="text-sm opacity-80">Dokunarak veya fareyle sürükle</p>
                </div>

                <div
                  className="relative bg-white/20 rounded-xl overflow-hidden"
                  style={{ height: '500px' }}
                  onMouseMove={handleRulerDrag}
                  onTouchMove={handleRulerDrag}
                >
                  {/* Grid background */}
                  <div className="absolute inset-0 opacity-20">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={`h-${i}`} className="absolute w-full border-t border-white" style={{ top: `${i * 5}%` }} />
                    ))}
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div key={`v-${i}`} className="absolute h-full border-l border-white" style={{ left: `${i * 5}%` }} />
                    ))}
                  </div>

                  {/* Ruler */}
                  <div
                    className="absolute cursor-move"
                    style={{
                      left: `${rulerPosition.x}%`,
                      top: `${rulerPosition.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onTouchStart={() => setIsDragging(true)}
                    onTouchEnd={() => setIsDragging(false)}
                  >
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg shadow-2xl p-2 w-80">
                      <div className="flex justify-between items-center mb-1">
                        {Array.from({ length: 31 }).map((_, i) => (
                          <div key={i} className="flex flex-col items-center">
                            <div className={`bg-black ${i % 5 === 0 ? 'h-6 w-0.5' : 'h-3 w-0.5'}`} />
                            {i % 5 === 0 && <span className="text-xs font-bold text-black mt-1">{i}</span>}
                          </div>
                        ))}
                      </div>
                      <div className="text-center text-black font-bold text-sm">cm</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="protractor">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-4 text-white text-center">
                  <p className="text-lg font-semibold">Açı: {protractorAngle}°</p>
                  <p className="text-sm opacity-80">Döndür butonuna tıklayarak açıyı değiştir</p>
                </div>

                <div className="flex justify-center mb-4">
                  <Button
                    onClick={rotateProtractor}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    <RotateCw className="w-4 h-4 mr-2" />
                    Döndür (15°)
                  </Button>
                </div>

                <div className="relative bg-white/20 rounded-xl overflow-hidden flex items-center justify-center" style={{ height: '500px' }}>
                  {/* Protractor */}
                  <div
                    className="relative transition-transform duration-300"
                    style={{ transform: `rotate(${protractorAngle}deg)` }}
                  >
                    <svg width="400" height="250" viewBox="0 0 400 250">
                      {/* Semi-circle base */}
                      <path
                        d="M 50 200 A 150 150 0 0 1 350 200"
                        fill="rgba(255, 255, 255, 0.3)"
                        stroke="white"
                        strokeWidth="3"
                      />
                      
                      {/* Degree marks */}
                      {Array.from({ length: 19 }).map((_, i) => {
                        const angle = (i * 10 - 90) * (Math.PI / 180);
                        const x1 = 200 + 150 * Math.cos(angle);
                        const y1 = 200 + 150 * Math.sin(angle);
                        const x2 = 200 + 130 * Math.cos(angle);
                        const y2 = 200 + 130 * Math.sin(angle);
                        const textX = 200 + 110 * Math.cos(angle);
                        const textY = 200 + 110 * Math.sin(angle);
                        
                        return (
                          <g key={i}>
                            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="2" />
                            <text
                              x={textX}
                              y={textY}
                              fill="white"
                              fontSize="14"
                              fontWeight="bold"
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              {i * 10}
                            </text>
                          </g>
                        );
                      })}
                      
                      {/* Center point */}
                      <circle cx="200" cy="200" r="5" fill="red" />
                      
                      {/* Angle indicator line */}
                      <line x1="200" y1="200" x2="350" y2="200" stroke="red" strokeWidth="3" />
                    </svg>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

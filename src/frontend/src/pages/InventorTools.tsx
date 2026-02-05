import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calculator, Ruler, PenTool, RefreshCw, Type, BookOpen, Grid3x3, Calendar as CalendarIcon, Hash, Divide, Shapes, BarChart3, FileText, Binary, Edit3, BookMarked, Volume2, Languages } from 'lucide-react';

interface InventorToolsProps {
  userId: string;
  onClose: () => void;
  onToolSelect: (toolId: string) => void;
}

interface Tool {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const tools: Tool[] = [
  {
    id: 'calculator',
    name: 'Hesap Makinesi',
    icon: <Calculator className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: 'text-blue-400',
    gradient: 'from-blue-400 to-blue-600',
  },
  {
    id: 'noise-meter',
    name: 'Gürültü Ölçer',
    icon: <Volume2 className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: 'text-sky-400',
    gradient: 'from-sky-400 to-sky-600',
  },
  {
    id: 'ruler',
    name: 'Cetvel & Açı',
    icon: <Ruler className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: 'text-green-400',
    gradient: 'from-green-400 to-green-600',
  },
  {
    id: 'scratch',
    name: 'Karalama Alanı',
    icon: <PenTool className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: 'text-purple-400',
    gradient: 'from-purple-400 to-purple-600',
  },
  {
    id: 'converter',
    name: 'Birim Dönüştürücü',
    icon: <RefreshCw className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: 'text-orange-400',
    gradient: 'from-orange-400 to-orange-600',
  },
  {
    id: 'writing',
    name: 'Yazım Aracı',
    icon: <Type className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: 'text-pink-400',
    gradient: 'from-pink-400 to-pink-600',
  },
  {
    id: 'reading',
    name: 'Okuma Çubuğu',
    icon: <BookOpen className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: 'text-cyan-400',
    gradient: 'from-cyan-400 to-cyan-600',
  },
  {
    id: 'multiplication',
    name: 'Çarpım Tablosu',
    icon: <Grid3x3 className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: 'text-yellow-400',
    gradient: 'from-yellow-400 to-yellow-600',
  },
  {
    id: 'date',
    name: 'Tarih Hesaplayıcı',
    icon: <CalendarIcon className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: 'text-red-400',
    gradient: 'from-red-400 to-red-600',
  },
  {
    id: 'numberline',
    name: 'Sayı Doğrusu',
    icon: <Hash className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: 'text-indigo-400',
    gradient: 'from-indigo-400 to-indigo-600',
  },
  {
    id: 'fraction',
    name: 'Kesir Aracı',
    icon: <Divide className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: 'text-teal-400',
    gradient: 'from-teal-400 to-teal-600',
  },
  {
    id: 'shapes',
    name: 'Şekil Çizimi',
    icon: <Shapes className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: 'text-lime-400',
    gradient: 'from-lime-400 to-lime-600',
  },
  {
    id: 'graph',
    name: 'Grafik Oluşturucu',
    icon: <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: 'text-emerald-400',
    gradient: 'from-emerald-400 to-emerald-600',
  },
  {
    id: 'problem',
    name: 'Problem Şablonu',
    icon: <FileText className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: 'text-violet-400',
    gradient: 'from-violet-400 to-violet-600',
  },
  {
    id: 'placevalue',
    name: 'Basamak Değeri',
    icon: <Binary className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: 'text-fuchsia-400',
    gradient: 'from-fuchsia-400 to-fuchsia-600',
  },
  {
    id: 'equation',
    name: 'Denklem Alanı',
    icon: <Edit3 className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: 'text-rose-400',
    gradient: 'from-rose-400 to-rose-600',
  },
  {
    id: 'formula',
    name: 'Formül Defteri',
    icon: <BookMarked className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: 'text-amber-400',
    gradient: 'from-amber-400 to-amber-600',
  },
  {
    id: 'dictionary',
    name: 'Sözlük Aracı',
    icon: <Languages className="w-8 h-8 sm:w-10 sm:h-10" />,
    color: 'text-purple-400',
    gradient: 'from-purple-400 to-purple-600',
  },
];

export default function InventorTools({ userId, onClose, onToolSelect }: InventorToolsProps) {
  const handleToolClick = (tool: Tool) => {
    onToolSelect(tool.id);
  };

  return (
    <div className="py-4 sm:py-6 md:py-8">
      <div className="mb-6 sm:mb-8">
        <Button
          onClick={onClose}
          variant="outline"
          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Ana Sayfa
        </Button>

        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3">
            <img
              src="/assets/generated/mucit-araclari-icon-transparent.dim_100x100.png"
              alt="Mucit Araçları"
              className="w-12 h-12 sm:w-16 sm:h-16"
            />
            Mucit Araçları
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 px-4">
            Öğrenme yolculuğunda sana yardımcı olacak harika araçlar!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-7xl mx-auto">
        {tools.map((tool) => (
          <Card
            key={tool.id}
            className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            onClick={() => handleToolClick(tool)}
          >
            <CardContent className="p-4 sm:p-5 md:p-6 flex flex-col items-center justify-center text-center h-full min-h-[140px] sm:min-h-[160px]">
              <div className="relative mb-3 sm:mb-4">
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-20 rounded-full blur-xl group-hover:opacity-40 transition-opacity`} />
                <div className={`relative z-10 ${tool.color} transition-transform group-hover:scale-110`}>
                  {tool.icon}
                </div>
              </div>
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-white leading-tight">
                {tool.name}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

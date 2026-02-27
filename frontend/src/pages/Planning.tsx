import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Calendar } from 'lucide-react';
import Notebook from '../components/Notebook';
import DailyPlanning from '../components/DailyPlanning';

interface PlanningProps {
  userId: string;
  onClose: () => void;
}

export default function Planning({ userId, onClose }: PlanningProps) {
  const [activeTab, setActiveTab] = useState<string>('notebook');
  const studentNumber = localStorage.getItem('mucit_ogrenciNumarasi') || '';

  return (
    <div className="py-4 sm:py-6 md:py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <Button
              onClick={onClose}
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-300" />
                Planlama
              </h1>
              <p className="text-white/70 text-sm sm:text-base mt-1">
                Notlarını yaz ve hedeflerini planla
              </p>
            </div>
          </div>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4 sm:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/10">
                <TabsTrigger 
                  value="notebook" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white text-white/70"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Not Defterim
                </TabsTrigger>
                <TabsTrigger 
                  value="daily" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white text-white/70"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Günlük Planlama
                </TabsTrigger>
              </TabsList>

              <TabsContent value="notebook" className="mt-0">
                <Notebook userId={userId} />
              </TabsContent>

              <TabsContent value="daily" className="mt-0">
                <DailyPlanning studentNumber={studentNumber} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

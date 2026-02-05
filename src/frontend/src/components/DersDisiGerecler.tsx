import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Wrench } from 'lucide-react';
import GenelKulturTabs from './GenelKulturTabs';

interface DersDisiGereclerProps {
  userId: string;
  onPlanningOpen: () => void;
  onToolsOpen: () => void;
}

export default function DersDisiGerecler({ userId, onPlanningOpen, onToolsOpen }: DersDisiGereclerProps) {
  const [activeTab, setActiveTab] = useState<string>('mucit-gerecleri');

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-3 sm:p-4 md:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Enhanced main tabs with larger size and better mobile support */}
            <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 bg-white/10 h-auto p-1.5 sm:p-2 gap-2">
              <TabsTrigger 
                value="mucit-gerecleri" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-white/80 font-bold transition-all duration-300 hover:scale-105 py-3 sm:py-4 md:py-5 px-3 sm:px-4 text-sm sm:text-base md:text-lg rounded-lg"
              >
                <img
                  src="/assets/generated/mucit-gerecleri-banner.dim_800x200.png"
                  alt="Mucit Gereçleri"
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mr-2"
                />
                <span className="leading-tight">Mucit Gereçleri</span>
              </TabsTrigger>
              <TabsTrigger 
                value="genel-kultur" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-white/80 font-bold transition-all duration-300 hover:scale-105 py-3 sm:py-4 md:py-5 px-3 sm:px-4 text-sm sm:text-base md:text-lg rounded-lg"
              >
                <img
                  src="/assets/generated/genel-kultur-icon-transparent.dim_100x100.png"
                  alt="Genel Kültür"
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mr-2"
                />
                <span className="leading-tight">Genel Kültür</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mucit-gerecleri" className="mt-0">
              <div className="space-y-4 sm:space-y-6">
                {/* Planning Section */}
                <Card
                  className="bg-gradient-to-br from-orange-400/20 to-yellow-500/20 backdrop-blur-md border-yellow-300/30 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                  onClick={onPlanningOpen}
                >
                  <CardContent className="p-5 sm:p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                      <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-yellow-500 opacity-30 rounded-full blur-xl group-hover:opacity-50 transition-opacity" />
                        <img
                          src="/assets/generated/planning-icon-transparent.dim_64x64.png"
                          alt="Planlama"
                          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 relative z-10"
                        />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 flex items-center justify-center sm:justify-start gap-2">
                          <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-300" />
                          Planlama
                        </h3>
                        <div className="mb-2 h-1 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full max-w-xs mx-auto sm:mx-0" />
                        <p className="text-white/90 text-base sm:text-lg font-semibold mb-1">
                          Notlarını yaz, hedeflerini planla!
                        </p>
                        <p className="text-white/80 text-sm sm:text-base">
                          Not defteri ve günlük planlama araçlarına buradan ulaşabilirsin
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Inventor Tools Section */}
                <Card
                  className="bg-gradient-to-br from-cyan-400/20 to-blue-500/20 backdrop-blur-md border-cyan-300/30 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
                  onClick={onToolsOpen}
                >
                  <CardContent className="p-5 sm:p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                      <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 opacity-30 rounded-full blur-xl group-hover:opacity-50 transition-opacity" />
                        <img
                          src="/assets/generated/mucit-araclari-icon-transparent.dim_100x100.png"
                          alt="Mucit Araçları"
                          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 relative z-10"
                        />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 flex items-center justify-center sm:justify-start gap-2">
                          <Wrench className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-300" />
                          Mucit Araçları
                        </h3>
                        <div className="mb-2 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full max-w-xs mx-auto sm:mx-0" />
                        <p className="text-white/90 text-base sm:text-lg font-semibold mb-1">
                          Öğrenme yolculuğunda sana yardımcı olacak araçlar!
                        </p>
                        <p className="text-white/80 text-sm sm:text-base">
                          Hesap makinesi, cetvel, karalama alanı ve daha fazlası
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="genel-kultur" className="mt-0">
              <GenelKulturTabs userId={userId} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

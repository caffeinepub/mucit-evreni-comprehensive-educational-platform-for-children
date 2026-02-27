import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Check, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { DailyPlan, PlanCategory } from '../types';
import {
  useGetDailyPlans,
  useSaveDailyPlan,
  useDeleteDailyPlan,
} from '../hooks/useQueries';

interface DailyPlanningProps {
  studentNumber: string;
}

export default function DailyPlanning({ studentNumber }: DailyPlanningProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<DailyPlan | null>(null);
  const [newPlan, setNewPlan] = useState({
    title: '',
    description: '',
    category: 'learning' as PlanCategory,
  });

  const { data: plans = [], isLoading } = useGetDailyPlans(studentNumber);
  const savePlanMutation = useSaveDailyPlan();
  const deletePlanMutation = useDeleteDailyPlan();

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const plansForSelectedDate = plans.filter((plan: DailyPlan) => plan.date === selectedDateStr);

  const handleAddPlan = async () => {
    if (!newPlan.title.trim()) return;

    const plan: DailyPlan = {
      id: Date.now().toString(),
      date: selectedDateStr,
      title: newPlan.title,
      description: newPlan.description,
      category: newPlan.category,
      completed: false,
      createdAt: Date.now(),
    };

    await savePlanMutation.mutateAsync({ studentNumber, plan });
    setNewPlan({ title: '', description: '', category: 'learning' });
    setIsAddDialogOpen(false);
  };

  const handleUpdatePlan = async (plan: DailyPlan) => {
    await savePlanMutation.mutateAsync({ studentNumber, plan });
    setEditingPlan(null);
  };

  const handleDeletePlan = async (planId: string) => {
    await deletePlanMutation.mutateAsync({ studentNumber, planId });
  };

  const handleToggleComplete = async (plan: DailyPlan) => {
    const updatedPlan = { ...plan, completed: !plan.completed };
    await savePlanMutation.mutateAsync({ studentNumber, plan: updatedPlan });
  };

  const getCategoryColor = (category: PlanCategory) => {
    switch (category) {
      case 'learning':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'fun':
        return 'bg-pink-100 text-pink-800 border-pink-300';
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'task':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getCategoryLabel = (category: PlanCategory) => {
    switch (category) {
      case 'learning':
        return 'Öğrenme Hedefi';
      case 'fun':
        return 'Eğlence';
      case 'reminder':
        return 'Hatırlatma';
      case 'task':
        return 'Görev';
      default:
        return category;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-purple-600">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-purple-800">
          📅 Günlük Planlama
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <CalendarIcon className="w-6 h-6" />
                Takvim
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={tr}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Plans Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-purple-700">
                <span>
                  {format(selectedDate, 'd MMMM yyyy', { locale: tr })} - Planlar
                </span>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="w-4 h-4 mr-1" />
                      Yeni Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Yeni Plan Ekle</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Başlık</label>
                        <Input
                          value={newPlan.title}
                          onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                          placeholder="Plan başlığı..."
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Açıklama</label>
                        <Textarea
                          value={newPlan.description}
                          onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                          placeholder="Plan açıklaması..."
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Kategori</label>
                        <Select
                          value={newPlan.category}
                          onValueChange={(value) => setNewPlan({ ...newPlan, category: value as PlanCategory })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="learning">Öğrenme Hedefi</SelectItem>
                            <SelectItem value="fun">Eğlence</SelectItem>
                            <SelectItem value="reminder">Hatırlatma</SelectItem>
                            <SelectItem value="task">Görev</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddPlan} className="w-full bg-purple-600 hover:bg-purple-700">
                        Ekle
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {plansForSelectedDate.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Bu gün için henüz plan yok.</p>
                  <p className="text-sm mt-2">Yeni plan eklemek için yukarıdaki butona tıklayın!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {plansForSelectedDate.map((plan: DailyPlan) => (
                    <div
                      key={plan.id}
                      className={`p-4 rounded-lg border-2 ${getCategoryColor(plan.category)} ${
                        plan.completed ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold ${plan.completed ? 'line-through' : ''}`}>
                              {plan.title}
                            </h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-white/50">
                              {getCategoryLabel(plan.category)}
                            </span>
                          </div>
                          {plan.description && (
                            <p className={`text-sm mt-1 ${plan.completed ? 'line-through' : ''}`}>
                              {plan.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2 ml-2">
                          <Button
                            size="sm"
                            variant={plan.completed ? 'outline' : 'default'}
                            onClick={() => handleToggleComplete(plan)}
                            className={plan.completed ? '' : 'bg-green-600 hover:bg-green-700'}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeletePlan(plan.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

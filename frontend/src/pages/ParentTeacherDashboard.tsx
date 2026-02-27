import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, User, Award, TrendingUp, Clock, BookOpen, ArrowLeft, RefreshCw } from 'lucide-react';
import { useGetStudentData } from '../hooks/useQueries';

interface ParentTeacherDashboardProps {
  onBack: () => void;
}

export default function ParentTeacherDashboard({ onBack }: ParentTeacherDashboardProps) {
  const [studentNumber, setStudentNumber] = useState('');
  const [searchedNumber, setSearchedNumber] = useState('');

  const { data: studentData, isLoading, error, refetch } = useGetStudentData(searchedNumber);

  const handleSearch = () => {
    // Sanitize: remove all spaces and non-numeric characters
    const cleanNumber = studentNumber.replace(/\s/g, '').replace(/\D/g, '');
    if (cleanNumber.length === 16) {
      setSearchedNumber(cleanNumber);
    } else {
      alert('Lütfen geçerli bir 16 haneli öğrenci numarası girin.');
    }
  };

  const formatStudentNumber = (number: string) => {
    return number.match(/.{1,4}/g)?.join(' ') || number;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setStudentNumber(value);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-purple-600 hover:bg-purple-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-purple-800">
            👨‍👩‍👧‍👦 Veli-Öğretmen Paneli
          </h1>
        </div>

        {/* Search Section */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="text-purple-700">Öğrenci Numarası ile Sorgula</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                type="text"
                value={formatStudentNumber(studentNumber)}
                onChange={handleInputChange}
                placeholder="0000 0000 0000 0000"
                className="text-lg font-mono"
                maxLength={19}
              />
              <Button
                onClick={handleSearch}
                className="bg-purple-600 hover:bg-purple-700 px-8"
                disabled={studentNumber.length !== 16}
              >
                <Search className="w-5 h-5 mr-2" />
                Sorgula
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              16 haneli öğrenci numarasını girerek öğrenci verilerine erişebilirsiniz.
            </p>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="text-xl text-purple-600">Veriler yükleniyor...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="shadow-lg">
            <CardContent className="py-12 text-center">
              <p className="text-red-600 text-lg">Bir hata oluştu. Lütfen tekrar deneyin.</p>
            </CardContent>
          </Card>
        )}

        {/* No Data State with Sync Guidance */}
        {!isLoading && !error && searchedNumber && !studentData && (
          <Card className="shadow-lg">
            <CardContent className="py-12 text-center space-y-4">
              <p className="text-gray-600 text-lg font-semibold">Henüz veri bulunamadı</p>
              <p className="text-sm text-gray-500">
                Bu öğrenci numarası için kayıtlı veri bulunmamaktadır.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 text-left max-w-md mx-auto">
                <p className="text-sm text-blue-800 font-semibold mb-2">💡 Olası Nedenler:</p>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Öğrenci henüz profil oluşturmamış olabilir</li>
                  <li>Profil henüz senkronize edilmemiş olabilir</li>
                  <li>İnternet bağlantısı olmadan profil oluşturulmuş olabilir</li>
                </ul>
                <p className="text-sm text-blue-800 font-semibold mt-3 mb-2">✅ Çözüm:</p>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Öğrencinin uygulamayı açıp internet bağlantısı ile giriş yapmasını sağlayın</li>
                  <li>Birkaç dakika bekleyip tekrar deneyin</li>
                </ul>
              </div>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="mt-4"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Yeniden Dene
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Student Data Display */}
        {studentData && (
          <div className="space-y-6">
            {/* Profile Section */}
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <User className="w-6 h-6" />
                    Öğrenci Profili
                  </CardTitle>
                  <Button
                    onClick={handleRefresh}
                    variant="ghost"
                    size="sm"
                    className="text-purple-600"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Yenile
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  {studentData.profile?.avatar && (
                    <img
                      src={`/assets/generated/avatar-${studentData.profile.avatar}-transparent.dim_150x150.png`}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full border-4 border-purple-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/assets/generated/child-inventor-scientist-transparent.dim_150x150.png';
                      }}
                    />
                  )}
                  <div>
                    <h3 className="text-2xl font-bold text-purple-800">
                      {studentData.profile?.username || 'İsimsiz Öğrenci'}
                    </h3>
                    <p className="text-lg font-mono text-gray-600 mt-1">
                      {formatStudentNumber(searchedNumber)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Toplam Puan</p>
                      <p className="text-2xl font-bold text-purple-800">
                        {studentData.progress?.totalScore || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">İlerleme</p>
                      <p className="text-2xl font-bold text-purple-800">
                        %{studentData.progress?.progressPercentage || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Tamamlanan</p>
                      <p className="text-2xl font-bold text-purple-800">
                        {studentData.progress?.completedActivities?.length || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Seviye</p>
                      <p className="text-2xl font-bold text-purple-800">
                        {studentData.progress?.achievementBadge || studentData.progress?.achievementLevel || 'Acemi'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activity Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-purple-700">Günlük Planlar</CardTitle>
                </CardHeader>
                <CardContent>
                  {studentData.plans && studentData.plans.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-lg">
                        Toplam Plan: <span className="font-bold">{studentData.plans.length}</span>
                      </p>
                      <p className="text-lg">
                        Tamamlanan:{' '}
                        <span className="font-bold">
                          {studentData.plans.filter((p: any) => p.completed).length}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500">Henüz plan oluşturulmamış</p>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-purple-700">Notlar</CardTitle>
                </CardHeader>
                <CardContent>
                  {studentData.notes && studentData.notes.length > 0 ? (
                    <p className="text-lg">
                      Toplam Not: <span className="font-bold">{studentData.notes.length}</span>
                    </p>
                  ) : (
                    <p className="text-gray-500">Henüz not oluşturulmamış</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Exam Results */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-purple-700">Günlük Sınav Sonuçları</CardTitle>
              </CardHeader>
              <CardContent>
                {studentData.examResults && studentData.examResults.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-lg">
                      Toplam Sınav: <span className="font-bold">{studentData.examResults.length}</span>
                    </p>
                    <p className="text-lg">
                      Ortalama Puan:{' '}
                      <span className="font-bold">
                        {Math.round(
                          studentData.examResults.reduce((acc: number, r: any) => acc + r.score, 0) /
                            studentData.examResults.length
                        )}
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500">Henüz sınav sonucu yok</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

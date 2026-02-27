import { useState, useEffect, lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import { AgeGroup } from './types';
import { ActivityData } from './components/ActivityList';

// Lazy load heavy components for better initial load performance
const EntrySelection = lazy(() => import('./pages/EntrySelection'));
const AvatarSelection = lazy(() => import('./pages/AvatarSelection'));
const PlanetSelection = lazy(() => import('./pages/PlanetSelection'));
const ClassView = lazy(() => import('./pages/ClassView'));
const ActivityPlayer = lazy(() => import('./components/ActivityPlayer'));
const ProfileSettings = lazy(() => import('./pages/ProfileSettings'));
const InventorTools = lazy(() => import('./pages/InventorTools'));
const Planning = lazy(() => import('./pages/Planning'));
const ParentTeacherDashboard = lazy(() => import('./pages/ParentTeacherDashboard'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const ToolRouter = lazy(() => import('./components/ToolRouter'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white text-lg">Yükleniyor...</p>
    </div>
  </div>
);

// PRODUCTION DEPLOYMENT CONFIGURATION
// Permanent active mode - no expiration, no draft state, 24/7 availability
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // PERMANENT ACTIVE STATE - Never refetch automatically
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      // INFINITE RELIABILITY - Retry forever with exponential backoff
      retry: Infinity,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // NO EXPIRATION - Data never becomes stale
      staleTime: Infinity,
      // PERMANENT CACHE - Never garbage collect
      gcTime: Infinity,
      // ALWAYS ONLINE - Try to fetch even offline
      networkMode: 'always',
    },
    mutations: {
      // INFINITE RELIABILITY for mutations
      retry: Infinity,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      networkMode: 'always',
    },
  },
});

type View = 
  | 'entry'
  | 'avatar'
  | 'planets'
  | 'class'
  | 'activity'
  | 'profile'
  | 'inventorTools'
  | 'tool'
  | 'planning'
  | 'parentTeacher'
  | 'privacy'
  | 'adminLogin'
  | 'adminDashboard';

function App() {
  const [currentView, setCurrentView] = useState<View>('entry');
  const [userId, setUserId] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [avatarId, setAvatarId] = useState<number>(1);
  const [ogrenciNumarasi, setOgrenciNumarasi] = useState<string>('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Priority 1: Check for admin route
    const hash = window.location.hash;
    const path = window.location.pathname;
    
    if (hash === '#/admin' || hash === '#/admin/') {
      const adminAuth = sessionStorage.getItem('mucit_admin_auth');
      if (adminAuth === 'true') {
        setIsAdminAuthenticated(true);
        setCurrentView('adminDashboard');
      } else {
        setCurrentView('adminLogin');
      }
      document.title = 'Admin Panel - Mucit Evreni';
      return;
    }

    // Priority 2: Check for privacy policy route (globally accessible)
    if (hash === '#/gizlilik' || hash === '#/gizlilik/') {
      setCurrentView('privacy');
      document.title = 'Gizlilik Politikası - Mucit Evreni';
      return;
    }
    
    if (path === '/gizlilik' || path === '/gizlilik/' || path.endsWith('/gizlilik') || path.endsWith('/gizlilik/')) {
      if (hash !== '#/gizlilik') {
        window.history.replaceState(null, '', '#/gizlilik');
      }
      setCurrentView('privacy');
      document.title = 'Gizlilik Politikası - Mucit Evreni';
      return;
    }

    document.title = 'Mucit Evreni';

    // Priority 3: Restore saved profile for permanent session
    const storedUsername = localStorage.getItem('mucit_username');
    const storedAvatarId = localStorage.getItem('mucit_avatarId');
    const storedOgrenciNumarasi = localStorage.getItem('mucit_ogrenciNumarasi');

    if (storedUsername && storedAvatarId && storedOgrenciNumarasi) {
      let storedUserId = localStorage.getItem('mucit_userId');
      if (!storedUserId) {
        storedUserId = `user_${storedOgrenciNumarasi}`;
        localStorage.setItem('mucit_userId', storedUserId);
      }
      
      setUserId(storedUserId);
      setUsername(storedUsername);
      setAvatarId(parseInt(storedAvatarId));
      setOgrenciNumarasi(storedOgrenciNumarasi);
      setCurrentView('planets');
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/admin' || hash === '#/admin/') {
        const adminAuth = sessionStorage.getItem('mucit_admin_auth');
        if (adminAuth === 'true') {
          setIsAdminAuthenticated(true);
          setCurrentView('adminDashboard');
        } else {
          setCurrentView('adminLogin');
        }
        document.title = 'Admin Panel - Mucit Evreni';
      } else if (hash === '#/gizlilik' || hash === '#/gizlilik/') {
        setCurrentView('privacy');
        document.title = 'Gizlilik Politikası - Mucit Evreni';
      } else {
        document.title = 'Mucit Evreni';
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleStudentEntry = () => {
    const storedUsername = localStorage.getItem('mucit_username');
    const storedAvatarId = localStorage.getItem('mucit_avatarId');
    const storedOgrenciNumarasi = localStorage.getItem('mucit_ogrenciNumarasi');

    if (storedUsername && storedAvatarId && storedOgrenciNumarasi) {
      let storedUserId = localStorage.getItem('mucit_userId');
      if (!storedUserId) {
        storedUserId = `user_${storedOgrenciNumarasi}`;
        localStorage.setItem('mucit_userId', storedUserId);
      }
      
      setUserId(storedUserId);
      setUsername(storedUsername);
      setAvatarId(parseInt(storedAvatarId));
      setOgrenciNumarasi(storedOgrenciNumarasi);
      setCurrentView('planets');
    } else {
      setCurrentView('avatar');
    }
  };

  const handleParentTeacherEntry = () => {
    setCurrentView('parentTeacher');
  };

  const handleAvatarComplete = (newUserId: string, newUsername: string, newAvatarId: number, newOgrenciNumarasi: string) => {
    setUserId(newUserId);
    setUsername(newUsername);
    setAvatarId(newAvatarId);
    setOgrenciNumarasi(newOgrenciNumarasi);
    
    localStorage.setItem('mucit_userId', newUserId);
    localStorage.setItem('mucit_username', newUsername);
    localStorage.setItem('mucit_avatarId', newAvatarId.toString());
    localStorage.setItem('mucit_ogrenciNumarasi', newOgrenciNumarasi);
    
    setCurrentView('planets');
  };

  const handlePlanetSelect = (ageGroup: AgeGroup) => {
    setSelectedAgeGroup(ageGroup);
    setCurrentView('class');
  };

  const handleActivitySelect = (activity: ActivityData, difficulty: 'easy' | 'medium' | 'hard') => {
    setSelectedActivity(activity);
    setSelectedDifficulty(difficulty);
    setCurrentView('activity');
  };

  const handleActivityComplete = () => {
    setSelectedActivity(null);
    setCurrentView('class');
  };

  const handleBackToPlanets = () => {
    setSelectedAgeGroup(null);
    setSelectedDifficulty(null);
    setCurrentView('planets');
  };

  const handleOpenProfile = () => {
    setCurrentView('profile');
  };

  const handleCloseProfile = () => {
    setCurrentView('planets');
  };

  const handleResetProfile = () => {
    setUserId('');
    setUsername('');
    setAvatarId(1);
    setOgrenciNumarasi('');
    setSelectedAgeGroup(null);
    setSelectedDifficulty(null);
    setSelectedActivity(null);
    setCurrentView('avatar');
  };

  const handleLogout = () => {
    setUserId('');
    setUsername('');
    setAvatarId(1);
    setOgrenciNumarasi('');
    setSelectedAgeGroup(null);
    setSelectedDifficulty(null);
    setSelectedActivity(null);
    setCurrentView('entry');
  };

  const handleOpenInventorTools = () => {
    setCurrentView('inventorTools');
  };

  const handleCloseInventorTools = () => {
    setCurrentView('planets');
  };

  const handleToolSelect = (toolId: string) => {
    setSelectedToolId(toolId);
    setCurrentView('tool');
  };

  const handleBackFromTool = () => {
    setSelectedToolId(null);
    setCurrentView('inventorTools');
  };

  const handleOpenPlanning = () => {
    setCurrentView('planning');
  };

  const handleClosePlanning = () => {
    setCurrentView('planets');
  };

  const handleBackToEntry = () => {
    setCurrentView('entry');
  };

  const handleHomeClick = () => {
    setCurrentView('planets');
  };

  const handleClosePrivacy = () => {
    window.location.hash = '';
    setCurrentView('entry');
    document.title = 'Mucit Evreni';
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    sessionStorage.setItem('mucit_admin_auth', 'true');
    setCurrentView('adminDashboard');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('mucit_admin_auth');
    window.location.hash = '';
    setCurrentView('entry');
  };

  const showHeader = currentView !== 'entry' && currentView !== 'avatar' && currentView !== 'parentTeacher' && currentView !== 'privacy' && currentView !== 'adminLogin' && currentView !== 'adminDashboard';
  const showHomeButton = currentView !== 'planets';

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-x-hidden">
        <div className="w-full max-w-[100vw] mx-auto">
          {showHeader && (
            <Header
              userId={userId}
              onProfileClick={handleOpenProfile}
              onHomeClick={handleHomeClick}
              showHomeButton={showHomeButton}
            />
          )}
          
          <main 
            className={`${showHeader ? 'pt-[120px] sm:pt-[130px] md:pt-[140px]' : ''} px-3 sm:px-4 md:px-6 pb-6 sm:pb-8 md:pb-10`}
            style={{ 
              position: 'relative', 
              zIndex: 1,
              minHeight: showHeader ? 'calc(100vh - 120px)' : '100vh'
            }}
          >
            <Suspense fallback={<LoadingFallback />}>
              {currentView === 'entry' && (
                <EntrySelection
                  onStudentEntry={handleStudentEntry}
                  onParentTeacherEntry={handleParentTeacherEntry}
                />
              )}
              
              {currentView === 'avatar' && (
                <AvatarSelection onComplete={handleAvatarComplete} />
              )}
              
              {currentView === 'planets' && (
                <PlanetSelection
                  userId={userId}
                  onPlanetSelect={handlePlanetSelect}
                  onPlanningOpen={handleOpenPlanning}
                  onToolsOpen={handleOpenInventorTools}
                />
              )}
              
              {currentView === 'class' && selectedAgeGroup && (
                <ClassView
                  userId={userId}
                  ageGroup={selectedAgeGroup}
                  onBack={handleBackToPlanets}
                />
              )}
              
              {currentView === 'activity' && selectedActivity && selectedAgeGroup && selectedDifficulty && (
                <ActivityPlayer
                  userId={userId}
                  activity={selectedActivity}
                  ageGroup={selectedAgeGroup}
                  difficulty={selectedDifficulty}
                  onComplete={handleActivityComplete}
                  onBack={handleActivityComplete}
                />
              )}
              
              {currentView === 'profile' && (
                <ProfileSettings
                  userId={userId}
                  ogrenciNumarasi={ogrenciNumarasi}
                  onClose={handleCloseProfile}
                  onReset={handleResetProfile}
                  onLogout={handleLogout}
                />
              )}
              
              {currentView === 'inventorTools' && (
                <InventorTools
                  userId={userId}
                  onClose={handleCloseInventorTools}
                  onToolSelect={handleToolSelect}
                />
              )}
              
              {currentView === 'tool' && selectedToolId && (
                <ToolRouter
                  toolId={selectedToolId}
                  onBack={handleBackFromTool}
                />
              )}
              
              {currentView === 'planning' && (
                <Planning
                  userId={userId}
                  onClose={handleClosePlanning}
                />
              )}
              
              {currentView === 'parentTeacher' && (
                <ParentTeacherDashboard onBack={handleBackToEntry} />
              )}

              {currentView === 'privacy' && (
                <PrivacyPolicy onBack={handleClosePrivacy} />
              )}

              {currentView === 'adminLogin' && (
                <AdminLogin onLogin={handleAdminLogin} />
              )}

              {currentView === 'adminDashboard' && isAdminAuthenticated && (
                <AdminDashboard />
              )}
            </Suspense>
          </main>
          
          <Footer />
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

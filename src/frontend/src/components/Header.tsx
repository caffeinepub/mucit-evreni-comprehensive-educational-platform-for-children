import { Sparkles, User, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AchievementLevel } from '../types';
import { useState, useEffect } from 'react';

interface HeaderProps {
  userId: string;
  onProfileClick: () => void;
  onHomeClick: () => void;
  showHomeButton: boolean;
}

const achievementLabels: Record<AchievementLevel, string> = {
  'Acemi': 'Acemi',
  'Çırak': 'Çırak',
  'Usta': 'Usta',
  'Uzman': 'Uzman',
  'Dahi': 'Dahi',
  'Mucit': 'Mucit',
};

const achievementImages: Record<AchievementLevel, string> = {
  'Acemi': '/assets/generated/acemi-badge-transparent.dim_100x100.png',
  'Çırak': '/assets/generated/cirak-badge-transparent.dim_100x100.png',
  'Usta': '/assets/generated/usta-badge-transparent.dim_100x100.png',
  'Uzman': '/assets/generated/uzman-badge-transparent.dim_100x100.png',
  'Dahi': '/assets/generated/dahi-badge-transparent.dim_100x100.png',
  'Mucit': '/assets/generated/mucit-badge-transparent.dim_100x100.png',
};

const avatars = [
  { id: 1, image: '/assets/generated/avatar-boy-modern-transparent.dim_150x150.png' },
  { id: 2, image: '/assets/generated/avatar-girl-modern-transparent.dim_150x150.png' },
  { id: 3, image: '/assets/generated/avatar-boy-studious-transparent.dim_150x150.png' },
  { id: 4, image: '/assets/generated/avatar-girl-curly-transparent.dim_150x150.png' },
  { id: 5, image: '/assets/generated/avatar-boy-sports-transparent.dim_150x150.png' },
  { id: 6, image: '/assets/generated/avatar-girl-artist-transparent.dim_150x150.png' },
  { id: 7, image: '/assets/generated/avatar-boy-scientist-transparent.dim_150x150.png' },
  { id: 8, image: '/assets/generated/avatar-girl-explorer-transparent.dim_150x150.png' },
];

export default function Header({ userId, onProfileClick, onHomeClick, showHomeButton }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  // ALWAYS get data from localStorage as primary source for immediate display
  const storedUsername = localStorage.getItem('mucit_username') || 'Öğrenci';
  const storedAvatarId = localStorage.getItem('mucit_avatarId') || '1';
  const storedScore = localStorage.getItem('mucit_totalScore') || '0';
  const storedLevel = (localStorage.getItem('mucit_achievementLevel') as AchievementLevel) || 'Acemi';
  const storedProgress = localStorage.getItem('mucit_mucitSeviyesi') || '0';
  
  // Use localStorage directly (no backend query)
  const username = storedUsername;
  const avatarId = Number(storedAvatarId);
  const totalScore = Number(storedScore);
  const achievementLevel = storedLevel;
  const mucitSeviyesi = Number(storedProgress);

  const currentAvatar = avatars.find(a => a.id === avatarId) || avatars[0];

  // Handle scroll behavior for shadow effect
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setIsScrolled(currentScrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // ALWAYS render the header with all elements visible
  return (
    <header 
      className={`fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-600/95 to-pink-600/95 backdrop-blur-md border-b border-white/10 transition-shadow duration-300 ${
        isScrolled ? 'shadow-lg' : ''
      }`}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        willChange: 'transform',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
    >
      <div className="w-full max-w-[100vw] mx-auto px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3">
        {/* Top Row: Logo/Title + Profile Info - ALWAYS VISIBLE */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 mb-2 sm:mb-2.5">
          <button 
            onClick={onHomeClick}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none min-w-0 flex-shrink"
            aria-label="Ana Sayfaya Dön"
            style={{ zIndex: 101 }}
          >
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-yellow-300 animate-pulse flex-shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 min-w-0">
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white truncate">
                Mucit Evreni
              </h1>
              <span className="text-[10px] sm:text-xs md:text-sm lg:text-base text-white/90 font-medium whitespace-nowrap">
                – Oyna, Öğren, Keşfet!
              </span>
            </div>
          </button>

          <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 flex-shrink-0" style={{ zIndex: 101 }}>
            {showHomeButton && (
              <Button
                onClick={onHomeClick}
                variant="ghost"
                className="text-white hover:bg-white/20 gap-1 px-1.5 sm:px-2 md:px-3 h-7 sm:h-8 md:h-9 text-xs sm:text-sm"
              >
                <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Ana Sayfa</span>
              </Button>
            )}

            {/* Username - ALWAYS VISIBLE on larger screens */}
            {userId && username && (
              <div className="hidden lg:flex items-center gap-1.5 bg-white/10 rounded-full px-2 sm:px-3 py-1 sm:py-1.5">
                <span className="text-white font-bold text-xs sm:text-sm truncate max-w-[100px]">{username}</span>
              </div>
            )}

            {/* Score (Kazanılan Rozetler) - ALWAYS VISIBLE */}
            {userId && (
              <div className="flex items-center gap-1 sm:gap-1.5 bg-white/10 rounded-full px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5">
                <img 
                  src="/assets/generated/coin-icon-transparent.dim_64x64.png" 
                  alt="Coins" 
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0"
                />
                <span className="text-white font-bold text-xs sm:text-sm">{totalScore}</span>
              </div>
            )}

            {/* Achievement Badge - ALWAYS VISIBLE on medium+ screens */}
            {userId && (
              <div className="hidden md:flex items-center gap-1.5 bg-white/10 rounded-full px-2 sm:px-3 py-1 sm:py-1.5">
                <img 
                  src={achievementImages[achievementLevel]}
                  alt={achievementLabels[achievementLevel]}
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                />
                <span className="text-white font-bold text-xs sm:text-sm">
                  {achievementLabels[achievementLevel]}
                </span>
              </div>
            )}

            {/* Avatar - ALWAYS VISIBLE */}
            {userId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onProfileClick}
                className="rounded-full bg-white/10 hover:bg-white/20 p-0.5 h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 flex-shrink-0"
              >
                <img 
                  src={currentAvatar.image} 
                  alt="Avatar" 
                  className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full"
                />
              </Button>
            )}
          </div>
        </div>

        {/* Bottom Row: Progress Bar (İlerleme Yüzdeleri) - ALWAYS VISIBLE */}
        {userId && (
          <div className="w-full max-w-full sm:max-w-md" style={{ zIndex: 101 }}>
            <div className="flex items-center justify-between mb-1 sm:mb-1.5">
              <span className="text-[10px] sm:text-xs text-white/90 font-medium">İlerleme Yüzdeleri</span>
              <span className="text-[10px] sm:text-xs text-white font-bold">{mucitSeviyesi}%</span>
            </div>
            <Progress value={mucitSeviyesi} className="h-1.5 sm:h-2 bg-white/20" />
          </div>
        )}
      </div>
    </header>
  );
}

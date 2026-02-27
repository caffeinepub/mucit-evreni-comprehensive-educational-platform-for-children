import { useEffect, useRef } from 'react';
import { useActor } from './useActor';

const MOTIVATIONAL_MESSAGES = [
  'Harika ilerliyorsun! 🌟',
  'Biraz daha düşün, başarabilirsin! 💪',
  'Muhteşem bir mucitsin! 🚀',
  'Öğrenmeye devam et! 📚',
  'Hayal gücün sınırsız! ✨',
  'Bugün ne öğreneceksin? 🎯',
  'Sen harikasın! 🌈',
  'Başarıya giden yoldasın! 🏆',
];

const BEDTIME_MESSAGE = 'Hadi uyku vakti! 😴';

export function useNotifications(userId: string, enabled: boolean) {
  const { actor } = useActor();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const bedtimeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageIndexRef = useRef<number>(-1);

  useEffect(() => {
    if (!userId || !enabled || !actor) {
      // Clear intervals if disabled
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (bedtimeIntervalRef.current) {
        clearInterval(bedtimeIntervalRef.current);
        bedtimeIntervalRef.current = null;
      }
      return;
    }

    // Function to get a random motivational message (avoiding repetition)
    const getRandomMessage = () => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
      } while (randomIndex === lastMessageIndexRef.current && MOTIVATIONAL_MESSAGES.length > 1);
      
      lastMessageIndexRef.current = randomIndex;
      return MOTIVATIONAL_MESSAGES[randomIndex];
    };

    // Function to show notification
    const showNotification = (message: string) => {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Mucit Evreni', {
          body: message,
          icon: '/assets/generated/notification-icon-transparent.dim_32x32.png',
        });
      }
    };

    // Send random motivational messages during the day (every 2 hours)
    const sendMotivationalMessage = () => {
      const message = getRandomMessage();
      showNotification(message);
    };

    // Check if it's bedtime (around 9 PM)
    const checkBedtime = () => {
      const now = new Date();
      const hour = now.getHours();
      
      // Send bedtime reminder at 9 PM
      if (hour === 21) {
        showNotification(BEDTIME_MESSAGE);
      }
    };

    // Set up motivational message interval (every 2 hours)
    intervalRef.current = setInterval(sendMotivationalMessage, 2 * 60 * 60 * 1000);

    // Set up bedtime check interval (every hour)
    bedtimeIntervalRef.current = setInterval(checkBedtime, 60 * 60 * 1000);

    // Check bedtime immediately
    checkBedtime();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (bedtimeIntervalRef.current) {
        clearInterval(bedtimeIntervalRef.current);
      }
    };
  }, [userId, enabled, actor]);
}

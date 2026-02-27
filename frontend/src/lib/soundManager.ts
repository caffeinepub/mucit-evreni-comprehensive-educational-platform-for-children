import { SoundCategory } from '../backend';

// Sound manager for playing game sound effects
class SoundManager {
  private sounds: Map<SoundCategory, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  constructor() {
    this.loadSoundSettings();
  }

  private loadSoundSettings() {
    const profile = localStorage.getItem('currentProfile');
    if (profile) {
      try {
        const parsed = JSON.parse(profile);
        this.enabled = parsed.soundEnabled !== false;
      } catch (e) {
        this.enabled = true;
      }
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async loadSound(category: SoundCategory, url: string) {
    try {
      const audio = new Audio(url);
      audio.preload = 'auto';
      this.sounds.set(category, audio);
    } catch (error) {
      console.error(`Failed to load sound for ${category}:`, error);
    }
  }

  async playSound(category: SoundCategory) {
    if (!this.enabled) return;

    const audio = this.sounds.get(category);
    if (audio) {
      try {
        audio.currentTime = 0;
        await audio.play();
      } catch (error) {
        console.error(`Failed to play sound for ${category}:`, error);
      }
    }
  }

  // Play correct answer sound
  playCorrect() {
    this.playSound(SoundCategory.dogruCevap);
  }

  // Play wrong answer sound
  playWrong() {
    this.playSound(SoundCategory.yanlisCevap);
  }

  // Play selection sound
  playSelection() {
    this.playSound(SoundCategory.secim);
  }

  // Play success/completion sound
  playSuccess() {
    this.playSound(SoundCategory.basari);
  }

  // Play warning sound
  playWarning() {
    this.playSound(SoundCategory.uyari);
  }

  // Play level transition sound
  playTransition() {
    this.playSound(SoundCategory.gecisSesi);
  }
}

// Singleton instance
export const soundManager = new SoundManager();

// Hook for using sound manager in React components
export function useSoundManager() {
  return soundManager;
}

import { useEffect } from 'react';
import { useGetSound } from './useQueries';
import { SoundCategory } from '../backend';
import { soundManager } from '../lib/soundManager';

// Hook to load and initialize sound effects
export function useSoundEffects() {
  const { data: correctSound } = useGetSound(SoundCategory.dogruCevap);
  const { data: wrongSound } = useGetSound(SoundCategory.yanlisCevap);
  const { data: selectionSound } = useGetSound(SoundCategory.secim);
  const { data: successSound } = useGetSound(SoundCategory.basari);
  const { data: warningSound } = useGetSound(SoundCategory.uyari);
  const { data: transitionSound } = useGetSound(SoundCategory.gecisSesi);

  useEffect(() => {
    if (correctSound?.file) {
      soundManager.loadSound(SoundCategory.dogruCevap, correctSound.file.getDirectURL());
    }
  }, [correctSound]);

  useEffect(() => {
    if (wrongSound?.file) {
      soundManager.loadSound(SoundCategory.yanlisCevap, wrongSound.file.getDirectURL());
    }
  }, [wrongSound]);

  useEffect(() => {
    if (selectionSound?.file) {
      soundManager.loadSound(SoundCategory.secim, selectionSound.file.getDirectURL());
    }
  }, [selectionSound]);

  useEffect(() => {
    if (successSound?.file) {
      soundManager.loadSound(SoundCategory.basari, successSound.file.getDirectURL());
    }
  }, [successSound]);

  useEffect(() => {
    if (warningSound?.file) {
      soundManager.loadSound(SoundCategory.uyari, warningSound.file.getDirectURL());
    }
  }, [warningSound]);

  useEffect(() => {
    if (transitionSound?.file) {
      soundManager.loadSound(SoundCategory.gecisSesi, transitionSound.file.getDirectURL());
    }
  }, [transitionSound]);

  return soundManager;
}

import { useEffect, useCallback, useState } from 'react';
import { Audio } from 'expo-av';

const soundSources = [
  require('../assets/sound/confetti/sfx.mp3'),
  require('../assets/sound/confetti/soft.mp3'),
  require('../assets/sound/confetti/wind.mp3'),
];

export default function useTaskCompleteSound() {
  const [sound, setSound] = useState<Audio.Sound>();

  const playSound = useCallback(async () => {
    try {
      const randomIndex = Math.floor(Math.random() * soundSources.length);
      const { sound: newSound } = await Audio.Sound.createAsync(soundSources[randomIndex]);

      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return { playSound };
}

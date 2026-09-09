let audioContext: AudioContext | null = null;

export function playSound(kind: 'click' | 'correct' | 'mission' | 'wrong') {
  try {
    audioContext ??= new AudioContext();
    if (audioContext.state === 'suspended') void audioContext.resume().catch(() => undefined);
    const notes = kind === 'mission' ? [523, 659, 784, 1047] : kind === 'correct' ? [659, 880] : kind === 'wrong' ? [260, 220] : [600];
    notes.forEach((frequency, index) => {
      const oscillator = audioContext!.createOscillator();
      const gain = audioContext!.createGain();
      const time = audioContext!.currentTime + index * 0.115;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, time);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(kind === 'click' ? 0.025 : 0.07, time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
      oscillator.connect(gain);
      gain.connect(audioContext!.destination);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      oscillator.start(time);
      oscillator.stop(time + 0.17);
    });
  } catch {
    // Audio is optional; unsupported browsers keep the learning experience silent.
  }
}
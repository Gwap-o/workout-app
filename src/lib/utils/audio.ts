/**
 * Audio Utility for Rest Timer
 *
 * Provides timer completion sound using Web Audio API.
 * Respects user settings for sound enabled/disabled.
 */

let audioContext: AudioContext | null = null;

/**
 * Initialize audio context (lazy initialization)
 */
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
}

/**
 * Play a pleasant beep sound to indicate timer completion
 * Uses Web Audio API to generate sound programmatically
 *
 * @param enabled - Whether sound is enabled in user settings
 */
export function playTimerCompleteSound(enabled: boolean = true): void {
  if (!enabled) return;

  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Create oscillator for beep
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Configure pleasant beep sound
    oscillator.type = 'sine';
    oscillator.frequency.value = 800; // 800 Hz - pleasant frequency

    // Envelope for smooth sound (attack-decay-sustain-release)
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02); // Quick attack
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1); // Decay
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.2); // Sustain
    gainNode.gain.linearRampToValueAtTime(0, now + 0.25); // Release

    // Play beep
    oscillator.start(now);
    oscillator.stop(now + 0.25);

    // Double beep for emphasis
    setTimeout(() => {
      if (!enabled) return;

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.type = 'sine';
      osc2.frequency.value = 800;

      const startTime = ctx.currentTime;
      gain2.gain.setValueAtTime(0, startTime);
      gain2.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
      gain2.gain.linearRampToValueAtTime(0.2, startTime + 0.1);
      gain2.gain.linearRampToValueAtTime(0.2, startTime + 0.2);
      gain2.gain.linearRampToValueAtTime(0, startTime + 0.25);

      osc2.start(startTime);
      osc2.stop(startTime + 0.25);
    }, 150);

  } catch (error) {
    console.error('Failed to play timer sound:', error);
  }
}

/**
 * Resume audio context if suspended (browser autoplay policy)
 */
export async function resumeAudioContext(): Promise<void> {
  if (audioContext && audioContext.state === 'suspended') {
    try {
      await audioContext.resume();
    } catch (error) {
      console.error('Failed to resume audio context:', error);
    }
  }
}

/**
 * Clean up audio context
 */
export function closeAudioContext(): void {
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
}

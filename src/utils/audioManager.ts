class AudioManager {
  private dogAudioUrl: string | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private hoverSounds: Map<string, HTMLAudioElement> = new Map();

  // Store dog's recorded audio
  setDogAudio(audioBlob: Blob | string) {
    if (typeof audioBlob === 'string') {
      this.dogAudioUrl = audioBlob;
    } else {
      this.dogAudioUrl = URL.createObjectURL(audioBlob);
    }
    this.audioElement = new Audio(this.dogAudioUrl);
  }

  // Get trimmed version of dog audio (shorter for hover effects)
  async getTrimmedAudio(duration: number = 0.5): Promise<string | null> {
    if (!this.dogAudioUrl) return null;
    
    try {
      // For now, return the original audio
      // In a real implementation, you'd use Web Audio API to trim
      return this.dogAudioUrl;
    } catch (error) {
      console.error('Error trimming audio:', error);
      return null;
    }
  }

  // Play dog audio on hover
  playHoverSound(volume: number = 0.3) {
    if (this.audioElement) {
      const sound = this.audioElement.cloneNode() as HTMLAudioElement;
      sound.volume = volume;
      sound.playbackRate = 1.2; // Slightly faster for quick feedback
      sound.play().catch(() => {
        // Ignore if autoplay is blocked
      });
      
      // Clean up after playing
      sound.addEventListener('ended', () => {
        sound.remove();
      });
    }
  }

  // Play default paw sound effect
  playPawSound() {
    // Synthesize a simple "boop" sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }

  // Play success sound
  playSuccessSound() {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create a pleasant upward arpeggio
    const frequencies = [523.25, 659.25, 783.99]; // C, E, G
    
    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = audioContext.currentTime + (index * 0.1);
      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);

      oscillator.start(startTime);
      oscillator.stop(startTime + 0.2);
    });
  }

  // Check if dog audio is available
  hasDogAudio(): boolean {
    return this.dogAudioUrl !== null;
  }

  // Clean up
  cleanup() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }
    if (this.dogAudioUrl && this.dogAudioUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.dogAudioUrl);
    }
    this.hoverSounds.forEach(sound => sound.remove());
    this.hoverSounds.clear();
  }
}

// Export singleton instance
export const audioManager = new AudioManager();

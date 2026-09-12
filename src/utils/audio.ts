// Web Audio API and Speech Synthesis Engine
// 100% self-contained, no external audio files required!

class AudioManager {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMusicPlaying = false;
  private musicInterval: number | null = null;
  private musicStep = 0;
  private musicVolume = 0.4;
  private sfxVolume = 0.8;
  private speechEnabled = true;

  constructor() {
    // Lazy initialize on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
      this.musicGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMusicVolume(val: number) {
    this.musicVolume = Math.max(0, Math.min(1, val));
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  public getMusicVolume(): number {
    return this.musicVolume;
  }

  public setSfxVolume(val: number) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  public setSpeechEnabled(enabled: boolean) {
    this.speechEnabled = enabled;
  }

  public isSpeechOn(): boolean {
    return this.speechEnabled;
  }

  public isMusicOn(): boolean {
    return this.isMusicPlaying;
  }

  // --- Background Music Generator (Happy Kid-Friendly Adventure Tune) ---
  public startMusic() {
    this.initContext();
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;

    // Upbeat C Major pentatonic playful rhythm (Marimba & Pluck style)
    // Notes: C4, E4, G4, A4, C5, D5, G4, E4...
    const melody = [
      { note: 261.63, dur: 0.2 }, // C4
      { note: 329.63, dur: 0.2 }, // E4
      { note: 392.00, dur: 0.2 }, // G4
      { note: 523.25, dur: 0.35 }, // C5
      { note: 440.00, dur: 0.2 }, // A4
      { note: 392.00, dur: 0.25 }, // G4
      { note: 329.63, dur: 0.2 }, // E4
      { note: 293.66, dur: 0.2 }, // D4
      { note: 329.63, dur: 0.2 }, // E4
      { note: 392.00, dur: 0.35 }, // G4
      { note: 523.25, dur: 0.2 }, // C5
      { note: 587.33, dur: 0.2 }, // D5
      { note: 523.25, dur: 0.4 }, // C5
      { note: 392.00, dur: 0.2 }, // G4
      { note: 440.00, dur: 0.3 }, // A4
      { note: 261.63, dur: 0.4 }, // C4
    ];

    const bass = [130.81, 164.81, 196.00, 130.81]; // C3, E3, G3, C3

    const bpm = 120;
    const stepTimeMs = 280;

    this.musicStep = 0;
    this.musicInterval = window.setInterval(() => {
      if (!this.ctx || !this.musicGain || !this.isMusicPlaying) return;

      const currentMelody = melody[this.musicStep % melody.length];
      const currentBass = bass[Math.floor(this.musicStep / 4) % bass.length];

      // Play lead marimba tone
      this.playMarimbaTone(currentMelody.note, currentMelody.dur * 0.9, 0.16);

      // Play bass accent on 1st & 3rd beat
      if (this.musicStep % 2 === 0) {
        this.playBassTone(currentBass, 0.3, 0.22);
      }

      // Play gentle percussion shaker click
      this.playShaker();

      this.musicStep++;
    }, stepTimeMs);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public toggleMusic(): boolean {
    if (this.isMusicPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  private playMarimbaTone(freq: number, duration: number, volume: number) {
    if (!this.ctx || !this.musicGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Fast percussive attack, rounded decay
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before gesture
    }
  }

  private playBassTone(freq: number, duration: number, volume: number) {
    if (!this.ctx || !this.musicGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // ignore
    }
  }

  private playShaker() {
    if (!this.ctx || !this.musicGain) return;
    try {
      // Short white noise burst
      const bufferSize = this.ctx.sampleRate * 0.03;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.03;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 6000;

      noise.connect(filter);
      filter.connect(this.musicGain);
      noise.start();
    } catch {
      // ignore
    }
  }

  // --- Sound Effects ---
  public playCorrect() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0) return;
    try {
      const now = this.ctx.currentTime;
      // Cheerful chime: C5 -> E5 -> G5 -> C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.28, now + idx * 0.08 + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.4);
      });
    } catch {
      // ignore
    }
  }

  public playWrong() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0) return;
    try {
      const now = this.ctx.currentTime;
      // Gentle comic wobble "boing"
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.28);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch {
      // ignore
    }
  }

  public playPop() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // ignore
    }
  }

  public playTick() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(880, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // ignore
    }
  }

  public playVictory() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.sfxVolume <= 0) return;
    try {
      const now = this.ctx.currentTime;
      // Grand celebratory fanfare: G4 -> C5 -> E5 -> G5 -> C6
      const fanfare = [
        { f: 392.00, t: 0, d: 0.12 },
        { f: 523.25, t: 0.12, d: 0.12 },
        { f: 659.25, t: 0.24, d: 0.15 },
        { f: 783.99, t: 0.39, d: 0.2 },
        { f: 1046.50, t: 0.6, d: 0.6 },
      ];

      fanfare.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.f, now + n.t);

        gain.gain.setValueAtTime(0, now + n.t);
        gain.gain.linearRampToValueAtTime(0.3, now + n.t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(now + n.t);
        osc.stop(now + n.t + n.d + 0.05);
      });
    } catch {
      // ignore
    }
  }

  // --- Text-to-Speech Engine (Suara Pembaca Soal Perempuan - Ummi Ayu) ---
  private selectFemaleVoice(lang: string = 'en-US'): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // Female voice name keywords common across OS (Windows, ChromeOS, macOS, iOS, Android, Linux)
    const femaleKeywords = [
      'female',
      'zira',
      'jenny',
      'aria',
      'samantha',
      'victoria',
      'karen',
      'fiona',
      'moira',
      'tessa',
      'veena',
      'hazel',
      'susan',
      'linda',
      'heather',
      'catherine',
      'helena',
      'joana',
      'luciana',
      'google us english',
      'google uk english female',
      'gadis',
      'putri',
      'indonesia female',
    ];

    // First try to find a female voice matching target language
    const langPrefix = lang.split('-')[0].toLowerCase();
    const matchingLangVoices = voices.filter((v) =>
      v.lang.toLowerCase().startsWith(langPrefix)
    );

    const femaleInLang = matchingLangVoices.find((v) => {
      const vName = v.name.toLowerCase();
      return femaleKeywords.some((keyword) => vName.includes(keyword));
    });

    if (femaleInLang) return femaleInLang;

    // If no explicit female keyword in current lang, search any voice with female keyword
    const anyFemale = voices.find((v) => {
      const vName = v.name.toLowerCase();
      return femaleKeywords.some((keyword) => vName.includes(keyword));
    });

    if (anyFemale) return anyFemale;

    // Fallback to first voice of requested language or first available
    return matchingLangVoices[0] || voices[0] || null;
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.speechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // cancel any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);

      // Determine language: if contains Indonesian keywords, use id-ID, else en-US
      const isIndonesian =
        text.includes("Assalamu'alaikum") ||
        text.includes('Selamat') ||
        text.includes('Hebat') ||
        text.includes('Jawaban');
      const lang = isIndonesian ? 'id-ID' : 'en-US';
      utterance.lang = lang;

      // Female teacher voice settings (gentle, warm, elementary-friendly pitch)
      const femaleVoice = this.selectFemaleVoice(lang);
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.rate = 0.86; // Slightly slower, very clear for elementary kids
      utterance.pitch = 1.22; // Female teacher pitch (warm, sweet, articulate)

      // Temporary audio ducking (lower background music while speaking so children hear clearly)
      const currentMusicVol = this.musicVolume;
      if (this.musicGain && this.ctx && this.isMusicPlaying) {
        this.musicGain.gain.setValueAtTime(currentMusicVol * 0.25, this.ctx.currentTime);
      }

      utterance.onend = () => {
        if (this.musicGain && this.ctx && this.isMusicPlaying) {
          this.musicGain.gain.setValueAtTime(currentMusicVol, this.ctx.currentTime);
        }
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        if (this.musicGain && this.ctx && this.isMusicPlaying) {
          this.musicGain.gain.setValueAtTime(currentMusicVol, this.ctx.currentTime);
        }
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }
}

export const audio = new AudioManager();

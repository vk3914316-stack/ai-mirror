/**
 * Speech Recognition and Speech Synthesis utilities for AI Mirror Mentor
 */

export interface SpeechRecognitionResultState {
  transcript: string;
  isFinal: boolean;
}

// Check if browser supports Web Speech API synthesis
export const isSpeechSynthesisSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

// Check if browser supports Web Speech API recognition
export const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
};

/**
 * Clean text for natural speech synthesis:
 * Removes markdown formatting, asterisks, brackets, and emojis so the voice synthesizer
 * sounds natural and doesn't pronounce symbols.
 */
export const cleanTextForSpeech = (text: string): string => {
  return text
    // Remove markdown code blocks and inline code
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove bold, italics, strikethrough markdown
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    // Remove markdown headers
    .replace(/^#+\s+/gm, '')
    // Remove bullets and numbers at line starts
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Remove blockquotes
    .replace(/^\s*>\s+/gm, '')
    // Remove URLs
    .replace(/https?:\/\/\S+/g, '')
    // Remove parentheses surrounding citations or formulas if cluttered
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Text-to-Speech Controller
 */
class SpeechSynthesisController {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();

    // Prefer high-quality, natural English female voices suitable for Dr. Elena
    const preferredVoices = [
      'Google UK English Female',
      'Google US English',
      'Microsoft Sonia Online (Natural)',
      'Microsoft Jenny Online (Natural)',
      'Samantha',
      'Karen',
      'Victoria',
      'Serena',
      'Moira',
      'en-US-Standard-C'
    ];

    for (const name of preferredVoices) {
      const match = this.voices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
      if (match) {
        this.selectedVoice = match;
        return;
      }
    }

    // Fallback: any English female or en-US voice
    const enVoice = this.voices.find(v => v.lang.startsWith('en'));
    if (enVoice) {
      this.selectedVoice = enVoice;
    }
  }

  public speak(
    text: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
      onBoundary?: (e: SpeechSynthesisEvent) => void;
      rate?: number;
      pitch?: number;
    }
  ): boolean {
    if (!isSpeechSynthesisSupported()) {
      options?.onError?.(new Error('Speech synthesis not supported in this browser.'));
      return false;
    }

    // Stop any ongoing speech first
    this.stop();

    const spokenText = cleanTextForSpeech(text);
    if (!spokenText) return false;

    try {
      const utterance = new SpeechSynthesisUtterance(spokenText);
      this.currentUtterance = utterance;

      if (!this.selectedVoice) {
        this.initVoices();
      }
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      utterance.rate = options?.rate ?? 1.0;
      utterance.pitch = options?.pitch ?? 1.02;
      utterance.lang = 'en-US';

      utterance.onstart = () => {
        options?.onStart?.();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        options?.onEnd?.();
      };

      utterance.onerror = (e) => {
        this.currentUtterance = null;
        options?.onError?.(e);
      };

      if (options?.onBoundary) {
        utterance.onboundary = options.onBoundary;
      }

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (err) {
      console.error('Speech synthesis error:', err);
      options?.onError?.(err);
      return false;
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.speaking;
  }
}

export const speechSynthesizer = new SpeechSynthesisController();

/**
 * Speech Recognition Controller
 */
export class SpeechRecognitionSession {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor(
    private callbacks: {
      onStart?: () => void;
      onResult?: (transcript: string, isFinal: boolean) => void;
      onError?: (error: string) => void;
      onEnd?: () => void;
    }
  ) {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      return;
    }

    try {
      this.recognition = new SpeechRecognitionAPI();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.callbacks.onStart?.();
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        const currentText = finalTranscript || interimTranscript;
        this.callbacks.onResult?.(currentText, Boolean(finalTranscript));
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        let errorMsg = 'Could not capture microphone audio.';
        if (event.error === 'not-allowed') {
          errorMsg = 'Microphone permission was denied. Please allow microphone access in your browser settings.';
        } else if (event.error === 'no-speech') {
          errorMsg = 'No speech was detected. Please try speaking again closer to your microphone.';
        } else if (event.error === 'network') {
          errorMsg = 'Network error occurred during speech recognition.';
        }
        this.callbacks.onError?.(errorMsg);
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.callbacks.onEnd?.();
      };
    } catch (e) {
      console.error('Failed to construct SpeechRecognition:', e);
    }
  }

  public start(): boolean {
    if (!this.recognition) {
      this.callbacks.onError?.(
        'Speech recognition is not supported in this browser. You can type your question in the text box.'
      );
      return false;
    }

    try {
      this.recognition.start();
      return true;
    } catch (e: any) {
      // If already started, ignore or restart
      console.warn('Speech recognition start error:', e);
      return false;
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.isListening = false;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

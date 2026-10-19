import React, { useState, useEffect, useRef } from 'react';
import { StudentProfile } from '../../types';
import { MentorAvatar3D, AvatarVoiceState } from '../mentor/MentorAvatar3D';
import {
  speechSynthesizer,
  SpeechRecognitionSession,
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported
} from '../../utils/speechUtils';
import { generateCurriculumResponse, PedagogicalResponse } from '../../utils/pedagogyEngine';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  ShieldCheck,
  RotateCcw,
  Smile,
  Brain,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Info,
  Radio,
  CheckCircle2,
  ChevronDown,
  Sparkle,
  BookOpen,
  HelpCircle,
  X,
  Volume
} from 'lucide-react';

interface AIMentorViewProps {
  profile: StudentProfile;
  initialTopic?: string | null;
  initialSubject?: string | null;
  onClearInitialTopic?: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  speechText?: string;
  time: string;
  sourceEngine?: 'curriculum_engine' | 'gemini_api';
  levelBadge?: string;
  keyTakeaway?: string;
  suggestedFollowUps?: string[];
}

export const AIMentorView: React.FC<AIMentorViewProps> = ({
  profile,
  initialTopic,
  initialSubject,
  onClearInitialTopic
}) => {
  // Selected Subject for adaptation
  const [selectedSubject, setSelectedSubject] = useState<string>(() => {
    return initialSubject || profile.subjects[0]?.name || 'Mathematics & Science';
  });

  // State Management
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${profile.name}! I am Dr. Elena, your interactive 3D AI Mentor. I have adapted my explanations specifically for your ${profile.gradeLabel} curriculum${profile.branch ? ` (${profile.branch})` : ''} focusing on ${profile.subjects[0]?.name || 'your active courses'}.\n\nYou can speak to me using the microphone button, or tap the speaker button on any of my messages to hear me explain aloud with full 3D lip-sync animation!`,
      speechText: `Hello ${profile.name}! I am Dr. Elena, your interactive 3D AI Mentor. I have your ${profile.gradeLabel} curriculum loaded. You can speak to me with the microphone, or click the speaker button to hear me explain with synchronized 3D lip-sync!`,
      time: 'Just now',
      sourceEngine: 'curriculum_engine',
      levelBadge: `${profile.gradeLabel} Adapted`
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceState, setVoiceState] = useState<AvatarVoiceState>('idle');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [autoReadAloud, setAutoReadAloud] = useState(true);
  const [showApiSetupModal, setShowApiSetupModal] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [liveTranscriptPreview, setLiveTranscriptPreview] = useState<string>('');
  const [geminiActive, setGeminiActive] = useState<boolean | null>(null);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const recognitionSessionRef = useRef<SpeechRecognitionSession | null>(null);

  // Probe server AI health
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setGeminiActive(Boolean(data.aiConnected));
      })
      .catch(() => {
        setGeminiActive(false);
      });
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Clean up speech synthesis & recognition on unmount
  useEffect(() => {
    return () => {
      speechSynthesizer.stop();
      if (recognitionSessionRef.current) {
        recognitionSessionRef.current.stop();
      }
    };
  }, []);

  // Update voiceState whenever one of the flags changes
  useEffect(() => {
    if (isListening) {
      setVoiceState('listening');
    } else if (isThinking) {
      setVoiceState('thinking');
    } else if (isSpeaking) {
      setVoiceState('speaking');
    } else {
      setVoiceState('idle');
    }
  }, [isListening, isThinking, isSpeaking]);

  // Handle auto-query when navigated with initialTopic (e.g. from Student Intelligence)
  useEffect(() => {
    if (initialTopic) {
      if (initialSubject) {
        setSelectedSubject(initialSubject);
      }
      handleSendMessage(initialTopic);
      if (onClearInitialTopic) {
        onClearInitialTopic();
      }
    }
  }, [initialTopic, initialSubject]);

  // Dynamic starter prompts based on grade level and subject
  const getDynamicStarterPrompts = () => {
    if (profile.gradeId === 'primary') {
      return [
        `Explain ${selectedSubject} like a fun game`,
        `Give me a playful star challenge!`,
        `How do I draw a picture for this problem?`,
        `What should my bedtime study schedule be?`
      ];
    }
    if (profile.gradeId === 'middle') {
      return [
        `Show an everyday experiment for ${selectedSubject}`,
        `What is my biggest learning gap right now?`,
        `Give me a conceptual quiz on this topic`,
        `How should I structure my 30-minute study sprint?`
      ];
    }
    if (profile.gradeId === 'secondary') {
      return [
        `What are the most repeated board exam questions in ${selectedSubject}?`,
        `How do I avoid sign errors and unit traps?`,
        `Give me a 3-mark numerical problem challenge`,
        `What is my tonight study timetable?`
      ];
    }
    if (profile.gradeId === 'undergrad' || profile.gradeId === 'postgrad') {
      return [
        `Derive the first-principles foundations of ${selectedSubject}`,
        `Analyze time and space complexity trade-offs`,
        `Give me an algorithmic or architectural challenge`,
        `Evaluate empirical edge cases in this domain`
      ];
    }
    // Senior secondary / default
    return [
      `Explain my current learning gap in ${selectedSubject}`,
      `How should I structure my deep focus study tonight?`,
      `Give me a rapid 1-minute conceptual challenge`,
      `What are the invariant physical laws in this topic?`
    ];
  };

  /**
   * Speak a specific text aloud and synchronize avatar mouth animation
   */
  const handleReadAloud = (message: Message) => {
    // If already speaking this message, stop
    if (isSpeaking && speakingMessageId === message.id) {
      speechSynthesizer.stop();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      return;
    }

    const textToSpeak = message.speechText || message.text;
    setIsSpeaking(true);
    setSpeakingMessageId(message.id);

    speechSynthesizer.speak(textToSpeak, {
      onStart: () => {
        setIsSpeaking(true);
        setSpeakingMessageId(message.id);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      },
      onError: (err) => {
        console.warn('Speech synthesis error:', err);
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      }
    });
  };

  const handleStopAudio = () => {
    speechSynthesizer.stop();
    setIsSpeaking(false);
    setSpeakingMessageId(null);
  };

  /**
   * Microphone Voice Input Handler
   */
  const toggleListening = () => {
    setSpeechError(null);

    // If currently speaking, stop audio first
    if (isSpeaking) {
      handleStopAudio();
    }

    if (isListening) {
      if (recognitionSessionRef.current) {
        recognitionSessionRef.current.stop();
      }
      setIsListening(false);
      setLiveTranscriptPreview('');
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      setSpeechError(
        'Speech recognition is not supported in this browser engine. Please type your query in the input box.'
      );
      return;
    }

    const session = new SpeechRecognitionSession({
      onStart: () => {
        setIsListening(true);
        setLiveTranscriptPreview('Listening to your voice... Speak now!');
      },
      onResult: (transcript, isFinal) => {
        setInputValue(transcript);
        setLiveTranscriptPreview(transcript);

        if (isFinal && transcript.trim().length > 3) {
          // Finished utterance: stop and automatically send
          session.stop();
          setIsListening(false);
          setLiveTranscriptPreview('');
          handleSendMessage(transcript);
        }
      },
      onError: (errMsg) => {
        setIsListening(false);
        setLiveTranscriptPreview('');
        setSpeechError(errMsg);
      },
      onEnd: () => {
        setIsListening(false);
        setLiveTranscriptPreview('');
      }
    });

    recognitionSessionRef.current = session;
    const started = session.start();
    if (!started) {
      setIsListening(false);
    }
  };

  /**
   * Send message and receive AI / curriculum-adapted response
   */
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    // Stop listening if active
    if (isListening && recognitionSessionRef.current) {
      recognitionSessionRef.current.stop();
      setIsListening(false);
    }

    // Stop any playing audio
    if (isSpeaking) {
      handleStopAudio();
    }

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLiveTranscriptPreview('');
    setIsTyping(true);
    setIsThinking(true);

    try {
      // 1. Attempt real AI Model call via server-side proxy
      const response = await fetch('/api/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          profile,
          activeSubject: selectedSubject
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.responseText) {
          setIsThinking(false);
          setIsTyping(false);
          setGeminiActive(true);

          const aiMsg: Message = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: data.responseText,
            speechText: data.speechText || data.responseText.slice(0, 160),
            time: 'Just now',
            sourceEngine: 'gemini_api',
            levelBadge: data.levelBadge || `${profile.gradeLabel} · Gemini 3.8 Flash`,
            keyTakeaway: data.keyTakeaway,
            suggestedFollowUps: data.suggestedFollowUps
          };

          setMessages((prev) => [...prev, aiMsg]);

          if (autoReadAloud) {
            handleReadAloud(aiMsg);
          } else {
            setIsSpeaking(true);
            setTimeout(() => setIsSpeaking(false), 2000);
          }
          return;
        }
      }
    } catch {
      // Server endpoint unavailable or network error: gracefully fall back to local curriculum engine
    }

    // 2. Fallback to offline Curriculum Pedagogical Engine
    setTimeout(() => {
      setIsThinking(false);
      setIsTyping(false);

      const pedagogicalResult: PedagogicalResponse = generateCurriculumResponse(
        text,
        profile,
        selectedSubject
      );

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: pedagogicalResult.responseText,
        speechText: pedagogicalResult.speechText,
        time: 'Just now',
        sourceEngine: pedagogicalResult.sourceEngine,
        levelBadge: pedagogicalResult.levelBadge,
        keyTakeaway: pedagogicalResult.keyTakeaway,
        suggestedFollowUps: pedagogicalResult.suggestedFollowUps
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Auto-read aloud if enabled
      if (autoReadAloud) {
        handleReadAloud(aiMsg);
      } else {
        setIsSpeaking(true);
        setTimeout(() => setIsSpeaking(false), 2000);
      }
    }, 600);
  };

  // Handle initialTopic trigger from Student Intelligence
  useEffect(() => {
    if (initialTopic) {
      if (initialSubject) {
        setSelectedSubject(initialSubject);
      }
      handleSendMessage(
        `Dr. Elena, from my Student Intelligence diagnostics: please unpack "${initialTopic}" in ${
          initialSubject || selectedSubject
        } and guide me on how to master it.`
      );
      onClearInitialTopic?.();
    }
  }, [initialTopic, initialSubject]);

  const triggerAvatarGesture = (type: 'speak' | 'think') => {
    if (type === 'speak') {
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 2500);
    } else {
      setIsThinking(true);
      setTimeout(() => setIsThinking(false), 2500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner with Grade Adaptation & AI Engine Status */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-violet-600 rounded-3xl p-6 sm:p-7 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center ring-2 ring-white/30 text-white shadow-inner shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl font-bold tracking-tight">AI Mentor · Dr. Elena</h2>
              <span className="text-[10px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-300 animate-pulse" />
                <span>3D Voice Interactive</span>
              </span>
              <span className="text-[10px] font-bold bg-purple-900/40 text-purple-200 px-2.5 py-0.5 rounded-full border border-purple-400/30">
                Level: {profile.gradeLabel}
              </span>
            </div>
            <p className="text-xs text-purple-100 max-w-xl leading-relaxed">
              Real-time voice dialogue with autonomous 3D facial lip-sync, mouse rotation, and curriculum-grounded Socratic explanations.
            </p>
          </div>
        </div>

        {/* API Engine Status & Setup Indicator */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setShowApiSetupModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold bg-white/15 hover:bg-white/25 px-3 py-2 rounded-xl backdrop-blur-xs border border-white/20 transition-all text-white shadow-2xs"
            title="Inspect AI Engine & API setup status"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-300/40 animate-pulse" />
            <span>AI Status: Active Engine</span>
            <Info className="w-3.5 h-3.5 text-purple-200" />
          </button>
        </div>
      </div>

      {/* Curriculum Subject & Voice Settings Control Bar */}
      <div className="bg-white rounded-2xl border border-purple-100 p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Active Subject Focus:</span>
          </div>

          <div className="relative">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="appearance-none bg-purple-50 hover:bg-purple-100/70 border border-purple-200 text-purple-900 font-semibold rounded-xl pl-3 pr-8 py-1.5 outline-none cursor-pointer text-xs transition-colors"
            >
              {profile.subjects.map((sub) => (
                <option key={sub.id} value={sub.name}>
                  {sub.name} ({sub.masteryPercentage}% Mastery)
                </option>
              ))}
              <option value="General Cognitive Strategy">General Cognitive Strategy</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-purple-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70">
            <span>Pedagogical Target:</span>
            <span className="font-semibold text-slate-800">{profile.gradeLabel}</span>
          </div>
        </div>

        {/* Voice Toggles: Auto-Read Aloud & Stop Audio */}
        <div className="flex items-center gap-2">
          {isSpeaking && (
            <button
              onClick={handleStopAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-semibold hover:bg-rose-100 transition-all animate-pulse"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Stop Audio</span>
            </button>
          )}

          <button
            onClick={() => setAutoReadAloud(!autoReadAloud)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold transition-all ${
              autoReadAloud
                ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="Automatically read AI responses aloud with 3D lip-sync"
          >
            {autoReadAloud ? (
              <Volume2 className="w-3.5 h-3.5 text-purple-600" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>Auto-Read: {autoReadAloud ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* Student Intelligence Context Integration Strip */}
      <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-2.5 px-4 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2 text-purple-900">
          <div className="flex items-center gap-1.5 font-bold">
            <Brain className="w-3.5 h-3.5 text-purple-700" />
            <span>Student Intelligence Active:</span>
          </div>
          <span className="text-purple-700/80">
            {profile.name} · {profile.gradeLabel}
          </span>
          <span className="hidden md:inline text-purple-300">•</span>
          {profile.mirrorData?.gaps?.[0] && (
            <span className="hidden sm:inline bg-purple-100/90 text-purple-800 px-2 py-0.5 rounded-md font-medium text-[11px] border border-purple-200">
              Focus Gap: {profile.mirrorData.gaps[0].concept}
            </span>
          )}
          {profile.quizResults && profile.quizResults.length > 0 && (
            <span className="hidden lg:inline bg-emerald-100/80 text-emerald-800 px-2 py-0.5 rounded-md font-medium text-[11px] border border-emerald-200">
              Latest Quiz: {profile.quizResults[0].score}% ({profile.quizResults[0].subject})
            </span>
          )}
        </div>
        <div className="text-[11px] font-semibold text-purple-700">
          Tailoring tone & concepts to your curriculum
        </div>
      </div>

      {/* Main Grid: 3D Avatar (Left) + Chat Panel (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: 3D Interactive Virtual Human Avatar */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="h-[430px] sm:h-[490px] lg:h-[550px] relative">
            <MentorAvatar3D
              isSpeaking={isSpeaking}
              isThinking={isThinking}
              isListening={isListening}
              voiceState={voiceState}
            />

            {/* Speaking Audio Wave Visualizer Overlay when speaking */}
            {isSpeaking && (
              <div className="absolute bottom-12 left-4 right-4 bg-purple-950/85 backdrop-blur-md text-white p-3 rounded-2xl border border-purple-400/30 flex items-center justify-between shadow-lg animate-in fade-in zoom-in-95">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-end gap-1 h-4">
                    <span className="w-1 bg-purple-400 h-2.5 animate-bounce rounded-full" />
                    <span className="w-1 bg-purple-300 h-4 animate-bounce [animation-delay:0.15s] rounded-full" />
                    <span className="w-1 bg-purple-400 h-3 animate-bounce [animation-delay:0.3s] rounded-full" />
                    <span className="w-1 bg-purple-200 h-4.5 animate-bounce [animation-delay:0.45s] rounded-full" />
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">Dr. Elena is Speaking</div>
                    <div className="text-[10px] text-purple-200">Autonomous 3D mouth lip-sync active</div>
                  </div>
                </div>

                <button
                  onClick={handleStopAudio}
                  className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-[11px] font-bold transition-colors"
                >
                  Stop
                </button>
              </div>
            )}

            {/* Listening Banner Overlay when mic is active */}
            {isListening && (
              <div className="absolute bottom-12 left-4 right-4 bg-rose-950/85 backdrop-blur-md text-white p-3 rounded-2xl border border-rose-400/30 flex items-center justify-between shadow-lg animate-in fade-in zoom-in-95">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">Listening to your question...</div>
                    <div className="text-[10px] text-rose-200">Speak into your microphone now</div>
                  </div>
                </div>

                <button
                  onClick={toggleListening}
                  className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-[11px] font-bold transition-colors"
                >
                  Done Speaking
                </button>
              </div>
            )}
          </div>

          {/* Quick Voice & Gesture Interaction Dock */}
          <div className="p-3 bg-white rounded-2xl border border-purple-100 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
            <button
              onClick={toggleListening}
              className={`flex-1 min-w-[140px] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs ${
                isListening
                  ? 'bg-rose-600 text-white ring-2 ring-rose-300 animate-pulse'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>Stop Listening</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Speak to Dr. Elena</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => triggerAvatarGesture('speak')}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1 ${
                  isSpeaking
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                }`}
                title="Trigger nod gesture"
              >
                <Smile className="w-3.5 h-3.5" />
                <span>Nod</span>
              </button>

              <button
                type="button"
                onClick={() => triggerAvatarGesture('think')}
                className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex items-center gap-1 ${
                  isThinking
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                }`}
                title="Trigger thinking gesture"
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Ponder</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Chat & Voice Dialogue Panel */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-purple-100 shadow-xs flex flex-col h-[560px] lg:h-[620px] overflow-hidden">
          {/* Chat Header with Status Pill */}
          <div className="px-5 py-3.5 border-b border-purple-50 bg-gradient-to-r from-purple-50/50 via-white to-purple-50/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs ring-1 ring-purple-200 shadow-2xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    Socratic Dialogue with Dr. Elena
                  </h3>
                  {/* Real-time State Badge */}
                  {isListening ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      Listening
                    </span>
                  ) : isThinking ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-bounce" />
                      Thinking
                    </span>
                  ) : isSpeaking ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-purple-600 animate-pulse" />
                      Speaking
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Ready
                    </span>
                  )}

                  {/* Model Connection Badge */}
                  {geminiActive ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 flex items-center gap-1 border border-purple-200 shadow-2xs">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      Gemini 3.8 Flash Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 flex items-center gap-1 border border-slate-200">
                      <Brain className="w-3 h-3 text-purple-600" />
                      Curriculum Engine Active
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Adapted to <span className="font-semibold text-purple-700">{profile.gradeLabel}</span> · Subject: <span className="font-semibold text-slate-700">{selectedSubject}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  handleStopAudio();
                  setMessages([
                    {
                      id: `m-reset-${Date.now()}`,
                      sender: 'ai',
                      text: `Session reset for ${profile.name}. We are focused on ${selectedSubject} at the ${profile.gradeLabel} level. Speak or type your question!`,
                      speechText: `Session reset for ${profile.name}. Ready for ${selectedSubject}. What shall we explore?`,
                      time: 'Just now',
                      sourceEngine: 'curriculum_engine',
                      levelBadge: `${profile.gradeLabel} Adapted`
                    }
                  ]);
                }}
                className="text-slate-400 hover:text-purple-700 transition-colors p-1.5 rounded-lg hover:bg-purple-50"
                title="Restart conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Scroll View */}
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white shadow-2xs'
                      : 'bg-purple-100 text-purple-700 ring-1 ring-purple-200'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                <div
                  className={`max-w-[88%] sm:max-w-md lg:max-w-lg rounded-2xl p-4 text-xs sm:text-sm leading-relaxed relative ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white rounded-tr-xs shadow-2xs'
                      : 'bg-purple-50/60 border border-purple-100 text-slate-800 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  {/* Top Header inside message */}
                  <div className="flex items-center justify-between gap-4 mb-2 text-[10px] opacity-75 font-mono">
                    <span className="font-semibold flex items-center gap-1">
                      {msg.sender === 'user' ? profile.name : 'Dr. Elena · 3D AI Mentor'}
                    </span>
                    <div className="flex items-center gap-2">
                      {msg.levelBadge && (
                        <span className="bg-purple-200/50 text-purple-800 px-1.5 py-0.5 rounded text-[9px] font-sans font-bold">
                          {msg.levelBadge}
                        </span>
                      )}
                      <span>{msg.time}</span>
                    </div>
                  </div>

                  {/* Body Text */}
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>

                  {/* Key Takeaway Pill (if available) */}
                  {msg.keyTakeaway && (
                    <div className="mt-3 pt-2.5 border-t border-purple-200/50 flex items-start gap-1.5 text-[11px] text-purple-900 font-medium">
                      <Sparkle className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-bold">Key Takeaway:</strong> {msg.keyTakeaway}
                      </span>
                    </div>
                  )}

                  {/* Follow-up Prompts (if available) */}
                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-purple-100/80 flex flex-wrap gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider w-full mb-0.5">
                        Suggested Inquiries:
                      </span>
                      {msg.suggestedFollowUps.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(prompt)}
                          className="text-[11px] font-semibold text-purple-700 bg-white hover:bg-purple-100/80 border border-purple-200 rounded-lg px-2.5 py-1 text-left transition-colors"
                        >
                          → {prompt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Speaker Button to Read Aloud (on AI messages) */}
                  {msg.sender === 'ai' && (
                    <div className="mt-3 pt-2 border-t border-purple-100/60 flex items-center justify-between text-[11px]">
                      <span className="text-[10px] text-slate-400 font-sans">
                        {msg.sourceEngine === 'curriculum_engine' ? 'Curriculum Engine' : 'Live LLM'}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleReadAloud(msg)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all text-xs ${
                          isSpeaking && speakingMessageId === msg.id
                            ? 'bg-purple-600 text-white shadow-2xs'
                            : 'bg-white hover:bg-purple-100 text-purple-700 border border-purple-200 shadow-2xs'
                        }`}
                        title={
                          isSpeaking && speakingMessageId === msg.id
                            ? 'Click to stop reading'
                            : 'Click to read aloud with 3D lip-sync'
                        }
                      >
                        {isSpeaking && speakingMessageId === msg.id ? (
                          <>
                            <div className="flex items-center gap-0.5 h-3">
                              <span className="w-0.5 h-3 bg-white animate-pulse" />
                              <span className="w-0.5 h-1.5 bg-white animate-pulse [animation-delay:0.1s]" />
                              <span className="w-0.5 h-2.5 bg-white animate-pulse [animation-delay:0.2s]" />
                            </div>
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                            <span>Read Aloud</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Thinking / Synthesizing State Indicator */}
            {isTyping && (
              <div className="flex items-center gap-3 animate-in fade-in">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-purple-50 p-3 rounded-2xl border border-purple-100 text-xs text-purple-700 flex items-center gap-2 font-medium">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-1 text-[11px] text-slate-600 font-semibold">
                    Dr. Elena is analyzing {selectedSubject} for {profile.gradeLabel}...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Speech Error Banner (if any) */}
          {speechError && (
            <div className="px-4 py-2 bg-amber-50 border-t border-amber-200 text-amber-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{speechError}</span>
              </div>
              <button
                onClick={() => setSpeechError(null)}
                className="text-amber-700 font-bold hover:text-amber-900"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Live Microphone Transcript Strip (when listening) */}
          {isListening && (
            <div className="px-4 py-2 bg-rose-50 border-t border-rose-200 text-rose-800 text-xs flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2 overflow-hidden">
                <Mic className="w-4 h-4 text-rose-600 animate-pulse shrink-0" />
                <span className="font-semibold text-rose-900 shrink-0">Live Voice:</span>
                <span className="italic truncate text-rose-700">
                  {liveTranscriptPreview || 'Listening... speak clearly into your mic.'}
                </span>
              </div>
              <button
                onClick={toggleListening}
                className="text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 px-2 py-0.5 rounded-lg"
              >
                Stop
              </button>
            </div>
          )}

          {/* Starter Quick Prompts Scroll Bar */}
          <div className="p-2.5 border-t border-purple-50 bg-slate-50/50 overflow-x-auto flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase text-slate-400 shrink-0 px-2 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Inquiries:</span>
            </span>
            {getDynamicStarterPrompts().map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="text-xs font-medium text-slate-700 bg-white hover:bg-purple-50 hover:text-purple-700 border border-purple-100 rounded-xl px-3 py-1.5 whitespace-nowrap transition-colors shadow-2xs shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Message Input Form with Microphone Button */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 sm:p-4 bg-white border-t border-purple-100 flex items-center gap-2"
          >
            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-xl border transition-all shrink-0 flex items-center justify-center ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300 animate-pulse'
                  : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200'
              }`}
              title={isListening ? 'Click to stop listening' : 'Click to speak your question'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                isListening
                  ? 'Listening... speak your question into the microphone...'
                  : `Ask Dr. Elena anything about ${selectedSubject} (${profile.gradeLabel})...`
              }
              className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 outline-none focus:border-purple-500 focus:bg-white text-slate-800 placeholder:text-slate-400 transition-all font-medium"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1.5 shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* AI Engine & API Setup Transparency Modal */}
      {showApiSetupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-purple-100 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-50 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    AI Integration & API Setup Status
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    AI Mirror Mentorship Architecture Disclosure
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowApiSetupModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-slate-600">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5">
                <div className="flex items-center gap-2 font-bold text-emerald-900 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Active Engine: Grade-Adapted Pedagogical Intelligence</span>
                </div>
                <p className="text-emerald-800 text-[11px]">
                  Dr. Elena’s responses are dynamically tailored from first principles for your education tier (<strong>{profile.gradeLabel}</strong>) and active subject (<strong>{selectedSubject}</strong>). Responses follow Socratic pedagogy to build conceptual mastery without cognitive fatigue.
                </p>
              </div>

              <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-3.5 space-y-1.5">
                <div className="font-bold text-purple-900 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-purple-600" />
                  <span>Voice Interaction Subsystems:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                  <li>
                    <strong>Microphone Input:</strong> Uses the local Web Speech Recognition API with real-time acoustic analysis.
                  </li>
                  <li>
                    <strong>Speaker Read-Aloud:</strong> Uses the Web Speech Synthesis API with natural English voices.
                  </li>
                  <li>
                    <strong>3D Lip-Sync:</strong> Oscillates the avatar's jaw and mouth cavity geometries in real time during audio playback.
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5 space-y-1.5">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Optional Backend Gemini API Setup:</span>
                </div>
                <p className="text-amber-800 text-[11px]">
                  The application currently runs in frontend autonomous mode. To connect unrestricted generative responses via Gemini:
                </p>
                <ol className="list-decimal list-inside text-amber-800 text-[11px] space-y-0.5">
                  <li>Configure <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[10px]">GEMINI_API_KEY</code> in environment secrets.</li>
                  <li>Mount the server proxy endpoint at <code className="bg-white/80 px-1 py-0.5 rounded font-mono text-[10px]">/api/gemini</code>.</li>
                  <li>The client will automatically upgrade from the verified curriculum engine to live LLM streaming.</li>
                </ol>
                <p className="text-[10px] text-amber-700 italic pt-1">
                  * Note: AI Mirror never fakes live LLM responses; each response is transparently tagged.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowApiSetupModal(false)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

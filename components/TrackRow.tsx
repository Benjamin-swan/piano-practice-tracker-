import React, { useState, useEffect, useRef } from 'react';
import { Song } from '../types';

interface TrackRowProps {
  song: Song;
  onUpdate: (id: string, newCount: number) => void;
  onUpdateMemo: (id: string, memo: string) => void;
  onDelete: (id: string) => void;
}

// C Major Scale Frequencies
const NOTE_FREQUENCIES = [
  261.63, // C4
  293.66, // D4
  329.63, // E4
  349.23, // F4
  392.00, // G4
  440.00, // A4
  493.88, // B4
  523.25, // C5
  587.33, // D5
  659.25, // E5
];

const TrackRow: React.FC<TrackRowProps> = ({ song, onUpdate, onUpdateMemo, onDelete }) => {
  const maxSlots = 10;
  const isComplete = song.practiceCount === maxSlots;
  const [memo, setMemo] = useState(song.memo || '');
  
  // Timer State
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerIntervalRef = useRef<number | null>(null);

  // Sync local memo state if prop changes (e.g. on load)
  useEffect(() => {
    setMemo(song.memo || '');
  }, [song.memo]);

  // Timer Effect
  useEffect(() => {
    if (isRunning) {
      timerIntervalRef.current = window.setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRunning]);

  const toggleTimer = () => setIsRunning(!isRunning);
  
  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleLogTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timeString = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    
    const newEntry = `[Practice: ${timeString}]`;
    const newMemo = memo ? `${memo.trim()} ${newEntry}` : newEntry;
    
    setMemo(newMemo);
    onUpdateMemo(song.id, newMemo);
    
    // Optional: Reset timer after logging
    resetTimer();
  };

  const playNote = (index: number) => {
    try {
      // Create context only on user interaction to comply with browser autoplay policies
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Map index to frequency, clamp to array bounds just in case
      const freq = NOTE_FREQUENCIES[index] || NOTE_FREQUENCIES[0];
      
      osc.type = 'triangle'; // Soft, synth-like tone
      osc.frequency.value = freq;

      const now = ctx.currentTime;
      const attack = 0.05;
      const decay = 0.3;

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + attack);
      gain.gain.exponentialRampToValueAtTime(0.001, now + attack + decay);

      osc.start(now);
      osc.stop(now + attack + decay + 0.1);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const handleSlotClick = (index: number) => {
    const newCount = index + 1;
    
    // Play sound if we are increasing count or clicking a fruit
    playNote(index);

    if (song.practiceCount === newCount) {
        if (newCount === 1 && song.practiceCount === 1) {
            onUpdate(song.id, 0);
            return;
        }
    }
    onUpdate(song.id, newCount);
  };

  const handleMemoBlur = () => {
    if (memo !== song.memo) {
        onUpdateMemo(song.id, memo);
    }
  };

  return (
    <div 
        className={`
            relative rounded-xl p-5 mb-4 transition-all duration-500
            ${isComplete 
                ? 'bg-gradient-to-r from-white to-yellow-50 border-2 border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.2)]' 
                : 'bg-white border border-gray-100 shadow-sm hover:shadow-md'
            }
        `}
    >
      <div className="flex flex-col gap-4">
        
        {/* Top Row: Info + Fruits + Delete */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Song Info Section */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                    <a 
                        href={`https://music.youtube.com/search?q=${encodeURIComponent(song.title)}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1 transition-colors"
                    >
                        ▶ Listen
                    </a>
                </div>
                <h3 className="text-lg font-bold text-gray-800 truncate" title={song.title}>
                    {song.title}
                </h3>
            </div>

            {/* Progress Tracker Section */}
            <div className="flex items-center gap-1 md:gap-2 flex-wrap justify-start md:justify-end">
                {Array.from({ length: maxSlots }, (_, i) => i).map((index) => {
                    const isFilled = index < song.practiceCount;
                    
                    return (
                        <button
                            key={index}
                            onClick={() => handleSlotClick(index)}
                            className="group relative focus:outline-none transition-transform duration-200 active:scale-95"
                            aria-label={`Set progress to ${index + 1}`}
                        >
                            <div 
                                className={`
                                    w-8 h-8 md:w-9 md:h-9 flex items-center justify-center 
                                    transition-all duration-300 ease-out rounded-full
                                    ${isFilled ? 'scale-110' : 'scale-90'}
                                    ${isFilled && isComplete ? 'animate-pulse' : ''}
                                `}
                            >
                                {isFilled ? (
                                    <span className="text-2xl select-none filter drop-shadow-sm animate-bounce-short">
                                        {song.theme}
                                    </span>
                                ) : (
                                    <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-200 group-hover:border-gray-300 group-hover:bg-gray-200 transition-colors" />
                                )}
                            </div>
                            
                            {/* Tooltip for number */}
                            <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-mono">
                                {index + 1}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Delete Action */}
            <button 
                onClick={() => onDelete(song.id)}
                className="text-gray-300 hover:text-red-400 p-2 transition-colors self-start md:self-center"
                title="Remove song"
            >
                ✕
            </button>
        </div>

        {/* Middle Row: Timer & Tools */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2 self-start border border-gray-100">
            <div className="font-mono text-lg font-medium text-gray-700 w-16 text-center">
                {formatTime(seconds)}
            </div>
            <button 
                onClick={toggleTimer}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isRunning ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                title={isRunning ? "Pause" : "Start"}
            >
                {isRunning ? '⏸' : '▶'}
            </button>
            <button 
                onClick={resetTimer}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors"
                title="Reset"
            >
                ↺
            </button>
            
            {!isRunning && seconds > 0 && (
                <button
                    onClick={handleLogTime}
                    className="ml-2 px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full hover:bg-blue-200 transition-colors flex items-center gap-1 animate-fade-in"
                >
                    📝 Log Time
                </button>
            )}
        </div>

        {/* Bottom Row: Memo Input */}
        <div className="border-t border-gray-50 pt-2 mt-1">
             <input
                type="text"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                onBlur={handleMemoBlur}
                onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                placeholder="Add a note... (e.g., Focus on bar 12)"
                className="w-full text-sm text-gray-600 bg-transparent placeholder-gray-300 focus:outline-none focus:placeholder-gray-400 transition-colors py-1"
             />
        </div>

      </div>
      
      {/* Completion Badge (Visual Flourish) */}
      {isComplete && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg transform rotate-12 animate-fade-in-up pointer-events-none">
            MASTERY!
        </div>
      )}
    </div>
  );
};

export default TrackRow;
import React from 'react';

interface PianoKeyConfig {
  note: string;
  freq: number;
  type: 'white' | 'black';
  label?: string;
  // Position index for black keys (based on white key boundaries 1-7)
  positionIndex?: number; 
}

const PIANO_KEYS: PianoKeyConfig[] = [
  { note: 'C4', freq: 261.63, type: 'white', label: 'C' },
  { note: 'C#4', freq: 277.18, type: 'black', positionIndex: 1 },
  { note: 'D4', freq: 293.66, type: 'white' },
  { note: 'D#4', freq: 311.13, type: 'black', positionIndex: 2 },
  { note: 'E4', freq: 329.63, type: 'white' },
  { note: 'F4', freq: 349.23, type: 'white', label: 'F' },
  { note: 'F#4', freq: 369.99, type: 'black', positionIndex: 4 },
  { note: 'G4', freq: 392.00, type: 'white' },
  { note: 'G#4', freq: 415.30, type: 'black', positionIndex: 5 },
  { note: 'A4', freq: 440.00, type: 'white' },
  { note: 'A#4', freq: 466.16, type: 'black', positionIndex: 6 },
  { note: 'B4', freq: 493.88, type: 'white' },
  { note: 'C5', freq: 523.25, type: 'white', label: 'C' },
];

const PianoHeader: React.FC = () => {
  
  const playTone = (freq: number) => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    // Piano-like envelope (Triangle wave for a synth-like pluck)
    osc.type = 'triangle'; 
    osc.frequency.value = freq;

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.02); // Quick attack
    gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5); // Long decay

    osc.start(now);
    osc.stop(now + 1.5);
  };

  const whiteKeys = PIANO_KEYS.filter((k) => k.type === 'white');
  const blackKeys = PIANO_KEYS.filter((k) => k.type === 'black');

  return (
    <div className="w-full h-32 bg-gray-900 flex justify-center items-start overflow-hidden shadow-inner border-b-4 border-gray-800 relative select-none">
      <div className="relative flex h-full w-full max-w-3xl mx-auto shadow-2xl">
        
        {/* Render White Keys */}
        {whiteKeys.map((key, index) => (
          <div
            key={key.note}
            onMouseDown={() => playTone(key.freq)}
            className="flex-1 h-full bg-white border-l border-r border-gray-300 rounded-b-md relative active:bg-gray-100 active:h-[98%] active:shadow-inner transition-all cursor-pointer group"
            role="button"
            aria-label={`Play ${key.note}`}
          >
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-[10px] text-gray-400 font-mono group-hover:text-blue-500">
              {key.label}
            </div>
            {/* Gradient sheen for 3D effect */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-gray-50 to-transparent opacity-50 pointer-events-none" />
          </div>
        ))}

        {/* Render Black Keys (Absolute Positioning) */}
        {blackKeys.map((key) => {
          // There are 8 white keys total (C4 to C5). Each occupies 12.5% width.
          // Black keys are positioned at the boundaries of white keys (12.5%, 25%, 50%, etc.)
          const boundaryPercentage = (key.positionIndex! * 12.5); 
          
          return (
            <div
              key={key.note}
              onMouseDown={(e) => {
                e.stopPropagation(); // Prevent clicking white key underneath
                playTone(key.freq);
              }}
              className="absolute top-0 w-[6%] h-[60%] bg-gray-900 rounded-b-md z-10 cursor-pointer shadow-lg border-b-8 border-gray-800 active:border-b-2 active:h-[58%] transition-all"
              style={{
                left: `calc(${boundaryPercentage}% - 3%)`, // Subtract half width (3%) to center
              }}
              role="button"
              aria-label={`Play ${key.note}`}
            >
              {/* Highlight for plastic look */}
              <div className="absolute bottom-2 left-1 right-1 h-4 bg-gray-800 rounded-sm opacity-50 pointer-events-none" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PianoHeader;

import React, { useState } from 'react';
import { MoodLog } from '../types';

const MoodTracker: React.FC<{logs: MoodLog[]; setLogs: any; onBack: () => void}> = ({ logs, setLogs, onBack }) => {
  const [rating, setRating] = useState(3);
  const [note, setNote] = useState('');

  const moods = [
    { label: 'Terrible', emoji: '😫', val: 1 },
    { label: 'Bad', emoji: '😕', val: 2 },
    { label: 'Okay', emoji: '😐', val: 3 },
    { label: 'Good', emoji: '🙂', val: 4 },
    { label: 'Amazing', emoji: '🤩', val: 5 },
  ];

  const handleLog = () => {
    const newLog: MoodLog = {
      rating,
      note,
      timestamp: new Date(),
      emojis: [moods[rating-1].emoji]
    };
    setLogs([newLog, ...logs]);
    setNote('');
    setRating(3);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] text-white">
      <header className="p-4 bg-[#0d0d0d] border-b border-gray-900 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h2 className="text-xl font-black italic tracking-tighter">MOOD CHECK</h2>
        </div>
        <button onClick={onBack} className="text-gray-500 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-xl mb-8">
          <h3 className="text-2xl font-black italic mb-8 uppercase tracking-tighter">ATHLETE STATE</h3>
          <div className="flex justify-between items-center mb-10">
            {moods.map(m => (
              <button 
                key={m.val}
                onClick={() => setRating(m.val)}
                className={`flex flex-col items-center gap-2 transition-all duration-300 ${rating === m.val ? 'scale-125 opacity-100' : 'opacity-30 grayscale'}`}
              >
                <span className="text-4xl">{m.emoji}</span>
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">{m.label}</span>
              </button>
            ))}
          </div>
          <textarea 
            className="w-full bg-black border border-gray-800 rounded-2xl p-4 text-white text-xs placeholder-gray-700 outline-none mb-6 h-28 resize-none"
            placeholder="HOW ARE WE TRAINING TODAY?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button 
            onClick={handleLog}
            className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-red-600/20 active:scale-95 transition-all"
          >
            Log Session State
          </button>
        </div>

        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6 px-2">State History</h4>
        <div className="space-y-4">
          {logs.map((log, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{moods[log.rating-1].emoji}</span>
                  <div>
                    <h5 className="font-black text-xs uppercase italic">{moods[log.rating-1].label}</h5>
                    <p className="text-[9px] font-bold text-gray-500 uppercase">{log.timestamp.toLocaleDateString()} AT {log.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, idx) => (
                    <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx < log.rating ? 'bg-red-600' : 'bg-gray-800'}`} />
                  ))}
                </div>
              </div>
              {log.note && <p className="text-xs text-gray-500 italic mt-3 border-l-2 border-red-600/30 pl-3 leading-relaxed">"{log.note}"</p>}
            </div>
          ))}
          {logs.length === 0 && <div className="text-center py-20 text-gray-800 uppercase font-black italic text-sm">Silence is not strength. Log your state.</div>}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;

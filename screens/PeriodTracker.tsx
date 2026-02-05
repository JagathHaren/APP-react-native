
import React, { useState } from 'react';
import { PeriodEntry } from '../types';

const PeriodTracker: React.FC<{logs: PeriodEntry[]; setLogs: any; onBack: () => void}> = ({ logs, setLogs, onBack }) => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const [selectedFlow, setSelectedFlow] = useState<'Light' | 'Medium' | 'Heavy'>('Medium');
  const [note, setNote] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const handleLog = () => {
    const newEntry: PeriodEntry = {
      id: Math.random().toString(),
      date: new Date(),
      symptoms: selectedSymptoms,
      flow: selectedFlow,
      note: note
    };
    setLogs([newEntry, ...logs]);
    setNote('');
    setSelectedSymptoms([]);
  };

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]);
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] text-white">
      <header className="p-4 bg-[#0d0d0d] border-b border-gray-900 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h2 className="text-xl font-black italic tracking-tighter">PERIOD LOG</h2>
        </div>
        <button onClick={onBack} className="text-gray-500 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <div className="bg-gradient-to-br from-red-600 to-red-900 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-2">Today's Phase</p>
          <h3 className="text-4xl font-black italic mb-2 tracking-tighter">OVULATION PHASE</h3>
          <p className="text-xs text-red-100 font-bold uppercase tracking-widest opacity-80">High Energy • Max Strength</p>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 mb-8">
          <h4 className="text-xs font-black uppercase tracking-widest text-red-600 mb-6 italic">Log Details</h4>
          
          <div className="space-y-6">
            <div>
              <p className="text-[9px] font-black text-gray-500 uppercase mb-3">Flow Level</p>
              <div className="flex gap-2">
                {['Light', 'Medium', 'Heavy'].map(f => (
                  <button 
                    key={f} 
                    onClick={() => setSelectedFlow(f as any)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${selectedFlow === f ? 'bg-red-600 border-red-600' : 'bg-black border-gray-800 text-gray-500'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[9px] font-black text-gray-500 uppercase mb-3">Symptoms</p>
              <div className="flex flex-wrap gap-2">
                {['Cramps', 'Fatigue', 'Cravings', 'Bloating', 'Headache'].map(s => (
                  <button 
                    key={s} 
                    onClick={() => toggleSymptom(s)}
                    className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border ${selectedSymptoms.includes(s) ? 'bg-white text-black border-white' : 'bg-transparent border-gray-800 text-gray-600'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <textarea 
              className="w-full bg-black border border-gray-800 rounded-2xl p-4 text-xs text-white placeholder-gray-700 outline-none h-24"
              placeholder="NOTES..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <button onClick={handleLog} className="w-full bg-red-600 text-white py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-red-600/20 active:scale-95 transition-all">Save Entry</button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-white italic px-2">Cycle History</h4>
          {logs.length === 0 ? (
            <div className="p-10 text-center bg-gray-900/50 border border-dashed border-gray-800 rounded-3xl text-gray-700 font-bold uppercase text-[10px]">No history found.</div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-black text-xs uppercase text-red-500">{log.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span className="text-[8px] font-black bg-white text-black px-2 py-0.5 rounded-full uppercase">{log.flow} Flow</span>
                </div>
                {log.symptoms.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {log.symptoms.map(s => <span key={s} className="text-[8px] text-gray-500 font-bold border border-gray-800 px-2 py-0.5 rounded-full uppercase">{s}</span>)}
                  </div>
                )}
                {log.note && <p className="text-[10px] text-gray-400 italic font-medium leading-relaxed">"{log.note}"</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PeriodTracker;

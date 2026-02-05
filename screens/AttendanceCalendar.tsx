
import React from 'react';
import { Package } from '../types';

interface AttendanceProps {
  enrolledPackages: Package[];
  attendedDays: number[];
  onToggleAttendance: (day: number) => void;
  onBack: () => void;
}

const AttendanceCalendar: React.FC<AttendanceProps> = ({ enrolledPackages, attendedDays, onToggleAttendance, onBack }) => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] text-white">
      <header className="p-4 bg-[#0d0d0d] border-b border-gray-900 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h2 className="text-xl font-black italic tracking-tighter">ATTENDANCE</h2>
        </div>
        <button onClick={onBack} className="text-gray-500 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <div className="grid grid-cols-1 gap-4 mb-10">
          {enrolledPackages.length > 0 ? enrolledPackages.map(pkg => (
            <div key={pkg.id} className="bg-gray-900 border border-gray-800 p-6 rounded-3xl relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-red-600/5 rounded-full group-hover:bg-red-600/10 transition-colors"></div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-black text-white uppercase italic text-lg tracking-tight">{pkg.name}</h4>
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1 italic">Squad: Verified</p>
                </div>
                <div className="bg-red-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">PRO</div>
              </div>
              <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="text-center flex-1 border-r border-white/5">
                  <p className="text-[9px] text-gray-500 font-black uppercase mb-1">Started</p>
                  <p className="font-black text-xs text-gray-300">MAY 01</p>
                </div>
                <div className="text-center flex-1">
                  <p className="text-[9px] text-gray-500 font-black uppercase mb-1">Expires</p>
                  <p className="font-black text-xs text-red-600">JUN 01</p>
                </div>
              </div>
            </div>
          )) : (
            <div className="p-10 text-center bg-gray-900/50 border border-dashed border-gray-800 rounded-3xl">
              <p className="text-gray-600 font-bold text-xs uppercase italic">No battle plans enrolled.</p>
            </div>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl relative">
          <div className="flex justify-between items-center mb-8 px-2">
            <h4 className="font-black text-white italic tracking-tight uppercase">May Combat Log</h4>
            <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Mark Sessions</div>
          </div>
          
          <div className="grid grid-cols-7 gap-3 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d} className="text-[10px] font-black text-gray-700 uppercase mb-2">{d}</span>)}
            {days.map(d => (
              <button 
                key={d} 
                onClick={() => onToggleAttendance(d)}
                className={`h-11 flex items-center justify-center rounded-xl text-xs font-black transition-all duration-300
                  ${attendedDays.includes(d) 
                    ? 'bg-red-600 text-white shadow-xl shadow-red-600/40 border-transparent' 
                    : 'text-gray-700 bg-black border border-gray-800 hover:border-red-600/30'}
                `}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="mt-10 p-5 bg-white text-black rounded-2xl flex justify-between items-center shadow-2xl">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total Count</span>
              <p className="text-3xl font-black italic tracking-tighter uppercase">{attendedDays.length} SESSIONS</p>
            </div>
            <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-600/20 rotate-3 group-hover:rotate-0 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCalendar;


import React, { useState, useRef } from 'react';
import { FoodLog, WaterLog } from '../types';
import { analyzeFoodImage } from '../services/geminiService';

interface CalorieProps {
  logs: FoodLog[];
  setLogs: React.Dispatch<React.SetStateAction<FoodLog[]>>;
  waterLogs: WaterLog[];
  setWaterLogs: React.Dispatch<React.SetStateAction<WaterLog[]>>;
  onBack: () => void;
}

const CalorieTracker: React.FC<CalorieProps> = ({ logs, setLogs, waterLogs, setWaterLogs, onBack }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<'log' | 'history' | 'recipes' | 'water'>('log');
  const [foodText, setFoodText] = useState('');
  const [amount, setAmount] = useState(100);
  const [unit, setUnit] = useState<'g' | 'ml' | 'oz'>('g');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const totalCalories = logs.reduce((sum, log) => sum + log.calories, 0);
  const totalMacros = logs.reduce((acc, log) => ({
    p: acc.p + log.macros.protein,
    c: acc.c + log.macros.carbs,
    f: acc.f + log.macros.fat
  }), { p: 0, c: 0, f: 0 });

  const totalWater = waterLogs.reduce((sum, log) => sum + log.amount, 0);
  const goals = { cal: 2200, p: 140, c: 220, f: 60, water: 2500 };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsScanning(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const fullBase64 = reader.result as string;
        const base64 = fullBase64.split(',')[1];
        const analysis = await analyzeFoodImage(base64);
        if (analysis) {
          const newLog: FoodLog = {
            id: Math.random().toString(),
            name: analysis.foodName,
            calories: analysis.calories,
            macros: {
              protein: analysis.protein,
              carbs: analysis.carbs,
              fat: analysis.fat
            },
            timestamp: new Date(),
            unit: 'g',
            amount: 100,
            imageUrl: fullBase64
          };
          setLogs(prev => [newLog, ...prev]);
        }
        setIsScanning(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const addManualFood = () => {
    if (!foodText) return;
    const newLog: FoodLog = {
      id: Math.random().toString(),
      name: foodText,
      calories: Math.floor(Math.random() * 400 + 100),
      macros: { protein: 25, carbs: 35, fat: 8 },
      timestamp: new Date(),
      unit,
      amount
    };
    setLogs(prev => [newLog, ...prev]);
    setFoodText('');
  };

  const addWater = (amt: number) => {
    const newLog: WaterLog = {
      id: Math.random().toString(),
      amount: amt,
      timestamp: new Date()
    };
    setWaterLogs(prev => [newLog, ...prev]);
  };

  const deleteWaterLog = (id: string) => {
    setWaterLogs(prev => prev.filter(l => l.id !== id));
  };

  const MacroBar = ({ label, current, goal, color }: any) => (
    <div className="flex-1 space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
        <span>{label}</span>
        <span>{current}g / {goal}g</span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${Math.min((current/goal)*100, 100)}%` }} />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#0d0d0d] text-white">
      <header className="p-4 bg-[#0d0d0d] border-b border-gray-900 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </button>
          <h2 className="text-xl font-black italic">MACRO TRACKER</h2>
        </div>
        <button onClick={onBack} className="text-gray-500 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        </button>
      </header>

      <div className="flex bg-gray-900 p-1 m-4 rounded-2xl border border-gray-800 overflow-x-auto no-scrollbar">
        {['log', 'history', 'water', 'recipes'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-none px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === tab ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'log' && (
          <div className="p-4 space-y-6">
            <div className="bg-white text-black rounded-3xl p-6 shadow-2xl">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Calories</p>
                  <h3 className="text-5xl font-black tracking-tighter">{totalCalories}</h3>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Daily Goal</p>
                  <p className="font-black text-xl italic">{goals.cal}</p>
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <MacroBar label="Protein" current={totalMacros.p} goal={goals.p} color="bg-red-600" />
                <MacroBar label="Carbs" current={totalMacros.c} goal={goals.c} color="bg-black" />
                <MacroBar label="Fats" current={totalMacros.f} goal={goals.f} color="bg-gray-400" />
              </div>
            </div>

            <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800">
              <h4 className="text-xs font-black uppercase tracking-widest text-red-600 mb-6 italic">Snap & Track</h4>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-6 bg-black border border-gray-800 rounded-2xl hover:bg-gray-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Take Photo</span>
                  <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileUpload} />
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center p-6 bg-black border border-gray-800 rounded-2xl hover:bg-gray-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Upload</span>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
                </button>
              </div>
              {isScanning && <div className="mt-4 text-center text-[10px] font-bold text-red-600 animate-pulse uppercase">Gemini AI is analyzing your plate...</div>}
            </div>

            <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800">
              <h4 className="text-xs font-black uppercase tracking-widest text-red-600 mb-6 italic">Manual Log</h4>
              <div className="space-y-4">
                <input type="text" className="w-full px-4 py-4 bg-black text-white border border-gray-800 rounded-xl outline-none" placeholder="FOOD NAME" value={foodText} onChange={(e) => setFoodText(e.target.value)} />
                <button onClick={addManualFood} className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest">Add Log</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-4 space-y-4">
            {logs.length === 0 ? (
              <div className="text-center py-20 text-gray-500 uppercase font-black italic text-sm">No battle scars logged today.</div>
            ) : (
              logs.map(log => (
                <div key={log.id} className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex items-center gap-4">
                  {log.imageUrl && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-black flex-shrink-0">
                      <img src={log.imageUrl} className="w-full h-full object-cover" alt={log.name} />
                    </div>
                  )}
                  <div className="flex-1">
                    <h5 className="font-black text-white uppercase italic text-sm">{log.name}</h5>
                    <p className="text-[9px] font-bold text-gray-500 uppercase">{log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[8px] text-red-500 font-black">P: {log.macros.protein}g</span>
                      <span className="text-[8px] text-gray-400 font-black">C: {log.macros.carbs}g</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-red-600 italic text-sm">{log.calories} KCAL</span>
                    <button onClick={() => setLogs(logs.filter(l => l.id !== log.id))} className="block ml-auto mt-2 text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'water' && (
          <div className="p-4 space-y-6">
            <div className="bg-gradient-to-br from-blue-900 to-black border border-blue-600/20 rounded-3xl p-8 text-center shadow-2xl">
              <h3 className="text-xl font-black italic uppercase mb-2">HYDRATION LEVEL</h3>
              <p className="text-5xl font-black tracking-tighter text-blue-400 mb-2">{totalWater} <span className="text-xs uppercase font-bold text-gray-500">/ {goals.water} ml</span></p>
              <div className="w-full h-2 bg-gray-800 rounded-full mt-6 overflow-hidden">
                <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${Math.min((totalWater/goals.water)*100, 100)}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[250, 500, 750].map(amt => (
                <button key={amt} onClick={() => addWater(amt)} className="bg-gray-900 border border-gray-800 p-4 rounded-2xl font-black text-xs hover:border-blue-500 transition-colors">+{amt}ml</button>
              ))}
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 px-1">Log Entries (Editable)</h4>
              {waterLogs.map(log => (
                <div key={log.id} className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl flex justify-between items-center">
                  <div>
                    <span className="font-black text-sm text-blue-400">{log.amount} ml</span>
                    <p className="text-[9px] text-gray-600 uppercase font-bold">{log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <button onClick={() => deleteWaterLog(log.id)} className="text-red-900 hover:text-red-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalorieTracker;

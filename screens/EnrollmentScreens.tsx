
import React, { useState } from 'react';
import { Package } from '../types';

const PACKAGES: Package[] = [
  { id: 'f1', category: 'fitness', name: 'Group Squad', price: 49, description: 'Live high-intensity sessions with the community.' },
  { id: 'f2', category: 'fitness', name: 'Personal 1v1', price: 149, description: 'Direct access to pro female athletes and custom programs.' },
  { id: 'f3', category: 'fitness', name: 'Elite Athlete', price: 199, description: 'For competitive transformation and stage prep.' },
  { id: 'n1', category: 'nutrition', name: 'Fuel Plan', price: 39, description: 'Calculated macro targets for your cycle and lifestyle.' },
  { id: 'n2', category: 'nutrition', name: 'VIP Nutrition', price: 79, description: '24/7 access to nutritionist and customized prep menus.' },
];

export const EnrollDecisionScreen: React.FC<{onYes: () => void; onNo: () => void}> = ({ onYes, onNo }) => (
  <div className="flex flex-col items-center justify-center h-full p-8 bg-black text-white">
    <div className="w-24 h-24 bg-red-600 rounded-3xl flex items-center justify-center mb-10 rotate-12 shadow-2xl shadow-red-600/20">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    </div>
    <h2 className="text-4xl font-black text-center mb-4 tracking-tighter italic">START YOUR PROGRAM?</h2>
    <p className="text-gray-500 text-center mb-12 font-medium">Join the thousands of women transforming their lives with our proven methodology.</p>
    
    <div className="flex flex-col gap-4 w-full">
      <button 
        onClick={onYes}
        className="bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
      >
        I'M READY
      </button>
      <button 
        onClick={onNo}
        className="bg-transparent text-gray-500 py-4 rounded-xl font-bold uppercase tracking-widest active:scale-95 transition-all"
      >
        LATER
      </button>
    </div>
  </div>
);

export const PackageSelectionScreen: React.FC<{onComplete: (pkgs: Package[]) => void}> = ({ onComplete }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showUpsell, setShowUpsell] = useState(false);

  const togglePackage = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleNext = () => {
    const hasFitness = selectedIds.some(id => PACKAGES.find(p => p.id === id)?.category === 'fitness');
    const hasNutrition = selectedIds.some(id => PACKAGES.find(p => p.id === id)?.category === 'nutrition');
    if ((hasFitness && !hasNutrition) || (!hasFitness && hasNutrition)) {
      setShowUpsell(true);
    } else {
      onComplete(PACKAGES.filter(p => selectedIds.includes(p.id)));
    }
  };

  return (
    <div className="flex flex-col h-full bg-black text-white relative">
      <div className="p-6 bg-black border-b border-gray-900 sticky top-0 z-10">
        <h2 className="text-2xl font-black italic tracking-tighter uppercase">CHOOSE YOUR PATH</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar">
        <section>
          <h3 className="text-xs font-black text-red-600 mb-6 uppercase tracking-widest flex items-center gap-2">
            <span className="w-8 h-[2px] bg-red-600"></span> FITNESS SQUAD
          </h3>
          <div className="space-y-4">
            {PACKAGES.filter(p => p.category === 'fitness').map(pkg => (
              <div 
                key={pkg.id}
                onClick={() => togglePackage(pkg.id)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer ${selectedIds.includes(pkg.id) ? 'border-red-600 bg-red-600/10' : 'border-gray-900 bg-gray-900/50'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-black text-white uppercase italic tracking-tight">{pkg.name}</h4>
                  <span className="text-red-500 font-black italic text-lg">${pkg.price}</span>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">{pkg.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2 opacity-50">
            <span className="w-8 h-[2px] bg-white"></span> FUEL & NUTRITION
          </h3>
          <div className="space-y-4">
            {PACKAGES.filter(p => p.category === 'nutrition').map(pkg => (
              <div 
                key={pkg.id}
                onClick={() => togglePackage(pkg.id)}
                className={`p-6 rounded-3xl border transition-all cursor-pointer ${selectedIds.includes(pkg.id) ? 'border-white bg-white/5' : 'border-gray-900 bg-gray-900/50'}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-black text-white uppercase italic tracking-tight">{pkg.name}</h4>
                  <span className="text-white font-black italic text-lg">${pkg.price}</span>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">{pkg.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="p-6 bg-black border-t border-gray-900">
        <button 
          disabled={selectedIds.length === 0}
          onClick={handleNext}
          className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl disabled:opacity-30 active:scale-95 transition-all"
        >
          CONTINUE (${selectedIds.reduce((sum, id) => sum + (PACKAGES.find(p => p.id === id)?.price || 0), 0)})
        </button>
      </div>

      {showUpsell && (
        <div className="absolute inset-0 bg-black/95 z-50 flex items-center justify-center p-6">
          <div className="bg-gray-900 border border-red-600/30 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
            <h3 className="text-3xl font-black text-white mb-4 italic tracking-tighter uppercase">FUEL YOUR BODY?</h3>
            <p className="text-gray-400 mb-8 text-sm font-medium">Combining training with professional nutrition coaching increases results by up to 300%.</p>
            <div className="flex flex-col gap-3">
              <button onClick={() => setShowUpsell(false)} className="w-full bg-red-600 text-white py-5 rounded-xl font-black uppercase">ADD NUTRITION</button>
              <button onClick={() => onComplete(PACKAGES.filter(p => selectedIds.includes(p.id)))} className="w-full py-4 text-gray-600 font-black uppercase text-xs tracking-widest">NO THANKS</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const PaymentScreen: React.FC<{onComplete: () => void}> = ({ onComplete }) => {
  const [method, setMethod] = useState<'upi' | 'bank' | null>(null);
  const [paid, setPaid] = useState(false);

  const handlePay = () => {
    setPaid(true);
  };

  if (paid) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-black">
        <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mb-10 animate-bounce shadow-2xl shadow-red-600/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
        </div>
        <h2 className="text-4xl font-black text-white mb-4 tracking-tighter italic uppercase">ENROLLED!</h2>
        <p className="text-gray-500 mb-12 font-medium">Welcome to the inner circle. Your journey to peak performance starts now.</p>
        <button onClick={onComplete} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl">LET'S TRAIN</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black text-white p-6">
      <h2 className="text-2xl font-black mb-10 italic uppercase tracking-tighter">SECURE CHECKOUT</h2>
      <div className="space-y-4 mb-10">
        <label className={`flex items-center p-6 rounded-3xl border-2 transition-all cursor-pointer ${method === 'upi' ? 'border-red-600 bg-red-600/5' : 'border-gray-900 bg-gray-900/30'}`} onClick={() => setMethod('upi')}>
          <div className={`w-6 h-6 rounded-full border-2 mr-6 flex items-center justify-center ${method === 'upi' ? 'border-red-600' : 'border-gray-800'}`}>
            {method === 'upi' && <div className="w-3 h-3 bg-red-600 rounded-full" />}
          </div>
          <div className="flex-1">
            <p className="font-black uppercase italic text-sm tracking-tight">UPI FAST PAY</p>
            <p className="text-[10px] text-gray-500 font-bold">G-Pay, PhonePe, Paytm</p>
          </div>
        </label>
        <label className={`flex items-center p-6 rounded-3xl border-2 transition-all cursor-pointer ${method === 'bank' ? 'border-red-600 bg-red-600/5' : 'border-gray-900 bg-gray-900/30'}`} onClick={() => setMethod('bank')}>
          <div className={`w-6 h-6 rounded-full border-2 mr-6 flex items-center justify-center ${method === 'bank' ? 'border-red-600' : 'border-gray-800'}`}>
            {method === 'bank' && <div className="w-3 h-3 bg-red-600 rounded-full" />}
          </div>
          <div className="flex-1">
            <p className="font-black uppercase italic text-sm tracking-tight">BANK TRANSFER</p>
            <p className="text-[10px] text-gray-500 font-bold">IMPS / NEFT Transfer</p>
          </div>
        </label>
      </div>
      <button disabled={!method} onClick={handlePay} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl disabled:opacity-30 mt-auto">PAY NOW</button>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Droplet, Info, Calculator, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChlorineCalculator({ onClose }) {
  const [bleachConcentration, setBleachConcentration] = useState(5); // Default commercial bleach is 5%
  const [waterVolumeLiters, setWaterVolumeLiters] = useState(1);
  const [targetUsage, setTargetUsage] = useState('surfaces'); // 'surfaces' (0.1%) or 'spills' (0.5%)

  // Calculation for Liquid Bleach
  // Formula: Required Bleach (ml) = (Target % / Available %) * Total Volume (ml)
  const targetPercent = targetUsage === 'surfaces' ? 0.1 : 0.5;
  const requiredBleachMl = ((targetPercent / bleachConcentration) * (waterVolumeLiters * 1000)).toFixed(1);
  const waterMl = (waterVolumeLiters * 1000 - requiredBleachMl).toFixed(1);

  // Calculation for Tablets (assuming standard 1.5g active chlorine per tablet NaDCC)
  // 1 tablet in 1 Liter ~ 1500 ppm (Suitable for 1000 ppm target)
  // 4 tablets in 1 Liter ~ 6000 ppm (Suitable for 5000 ppm target)
  const requiredTablets = targetUsage === 'surfaces' ? Math.ceil(waterVolumeLiters * 1) : Math.ceil(waterVolumeLiters * 4);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="bg-teal-600 p-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Calculator size={24} />
            <h2 className="text-xl font-bold">حاسبة تركيز الكلور</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-sm text-blue-800 dark:text-blue-300 flex items-start gap-3">
            <Info className="shrink-0 mt-0.5" size={18} />
            <p>
              تستخدم هذه الحاسبة لتحضير محلول الكلور الموصى به في الدليل القومي. يتم تحضير الكلور يومياً ويفقد فاعليته بعد 24 ساعة.
            </p>
          </div>

          {/* Inputs */}
          <div className="space-y-5 mb-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                1. الغرض من الاستخدام:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setTargetUsage('surfaces')}
                  className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${targetUsage === 'surfaces' ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-teal-300'}`}
                >
                  الأسطح العادية
                  <span className="block text-xs font-normal opacity-70 mt-1">(1000 جزء بالمليون)</span>
                </button>
                <button 
                  onClick={() => setTargetUsage('spills')}
                  className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${targetUsage === 'spills' ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-rose-300'}`}
                >
                  انسكاب الدم
                  <span className="block text-xs font-normal opacity-70 mt-1">(5000 جزء بالمليون)</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                2. تركيز الكلور الخام (الزجاجة المشتراة):
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  value={bleachConcentration}
                  onChange={(e) => setBleachConcentration(Number(e.target.value))}
                  className="w-20 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg p-2 text-center font-bold text-slate-800 dark:text-white"
                />
                <span className="text-slate-500 dark:text-slate-400">% (عادة 5%)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                3. كمية المياه المطلوبة باللتر:
              </label>
              <input 
                type="range" 
                min="1" max="10" step="1"
                value={waterVolumeLiters}
                onChange={(e) => setWaterVolumeLiters(Number(e.target.value))}
                className="w-full accent-teal-500"
              />
              <div className="text-center font-bold text-teal-600 dark:text-teal-400 mt-2 text-lg">
                {waterVolumeLiters} لتر
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 border-2 border-dashed border-teal-200 dark:border-teal-900">
            <h3 className="font-bold text-slate-800 dark:text-white mb-4 text-center">النتيجة (كيفية التحضير)</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                <span className="text-slate-600 dark:text-slate-300 text-sm font-bold flex items-center gap-2">
                  <Droplet className="text-teal-500" size={18} />
                  كلور سائل خام:
                </span>
                <span className="font-bold text-lg text-teal-600 dark:text-teal-400" dir="ltr">{requiredBleachMl} ml</span>
              </div>
              
              <div className="text-center text-slate-400 text-sm">يضاف إلى</div>

              <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-xl shadow-sm">
                <span className="text-slate-600 dark:text-slate-300 text-sm font-bold flex items-center gap-2">
                  <Droplet className="text-blue-500" size={18} />
                  ماء:
                </span>
                <span className="font-bold text-lg text-blue-600 dark:text-blue-400" dir="ltr">{waterMl} ml</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-600">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">بديل الأقراص (NaDCC 1.5g):</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm bg-slate-100 dark:bg-slate-900 p-3 rounded-lg text-center">
                أضف <strong className="text-teal-600 dark:text-teal-400 text-lg">{requiredTablets}</strong> أقراص إلى {waterVolumeLiters} لتر ماء.
              </p>
            </div>

          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}

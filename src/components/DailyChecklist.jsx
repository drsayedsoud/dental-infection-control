import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Trash2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const CHECKLIST_DATA = [
  {
    title: "بداية اليوم (Pre-Clinic)",
    items: [
      "غسل اليدين روتينياً وتجهيز الواقيات الشخصية.",
      "تشغيل المياه في الوحدة (Flushing) لمدة دقيقتين لتقليل البيوفيلم.",
      "تجهيز الآلات المغلفة والمعقمة لكل مريض.",
      "تغطية الأسطح والمقابض (Barriers) بالعوازل البلاستيكية."
    ]
  },
  {
    title: "بين كل مريض وآخر (Between Patients)",
    items: [
      "التخلص من العوازل والنفايات في الأكياس المناسبة.",
      "تشغيل خطوط المياه والهواء لمدة 30 ثانية لتفريغ السوائل.",
      "تطهير الأسطح المكشوفة بمركبات الكلور (1000 جزء بالمليون).",
      "فك التوربينات والآلات، ونقعها لإرسالها للتعقيم."
    ]
  },
  {
    title: "نهاية اليوم (End of Day)",
    items: [
      "التخلص من حاويات الحادة (Safety Box) إذا امتلأت للثلثين.",
      "تنظيف فلاتر شفط اللعاب ومسارات المياه.",
      "مسح كرسي الأسنان والأسطح بالماء والمنظف ثم تطهيرها.",
      "غسل الأيدي جيدا قبل المغادرة."
    ]
  }
];

export default function DailyChecklist({ onClose }) {
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('dentalChecklist');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('dentalChecklist', JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggleCheck = (sectionIndex, itemIndex) => {
    const key = `${sectionIndex}-${itemIndex}`;
    setCheckedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const resetChecklist = () => {
    if (window.confirm('هل أنت متأكد من تصفير قائمة المهام وبدء يوم جديد؟')) {
      setCheckedItems({});
    }
  };

  const totalItems = CHECKLIST_DATA.reduce((acc, curr) => acc + curr.items.length, 0);
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const progress = Math.round((checkedCount / totalItems) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="bg-teal-600 p-4 sm:p-6 text-white flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <CheckSquare size={28} />
            <div>
              <h2 className="text-xl font-bold">قائمة تدقيق العيادة</h2>
              <p className="text-teal-100 text-sm">مكافحة العدوى اليومية</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto">
          {/* Progress */}
          <div className="mb-6 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">اكتمال المهام</span>
              <span className="font-bold text-teal-600 dark:text-teal-400">{progress}%</span>
            </div>
            <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-teal-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-6">
            {CHECKLIST_DATA.map((section, sIdx) => (
              <div key={sIdx}>
                <h3 className="font-bold text-lg text-slate-800 dark:text-white border-b-2 border-teal-100 dark:border-slate-700 pb-2 mb-3">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item, iIdx) => {
                    const isChecked = checkedItems[`${sIdx}-${iIdx}`];
                    return (
                      <label 
                        key={iIdx} 
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          isChecked 
                            ? 'bg-teal-50 border-teal-200 dark:bg-teal-900/20 dark:border-teal-800' 
                            : 'bg-white border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700/50'
                        }`}
                      >
                        <div className="mt-0.5">
                          {isChecked ? (
                            <ShieldCheck className="text-teal-500" size={20} />
                          ) : (
                            <div className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-600" />
                          )}
                        </div>
                        <span className={`text-sm leading-relaxed ${isChecked ? 'text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                          {item}
                        </span>
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={!!isChecked}
                          onChange={() => toggleCheck(sIdx, iIdx)}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between">
          <button 
            onClick={resetChecklist}
            className="flex items-center gap-2 text-rose-500 font-medium px-4 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
          >
            <Trash2 size={18} /> تصفير القائمة
          </button>
          <button 
            onClick={onClose}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            حسناً
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

import React from 'react';
import { AlertOctagon, X, Droplet, PhoneCall, ShieldAlert, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PepEmergencyModal({ onClose }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border-t-4 border-rose-500"
      >
        <div className="bg-rose-50 dark:bg-rose-950/30 p-4 sm:p-6 text-rose-900 dark:text-rose-100 flex justify-between items-start sticky top-0 z-10 border-b border-rose-100 dark:border-rose-900/50">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-rose-500 text-white rounded-full animate-pulse">
              <AlertOctagon size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-rose-700 dark:text-rose-400">طوارئ: وخز الإبر وتناثر الدم</h2>
              <p className="text-rose-600/80 dark:text-rose-300/80 text-sm font-medium mt-1">الإسعافات الأولية (بروتوكول PEP)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-rose-100/50 dark:bg-rose-900/50 hover:bg-rose-200 dark:hover:bg-rose-800 rounded-full transition-colors text-rose-700 dark:text-rose-300">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2 mb-3">
              <Droplet className="text-blue-500" size={20} />
              الخطوة 1: الغسيل الفوري
            </h3>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm list-disc list-inside marker:text-blue-500">
              <li><strong className="text-rose-600 dark:text-rose-400">للجلد والجروح:</strong> اغسل فوراً بالماء الجاري والصابون.</li>
              <li><strong className="text-rose-600 dark:text-rose-400">للعين والأغشية المخاطية:</strong> اغسل بوفرة بالماء المتدفق أو المحلول الملحي فقط.</li>
              <li className="font-bold text-rose-600 bg-rose-50 dark:bg-rose-900/20 p-2 rounded mt-2">ممنوع العصر أو الضغط العنيف لإخراج الدم من الجرح.</li>
              <li className="font-bold text-rose-600 bg-rose-50 dark:bg-rose-900/20 p-2 rounded">ممنوع وضع مطهرات كاوية (كالكحول أو الكلور) داخل الجرح.</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2 mb-3">
              <PhoneCall className="text-amber-500" size={20} />
              الخطوة 2: التقييم والإبلاغ
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              أبلغ مسؤول مكافحة العدوى بالعيادة فوراً.<br/>
              سيتم تقييم حالة المريض (مصدر العدوى) إن أمكن لمعرفة إصابته بـ (HBV, HCV, HIV).
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2 mb-3">
              <ShieldAlert className="text-teal-500" size={20} />
              الخطوة 3: الإجراء الوقائي الدوائي (PEP)
            </h3>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300 text-sm">
              <li className="flex items-start gap-2">
                <Activity className="text-teal-500 shrink-0 mt-0.5" size={16} />
                <span><strong className="text-teal-600 dark:text-teal-400">فيروس الكبد B:</strong> إعطاء الجلوبيولين المناعي (HBIG) وجرعة لقاح إذا كان الطبيب غير مطعم.</span>
              </li>
              <li className="flex items-start gap-2">
                <Activity className="text-rose-500 shrink-0 mt-0.5" size={16} />
                <span><strong className="text-rose-600 dark:text-rose-400">فيروس HIV:</strong> إذا كان المريض مصاباً، يُبدأ العلاج الثلاثي المضاد للفيروسات القهقرية في أسرع وقت (يفضل خلال ساعتين).</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-bold py-2 px-8 rounded-lg transition-colors"
          >
            إغلاق وتأكيد
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

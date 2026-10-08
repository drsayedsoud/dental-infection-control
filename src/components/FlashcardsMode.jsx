import React, { useState } from 'react';
import { topics } from '../data';
import { X, ChevronRight, ChevronLeft, Sparkles, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TextWithBadge from './TextWithBadge';

export default function FlashcardsMode({ onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % topics.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + topics.length) % topics.length);
    }, 150);
  };

  const currentTopic = topics[currentIndex];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-4"
    >
      <div className="absolute top-4 right-4 flex gap-4">
        <button 
          onClick={onClose}
          className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2 text-teal-400">
          <Sparkles size={24} />
          <h2 className="text-2xl font-bold text-white">المراجعة السريعة</h2>
        </div>
        <p className="text-slate-300 text-sm">البطاقة {currentIndex + 1} من {topics.length}</p>
      </div>

      <div className="w-full max-w-sm aspect-[3/4] perspective-1000 relative" onClick={() => setIsFlipped(!isFlipped)}>
        <motion.div 
          className="w-full h-full relative preserve-3d cursor-pointer"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front */}
          <div 
            className="absolute inset-0 backface-hidden bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 flex flex-col justify-center text-center border-4 border-teal-500/20"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-xl mx-auto mb-6">
              {currentIndex + 1}
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 leading-tight">
              {currentTopic.title}
            </h3>
            <p className="text-teal-600 dark:text-teal-400 font-medium font-sans" dir="ltr">
              {currentTopic.subtitle}
            </p>
            <div className="mt-8 text-slate-400 flex items-center justify-center gap-2 text-sm">
              <RotateCcw size={16} /> انقر للقلب
            </div>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 backface-hidden bg-gradient-to-br from-teal-600 to-teal-800 rounded-3xl shadow-2xl p-6 flex flex-col overflow-y-auto"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <h4 className="text-white font-bold text-lg mb-4 text-center border-b border-white/20 pb-2">الخلاصة العملية</h4>
            <div className="text-teal-50 text-sm leading-relaxed whitespace-pre-line text-right">
              <TextWithBadge text={currentTopic.content.substring(0, 450) + (currentTopic.content.length > 450 ? '...' : '')} />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-6 mt-8">
        <button 
          onClick={nextCard}
          className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
        >
          <ChevronRight size={28} />
        </button>
        <button 
          onClick={prevCard}
          className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
        >
          <ChevronLeft size={28} />
        </button>
      </div>
    </motion.div>
  );
}

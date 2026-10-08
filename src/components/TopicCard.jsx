import React, { useState } from 'react';
import { CheckCircle2, XCircle, ChevronDown, RotateCcw, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TextWithBadge from './TextWithBadge';

export default function TopicCard({ topic, index, isExpanded, onToggle, onQuizComplete, quizResult }) {
  const [selectedOption, setSelectedOption] = useState(quizResult?.selected ?? null);
  const [showResult, setShowResult] = useState(quizResult != null);

  const handleOptionSelect = (optionIndex) => {
    if (showResult) return;
    setSelectedOption(optionIndex);
    const isCorrect = optionIndex === topic.question.correctAnswer;
    setShowResult(true);
    onQuizComplete(isCorrect, optionIndex);
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setSelectedOption(null);
    setShowResult(false);
    onQuizComplete(null, null);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
    >
      {/* Header */}
      <div 
        onClick={onToggle}
        className="p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold shrink-0">
            {index + 1}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-white leading-tight">
              {topic.title}
            </h3>
            <p className="text-sm text-teal-600 dark:text-teal-400 font-medium font-sans mt-0.5" dir="ltr">
              {topic.subtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {quizResult && (
            <div title={quizResult.isCorrect ? 'إجابة صحيحة' : 'إجابة خاطئة'}>
              {quizResult.isCorrect 
                ? <CheckCircle2 className="text-green-500" size={20} />
                : <XCircle className="text-rose-500" size={20} />
              }
            </div>
          )}
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="text-slate-400" />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-slate-100 dark:border-slate-700"
          >
            <div className="p-5">
              {topic.imageUrl && (
                <div className="mb-6 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm">
                  <img src={topic.imageUrl} alt={topic.title} className="w-full h-auto object-cover max-h-64" />
                </div>
              )}
              
              <div className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line mb-8">
                <TextWithBadge text={topic.content} />
              </div>

              {/* Quiz Section */}
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="text-teal-500" size={20} />
                    اختبر معلوماتك
                  </h4>
                  {showResult && (
                    <button 
                      onClick={handleReset}
                      className="text-xs flex items-center gap-1 text-slate-500 hover:text-teal-600 dark:hover:text-teal-400"
                    >
                      <RotateCcw size={14} /> إعادة الاختبار
                    </button>
                  )}
                </div>
                
                <p className="text-slate-700 dark:text-slate-300 font-medium mb-4">
                  <TextWithBadge text={topic.question.text} />
                </p>

                <div className="space-y-2">
                  {topic.question.options.map((option, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    const isCorrectOption = optIdx === topic.question.correctAnswer;
                    
                    let btnClass = "w-full text-right p-3 rounded-lg border text-sm transition-all duration-200 ";
                    
                    if (!showResult) {
                      btnClass += "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20";
                    } else {
                      if (isCorrectOption) {
                        btnClass += "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-300 font-bold";
                      } else if (isSelected && !isCorrectOption) {
                        btnClass += "bg-rose-50 dark:bg-rose-900/20 border-rose-500 text-rose-700 dark:text-rose-300";
                      } else {
                        btnClass += "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-50";
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleOptionSelect(optIdx)}
                        disabled={showResult}
                        className={btnClass}
                      >
                        <div className="flex justify-between items-center">
                          <TextWithBadge text={option} />
                          {showResult && isCorrectOption && <CheckCircle2 className="text-green-500 shrink-0" size={18} />}
                          {showResult && isSelected && !isCorrectOption && <XCircle className="text-rose-500 shrink-0" size={18} />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-4 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800"
                    >
                      <h5 className="font-bold text-teal-800 dark:text-teal-300 text-sm mb-1">التفسير العلمي:</h5>
                      <p className="text-sm text-teal-700 dark:text-teal-400 leading-relaxed">
                        <TextWithBadge text={topic.question.explanation} />
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

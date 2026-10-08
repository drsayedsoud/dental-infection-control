import React, { useState, useEffect, useRef, useMemo } from 'react';
import TopicCard from './components/TopicCard';
import FlashcardsMode from './components/FlashcardsMode';
import DailyChecklist from './components/DailyChecklist';
import PepEmergencyModal from './components/PepEmergencyModal';
import LoginScreen from './components/LoginScreen';
import ChlorineCalculator from './components/ChlorineCalculator';
import AdminDashboard from './components/AdminDashboard';
import { topics } from './data';
import { 
  ShieldCheck, Activity, Moon, Sun, 
  Search, Trophy, HeartPulse, ListChecks,
  Droplets, Syringe, Sparkles, X, LogOut, Calculator, Settings,
  BookOpen, FlaskConical, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, signOut } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const ToothIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 21c-1 0-2.5-1.5-3-3-.5-1.5-.5-2.5-1-4-.5-1.5-3-2-3-5 0-3.3 2.7-6 6-6 1.8 0 3.3.9 4 2.2.7-1.3 2.2-2.2 4-2.2 3.3 0 6 2.7 6 6 0 3-2.5 3.5-3 5-.5 1.5-.5 2.5-1 4-.5 1.5-2 3-3 3-2 0-3-2-4-2-1 0-2 2-4 2z"/>
    <path d="M12 11v10"/>
  </svg>
);

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const [expandedTopicId, setExpandedTopicId] = useState(null);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [showPepModal, setShowPepModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  const searchRef = useRef(null);
  const pressTimer = useRef(null);

  const handleAdminPressStart = () => {
    pressTimer.current = setTimeout(() => {
      const pass = window.prompt("أدخل كلمة مرور المسؤول:");
      if (pass === "1153") {
        setShowAdmin(true);
      } else if (pass !== null) {
        alert("كلمة المرور غير صحيحة");
      }
    }, 3000);
  };

  const handleAdminPressEnd = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setAuthLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      // If firebase is not configured yet
      setAuthLoading(false);
      console.warn("Firebase is not configured yet. App will work without login for now.");
    }
  }, []);

  const [quizResults, setQuizResults] = useState(() => {
    try {
      const saved = localStorage.getItem('dentalQuizResults');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('dentalQuizResults', JSON.stringify(quizResults));
  }, [quizResults]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    let wakeLock = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen');
        }
      } catch (err) {}
    };
    requestWakeLock();
    const handleVisibilityChange = () => {
      if (wakeLock !== null && document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock !== null) wakeLock.release().then(() => { wakeLock = null; });
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleQuizComplete = (topicId, isCorrect, selectedOption) => {
    if (isCorrect === null) {
      setQuizResults(prev => {
        const next = { ...prev };
        delete next[topicId];
        return next;
      });
    } else {
      setQuizResults(prev => ({ ...prev, [topicId]: { isCorrect, selected: selectedOption } }));
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return topics;
    const q = searchQuery.trim().toLowerCase();
    return topics.filter(t => 
      t.title.toLowerCase().includes(q) || 
      t.subtitle.toLowerCase().includes(q) ||
      t.content.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalQuestions = topics.length;
  const answeredCount = Object.keys(quizResults).length;
  const correctCount = Object.values(quizResults).filter(r => r.isCorrect).length;
  const progressPercent = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const handleLogout = () => {
    signOut(auth).catch(console.error);
  };

  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // إذا لم يقم بتسجيل الدخول (وكان الفايربيز مهيئاً) نعرض شاشة الدخول
  if (!user && auth && auth.app.options.apiKey !== "YOUR_API_KEY") {
    return <LoginScreen onLoginSuccess={setUser} />;
  }

  return (
    <div className={`min-h-screen font-['Tajawal'] pb-24 md:pb-12 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-teal-100 dark:bg-slate-800">
        <motion.div 
          className="h-full bg-teal-500 rounded-r-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Header */}
      <header className="bg-teal-700 dark:bg-slate-800 text-white pt-5 pb-8 px-4 shadow-xl relative overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-10">
          <ToothIcon size={280} />
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <div className="flex justify-between items-center mb-5">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setShowSearch(!showSearch); if (!showSearch) setTimeout(() => searchRef.current?.focus(), 200); }}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all"
              >
                <Search size={20} />
              </button>
              
              <button
                onMouseDown={handleAdminPressStart}
                onMouseUp={handleAdminPressEnd}
                onMouseLeave={handleAdminPressEnd}
                onTouchStart={handleAdminPressStart}
                onTouchEnd={handleAdminPressEnd}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white/60 hover:text-white"
                title="إعدادات (اضغط مطولاً)"
              >
                <Settings size={20} />
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              {user && (
                <button onClick={handleLogout} className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-rose-200 hover:text-rose-100" title="تسجيل الخروج">
                  <LogOut size={20} />
                </button>
              )}
              <button onClick={() => setShowStatsModal(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm font-medium">
                <Trophy size={16} />
                <span>{correctCount}/{totalQuestions}</span>
              </button>
              <button onClick={toggleDarkMode} className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-all">
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-2">
            <div className="flex items-center justify-center gap-3 mb-2">
              <ToothIcon size={28} className="text-teal-300" />
              <h1 className="text-2xl md:text-3xl font-extrabold drop-shadow-md">
                مكافحة العدوى بطب الأسنان
              </h1>
            </div>
            <p className="text-teal-100 text-sm md:text-base font-medium opacity-90 mb-1">
              المرجع: الدليل القومي المصري لمكافحة العدوى (العيادات وقسم التعقيم CSSD)
            </p>
            <div className="inline-block bg-teal-800/50 backdrop-blur-sm border border-teal-500/30 rounded-lg px-4 py-2 mt-2">
              <p className="text-teal-50 text-xs md:text-sm font-bold">
                تصميم وإعداد: د. السيد أبوالسعود
              </p>
              <p className="text-teal-200 text-xs font-mono mt-1" dir="ltr">
                01066415005
              </p>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl px-4 py-6 -mt-4 relative z-20">
        
        {/* Install Banner */}
        <AnimatePresence>
          {showInstallBanner && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="bg-indigo-50 dark:bg-indigo-900/30 border-2 border-indigo-200 dark:border-indigo-800 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 dark:bg-indigo-800 p-2 rounded-full text-indigo-600 dark:text-indigo-300">
                  <ShieldAlert size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">تثبيت التطبيق</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">قم بتثبيت التطبيق على جهازك للوصول السريع حتى بدون إنترنت!</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={handleInstallClick}
                  className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                  تثبيت
                </button>
                <button 
                  onClick={() => setShowInstallBanner(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <button onClick={() => setShowFlashcards(true)} className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all">
            <BookOpen className="text-amber-500 mb-2" size={24} />
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">فلاش كارد</span>
          </button>
          
          <button onClick={() => setShowChecklist(true)} className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 transition-all">
            <ListChecks className="text-teal-500 mb-2" size={24} />
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">تدقيق يومي</span>
          </button>

          <button onClick={() => setShowCalculator(true)} className="flex flex-col items-center justify-center p-3 rounded-xl bg-white dark:bg-slate-800 shadow-md border border-slate-100 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all">
            <FlaskConical className="text-blue-500 mb-2" size={24} />
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">حاسبة الكلور</span>
          </button>
          
          <button onClick={() => setShowPepModal(true)} className="flex flex-col items-center justify-center p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 shadow-md border border-rose-200 dark:border-rose-900 hover:border-rose-500 dark:hover:border-rose-500 transition-all group">
            <Activity className="text-rose-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
            <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400">طوارئ وخز</span>
          </button>
        </div>

        <AnimatePresence>
          {showSearch && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-6 overflow-hidden">
              <div className="relative">
                <input 
                  ref={searchRef}
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في المواضيع والمصطلحات..." 
                  className="w-full bg-white dark:bg-slate-800 border-2 border-teal-200 dark:border-slate-700 rounded-xl py-3 px-11 text-slate-800 dark:text-white focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all"
                />
                <Search className="absolute right-4 top-3.5 text-slate-400" size={20} />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute left-4 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X size={20} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic, index) => (
              <TopicCard 
                key={topic.id} 
                topic={topic} 
                index={index}
                isExpanded={expandedTopicId === topic.id}
                onToggle={() => setExpandedTopicId(expandedTopicId === topic.id ? null : topic.id)}
                onQuizComplete={(isCorrect, selectedOption) => handleQuizComplete(topic.id, isCorrect, selectedOption)}
                quizResult={quizResults[topic.id]}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
              <Search className="mx-auto text-slate-300 mb-3" size={48} />
              <p className="text-slate-500 dark:text-slate-400 font-medium">لم نجد نتائج مطابقة لبحثك</p>
            </div>
          )}
        </div>
      </main>

      {/* Modals & Full Screens */}
      <AnimatePresence>
        {showFlashcards && <FlashcardsMode onClose={() => setShowFlashcards(false)} />}
        {showChecklist && <DailyChecklist onClose={() => setShowChecklist(false)} />}
        {showCalculator && <ChlorineCalculator onClose={() => setShowCalculator(false)} />}
        {showPepModal && <PepEmergencyModal onClose={() => setShowPepModal(false)} />}
        {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
      </AnimatePresence>

    </div>
  );
}

export default App;

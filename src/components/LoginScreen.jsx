import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, LogIn, AlertCircle } from 'lucide-react';
import { auth, provider, signInWithPopup, db, doc, setDoc, serverTimestamp } from '../firebase';

export default function LoginScreen({ onLoginSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // حفظ بيانات المستخدم في مجموعة منفصلة خاصة بهذا التطبيق فقط لتجنب الاختلاط مع التطبيقات الأخرى
      try {
        await setDoc(doc(db, "infection_users", user.uid), {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          lastLogin: serverTimestamp(),
          appSource: "infection_control_app"
        }, { merge: true });
      } catch (dbError) {
        console.error("Error saving user to Firestore:", dbError);
        // لا نوقف الدخول إذا فشل الحفظ في قاعدة البيانات بسبب الصلاحيات
      }

      onLoginSuccess(user);
    } catch (error) {
      console.error("Login Error:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        setError('تم إغلاق نافذة تسجيل الدخول قبل الاكتمال.');
      } else {
        setError('حدث خطأ أثناء تسجيل الدخول. يرجى التأكد من اتصالك بالإنترنت وإعدادات فايربيز.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4 font-['Tajawal']" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-slate-100 dark:border-slate-700 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mr-10 -mt-10 opacity-5 text-teal-600">
          <ShieldAlert size={200} />
        </div>

        <div className="relative z-10">
          <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600 dark:text-teal-400">
            <ShieldAlert size={40} />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">مكافحة العدوى - أسنان</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed">
            مرحباً بك دكتور.. يرجى تسجيل الدخول بحساب جوجل للوصول إلى الدليل القومي والأدوات التفاعلية.
          </p>

          {error && (
            <div className="mb-6 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-3 rounded-lg text-sm flex items-start gap-2 text-right">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-600 hover:border-teal-500 transition-all disabled:opacity-70"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                المتابعة بحساب جوجل
              </>
            )}
          </button>
          
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400">
            تصميم: د. السيد أبوالسعود
          </div>
        </div>
      </motion.div>
    </div>
  );
}

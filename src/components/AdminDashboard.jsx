import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Users, Activity, Calendar, ShieldCheck } from 'lucide-react';
import { db, collection, getDocs, query, orderBy } from '../firebase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard({ onClose }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "infection_users"), orderBy("lastLogin", "desc"));
        const snapshot = await getDocs(q);
        const usersList = [];
        const dateCounts = {};

        snapshot.forEach((doc) => {
          const data = doc.data();
          const timestamp = data.lastLogin?.toDate();
          
          usersList.push({
            id: doc.id,
            name: data.name || 'مجهول',
            email: data.email || 'غير معروف',
            photoURL: data.photoURL,
            date: timestamp ? timestamp.toLocaleDateString('ar-EG') : 'غير متوفر',
            time: timestamp ? timestamp.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : '',
          });

          // تجميع البيانات للرسم البياني
          if (timestamp) {
            const dateStr = timestamp.toLocaleDateString('en-GB'); // DD/MM/YYYY
            dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
          }
        });

        setUsers(usersList);

        // تحويل التجميع إلى مصفوفة للرسم البياني
        const chartArr = Object.keys(dateCounts)
          .map(date => ({ date, التسجيلات: dateCounts[date] }))
          .reverse(); // أقدم تاريخ أولاً
        
        setChartData(chartArr);

      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-900 overflow-y-auto"
    >
      <div className="container mx-auto max-w-4xl px-4 py-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 text-slate-800 dark:text-white">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold">لوحة تحكم المسؤول</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">إحصائيات وبيانات مستخدمي التطبيق</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors">
            <X size={24} className="text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                <Users className="text-blue-500 mb-2" size={32} />
                <span className="text-3xl font-bold text-slate-800 dark:text-white mb-1">{users.length}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">إجمالي المستخدمين</span>
              </div>
              <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center">
                <Activity className="text-emerald-500 mb-2" size={32} />
                <span className="text-3xl font-bold text-slate-800 dark:text-white mb-1">
                  {chartData.length > 0 ? chartData[chartData.length - 1].التسجيلات : 0}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">تفاعلات اليوم</span>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                <Calendar size={20} className="text-indigo-500" />
                نشاط المستخدمين في الأيام الأخيرة
              </h3>
              <div className="h-64 w-full" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#818cf8' }}
                    />
                    <Line type="monotone" dataKey="التسجيلات" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Users List */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Users size={20} className="text-indigo-500" />
                  سجل الأطباء المسجلين مؤخراً
                  <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 py-0.5 px-2 rounded-full text-xs font-bold mr-2">
                    (الإجمالي: {users.length})
                  </span>
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-right">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm">
                    <tr>
                      <th className="p-4 font-medium">الطبيب</th>
                      <th className="p-4 font-medium">البريد الإلكتروني</th>
                      <th className="p-4 font-medium">آخر نشاط</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {users.map((user, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {user.photoURL ? (
                              <img src={user.photoURL} alt={user.name} className="w-8 h-8 rounded-full" />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                {user.name.charAt(0)}
                              </div>
                            )}
                            <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{user.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-slate-500 dark:text-slate-400" dir="ltr">{user.email}</td>
                        <td className="p-4 text-sm text-slate-500 dark:text-slate-400">
                          <div className="flex flex-col">
                            <span>{user.date}</span>
                            <span className="text-xs opacity-70">{user.time}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="3" className="p-8 text-center text-slate-500">لا يوجد مستخدمين مسجلين بعد</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </motion.div>
  );
}

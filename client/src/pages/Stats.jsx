import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    TrendingUp, Target, Trophy, Clock, 
    Calendar, ArrowUpRight, BarChart3, PieChart as PieChartIcon,
    Zap, Sparkles
} from 'lucide-react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import api from '../api/api';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const Stats = () => {
    const { theme } = useTheme();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const productivityData = [
        { name: 'Mon', score: 65 },
        { name: 'Tue', score: 85 },
        { name: 'Wed', score: 72 },
        { name: 'Thu', score: 95 },
        { name: 'Fri', score: 88 },
        { name: 'Sat', score: 45 },
        { name: 'Sun', score: 55 },
    ];

    const priorityData = [
        { name: 'High', count: 4, color: '#f43f5e' },
        { name: 'Medium', count: 8, color: '#f59e0b' },
        { name: 'Low', count: 5, color: '#10b981' },
    ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/tasks/stats');
                setStats(res.data);
            } catch (err) {
                toast.error('Failed to load analytics');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 pb-12"
        >
            {/* Page Header */}
            <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-h1 text-[var(--text-primary)] mb-2">Analytics Hub</h1>
                    <p className="text-body-lg text-[var(--text-secondary)]">Deep dive into your productivity trends and performance metrics.</p>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm">
                    <Calendar size={18} className="text-purple-500" />
                    <span className="text-small font-black text-[var(--text-primary)] uppercase tracking-widest">Last 30 Days</span>
                </div>
            </motion.header>

            {/* Top Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Longest Streak', value: stats?.streak || 0, icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
                    { label: 'Total Productivity', value: `${stats?.productivity || 0}%`, icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' },
                    { label: 'Completion Rate', value: '88%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' }
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        variants={itemVariants}
                        className="p-8 bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] shadow-sm relative overflow-hidden"
                    >
                        <div className={`${item.bg} ${item.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                            <item.icon size={28} />
                        </div>
                        <p className="text-small text-[var(--text-secondary)] uppercase tracking-widest mb-1">{item.label}</p>
                        <h2 className="text-display text-[var(--text-primary)] text-4xl">{item.value}</h2>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
                    </motion.div>
                ))}
            </div>

            {/* Detailed Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Productivity Flow */}
                <motion.div 
                    variants={itemVariants}
                    className="p-8 bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] shadow-sm"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-h3 text-[var(--text-primary)]">Performance Flow</h3>
                            <p className="text-small text-[var(--text-secondary)] uppercase mt-1">Weekly Score Trend</p>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl">
                            <TrendingUp size={14} />
                            <span className="text-small uppercase tracking-widest">+18%</span>
                        </div>
                    </div>
                    <div className="h-72 w-full -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={productivityData}>
                                <defs>
                                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 700 }}
                                    dy={15}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        borderRadius: '20px', 
                                        border: 'none', 
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                        backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                                        padding: '16px'
                                    }} 
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="score" 
                                    stroke="#8B5CF6" 
                                    strokeWidth={4} 
                                    fillOpacity={1} 
                                    fill="url(#colorScore)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Priority Breakdown */}
                <motion.div 
                    variants={itemVariants}
                    className="p-8 bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] shadow-sm"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-h3 text-[var(--text-primary)]">Goal Distribution</h3>
                            <p className="text-small text-[var(--text-secondary)] uppercase mt-1">Tasks by Priority</p>
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-slate-400">
                            <BarChart3 size={20} />
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={priorityData} layout="vertical" barSize={32}>
                                <XAxis type="number" hide />
                                <YAxis 
                                    dataKey="name" 
                                    type="category" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fontSize: 14, fill: '#64748b', fontWeight: 700 }}
                                    width={80}
                                />
                                <Tooltip 
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }} 
                                />
                                <Bar dataKey="count" radius={[0, 12, 12, 0]}>
                                    {priorityData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 flex justify-between px-4">
                        {priorityData.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center">
                                <span className="text-h3 text-[var(--text-primary)]">{item.count}</span>
                                <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Insights Banner */}
            <motion.div 
                variants={itemVariants}
                className="p-10 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-[3rem] relative overflow-hidden group shadow-2xl shadow-purple-500/20"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-48 -mt-48 transition-transform group-hover:scale-110 duration-700"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full w-fit mx-auto md:mx-0">
                            <Sparkles size={14} className="text-purple-200" />
                            <span className="text-[10px] font-black text-purple-100 uppercase tracking-widest">Growth Mindset</span>
                        </div>
                        <h2 className="text-h2 text-white">Your focus is sharpening.</h2>
                        <p className="text-body-lg text-purple-100/70 max-w-xl">
                            You completed 85% of your high-priority tasks this week. Keep this momentum to break your all-time streak record!
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-center p-8 bg-white/10 backdrop-blur-xl rounded-[2.5rem] border border-white/20 min-w-[200px]">
                        <span className="text-display text-white text-5xl mb-2">A+</span>
                        <span className="text-small text-purple-100 uppercase tracking-[0.2em] font-black">Grade Score</span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Stats;

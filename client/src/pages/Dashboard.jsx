import React, { useState, useEffect, useContext } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { 
    Trophy, Zap, CheckCircle2, Clock, 
    ArrowUpRight, ArrowDownRight, Target,
    Calendar, Sun, Moon,
    LayoutDashboard, CheckSquare, BarChart2,
    Sparkles, ChevronRight, Edit2, Quote, CheckCircle
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
    AreaChart, Area, XAxis, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import api from '../api/api';
import toast from 'react-hot-toast';

const chartData = [
    { name: 'Mon', tasks: 4 },
    { name: 'Tue', tasks: 7 },
    { name: 'Wed', tasks: 5 },
    { name: 'Thu', tasks: 8 },
    { name: 'Fri', tasks: 12 },
    { name: 'Sat', tasks: 9 },
    { name: 'Sun', tasks: 6 },
];

const CountUp = ({ value, duration = 2 }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const val = typeof value === 'string' ? parseInt(value) : value;
        const controls = animate(count, val, { duration, ease: "easeOut" });
        return controls.stop;
    }, [value, count, duration]);

    useEffect(() => {
        return rounded.on("change", (v) => setDisplayValue(v));
    }, [rounded]);

    return <span>{displayValue}</span>;
};

const CircularProgress = ({ value, color }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center">
            <svg className="w-24 h-24 transform -rotate-90">
                <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    className="stroke-slate-100 dark:stroke-slate-800 fill-none"
                    strokeWidth="8"
                />
                <motion.circle
                    cx="48"
                    cy="48"
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-xl font-black text-slate-900 dark:text-white leading-none">{value}%</span>
            </div>
        </div>
    );
};

const Heatmap = () => {
    const days = Array.from({ length: 35 }, (_, i) => i);
    return (
        <div className="grid grid-cols-7 gap-1.5">
            {days.map((day) => {
                const opacity = Math.random() > 0.3 ? Math.random() : 0.1;
                return (
                    <motion.div
                        key={day}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: day * 0.01 }}
                        className="w-full aspect-square rounded-[4px] bg-purple-500 transition-colors duration-500"
                        style={{ opacity: opacity === 0.1 ? 0.05 : opacity }}
                    />
                );
            })}
        </div>
    );
};

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();
    const [stats, setStats] = useState({
        totalTasks: 0,
        completed: 0,
        pending: 0,
        productivity: 0,
        streak: 0
    });
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, tasksRes] = await Promise.all([
                api.get('/tasks/stats'),
                api.get('/tasks')
            ]);
            setStats({
                totalTasks: statsRes.data.total || 0,
                completed: statsRes.data.completed || 0,
                pending: statsRes.data.pending || 0,
                productivity: statsRes.data.productivity || 0,
                streak: statsRes.data.streak || 0
            });
            // Get first 3 pending tasks for the roadmap, and the most urgent for focus
            const pendingTasks = tasksRes.data.filter(t => t.status !== 'Completed');
            setTasks(pendingTasks.slice(0, 3));
        } catch (err) {
            console.error(err);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleTask = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
            await api.put(`/tasks/${id}`, { status: newStatus });
            toast.success(newStatus === 'Completed' ? 'Task completed! 🔥' : 'Task reopened');
            fetchDashboardData();
        } catch (err) {
            toast.error('Update failed');
        }
    };

    const handleCompleteFocus = async () => {
        if (tasks.length > 0) {
            await handleToggleTask(tasks[0]._id, 'Pending');
        } else {
            // Redirect to tasks page to add one
            window.location.href = '/tasks';
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
        }
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
            {/* Top Header */}
            <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-display text-[var(--text-primary)] mb-2">
                        Small steps. Big streaks.
                    </h1>
                    <p className="text-body-lg text-[var(--text-secondary)]">Consistency is your superpower.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleTheme}
                        className="p-3 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm text-[var(--text-secondary)] transition-all hover:shadow-md"
                    >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </motion.button>
                    
                    <div className="flex items-center gap-4 bg-[var(--card)] shadow-sm p-3 px-6 rounded-2xl border border-[var(--border)] transition-all hover:shadow-md group">
                        <div className="w-10 h-10 bg-orange-50 dark:bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                            <Trophy size={20} />
                        </div>
                        <div>
                            <p className="text-small text-[var(--text-secondary)] uppercase leading-tight">Current Streak</p>
                            <p className="text-h3 text-[var(--text-primary)]">
                                <CountUp value={stats.streak} /> Days
                            </p>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Tasks', value: stats.totalTasks, icon: Target, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                    { label: 'Pending', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
                    { label: 'Productivity', value: stats.productivity, type: 'circular', color: '#7C3AED' }
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        variants={itemVariants}
                        whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.04)" }}
                        className={`p-6 bg-[var(--card)] border border-[var(--border)] rounded-[2rem] relative overflow-hidden transition-all group ${stat.label === 'Productivity' ? 'ring-2 ring-purple-500/20 shadow-lg shadow-purple-500/5' : ''}`}
                    >
                        {stat.type === 'circular' ? (
                            <div className="flex items-center gap-6">
                                <CircularProgress value={stat.value} color={stat.color} />
                                <div>
                                    <p className="text-small text-[var(--text-secondary)] uppercase mb-1">{stat.label}</p>
                                    <p className="text-body-reg text-[var(--text-secondary)]">Peak Performance</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={24} />
                                </div>
                                <p className="text-small text-[var(--text-secondary)] uppercase mb-1">{stat.label}</p>
                                <h3 className="text-h1 text-[var(--text-primary)]">
                                    <CountUp value={stat.value} />
                                </h3>
                                <div className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowUpRight size={16} className="text-slate-300" />
                                </div>
                            </>
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Tasks & Focus */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Today's Focus Card */}
                    <motion.div 
                        variants={itemVariants}
                        className="p-8 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2.5rem] relative overflow-hidden group shadow-2xl shadow-purple-500/20"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full -mr-20 -mt-20"></div>
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full w-fit">
                                    <Sparkles size={14} className="text-purple-200" />
                                    <span className="text-small text-purple-100 uppercase">Today's Focus</span>
                                </div>
                                <h2 className="text-h2 text-white">
                                    {tasks.length > 0 ? tasks[0].title : "🎯 Set your focus for today"}
                                </h2>
                                <p className="text-body-reg text-purple-100/70 max-w-md">
                                    {tasks.length > 0 ? tasks[0].description : "Start by adding your most important task to master your productivity streak."}
                                </p>
                                <div className="flex items-center gap-4 pt-2">
                                    <button 
                                        onClick={handleCompleteFocus}
                                        className="px-6 py-2.5 bg-white text-purple-600 font-bold rounded-xl text-body-reg shadow-xl hover:scale-105 transition-transform active:scale-95"
                                    >
                                        {tasks.length > 0 ? "Complete Now" : "Add Task"}
                                    </button>
                                    {tasks.length > 0 && tasks[0].deadline && (
                                        <span className="text-body-reg text-purple-200 flex items-center gap-2">
                                            <Clock size={16} /> Due {new Date(tasks[0].deadline).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="w-32 h-32 bg-white/10 backdrop-blur-2xl rounded-3xl flex items-center justify-center border border-white/20 group-hover:rotate-6 transition-transform duration-500">
                                    <Target size={48} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Task Roadmap */}
                    <motion.div variants={itemVariants} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-h2 text-[var(--text-primary)]">Your Roadmap</h3>
                            <button 
                                onClick={() => window.location.href = '/tasks'}
                                className="text-small text-purple-600 dark:text-purple-400 uppercase hover:underline decoration-2 underline-offset-4"
                            >
                                View All
                            </button>
                        </div>
                        <div className="space-y-4">
                            {tasks.map((task, idx) => (
                                <motion.div
                                    key={task._id}
                                    whileHover={{ x: 8, backgroundColor: "var(--card)" }}
                                    className="p-5 bg-[var(--card)] opacity-90 border border-[var(--border)] rounded-3xl flex items-center gap-5 group transition-all"
                                >
                                    <div className="relative">
                                        <button 
                                            onClick={() => handleToggleTask(task._id, task.status)}
                                            className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center cursor-pointer group-hover:bg-purple-600 transition-colors"
                                        >
                                            <div className="w-4 h-4 border-2 border-slate-300 dark:border-slate-600 rounded-sm group-hover:border-white transition-colors" />
                                        </button>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h4 className="text-body-lg text-[var(--text-primary)]">{task.title}</h4>
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                    task.priority === 'High' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' :
                                                    task.priority === 'Medium' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' :
                                                    'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                                }`} />
                                                <span className="text-small text-[var(--text-secondary)] uppercase">{task.priority}</span>
                                            </div>
                                        </div>
                                        <p className="text-body-reg text-[var(--text-secondary)] line-clamp-1">{task.description}</p>
                                    </div>
                                    <div className="text-right flex items-center gap-4">
                                        <div className="hidden md:block">
                                            <p className="text-small text-[var(--text-secondary)] uppercase mb-0.5">Deadline</p>
                                            <p className="text-body-reg text-[var(--text-primary)]">{task.deadline ? new Date(task.deadline).toLocaleDateString() : 'Flexible'}</p>
                                        </div>
                                        <button className="p-2 text-slate-300 hover:text-purple-600 transition-colors">
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                            {tasks.length === 0 && (
                                <div className="text-center py-12 bg-[var(--card)] opacity-60 rounded-3xl border border-dashed border-[var(--border)]">
                                    <p className="text-body-reg text-[var(--text-secondary)] italic">No tasks found for today.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: Activity & Insights */}
                <div className="space-y-8">
                    {/* Activity Chart */}
                    <motion.div 
                        variants={itemVariants}
                        className="p-8 bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] shadow-sm relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-h3 text-[var(--text-primary)]">Activity</h3>
                                <p className="text-small text-[var(--text-secondary)] uppercase mt-1">Last 7 Days</p>
                            </div>
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl">
                                <ArrowUpRight size={14} />
                                <span className="text-small uppercase">+12%</span>
                            </div>
                        </div>

                        <div className="h-48 w-full -ml-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'} />
                                    <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                                        dy={10}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            borderRadius: '16px', 
                                            border: 'none', 
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                            backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
                                            color: theme === 'dark' ? '#fff' : '#000'
                                        }} 
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="tasks" 
                                        stroke="#7C3AED" 
                                        strokeWidth={4} 
                                        fillOpacity={1} 
                                        fill="url(#colorTasks)" 
                                        animationDuration={2500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="mt-8 pt-6 border-t border-[var(--border)] flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600">
                                <BarChart2 size={20} />
                            </div>
                            <p className="text-body-reg text-[var(--text-secondary)]">
                                You were <span className="text-body-lg text-[var(--text-primary)]">more productive</span> than yesterday 📈
                            </p>
                        </div>
                    </motion.div>

                    {/* Streak Heatmap */}
                    <motion.div 
                        variants={itemVariants}
                        className="p-8 bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-h3 text-[var(--text-primary)]">Consistency</h3>
                            <Calendar size={18} className="text-slate-300" />
                        </div>
                        
                        <Heatmap />
                        
                        <div className="mt-8 flex justify-between items-center text-small text-[var(--text-secondary)] uppercase">
                            <span>Less</span>
                            <div className="flex gap-1">
                                {[0.1, 0.3, 0.6, 0.9, 1].map(o => (
                                    <div key={o} className="w-2.5 h-2.5 rounded-[2px] bg-purple-500" style={{ opacity: o }} />
                                ))}
                            </div>
                            <span>More</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;

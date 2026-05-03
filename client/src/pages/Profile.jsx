import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    User, Mail, Shield, Bell, 
    Moon, Sun, Camera, Trophy,
    CheckCircle2, ChevronRight, Settings,
    CreditCard, ExternalLink
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme();
    const [notifications, setNotifications] = useState(true);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    const handleUpdate = () => {
        toast.success('Profile settings updated! ✨');
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl mx-auto space-y-8 pb-12"
        >
            {/* Profile Header */}
            <motion.header variants={itemVariants} className="text-center relative py-8">
                <div className="relative inline-block group">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white text-5xl md:text-6xl font-black shadow-2xl shadow-purple-500/30 transform transition-transform group-hover:scale-105 duration-500">
                        {user?.name?.[0] || 'U'}
                    </div>
                    <button className="absolute bottom-2 right-2 p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-[var(--border)] text-purple-600 hover:scale-110 transition-transform">
                        <Camera size={20} />
                    </button>
                    <div className="absolute inset-0 bg-purple-500 blur-[80px] opacity-10 -z-10"></div>
                </div>
                
                <div className="mt-8 space-y-2">
                    <h1 className="text-h1 text-[var(--text-primary)]">{user?.name || 'Student Name'}</h1>
                    <p className="text-body-lg text-[var(--text-secondary)] flex items-center justify-center gap-2">
                        <Mail size={16} /> {user?.email || 'email@example.com'}
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <div className="px-4 py-1.5 bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 rounded-full flex items-center gap-2">
                            <Trophy size={14} className="text-purple-600" />
                            <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Pro Member</span>
                        </div>
                    </div>
                </div>
            </motion.header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Account Settings */}
                <motion.div variants={itemVariants} className="space-y-6">
                    <h2 className="text-h3 text-[var(--text-primary)] ml-2">Preferences</h2>
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2rem] p-6 space-y-2 shadow-sm">
                        {/* Theme Toggle */}
                        <div className="flex items-center justify-between p-4 hover:bg-[var(--background)] rounded-2xl transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 group-hover:text-purple-600 transition-colors">
                                    {theme === 'light' ? <Sun size={20} /> : <Moon size={20} />}
                                </div>
                                <div>
                                    <p className="text-body-reg font-bold text-[var(--text-primary)]">Interface Theme</p>
                                    <p className="text-small text-[var(--text-secondary)] capitalize">{theme} Mode Active</p>
                                </div>
                            </div>
                            <button 
                                onClick={toggleTheme}
                                className="relative w-14 h-7 bg-slate-100 dark:bg-slate-800 rounded-full p-1 transition-all"
                            >
                                <motion.div 
                                    animate={{ x: theme === 'dark' ? 28 : 0 }}
                                    className="w-5 h-5 bg-purple-600 rounded-full shadow-md"
                                />
                            </button>
                        </div>

                        {/* Notifications */}
                        <div className="flex items-center justify-between p-4 hover:bg-[var(--background)] rounded-2xl transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 group-hover:text-purple-600 transition-colors">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <p className="text-body-reg font-bold text-[var(--text-primary)]">Notifications</p>
                                    <p className="text-small text-[var(--text-secondary)]">Push & Email alerts</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setNotifications(!notifications)}
                                className="relative w-14 h-7 bg-slate-100 dark:bg-slate-800 rounded-full p-1 transition-all"
                            >
                                <motion.div 
                                    animate={{ x: notifications ? 28 : 0 }}
                                    className={`w-5 h-5 ${notifications ? 'bg-purple-600' : 'bg-slate-400'} rounded-full shadow-md transition-colors`}
                                />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Security & System */}
                <motion.div variants={itemVariants} className="space-y-6">
                    <h2 className="text-h3 text-[var(--text-primary)] ml-2">Security</h2>
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2rem] p-6 space-y-2 shadow-sm">
                        {[
                            { label: 'Privacy Policy', icon: Shield, desc: 'Your data is encrypted' },
                            { label: 'Manage Subscription', icon: CreditCard, desc: 'Upgrade or downgrade plan' },
                            { label: 'System Settings', icon: Settings, desc: 'App performance & logic' }
                        ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-4 hover:bg-[var(--background)] rounded-2xl transition-colors group cursor-pointer" onClick={handleUpdate}>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 group-hover:text-purple-600 transition-colors">
                                        <item.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-body-reg font-bold text-[var(--text-primary)]">{item.label}</p>
                                        <p className="text-small text-[var(--text-secondary)]">{item.desc}</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-slate-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Bottom Actions */}
            <motion.div variants={itemVariants} className="pt-8">
                <button 
                    onClick={handleUpdate}
                    className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-5 rounded-[1.5rem] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl text-lg uppercase tracking-widest"
                >
                    Save All Changes
                </button>
                <div className="mt-8 text-center">
                    <button className="text-small font-black text-rose-500 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                        Delete Account Permanently
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Profile;

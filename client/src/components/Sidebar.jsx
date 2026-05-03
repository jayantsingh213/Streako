import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, CheckSquare, BarChart2, 
    User, LogOut, Settings, Bell, Sparkles
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const { theme } = useTheme();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
        { icon: BarChart2, label: 'Stats', path: '/stats' },
        { icon: User, label: 'Profile', path: '/profile' },
    ];

    return (
        <aside className="w-24 md:w-72 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col transition-all duration-300 z-50">
            {/* Premium Logo Section */}
            <motion.div 
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="p-8 flex flex-col items-start"
            >
                {/* Logo */}
                <div className="group cursor-default">
                    <h1 className="text-[40px] font-bold text-slate-900 dark:text-white tracking-tighter flex items-center leading-none font-outfit">
                        Streak
                        <span className="relative flex items-center justify-center ml-0.5">
                            <span className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></span>
                            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400">o</span>
                        </span>
                    </h1>
                </div>

                {/* Tagline */}
                <div className="mt-[8px]">
                    <span className="text-[12px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">
                        Master Your Productivity
                    </span>
                </div>

                {/* CTA Pill */}
                <div className="mt-[20px] hidden md:flex items-center gap-2.5 px-4 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-100 dark:border-slate-700/50 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-md transition-all group">
                    <Sparkles size={14} className="text-purple-500 group-hover:rotate-12 transition-transform" />
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 tracking-tight">
                        Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 font-bold">streak</span> won't lie to you.
                    </p>
                </div>
            </motion.div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `
                            flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative
                            ${isActive 
                                ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' 
                                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                            }
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={22} className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`} />
                                <span className="hidden md:block font-bold text-sm tracking-tight">{item.label}</span>
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeTab"
                                        className="absolute right-0 w-1 h-6 bg-purple-600 dark:bg-purple-400 rounded-l-full shadow-[0_0_12px_rgba(124,58,237,0.4)]"
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 space-y-2">
                <button className="flex items-center gap-4 w-full px-4 py-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-all duration-300 group">
                    <Settings size={22} className="group-hover:rotate-45 transition-transform duration-500" />
                    <span className="hidden md:block font-bold text-sm tracking-tight">Settings</span>
                </button>
                <button 
                    onClick={logout}
                    className="flex items-center gap-4 w-full px-4 py-4 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all duration-300 group"
                >
                    <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden md:block font-bold text-sm tracking-tight">Logout</span>
                </button>
                
                {/* User Info (Desktop only) */}
                <div className="hidden md:flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-[1.5rem] mt-4 border border-slate-100 dark:border-slate-700/50 transition-all hover:border-purple-100 dark:hover:border-purple-900/50">
                    <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md">
                        {user?.name?.[0] || 'U'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-black text-slate-900 dark:text-white truncate">{user?.name || 'User'}</p>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate">Pro Member</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

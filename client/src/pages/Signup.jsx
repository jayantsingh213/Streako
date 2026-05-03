import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, User as UserIcon, ArrowRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { signup } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(name, email, password);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (err) {
            toast.error('Signup failed');
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6 bg-[#fcfcfd] relative overflow-hidden selection:bg-purple-100 selection:text-purple-900">
            {/* Living Background Blobs */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, 30, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-100/40 blur-[120px] rounded-full -z-10"
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.1, 1],
                    x: [0, -40, 0],
                    y: [0, -20, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-15%] left-[-5%] w-[700px] h-[700px] bg-blue-100/40 blur-[100px] rounded-full -z-10"
            />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[420px] bg-white/80 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgb(0,0,0,0.03)] border border-white relative"
            >
                {/* Premium Branding Header */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <motion.div 
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative mb-4"
                    >
                        <h1 className="text-6xl font-black text-[#0f172a] tracking-tight font-outfit flex items-center">
                            Streak
                            <span className="relative inline-block ml-0.5">
                                o
                                <div className="absolute top-1.5 -right-1.5 w-7 h-7 bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 rounded-full mix-blend-multiply opacity-80 blur-[3px] -z-10 animate-pulse"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4.5 h-4.5 border-[4px] border-orange-400/40 rounded-full"></div>
                            </span>
                        </h1>
                    </motion.div>
                    
                    <div className="flex items-center gap-4 w-full max-w-[280px] mb-6">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-purple-300 to-purple-500"></div>
                        <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em] whitespace-nowrap">Master Your Productivity</p>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-purple-500 via-orange-300 to-transparent"></div>
                    </div>
                    
                    <motion.div 
                        whileHover={{ scale: 1.02, translateY: -2 }}
                        className="px-5 py-2.5 bg-white border border-slate-100 rounded-full flex items-center gap-2.5 shadow-[0_10px_25px_rgba(0,0,0,0.04)] cursor-default group"
                    >
                        <div className="text-purple-500 group-hover:rotate-12 transition-transform duration-500">
                            <Sparkles size={14} fill="currentColor" className="opacity-80" />
                        </div>
                        <span className="text-[13px] font-bold text-slate-800 tracking-tight">
                            Your <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">streak</span> won't lie to you.
                        </span>
                    </motion.div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Input */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-purple-500 transition-colors">
                                <UserIcon size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-11 pr-4 text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-purple-200 focus:ring-4 focus:ring-purple-500/5 transition-all"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-purple-500 transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-11 pr-4 text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-purple-200 focus:ring-4 focus:ring-purple-500/5 transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-purple-500 transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-4 pl-11 pr-12 text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-purple-200 focus:ring-4 focus:ring-purple-500/5 transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-slate-500 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <motion.button
                            whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(147,51,234,0.15)" }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-purple-500/10 active:translate-y-0 text-sm tracking-wide uppercase flex items-center justify-center gap-2"
                        >
                            Stay Locked 🔒 <ArrowRight size={16} />
                        </motion.button>
                    </div>
                </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-50"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.25em] text-slate-300">
                            <span className="bg-white px-3">OR CONTINUE WITH</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => window.location.href = '/api/auth/google'}
                        className="w-full bg-white border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 text-slate-600 font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-sm text-[11px] uppercase tracking-wider"
                    >
                        <Globe size={18} className="text-[#4285F4]" />
                        Google
                    </button>

                    <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                            Already a member?{' '}
                            <Link to="/login" className="text-purple-600 hover:text-purple-700 transition-colors ml-1 font-black">Sign in here</Link>
                        </p>
                    </div>
            </motion.div>
        </div>
    );
};

export default Signup;

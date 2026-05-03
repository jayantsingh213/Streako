import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Globe, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Login failed');
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = '/api/auth/google';
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md overflow-hidden">
            {/* Animated Background Glows */}
            <motion.div 
                animate={{ 
                    x: [0, 30, -20, 0],
                    y: [0, -40, 20, 0],
                    scale: [1, 1.1, 0.9, 1]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-100/40 blur-[120px] rounded-full pointer-events-none"
            ></motion.div>
            <motion.div 
                animate={{ 
                    x: [0, -40, 30, 0],
                    y: [0, 20, -40, 0],
                    scale: [1, 0.9, 1.1, 1]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-100/40 blur-[120px] rounded-full pointer-events-none"
            ></motion.div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[390px] relative z-10"
            >
                {/* Elegant Glass Card */}
                <div className="bg-white/80 backdrop-blur-xl border border-white p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgb(0,0,0,0.03)]">
                    <div className="mb-10 text-center flex flex-col items-center">
                        {/* Premium Branding Header */}
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 ml-0.5 tracking-[0.1em] uppercase">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3.5 px-4 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-500/40 focus:ring-[6px] focus:ring-purple-500/5 transition-all duration-300 shadow-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-0.5">
                                <label className="text-[11px] font-black text-slate-400 tracking-[0.1em] uppercase">Password</label>
                                <Link to="/forgot-password" size="sm" className="text-[11px] text-purple-600 hover:text-purple-700 font-black transition-colors uppercase tracking-wider">Forgot?</Link>
                            </div>
                            <div className="relative group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl py-3.5 px-4 text-[14px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-500/40 focus:ring-[6px] focus:ring-purple-500/5 transition-all duration-300 shadow-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:bg-purple-600 transition-colors duration-300"></div>
                                    <div className="absolute left-[3px] top-[3px] bg-white w-3.5 h-3.5 rounded-full transition-transform duration-300 peer-checked:translate-x-4 shadow-sm"></div>
                                </div>
                                <span className="text-[11px] font-black text-slate-400 group-hover:text-slate-600 transition-colors uppercase tracking-wider">Remember me</span>
                            </label>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.03, boxShadow: "0 20px 40px rgba(147,51,234,0.15)" }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-purple-500/10 active:translate-y-0 text-sm tracking-wide uppercase"
                        >
                            Stay Locked 🔒 →
                        </motion.button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.25em] text-slate-300">
                            <span className="bg-white/0 px-3 backdrop-blur-sm">OR CONTINUE WITH</span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full bg-white border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 text-slate-600 font-black py-3.5 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-sm text-[11px] uppercase tracking-wider"
                    >
                        <Globe size={18} className="text-[#4285F4]" />
                        Google
                    </button>

                    <p className="mt-8 text-center text-[12px] text-slate-400 font-bold uppercase tracking-wide">
                        New here?{' '}
                        <Link to="/signup" className="text-purple-600 hover:text-purple-700 transition-all">Create account</Link>
                    </p>
                </div>

                <div className="mt-10 text-center opacity-20 select-none">
                    <span className="text-[10px] font-black tracking-[0.4em] uppercase text-slate-900">Streako &copy; 2026</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;

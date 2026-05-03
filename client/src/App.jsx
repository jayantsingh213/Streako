import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AuthSuccess from './pages/AuthSuccess';
import Tasks from './pages/Tasks';
import Stats from './pages/Stats';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return (
        <>
            {children}
            {!token && <Login />}
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="flex min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans selection:bg-purple-100 dark:selection:bg-purple-900/30 selection:text-purple-900 transition-colors duration-300">
                    <Toaster 
                        position="top-right"
                        toastOptions={{
                            className: 'glass-light dark:bg-slate-800 dark:text-white dark:border-slate-700 font-bold text-sm rounded-2xl shadow-lg',
                            duration: 3000,
                        }} 
                    />
                    <Routes>
                        <Route path="/auth-success" element={<AuthSuccess />} />
                        <Route path="/signup" element={<Signup />} />
                        
                        <Route path="/*" element={
                            <ProtectedRoute>
                                <div className="flex w-full relative overflow-hidden">
                                    {/* Theme-aware Background Glows */}
                                    <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-500/5 dark:bg-purple-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
                                    <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
                                    
                                    <Sidebar />
                                    <main className="flex-1 p-4 md:p-8 overflow-y-auto relative z-10">
                                        <Routes>
                                            <Route path="/dashboard" element={<Dashboard />} />
                                            <Route path="/tasks" element={<Tasks />} />
                                            <Route path="/stats" element={<Stats />} />
                                            <Route path="/profile" element={<Profile />} />
                                            <Route path="*" element={<Navigate to="/dashboard" />} />
                                        </Routes>
                                    </main>
                                </div>
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;

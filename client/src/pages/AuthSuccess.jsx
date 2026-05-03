import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    useEffect(() => {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');
        if (token && userParam) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', userParam); // userParam is a JSON string
            setUser(JSON.parse(userParam));
            navigate('/dashboard');
        } else {
            navigate('/');
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
                <Loader2 size={48} className="text-primary" />
            </motion.div>
            <p className="mt-4 text-slate-400 font-medium">Authenticating...</p>
        </div>
    );
};

export default AuthSuccess;

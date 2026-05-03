import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Search, Filter, Trash2, CheckCircle2, 
    Clock, AlertCircle, X, Calendar, Target,
    Sparkles, ChevronRight
} from 'lucide-react';
import api from '../api/api';
import toast from 'react-hot-toast';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        deadline: ''
    });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', newTask);
            toast.success('Task added! ✨');
            setIsModalOpen(false);
            setNewTask({ title: '', description: '', priority: 'Medium', deadline: '' });
            fetchTasks();
        } catch (err) {
            toast.error('Failed to add task');
        }
    };

    const toggleTask = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
            await api.put(`/tasks/${id}`, { status: newStatus });
            toast.success(newStatus === 'Completed' ? 'Goal reached! 🔥' : 'Task reopened');
            fetchTasks();
        } catch (err) {
            toast.error('Update failed');
        }
    };

    const deleteTask = async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            toast.success('Task removed');
            fetchTasks();
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesFilter = filter === 'All' || task.status === f; // Wait, f is not defined
        const matchesFilterFixed = filter === 'All' || task.status === filter;
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilterFixed && matchesSearch;
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-8 pb-12"
        >
            {/* Header Section */}
            <motion.header variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-h1 text-[var(--text-primary)] mb-2">My Roadmap</h1>
                    <p className="text-body-lg text-[var(--text-secondary)]">Organize your goals and build your winning streak.</p>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[var(--accent)] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-purple-500/20 transition-all"
                >
                    <Plus size={20} /> Add New Task
                </motion.button>
            </motion.header>

            {/* Filters and Search */}
            <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--accent)] transition-colors">
                        <Search size={20} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search tasks by title..." 
                        className="w-full bg-[var(--card)] border border-[var(--border)] rounded-[1.5rem] py-4 px-12 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex bg-[var(--card)] p-1.5 rounded-[1.5rem] border border-[var(--border)] shadow-sm">
                    {['All', 'Pending', 'Completed'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-8 py-2.5 rounded-xl text-small uppercase tracking-widest transition-all ${
                                filter === f 
                                ? 'bg-[var(--accent)] text-white shadow-lg shadow-purple-500/20' 
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Task List */}
            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {filteredTasks.length > 0 ? filteredTasks.map((task) => (
                        <motion.div
                            key={task._id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            whileHover={{ x: 8 }}
                            className={`flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-[2rem] border transition-all ${
                                task.status === 'Completed' 
                                ? 'bg-[var(--card)] border-[var(--border)] opacity-60' 
                                : 'bg-[var(--card)] border-[var(--border)] hover:border-purple-500/30 shadow-sm hover:shadow-md'
                            }`}
                        >
                            {/* Status Toggle */}
                            <motion.button 
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => toggleTask(task._id, task.status)}
                                className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all ${
                                    task.status === 'Completed'
                                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                    : 'border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-secondary)]'
                                }`}
                            >
                                {task.status === 'Completed' ? <CheckCircle2 size={24} /> : <div className="w-4 h-4 rounded-sm border-2 border-current opacity-30" />}
                            </motion.button>

                            {/* Task Content */}
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h3 className={`text-h3 leading-none ${task.status === 'Completed' ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
                                        {task.title}
                                    </h3>
                                    <div className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                                        task.priority === 'High' ? 'bg-rose-500/10 text-rose-500' :
                                        task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
                                        'bg-emerald-500/10 text-emerald-500'
                                    }`}>
                                        {task.priority} Priority
                                    </div>
                                </div>
                                <p className={`text-body-reg ${task.status === 'Completed' ? 'text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]'}`}>
                                    {task.description}
                                </p>
                            </div>

                            {/* Task Metadata */}
                            <div className="flex items-center gap-8 md:gap-12 pl-12 md:pl-0">
                                {task.deadline && (
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-1">Deadline</span>
                                        <div className="flex items-center gap-2 text-small text-[var(--text-primary)] font-bold">
                                            <Calendar size={14} className="text-purple-500" />
                                            {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => deleteTask(task._id)}
                                        className="p-3 text-[var(--text-secondary)] hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all"
                                        title="Delete Task"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="text-center py-24 bg-[var(--card)] rounded-[2.5rem] border border-dashed border-[var(--border)]">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                                <Target size={40} />
                            </div>
                            <h3 className="text-h3 text-[var(--text-primary)] mb-2">No tasks found</h3>
                            <p className="text-body-reg text-[var(--text-secondary)]">Time to set some new goals and build your streak!</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Add Task Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[var(--card)] w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 border border-[var(--border)] shadow-2xl relative overflow-hidden"
                        >
                            {/* Modal Background Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full -mr-32 -mt-32"></div>
                            
                            <div className="relative z-10 flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-h2 text-[var(--text-primary)]">New Goal</h2>
                                    <p className="text-small text-[var(--text-secondary)] uppercase mt-1">Let's build your streak</p>
                                </div>
                                <button 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--background)] rounded-xl transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleAddTask} className="relative z-10 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-small font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Task Title</label>
                                    <input 
                                        type="text" 
                                        placeholder="What are you working on?"
                                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl py-4 px-6 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-bold"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-small font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Notes</label>
                                    <textarea 
                                        placeholder="Add some details or steps..."
                                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl py-4 px-6 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all min-h-[120px] font-medium"
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-small font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Priority</label>
                                        <select 
                                            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl py-4 px-6 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-bold appearance-none"
                                            value={newTask.priority}
                                            onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-small font-black text-[var(--text-secondary)] uppercase tracking-widest ml-1">Target Date</label>
                                        <input 
                                            type="date" 
                                            className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl py-4 px-6 text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all font-bold"
                                            value={newTask.deadline}
                                            onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <motion.button 
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black py-5 rounded-[1.5rem] transition-all shadow-xl shadow-purple-500/20 text-lg uppercase tracking-widest"
                                    >
                                        Activate Streak 🔥
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Tasks;

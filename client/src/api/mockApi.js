// Mock API using Local Storage to bypass the need for a real backend
const delay = (ms) => new Promise(res => setTimeout(res, ms));

const getStorage = (key, defaultValue = []) => {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (err) {
        return defaultValue;
    }
};

const setStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

export const mockApi = {
    // Auth
    login: async (email, password) => {
        await delay(500);
        const user = { id: 'mock-1', name: 'Demo Student', email };
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', 'mock-token-123');
        return { data: { user, token: 'mock-token-123' } };
    },
    signup: async (name, email) => {
        await delay(500);
        const user = { id: 'mock-1', name, email };
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', 'mock-token-123');
        return { data: { user, token: 'mock-token-123' } };
    },

    // Tasks
    getTasks: async () => {
        await delay(300);
        return { data: getStorage('mock-tasks') };
    },
    createTask: async (taskData) => {
        await delay(300);
        const tasks = getStorage('mock-tasks');
        const newTask = { 
            ...taskData, 
            _id: Math.random().toString(36).substr(2, 9),
            status: 'Pending',
            createdAt: new Date().toISOString()
        };
        tasks.unshift(newTask);
        setStorage('mock-tasks', tasks);
        return { data: newTask };
    },
    updateTask: async (id, update) => {
        await delay(300);
        let tasks = getStorage('mock-tasks');
        tasks = tasks.map(t => t._id === id ? { ...t, ...update } : t);
        setStorage('mock-tasks', tasks);
        
        // Handle streak logic if completed
        if (update.status === 'Completed') {
            const stats = getStorage('mock-stats', { streak: 0, total: 0, completed: 0, productivity: 0 });
            stats.streak += 1; // Simple mock streak increment
            setStorage('mock-stats', stats);
        }
        
        return { data: tasks.find(t => t._id === id) };
    },
    deleteTask: async (id) => {
        await delay(300);
        let tasks = getStorage('mock-tasks');
        tasks = tasks.filter(t => t._id !== id);
        setStorage('mock-tasks', tasks);
        return { data: { msg: 'Deleted' } };
    },

    // Stats
    getStats: async () => {
        await delay(300);
        const tasks = getStorage('mock-tasks');
        const completed = tasks.filter(t => t.status === 'Completed').length;
        const total = tasks.length;
        const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        // Retrieve or init streak
        const stats = getStorage('mock-stats', { streak: 0 });
        
        return { data: {
            total,
            completed,
            pending: total - completed,
            productivity,
            streak: stats.streak
        }};
    }
};

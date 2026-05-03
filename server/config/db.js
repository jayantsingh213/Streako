const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const connectDB = async () => {
    try {
        let uri = process.env.MONGO_URI;
        
        // If no URI or default local URI, check if we can connect or fallback to memory server
        if (!uri || uri.includes('127.0.0.1') || uri.includes('localhost')) {
            try {
                // Try to connect to local DB with a short timeout
                await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/streako', {
                    serverSelectionTimeoutMS: 2000 
                });
                console.log('✅ Connected to Local MongoDB');
                return;
            } catch (localErr) {
                console.log('⚠️ Local MongoDB not found. Starting In-Memory Database...');
                const mongod = await MongoMemoryServer.create();
                uri = mongod.getUri();
                
                await mongoose.connect(uri);
                console.log('🚀 In-Memory MongoDB Started & Connected');
                
                // Seed some demo data if using memory server
                await seedDemoData();
            }
        } else {
            await mongoose.connect(uri);
            console.log('✅ Connected to MongoDB Atlas');
        }
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

const seedDemoData = async () => {
    try {
        const User = require('../models/User');
        const Task = require('../models/Task');
        const bcrypt = require('bcryptjs');

        // Check if user already exists (should be empty in memory)
        const userCount = await User.countDocuments();
        if (userCount > 0) return;

        console.log('🌱 Seeding Demo Data...');

        // Create Demo User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const demoUser = await User.create({
            name: 'Demo Student',
            email: 'demo@streako.com',
            password: hashedPassword,
            streak: 5,
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
        });

        // Create Demo Tasks
        await Task.create([
            {
                userId: demoUser._id,
                title: 'Complete React Dashboard',
                description: 'Implement Framer Motion animations',
                status: 'Completed',
                priority: 'High',
                deadline: new Date(Date.now() - 86400000)
            },
            {
                userId: demoUser._id,
                title: 'Review MongoDB Models',
                description: 'Add indexes to Task schema',
                status: 'Pending',
                priority: 'Medium',
                deadline: new Date(Date.now() + 86400000)
            },
            {
                userId: demoUser._id,
                title: 'Prepare Presentation',
                description: 'Slides for the productivity app',
                status: 'Pending',
                priority: 'Low',
                deadline: new Date(Date.now() + 172800000)
            }
        ]);

        console.log('✅ Demo data seeded successfully');
        console.log('👤 Login: demo@streako.com | password: password123');
    } catch (err) {
        console.error('❌ Seeding Error:', err.message);
    }
};

module.exports = connectDB;

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const User = require('../models/User');

// @route   GET api/tasks
// @desc    Get all user tasks
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/tasks
// @desc    Create a task
// @access  Private
router.post('/', auth, async (req, res) => {
    const { title, description, priority, deadline } = req.body;

    try {
        const newTask = new Task({
            title,
            description,
            priority,
            deadline,
            userId: req.user.id
        });

        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { title, description, priority, deadline, status } = req.body;

    try {
        let task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Make sure user owns task
        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: { title, description, priority, deadline, status } },
            { new: true }
        );

        // Streak logic if task is completed
        if (status === 'Completed' && task.status !== 'Completed') {
            const user = await User.findById(req.user.id);
            const today = new Date().setHours(0, 0, 0, 0);
            const lastDate = user.lastCompletedDate ? new Date(user.lastCompletedDate).setHours(0, 0, 0, 0) : null;

            if (!lastDate || today > lastDate) {
                if (lastDate && today === lastDate + 86400000) {
                    user.streak += 1;
                } else if (!lastDate) {
                    user.streak = 1;
                } else {
                    user.streak = 1; // Streak reset or restarted
                }
                user.lastCompletedDate = new Date();
                await user.save();
            }
        }

        res.json(updatedTask);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Make sure user owns task
        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/tasks/stats
// @desc    Get user stats
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const tasks = await Task.find({ userId: req.user.id });
        
        const completed = tasks.filter(t => t.status === 'Completed').length;
        const total = tasks.length;
        const pending = total - completed;
        const productivity = total > 0 ? Math.round((completed / total) * 100) : 0;

        res.json({
            streak: user.streak,
            total,
            completed,
            pending,
            productivity
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

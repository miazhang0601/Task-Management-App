const express = require('express');
const authenticate = require('../middleware/auth');
const logger = require('../utils/logger');
const router = express.Router();

let tasks = [];

// Get all tasks for the authenticated user
router.get('/', authenticate, (req, res, next) => {
    try {
        const userTasks = tasks.filter(task => task.userId === req.user.id);
        res.json(userTasks);
    } catch (err) {
        next(err);
    }
});

// Create a new task
router.post('/', authenticate, (req, res, next) => {
    try {
        const task = { id: tasks.length + 1, userId: req.user.id, title: req.body.title, completed: false };
        tasks.push(task);
        logger.info(`Task created: ${task.title} by user ${req.user.username}`);
        res.status(201).json(task);
    } catch (err) {
        next(err);
    }
});

// Update a task
router.put('/:id', authenticate, (req, res, next) => {
    try {
        const taskId = parseInt(req.params.id);
        const task = tasks.find(t => t.id === taskId && t.userId === req.user.id);
        if (task) {
            task.title = req.body.title !== undefined ? req.body.title : task.title;
            task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;
            logger.info(`Task updated: ${task.title} by user ${req.user.username}`);
            res.json(task);
        } else {
            res.status(404).send('Task not found');
        }
    } catch (err) {
        next(err);
    }
});

// Delete a task
router.delete('/:id', authenticate, (req, res, next) => {
    try {
        const taskId = parseInt(req.params.id);
        const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === req.user.id);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            logger.info(`Task deleted: ID ${taskId} by user ${req.user.username}`);
            res.status(204).send();
        } else {
            res.status(404).send('Task not found');
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;

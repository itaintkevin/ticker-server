const express = require('express');
const router = express.Router();
const {
    getTasks,
    createTask,
    deleteTask,
    updateTask
} = require('../controllers/taskController')
const { protect } = require('../middleware/authMiddleware')

// Get All Tasks
router.get('/', protect, getTasks)

// Create A Task
router.post('/', protect, createTask)

// Delete A Task
router.delete('/:id', protect, deleteTask)

// Update A Task
router.put('/:id', protect, updateTask)

module.exports = router
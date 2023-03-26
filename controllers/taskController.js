const Task = require('../models/taskModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// get all tasks 
const getTasks = async (req,res) => {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
}

// create a task 
const createTask = async (req,res) => {
    const { title, description, dueDate, status, priority, subTasks } = req.body;
    const user = req.user.id;
    try {
        const task = await Task.create({ title, description, dueDate, priority, status, subTasks, user });
        res.status(200).json(task);
    } catch (error) {
        res.status(404).json({ error: error.message });
    };
}

// delete a task  
const deleteTask = async (req,res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({error: "No such Task exists."});
    };

    const task = await Task.findById(req.params.id);

    if(!task) {
        return res.status(404).json({error: "Task not found."});
    };

    if (!req.user) {
        res.status(401).json({ error : "User not found"})
    }

    if ( task.user.toString() !== req.user.id ) {
        res.status(401).json({ error : "User not authorized"})
    }

    await task.remove();

    res.status(200).json({ _id: req.params.id });
}

// update a task
const updateTask = async (req,res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No such Task exists."});
    };

    // Check for user
    if (!req.user) {
        res.status(401).json({ error : "User not found"})
    }

    if ( global.user.toString() !== req.user.id) {
        res.status(401).json({ error : "User not authorized"})
    }

    const task = await Task.findOneAndUpdate({_id: id}, {
        ...req.body
    });

    res.status(200).json(task);
}

// add a new sub task
const createSubTask = async (req, res) => {
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: "No such Task exists."});
    };

    // Check for user
    if (!req.user) {
        res.status(401).json({ error : "User not found"})
    }

    if ( global.user.toString() !== req.user.id) {
        res.status(401).json({ error : "User not authorized"})
    }

    const task = await Task.findOneAndUpdate({_id: id}, {
        $push: {
            subTasks: req.body
        }
    });

    res.status(200).json(task);
}

module.exports = {
    getTasks,
    createTask,
    deleteTask,
    updateTask,
    createSubTask,
}
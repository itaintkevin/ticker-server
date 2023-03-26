const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc Register new user 
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if all fields are filled
    if ( !name || !email || !password ) {
        res.status(400).json({error: "Please add all fields!"})
    }

    // Check if user exists
    const userExists = await User.findOne({email})

    if (userExists) {
        res.status(400).json({error: "User already exists!"})
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)


    // Create user 
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400).json({error: "Invalid User Data"})
    }
})

// @desc Authenticate new user 
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email});

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
        })
    } else {
        res.status(400).json({error: "Invalid Credentials"})
    }
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

// @desc Get user details
// @route GET /api/users/me
// @access Private
const getMe = async (req, res) => {
res.status(200).json(req.user)
}

// @desc Get all user details
// @route GET /api/users/
// @access Public
const getUsers = async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
}
module.exports = {
    registerUser, 
    loginUser, 
    getMe,
    getUsers
}
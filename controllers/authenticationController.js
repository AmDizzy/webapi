const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const express = require('express')
const controller = express.Router()

const { generateAccessToken } = require('../middlewares/authorazation')
const userSchema = require('../schemas/userSchema')

// unsecured routes
controller.route('/signup').post(async (req, res) => {
    const {firstName, lastName, email, password} = req.body
    if (!firstName || !lastName || !email || !password) {
        res.status(400).json({text: 'First name, last name, email and password is required.'})
    }

    let user_exists = await userSchema.findOne({email})
    if(user_exists) {
        res.status(409).json({text: 'A user with the same email address already exists.'})
    } else {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await userSchema.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        if (user) {
            res.status(201).json({text: 'User account was created successfully.'})
        } else {
            res.status(400).json({text: 'Something went wrong when creating user account.'})
        }
    }
})

controller.route('/signin').post(async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        res.status(400).json({text: 'Email and password is required.'})
    }
    
    let user = await userSchema.findOne({email})
    if(user && await bcrypt.compare(password, user.password)) {
        res.status(200).json({
            accessToken: generateAccessToken(user._id)
        })
    } else {
        res.status(400).json({text: 'Incorrect email or password.'})
    }
})

module.exports = controller
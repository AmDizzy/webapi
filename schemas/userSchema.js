const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    id: {type: mongoose.Schema.Types.ObjectId},
    firstName: {type: String, required: [true, 'please enter a first name']},
    lastName: {type: String, required: [true, 'please enter a last name']},
    email: {type: String, required: [true, 'please enter an email address'], unique: true},
    password: {type: String, required: [true, 'please enter a password']},
})

module.exports = mongoose.model('users', userSchema)
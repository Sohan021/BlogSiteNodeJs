const { Schema, model } = require('mongoose')
// const { Profile } = require('./Profile')

const userSchema = new Schema({

    username: {
        type: String,
        maxlength: 15,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },

    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
    profilePic: {
        type: String,
        default: '/uploads/default.jpg'
    }

}, {
    timestamps: true
})

const User = model('User', userSchema)
module.exports = User
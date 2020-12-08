const User = require('../../models/User')
const { body } = require('express-validator')

module.exports = [
    body('username')
        .isLength({ min: 2, max: 15 }).withMessage("Btwn 2 to 15 Char")
        .custom(async username => {
            let user = await User.findOne({ username })
            if (user) {
                return Promise.reject('Already Used')
            }
        })
        .trim()
    ,

    body('email')
        .isEmail().withMessage('Please provide a valid Email')
        .custom(async email => {
            let user = await User.findOne({ email })
            if (user) {
                return Promise.reject('Email already used')
            }
        })
        .normalizeEmail()
    ,
    body('password')
        .isLength({ min: 5 }).withMessage('Must be greater thn 5 char')
    ,
    body('confirmPassword')
        //.isLength({ min: 5 }).withMessage('Must be greater thn 5 char')
        .custom((confirmPassword, { req }) => {
            if (confirmPassword != req.body.password) {
                throw new Error('Password does not match')
            }
            return true
        })
]
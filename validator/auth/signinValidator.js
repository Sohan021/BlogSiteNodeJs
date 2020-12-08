const { body } = require('express-validator')

module.exports = [
    body('email')
        .not().isEmpty().withMessage('Mail Should not empty'),

    body('password')
        .not().isEmpty().withMessage("Pass Should not empty")
]
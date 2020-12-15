const { body } = require('express-validator')
const validator = require('validator')

const linkValidator = value => {
    if (value) {
        if (!validator.isURL(value)) {
            throw new Error('Please Provide Valid URL')
        }
    }
    return true
}

module.exports = [
    body('name')
        .not().isEmpty().withMessage('Name Can not be empty')
        .isLength({ max: 30 }).withMessage('Can Not be more than 50 Char')
        .trim()
    ,
    body('title')
        .not().isEmpty().withMessage('Title Can not be empty')
        .isLength({ max: 100 }).withMessage('Can Not be more than 100 Char')
        .trim()
    ,
    body('bio')
        .not().isEmpty().withMessage('Bio Can not be empty')
        .isLength({ max: 500 }).withMessage('Can Not be more than 500 Char')
        .trim()
    ,
    body('website')
        .custom(linkValidator)
    ,
    body('facebook')
        .custom(linkValidator)
    ,
    body('twitter')
        .custom(linkValidator)
    ,
    body('github')
        .custom(linkValidator)
    ,
]



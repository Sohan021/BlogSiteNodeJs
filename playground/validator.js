const { check, validationResult } = require('express-validator')
const router = require('express').Router()

router.get('/validator', (req, res, next) => {
    res.render('playground/signup', { title: 'Validator Playground' })
})

router.post('/validator', [

    check('username')
        .not()
        .isEmpty()
        .withMessage(`Can not be empty`)
        .isLength({ max: 15 })
        .withMessage(`Not grtr thn 15`)
        .trim(),

    check('email')
        .isEmail()
        .withMessage('Plz entr vld eml')
        .normalizeEmail(),

    check('password').custom(value => {
        if (value.length < 5) {
            throw new Error('Passeord must be greater than 5 characters')

        }
        return true
    }),
    check('conformPassword').custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error('Pass ds nt match')
        }
        return true
    })


], (req, res, next) => {

    let errors = validationResult(req)

    const formatter = (error) => error.msg

    console.log(errors.formatWith(formatter).mapped())

    console.log(req.body)
    res.render('playground/signup', { title: 'Validator PlayGround' })

})

module.exports = router
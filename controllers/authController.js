const User = require('../models/User')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const { errorFormatter } = require('../utils/validationErrorFormatter')

exports.signUpGetController = (req, res, next) => {
    res.render('pages/auth/signup', { title: 'Create A new Account', error: {}, value: {} })
}

exports.signUpPostController = async (req, res, next) => {

    let error = validationResult(req)
    const formatter = (error) => error.msg
    let errors = error.formatWith(formatter)

    let { username, email, password } = req.body
    //let errors = validationResult(req).formatWith(errorFormatter)

    if (!errors.isEmpty()) {

        return res.render('pages/auth/signup',
            {
                title: 'Create A new Account',
                error: errors.mapped(),
                value: {
                    username,
                    email,
                    password
                }
            })
    }




    try {

        let hashedPassword = await bcrypt.hash(password, 11)

        let user = new User({
            username,
            email,
            password: hashedPassword
        })

        let createUser = await user.save()
        console.log('User created Successfully', createUser)
        res.render('pages/auth/signup', { title: 'Create A new Account' })
    } catch (e) {
        console.log(e)
        next(e)
    }


}

exports.signInGetController = async (req, res, next) => {
    res.render('pages/auth/signin', { title: 'Login', error: {} })
}

exports.signInPostController = async (req, res, next) => {


    let error = validationResult(req)
    const formatter = (error) => error.msg
    let errors = error.formatWith(formatter)

    let { email, password } = req.body

    if (!errors.isEmpty()) {

        return res.render('pages/auth/signin',
            {
                title: 'Login Your Account',
                error: errors.mapped()
            })
    }


    try {

        let user = await User.findOne({ email })

        if (!user) {
            return res.json({
                message: 'Invalid Credential'
            })
        }

        let match = await bcrypt.compare(password, user.password)

        if (!match) {

            return res.json({
                message: 'Invalid Credential'
            })
        }

        console.log('Successfully loggd In', user)
        res.render('pages/auth/signin', { title: 'Login to Your account' })

    } catch (e) {
        console.log(e)
    }
}

exports.signOutController = (req, res, next) => {

}
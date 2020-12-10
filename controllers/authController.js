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
    //let isLoggedIn = req.get('Cookie').includes('isLoggedIn=true') ? true : false
    console.log(req.session.isLoggedIn, req.session.user)
    res.render('pages/auth/signin', { title: 'Login', error: {} })
}

exports.signInPostController = async (req, res, next) => {

    let { email, password } = req.body

    // let isLoggedIn = req.get('Cookie').includes('isLoggedIn=true') ? true : false
    // res.render('pages/auth/signin', { title: 'Login', error: {}, isLoggedIn })

    let error = validationResult(req)
    const formatter = (error) => error.msg
    let errors = error.formatWith(formatter)



    if (!errors.isEmpty()) {

        return res.render('pages/auth/signin',
            {
                title: 'Login Your Account',
                error: errors.mapped(),
                isLoggedIn
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

        req.session.isLoggedIn = true
        req.session.user = user

        req.session.save(e => {
            if (e) {
                console.log(e)
                return next()
            }
            res.redirect('/dashboard')
        })

        //res.render('pages/auth/signin', { title: 'Login to Your account', error: {} })

    } catch (e) {
        console.log(e)
    }
}

exports.signOutController = (req, res, next) => {
    req.session.destroy(e => {
        if (e) {
            console.log(e)
            return next(e)
        }
        return res.redirect('/auth/signin')
    })
}
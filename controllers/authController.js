const User = require('../models/User')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const { errorFormatter } = require('../utils/validationErrorFormatter')
const Flash = require('../utils/Flash')


exports.signUpGetController = (req, res, next) => {
    res.render('pages/auth/signup',
        {
            title: 'Create A new Account',
            error: {},
            value: {},
            flashMessage: Flash.getMessage(req)
        })
}

exports.signUpPostController = async (req, res, next) => {

    let error = validationResult(req)
    const formatter = (error) => error.msg
    let errors = error.formatWith(formatter)

    let { username, email, password } = req.body
    //let errors = validationResult(req).formatWith(errorFormatter)
   
    if (!errors.isEmpty()) {
        req.flash('fail', 'Please ck ur Form')
        return res.render('pages/auth/signup',
            {
                title: 'Create A new Account',
                error: errors.mapped(),
                value: {
                    username,
                    email,
                    password
                },
                flashMessage: Flash.getMessage(req)
            })
    }




    try {

        let hashedPassword = await bcrypt.hash(password, 11)

        let user = new User({
            username,
            email,
            password: hashedPassword
        })

        await user.save()
        req.flash('success', 'User Created Successfully')
        console.log('User created Successfully', createUser)
        res.render('pages/auth/signin',
            {
                title: 'Create A new Account',
                flashMessage: Flash.getMessage(req)
            })
    } catch (e) {
        console.log(e)
        next(e)
    }


}

exports.signInGetController = async (req, res, next) => {
    //let isLoggedIn = req.get('Cookie').includes('isLoggedIn=true') ? true : false
    //console.log(req.session.isLoggedIn, req.session.user)
    res.render('pages/auth/signin',
        {
            title: 'Login',
            error: {},
            flashMessage: Flash.getMessage(req)
        })
}

exports.signInPostController = async (req, res, next) => {

    let { email, password } = req.body

    // let isLoggedIn = req.get('Cookie').includes('isLoggedIn=true') ? true : false
    // res.render('pages/auth/signin', { title: 'Login', error: {}, isLoggedIn })

    let error = validationResult(req)
    const formatter = (error) => error.msg
    let errors = error.formatWith(formatter)


  
    if (!errors.isEmpty()) {
        req.flash('fail', 'Please ck ur Form')
        return res.render('pages/auth/signin',
            {
                title: 'Login Your Account',
                error: errors.mapped(),
                flashMessage: Flash.getMessage(req)
            })
    }


    try {

        let user = await User.findOne({ email })

        if (!user) {
            req.flash('fail', 'Please provide vadlid crdntial')
            return res.render('pages/auth/signin',
                {
                    title: 'Login Your Account',
                    error: {},
                    flashMessage: Flash.getMessage(req)
                })
        }

        let match = await bcrypt.compare(password, user.password)

        if (!match) {
            req.flash('fail', 'Please provide vadlid crdntial')
            return res.render('pages/auth/signin',
                {
                    title: 'Login Your Account',
                    error: {},
                    flashMessage: Flash.getMessage(req)
                })
        }

        req.session.isLoggedIn = true
        req.session.user = user

        req.session.save(e => {
            if (e) {
                console.log(e)
                return next()
            }
            req.flash('success', 'Successfully Logged in')
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
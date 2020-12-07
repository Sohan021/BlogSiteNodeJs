const User = require('../models/User')
const bcrypt = require('bcrypt')

exports.signUpGetController = (req, res, next) => {
    res.render('pages/auth/signup', { title: 'Create A new Account' })
}
exports.signUpPostController = async (req, res, next) => {

    let { userName, email, password } = req.body


    try {

        let hashedPassword = await bcrypt.hash(password, 11)

        let user = new User({
            userName,
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
    res.render('pages/auth/signin', { title: 'Login' })
}

exports.signInPostController = async (req, res, next) => {
    let { email, password } = req.body

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
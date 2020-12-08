const router = require('express').Router()
const signUpValidator = require('../validator/auth/signupValidator')
const signInValidator = require('../validator/auth/signinValidator')

const {
    signUpGetController,
    signUpPostController,

    signInGetController,
    signInPostController,

    signOutController
} = require('../controllers/authController')



router.get('/signup', signUpGetController)
router.post('/signup', signUpValidator, signUpPostController)

router.get('/signin', signInGetController)
router.post('/signin', signInValidator, signInPostController)

router.get('/signout', signOutController)

module.exports = router
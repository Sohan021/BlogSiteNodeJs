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

const { isUnAuthenticated } = require('../middleware/authMiddleware')

router.get('/signup', isUnAuthenticated, signUpGetController)
router.post('/signup', isUnAuthenticated, signUpValidator, signUpPostController)

router.get('/signin', isUnAuthenticated, signInGetController)
router.post('/signin', isUnAuthenticated, signInValidator, signInPostController)

router.get('/signout', signOutController)

module.exports = router
const router = require('express').Router()

const {
    signUpGetController,
    signUpPostController,

    signInGetController,
    signInPostController,

    signOutController
} = require('../controllers/authController')

router.get('/signup', signUpGetController)
router.post('/signup', signUpPostController)

router.get('/signin', signInGetController)
router.post('/signin', signInPostController)

router.get('/signout', signOutController)

module.exports = router
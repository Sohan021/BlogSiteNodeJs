const router = require('express').Router()
const upload = require('../middleware/uploadMiddleware')
const chalk = require('chalk');

router.get('/play', (req, res, next) => {
    res.render('playground/play', {
        title: 'Playground',
        flashMessage: {}
    })
})

router.post('/play', upload.single('file'), (req, res, next) => {

    if (req.file) {
        console.log(chalk.red(req.file))
    }
    res.redirect('/playground/play')

})

module.exports = router
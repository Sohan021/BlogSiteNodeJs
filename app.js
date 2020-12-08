const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')

// Routes
const authRoutes = require('./routes/authRoute')

//validtr Routes
//const validatorRoutes = require('./playground/validator')

const app = express();

app.set('view engine', 'ejs')
app.set('views', 'views')

const middleware = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({ extended: true }),
    express.json()
]

app.use(middleware)

app.use('/auth', authRoutes)

//Validator
//app.use('/playground', validatorRoutes)

app.get('/', (req, res) => {

    res.json({
        message: 'hello'
    })
})

const PORT = process.env.PORT || 8080


mongoose.connect('mongodb://localhost:27017/blog',
    { useNewUrlParser: true })
    .then(() => {
        console.log('Connected')
        app.listen(PORT, () => {
            console.log(`Server in rinning onPORT ${PORT}`)
        })
    })
    .catch(e => {

        return console.log(e)
    })


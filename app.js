const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose')

// Routes
const authRoutes = require('./routes/authRoute');
const dashboardRoutes = require('./routes/dashboardRoute')
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
//validtr Routes
//const validatorRoutes = require('./playground/validator')
//Middleware Import
const { bindUserWithRequest } = require('./middleware/authMiddleware')
const setLocals = require('./middleware/setLocals')
const app = express();

app.set('view engine', 'ejs')
app.set('views', 'views')




const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/blog',
    collection: 'sessions',
    expires: 1000 * 60 * 60 * 2
});


const middleware = [
    morgan('dev'),
    express.static('public'),
    express.urlencoded({ extended: true }),
    express.json(),
    session({
        secret: process.env.SECRET_KEY || 'SECRET_KEY',
        resave: false,
        saveUninitialized: false,
        store: store
    }),
    bindUserWithRequest(),
    setLocals()
]

app.use(middleware)

app.use('/auth', authRoutes)
app.use('/dashboard', dashboardRoutes)

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


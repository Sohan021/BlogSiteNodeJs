const express = require('express');
const mongoose = require('mongoose')

const setMiddleware = require('./middleware/middlewares')
const setRoutes = require('./routes/routes')

const app = express();

app.set('view engine', 'ejs')
app.set('views', 'views')

setMiddleware(app)

setRoutes(app)

app.use((req, res, next) => {
    let error = new Error('404 Page Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    if (error.status === 404) {
        return res.render('pages/error/404', { flashMessage: {} })
    } else {
        res.render('pages/error/500', { flashMessage: {} })
    }
    
   
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


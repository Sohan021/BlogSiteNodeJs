const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash')
const MongoDBStore = require('connect-mongodb-session')(session);
const { bindUserWithRequest } = require('./authMiddleware')
const setLocals = require('./setLocals')


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
    flash(),
    bindUserWithRequest(),
    setLocals(),
]

module.exports = app => {
    middleware.forEach(_ => {
        app.use(_)
    })
}
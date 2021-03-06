const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const http = require('http')
const cookieParser = require('cookie-parser')
const validator = require('express-validator')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const flash = require('connect-flash')
const passport = require('passport')
const _ = require('lodash')
const socketIO = require('socket.io')
const {Users} = require('./helpers/UsersClass')
const {Global} = require('./helpers/Global')

const container = require('./container')

container.resolve(function(users, admin, home, group, results, privateChat) {

    mongoose.Promise = global.Promise
    mongoose.connect('mongodb://localhost/webchat')

    const app = SetupExpress()

    function SetupExpress() {
        const app = express()
        const server = http.createServer(app)
        const io = socketIO(server)
        server.listen(3000, () => console.log('Listening on port 3000'))
        ConfigureExpress(app)

        require('./socket/groupchat')(io, Users)
        require('./socket/friends')(io)
        require('./socket/globalroom')(io, Global)
        require('./socket/pm')(io)

        // Setup Router
        const router = require('express-promise-router')()
        users.SetRouting(router)
        admin.SetRouting(router)
        home.setRouting(router)
        group.SetRouting(router)
        results.SetRouting(router)
        privateChat.SetRouting(router)

        app.use(router)
    }


    function ConfigureExpress(app) {
        require('./passport/passport-local')
        require('./passport/passport-facebook')
        require('./passport/passport-google')

        app.use(express.static('public'))
        app.use(cookieParser())
        app.set('view engine', 'ejs')
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({extended: true}))

        app.use(validator())
        app.use(session({
            secret: 'thisisasecretkey',
            resave: true, 
            saveUninitialized: true, 
            store: new MongoStore({mongooseConnection: mongoose.connection}) 
        }))

        app.use(flash())
        app.use(passport.initialize())
        app.use(passport.session())

        app.locals._ = _
    }

})
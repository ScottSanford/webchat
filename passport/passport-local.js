const passport = require('passport')
const User = require('../models/users')
const LocalStrategy = require('passport-local').Strategy

// Allows or determines which of the users info will be saved in the session
// Using the User ID
passport.serializeUser((user, done) => {
    done(null, user.id)
})

// Find User ID match compared to the Database
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        // if no err, err == null and user == {}
        done(err, user)
    })
})

const formFields = {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}

// Passport Middleware 
passport.use('local.signup', new LocalStrategy(
    formFields, (req, email, password, done) => {
    // Look in MongoDB for a user match
    User.findOne({'email': email}, (err, user) => {
        // Network Error
        if (err) {
            return done(err)
        }

        // if the email already exists
        if (user) {
            return done(null, false, req.flash('error', 'User with email already exists'))
        }

        const newUser = new User()
        newUser.username = req.body.username
        newUser.email = req.body.email
        newUser.password = newUser.encryptPassword(req.body.password)

        // Save a new user to MongoDB
        newUser.save(err => {
            done(null, newUser)
        })
    })

}))

passport.use('local.login', new LocalStrategy(
    formFields, (req, email, password, done) => {

    User.findOne({ 'email': email }, (err, user) => {
        if (err) {
            return done(err)
        }

        const messages = []
        if (!user || !user.validUserPassword(password)) {
            messages.push('Email Does Not Exist or Password is Invalid')
            return done(null, false, req.flash('error', messages))
        }

        return done(null, user)
    })
}))
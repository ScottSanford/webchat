const passport = require('passport')
const User = require('../models/users')
const secret = require('../secret/secretFile')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

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

// Passport Middleware 
passport.use(new GoogleStrategy({
    clientID: secret.google.clientID,
    clientSecret: secret.google.clientSecret,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
    // Look in MongoDB for a user match
    User.findOne({ google: profile.id }, (err, user) => {
        // Network Error
        if (err) {
            return done(err)
        }

        if (user) {
            return done(null, user)
        } else {
            const newUser = new User()
            newUser.google = profile.id
            newUser.fullname = profile.displayName
            newUser.username = profile.displayName
            newUser.email = profile.emails[0].value
            newUser.userImage = profile._json.image.url

            newUser.save(err => {
                if (err) {
                    return done(err)
                } else {
                    return done(null, newUser)
                }
            })
        }
    })

}))
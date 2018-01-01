const passport = require('passport')
const User = require('../models/users')
const secret = require('../secret/secretFile')
const FacebookStrategy = require('passport-facebook').Strategy

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
    clientID: secret.facebook.clientID,
    clientSecret: secret.facebook.clientSecret,
    profileFields: ['email', 'displayName', 'photos'],
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    passReqToCallback: true
}

// Passport Middleware 
passport.use(new FacebookStrategy(
    formFields, (req, token, refreshToken, profile, done) => {
        // Look in MongoDB for a user match
        User.findOne({ facebook: profile.id }, (err, user) => {
            // Network Error
            if (err) {
                return done(err)
            }

            // if the facebook user already exists
            if (user) {
                return done(null, user)
            } else {
                // Create new facebook profile in MongoDB
                const newUser = new User()
                newUser.facebook = profile.id
                newUser.fullname = profile.displayName
                newUser.email = profile._json.email
                newUser.userImage = `https://graph.facebook.com/${profile.id}/picture?type=large`
                newUser.fbTokens.push({token:token})

                // Save a new user to MongoDB
                newUser.save(err => done(null, newUser))
            }

        })

}))
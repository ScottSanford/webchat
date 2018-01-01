const passport = require('passport')

module.exports = function(User) {
    return {
        SetRouting: function(router) {
            // GET Routes
            router.get('/', this.indexPage)
            router.get('/signup', this.getSignUp)
            router.get('/home', this.homePage)
            router.get('/auth/facebook', this.getFacebookLogin)
            router.get('/auth/facebook/callback', this.facebookLogin)

            // POST Routes
            router.post('/', User.LoginValidation, this.postLogin)
            router.post('/signup', User.SignUpValidation, this.postSignUp)
        }, 

        indexPage: function (req, res) {
            const errors = req.flash('error')
            return res.render('index', { 
                title: 'Web Chat | Login', 
                messages: errors, 
                hasErrors: errors.length > 0 
            })
        }, 

        postLogin: passport.authenticate('local.login', {
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true
        }), 

        getSignUp: function(req, res) {
            const errors = req.flash('error')
            return res.render('signup', {
                title: 'Web Chat App | Signup', 
                messages: errors,
                hasErrors: errors.length > 0
            })
        }, 

        postSignUp: passport.authenticate('local.signup', {
            successRedirect: '/home', 
            failureRedirect: '/signup', 
            failureFlash: true
        }), 

        getFacebookLogin: passport.authenticate('facebook', {
            scope: 'email'
        }),

        facebookLogin: passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),

        homePage: function (req, res) {
            return res.render('home')
        }

    }
}
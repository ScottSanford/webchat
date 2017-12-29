const passport = require('passport')

module.exports = function() {
    return {
        SetRouting: function(router) {
            // GET Routes
            router.get('/', this.indexPage)
            router.get('/signup', this.getSignUp)
            router.get('/home', this.homePage)


            // POST Routes
            router.post('/signup', this.postSignUp)
        }, 

        indexPage: function(req, res) {
            return res.render('index', {test: 'This is a test'})
        }, 

        getSignUp: function(req, res) {
            return res.render('signup')
        }, 

        postSignUp: passport.authenticate('local.signup', {
            successRedirect: '/home', 
            failureRedirect: '/signup', 
            failureFlash: true
        }), 

        homePage: function (req, res) {
            return res.render('home')
        }

    }
}
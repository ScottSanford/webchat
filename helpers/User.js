module.exports = function() {
    return {
        SignUpValidation: (req, res, next) => {
            // Validate Form on the Server Side
            req.checkBody('username', 'Username is required.').notEmpty()
            req.checkBody('username', 'Username must not be less than 5.').isLength({min: 5})
            
            req.checkBody('email', 'Email is required.').notEmpty()
            req.checkBody('email', 'Email is invalid.').isEmail()
            
            req.checkBody('password', 'Password is required.').notEmpty()
            req.checkBody('password', 'Password must not be less than 5').isLength({min: 5})

            // Output any Errors if Form Unsuccessful
            req.getValidationResult()
                .then(result => {
                    const errors = result.array()
                    const messages = []

                    errors.forEach(error => {
                        messages.push(error.msg)
                    })

                    req.flash('error', messages)
                    res.redirect('/signup')
                })
                .catch(err => next())
        }, 

        LoginValidation: (req, res, next) => {
            req.checkBody('email', 'Email is Required').notEmpty()
            req.checkBody('email', 'Email is Invalid').isEmail()
            
            req.checkBody('password', 'Password is Required').notEmpty()
            req.checkBody('password', 'Password Must Not Be Less Than 5').isLength({min: 5})
            
            req.getValidationResult()
                .then((result) => {
                    const errors = result.array()
                    const messages = [];
                    errors.forEach((error) => {
                        messages.push(error.msg)
                    });
                
                    req.flash('error', messages)
                    res.redirect('/')
                })
                .catch((err) => {
                    return next()
                })
        }
    }
}
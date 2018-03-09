module.exports = function() {
    return {
        SetRouting: function(router) {
            router.get('/chat', this.getChatPage)
        },

        getChatPage: function(req, res) {
            res.render('privatechat/privatechat', {
                user: req.user
            })
        }
    }
}
exports.get_dash = async (req, res) => {
    res.render('voter', { title: 'Voter Dashboard' })
}
exports.get_home = async (req, res) => {
    res.cookie('voterLoginJWT', '', { maxAge: 1 })
    res.redirect('/')
} 
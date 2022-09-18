exports.get_dash = async (req, res) => {
    res.render('candidate', { title: 'Candidate Dashboard' })
}
exports.get_home = async (req, res) => {
    res.cookie('candidateLoginJWT', '', { maxAge: 1 })
    res.redirect('/')
} 
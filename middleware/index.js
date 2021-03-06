function loggedOut(req, res, next){
  if(req.session && req.session.userId) {
    return res.redirect('/profile')
  }
  return next()
}

function loggedIn(req, res, next){
  if(req.session && req.session.userId) {
    return next()
  }
  return res.redirect('/login')
}

module.exports.loggedOut = loggedOut
module.exports.loggedIn = loggedIn
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
   next()
  } else {
    res.status(401).json('No tenes permisos para hacer esto, Comproba que estas logueado y volve a intentar')
  }
}

module.exports = ensureAuthenticated
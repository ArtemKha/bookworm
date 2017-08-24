var express = require('express')
var router = express.Router()
var User = require('../models/user')
const mid = require('../middleware')

router.get('/profile', mid.loggedIn, (req, res, next) => {
  User.findById(req.session.userId)
      .exec((err, user) => {
        if (err) {
          next(err)
        } else {
          return res.render('profile',
            { title: 'Profile', name: user.name, favorite: user.favoriteBook })
        }
      })
})

router.get('/login', mid.loggedOut, (req, res, next) => {
  return res.render('login', { title: 'Log In' })
})

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy(function(err) {
      if (err) {
        return next(err)
      } else {
        return res.redirect('/')
      }
    })
  }
})

router.post('/login', (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, function(error, user) {
      if (error || !user) {
        const err = new Error('Wrong password or email.')
        err.status = 401
        return next(err)
      } else {
        req.session.userId = user._id
        return res.redirect('./profile')
      }
    })
  } else {
    const err = new Error('Password and email are required.')
    err.status = 401
    return next(err)
  }
})

router.get('/register', mid.loggedOut, (req, res, next) => {
  return res.render('register', { title: 'Sing Up' })
})

router.post('/register', (req, res, next) => {
  if (req.body.email &&
    req.body.name &&
    req.body.favoriteBook &&
    req.body.password &&
    req.body.confirmPassword) {
    if (req.body.password !== req.body.confirmPassword) {
      const err = new Error('Passwords do not match.')
      err.status = 400
      return next(err)
    }
    const userData = {
      email: req.body.email,
      name: req.body.name,
      favoriteBook: req.body.favoriteBook,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword
    }

    User.create(userData, (err, user) => {
      if (err) {
        return next(err)
      } else {
        req.session.userId = user._id
        return res.redirect('/profile')
      }
    })
  } else {
    const err = new Error('All fields required.')
    err.status = 400
    return next(err)
  }
})

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' })
})

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' })
})

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' })
})

module.exports = router

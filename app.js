const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
const MonogoStore = require('connect-mongo')(session)
const app = express()


mongoose.connect('mongodb://localhost:27017/bookworm')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

app.use(session({
  secret: "don't say about the club",
  resave: true,
  saveUninitialized: false,
  store: new MonogoStore({
    mongooseConnection: db
  })
}))

app.use(function (req, res, next) {
  res.locals.currentUser = req.session.userId
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(__dirname + '/public'))

app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

const routes = require('./routes/index')
app.use('/', routes)

app.use(function(req, res, next) {
  const err = new Error('File Not Found')
  err.status = 404
  next(err)
})

app.use(function(err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

app.listen(3000, function () {
  console.log('Express app listening on port 3000')
})

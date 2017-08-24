const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  favoriteBook: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
})

UserSchema.statics.authenticate = (email, password, cb) => {
  User.findOne({ email: email})
      .exec((err, user) => {
          if (err) return err
          else if (!user) {
            const error = new Error('User not found.')
            error.status = 404
            return cb(error)
          }
          bcrypt.compare(password, user.password, (error, result) => {
            if (result === true) {
              return cb(null, user)
            } else {
              return cb()
            }
          })
        })
}

UserSchema.pre('save', (next) => {
  const user = this
  bcrypt.hash(user.password, bcrypt.genSaltSync(10), null, (err, hash) => {
    if (err) return next(err)
    user.password = hash
    next()
  })
})

const User = mongoose.model('User', UserSchema)
module.exports = User

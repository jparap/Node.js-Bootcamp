let mongoose = require('mongoose')
//let bcrypt = require('bcrypt')
//let crypto = require('crypto')
//let SALT = 'CodePathHeartNodeJS'
//let nodeify  = require('bluebird-nodeify')

require('songbird')

let userSchema = mongoose.Schema({
  username: {
  type: String,
  required: true
  },
  email: {
  type: String,
  required: true
  },
  password: {
  type: String,
  required: true
  },
    blogtitle: String,
	blogdescription: String
})

/*
userSchema.methods.generateHash = async function(password) {
//  return await bcrypt.promise.hash(password, 8)
  return await crypto.promise.pbkdf2(password, SALT, 4096, 512, 'sha256')
}

userSchema.methods.validatePassword = async function(password) {
//  return await bcrypt.promise.compare(password, this.password)
let passwordHash = await crypto.promise.pbkdf2(password, SALT, 4096, 512, 'sha256')
   if (passwordHash.toString('hex') !== this.password) {
       return [false, {message: 'Invalid password'}]
   } else { 
    return true
    }
}


userSchema.pre('save', function(callback)=>{
 nodify(async() {
 if (!this.isModified('password')) return callback()
 this.password = await this.generateHash(this.password)
 }(), callback)
 })



userSchema.pre('save', function(callback)=>{
 nodify(async() {
 if (!this.isModified('password')) return callback()
 //this.password = await this.generateHash(this.password)
 }(), callback)
 })
 */

userSchema.path('password').validate( (pwd) => {

	return pwd.length >= 4 &&  /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd)
})

module.exports = mongoose.model('User', userSchema)

      
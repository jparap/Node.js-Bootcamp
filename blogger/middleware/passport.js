let LocalStrategy = require('passport-local').Strategy
let nodeifyit = require('nodeifyit')
let User = require('../models/user')
let util = require('util')

module.exports = (app) => {
  let passport = app.passport

  passport.serializeUser(nodeifyit(async (user) => user._id))
  passport.deserializeUser(nodeifyit(async (id) => {
    return await User.promise.findById(id)
  }))

/* passport.use(new LocalStrategy({
    // Use "email" field instead of "username"
    usernameField: 'username',
    failureFlash: true
  }, nodeifyit(async (username, password) => {
   let user
  if (username.indexOf('@')){
    let email = username.toLowerCase()
    user = await User.promise.findOne({email})
    } else {
    let regexp = new RegExp(username, 'i')
    user = await User.promise.findOne({username: {$regex: regexp}
    })
   }
    if (!user || username !== user.username) {
      return [false, {message: 'Invalid username'}]
    }

    if (!await user.validatePassword(password)) {
      return [false, {message: 'Invalid password'}]
    }
    return user
  }, {spread: true})))
*/

passport.use('local-login', new LocalStrategy({
    // Use "email" field instead of "username"
    usernameField: 'username',
    // We'll need this later
    failureFlash: true
	},	nodeifyit( async (username, password) => {
	   let user
  if (username.indexOf('@')){
    let email = username.toLowerCase()
    user = await User.promise.findOne({email})
    } else {
    let regexp = new RegExp(username, 'i')
    user = await User.promise.findOne({username: {$regex: regexp}
    })
   }
	  //  email = (email || '').toLowerCase()
	//		let user = await User.promise.findOne({email})
console.log('username is: '+ user.username )
console.log('username variable is: '+ username )
console.log('email is: '+ user.email )
console.log('user.email is: '+ user.email )
			if(!user || (username !== user.username) && (username !== user.email) ){
				return [false, {message: 'Invalid User Name'}]
			}

//    let passwordHash = await crypto.promise.pbkdf2(password, SALT, 4096, 512, 'sha256')
   if (password !== user.password) {
       return [false, {message: 'Invalid password'}]
   }

			return user
		}, {spread: true})))
		
  passport.use('local-signup', new LocalStrategy({
    // Use "email" field instead of "username"
    usernameField: 'email',
    failureFlash: true,
    passReqToCallback: true
  }, nodeifyit(async (req, email, password) => {
      email = (email || '').toLowerCase()
      // Is the email taken?
      if (await User.promise.findOne({email})) {
        return [false, {message: 'That email is already taken.'}]
      }

let {username, title, description} = req.body

let regexp = new RegExp(username, 'i')
let query = {username: {$regex: regexp}}

if (await User.promise.findOne(query)) {
    return [false, {message: 'That username is alredy taken'}]
}
      // create the user
      let user = new User()
      user.username = username
      user.email = email
      user.password = password
      user.blogtitle = title
      user.blogdescription = description
      // Use a password hash instead of plain-text
     // user.password = await user.generateHash(password)
     
     console.log( user.username)
      console.log( user.email)
           console.log( user.password)
                console.log( user.blogtitle)
                     console.log( user.blogdescription)
          try{
				return await user.save()	
			}catch(e){
				console.log(util.inspect(e))
				return [false, {message: e.message}]
			}
  }, {spread: true})))
}

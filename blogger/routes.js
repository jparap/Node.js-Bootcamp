let fs = require('fs')
let dataUri = require('datauri')
let multiparty = require('multiparty')
let then = require('express-then')
let isLoggedIn = require('./middleware/isLoggedIn')
let Post = require('./models/post')



module.exports = (app) => {
  let passport = app.passport

  app.get('/', (req, res) => {
    res.render('index.ejs')
  })
  
  app.get('/login', (req, res) => {
    res.render('login.ejs', {message: req.flash('error')})
  })
  
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
  }))

  app.get('/signup', (req, res) => {
    res.render('signup.ejs', {message: req.flash('error')})
  })
  
  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }))

  app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile.ejs', {
      user: req.user,
      message: req.flash('error')
    })
  })

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })
  
  app.get('/post/:postId?', then(async (req, res) => {
    let postId = req.params.postId
  
    if (!postId) {
    res.render('post.ejs', {
      post: {},
      verb: 'Create'
    })
    return
    }
    
    let post = await Post.promise.findById(postId)
    if (!post) res.send(404, 'Not found')
    
    let dataUri = new DataUri
    let image = dataUri.format('.'+post.image.contentType.split('/').pop(),
    post.image.data)
    
    console.log(image)
    res.render('post.ejs', {
    post: post,
    verb: 'Edit',
    image: `data: ${post.image.contentType};base64,${image.base64}`
 
    })
    }))
 
  app.post('/post/:postId?', isLoggedIn, then(async (req, res) => {
    let postId = req.params.postId
    console.log('post id is :'+postId)
    if (!postId) {
    let post = new Post()
    console.log(req.body)
    let [{title: [title], content: [content]},{image: [file]}] = await new multiparty.Form().promise.parse(req)
    
    post.email = req.user.email
    post.title = title
    post.content = content
    console.log(file, title, content)
    post.image.data = await fs.promise.readFile(file.path)  
    post.image.contentType = file.headers['content-type']
    console.log(file, title, content, post.image)
    await post.save() 
    console.log("req.user.blogtitle  "+req.user)
 //  res.redirect('/blog/' + encodeURI(req.user.blogtitle))
    res.redirect('/blog/' + encodeURI(req.user.email))
   //   res.redirect(`/blog/posts/${post.id}`)
    return
    }
    
    let post = await Post.promise.findById(postId)
    if (!post) res.send(404, 'Not Found')
    
    post.title = title
    post.content = content
    await post.save()
    console.log("Request Object here "+JSON.stringify(req.passport.user))
    //res.redirect(`/blog/posts/${post.id}`)
   // res.redirect('/blog/' + encodeURI(req.user.blogtitle))
     res.redirect('/blog/' + encodeURI(req.user.email))
    return  
    }))

 app.get('/blog/:email?', then(async (req, res) => {
    let email = req.params.email
  console.log("email - from blog "+ email)
    if (!email) {
    res.render('post.ejs', {
      post: {},
      verb: 'Create'
    })
    return
    }
    
    let post = await Post.promise.find(email)
     console.log("post - from blog "+ email)
    if (!post) res.send(404, 'Not found')
    
    let dataUri = new DataUri
    let image = dataUri.format('.'+post.image.contentType.split('/').pop(),
    post.image.data)
    
    console.log(image)
    res.render('post.ejs', {
    post: post,
    verb: 'Edit',
    image: `data: ${post.image.contentType};base64,${image.base64}`
 
    })
    }))
        
 /*   app.get('/blog/posts/:postId?', (req, res) => {
    let blogTitle = req.params.blogtitle
    let postId = req.params.postId
    let post = await Post.promise.findById(postId)
    //let post = new Post()
   //let blogPosts = await Post.promise.find({email:req.user.email})
      console.log("email  "+req.user.email)
   //         console.log("blogposts  "+blogPosts)
    res.render('blog.ejs', {
      user: req.user,
      blogPosts: post,
    // blogPosts: await post.promise.find({email:req.user.email}),
      message: req.flash('error')
    })
  })
  */
  
  
}



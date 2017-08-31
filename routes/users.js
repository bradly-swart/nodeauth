var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

var User = require('../models/user')

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new localStrategy({ usernameField: 'email' },function(email, password, done){
  User.getUserByEmail(email, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown user'})
    }

    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null, user)
      }else{
        return done(null, false, { message: 'invalid password'} )
      }
    })
  })
}))

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res, next) {
  res.render('users/login', { title: 'Login' })
});

router.post('/login', passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid login details'}),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    // res.redirect('/users/' + req.user.username);
    req.flash('success', 'You are now logged in.')
    res.redirect('/')
});

router.get('/register', function(req, res, next) {
  res.render('users/register', { title: 'Register' })
});

router.post('/register', upload.single('profilePic'), function(req, res, next) {
    var name = req.body.name
    var email = req.body.email
    var password = req.body.password
    var passwordConfirm = req.body.passwordConfirm
    if(req.file){
      console.log(req.file)
      var profilePic = req.file.filename
    }else{
      var profilePic = 'blankprofile.jpg'
    }

    //form validation
    req.checkBody('name', 'Name field cannot be empty').notEmpty()
    req.checkBody('email', 'Email field cannot be empty').notEmpty()
    req.checkBody('email', 'Email must be valid email').isEmail()
    req.checkBody('password', 'Password cannot be empty').notEmpty()
    req.checkBody('passwordConfirm', 'passwords do not match').equals(req.body.password)

    req.getValidationResult().then(function (result){
      var errors = result.array().map(function(error){
        return error.msg
      })
      if(errors.length > 0){
        console.log(errors)
        res.render('users/register', { errors: errors})
      }else{
        console.log("No errors")
        var newUser = new User({
          name: name,
          email: email,
          password: password,
          profilePic: profilePic
        });

        User.createUser(newUser, function(err, user){
          if(err) throw err;
          console.log(user);
        })

        req.flash('success', "Thank you for registering")
        res.location('/')
        res.redirect('/')
      }
    })
});


module.exports = router;

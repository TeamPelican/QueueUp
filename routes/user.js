var express = require('express');
var db = require('../lib/MongoDB-user.js');

var router = express.Router();

router.post('/auth', (req,res) => {
  var user = req.session.user;
  if (!user){
    req.flash("login","Please log in");
    res.redirect('/login');
  } else {
    var name = req.body.name;
    var password = req.body.pass;
    db.login(name , password, function(err, result) {
      if (err) {
        req.flash("login", err);
        res.redirect('/login');
      } else {
        req.session.user = {"name":name};
        res.redirect('/profile');
      }
    });
  }
});

router.post('/add', (req,res) => {
  var name = req.body.name;
  var password = req.body.pass;
  db.addUser(name,password,false,function(err, result){
    if (err) {
      req.flash("signup", err);
      res.redirect('/signup');
    } else {
      req.session.user = {"name" : name};
      res.redirect('/profile');
    }
  });
});

router.get('/signup', (req, res) => {
  var user = req.session.user;
  if (user){
    res.redirect('/profile');
    return;
  }
  var message = req.flash('signup') || '';
  res.locals.view_signup = true; // for template specific css/js
  res.render('signup', {
    title : 'Sign up for QueueUp',
    message : message
  });
});

router.get('/login', (req, res) => {
  var user = req.session.user;

  if (user) {
    res.redirect('/profile');
  } else {
    var message = req.flash('login') || '';
    res.locals.view_login = true; // for template specific css/js
    res.render('login', {
      title    : 'QueueUp Login',
      message  : message
    });
  }
});

router.get('/logout', function(req, res) {
  var user = req.session.user;

  if (user) {
    delete req.session.user;
  } else {
    delete req.session.user;
  }

  // maybe add a flash method for saying "Successfully logged out?"
  res.redirect('/user/login');
});

router.get('/profile', function(req, res) {
  var user = req.session.user;

  if (!user) {
    res.redirect('/login');
  } else {
    res.locals.view_profile = true;
    res.render('profile', {
      title: req.session.user.name + '\'s Profile'
    });
  }
});

module.exports = router;

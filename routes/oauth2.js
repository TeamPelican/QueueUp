var express = require('express');
var oauth2 = require('../lib/oauth2.js');
var router = express.Router();

router.get('/deauthorize', function(req,res){
  var user = req.session.user;
  //check for a logged in user in order to display content
  if(!user){
    req.flash('login', "Please log in to perform this action.");
    res.redirect('/user/login');
  } else {
    oauth2.deauthorize(user, function(error, responseBody) {
      if (error) {
        req.flash('profile', error);
        res.redirect('/profile');
      } else {
        req.flash('profile', responseBody);
        res.redirect('/profile');
      }

    });
  }
});

router.get('/oauth2callback', function(req, res) {
  var user = req.session.user;
  if(!user) {
    req.flash('login', "Please log in to perform this action.");
    res.redirect('/user/login');
  } else {
    var state = req.query.state;
    var authCode = req.query.code;
    oauth2.getToken(user, authCode, state, function(error) {
      if (error) {
        req.flash('profile',error.toString());
      }
      res.redirect('/profile');
    });
  }
});

module.exports = router;

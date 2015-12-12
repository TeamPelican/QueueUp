var express = require('express');
var router = express.Router();
var db = require('../lib/MongoDB-user.js');
var api = require('../lib/api.json');
var oauth2 = require('../lib/oauth2.js');

// TODO: finish this
router.get('/deauthorize', function(req,res){
  var user = req.session.user;
  //check for a logged in user in order to display content
  if(!user){
    req.flash('login', "Please log in to perform this action.");
    res.redirect('/user/login');
  } else {
    db.getAPI(user.name, "YouTube", function(err, results){
      if(err){
        req.flash('profile',"Unable to get credentials. ",err);
        res.redirect('/profile');
      }
      else{
        var accessToken = results.access_token;
        oauth2.deauthorize(user, accessToken, function(error) {
          if (error) {
            req.flash('profile', err);
            res.redirect('/profile');
          }
        });
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
        req.flash('profile',err.toString());
      }
      res.redirect('/profile');
    });
  }
});

module.exports = router;

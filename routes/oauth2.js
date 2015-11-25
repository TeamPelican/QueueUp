var express = require('express');
var router = express.Router();
var db = require('../lib/MongoDB-user.js');
var api = require('../lib/api.json')

//setup youtube auth URL
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(api.web.client_id, api.web.client_secret, api.web.redirect_uris[2]);
var scopes = 'https://www.googleapis.com/auth/youtube';

router.get('/youtube', (req,res) => {
  var user = req.session.user;
  if(!user){
    res.redirect('/login');
  } else {
    var authCode = req.query.code;
    oauth2Client.getToken(authCode, function(err, tokens){
      if(!err){
        // db.addYouTubeAPI("admin",{"access_token":"asdgaiwhgjb","refresh_token":"DSBIgualsuhgue"},function(error, result){
        console.log(tokens);
        db.addYouTubeAPI(user.name,tokens,function(error, result){
          if(error){
            req.flash('profile', "Unable to add to database. ",error);
            res.redirect('/profile');
          } else {
            res.redirect('/profile')
          }
        });
        
      } else{
        req.flash('profile',err.toString());
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
    var accessCode = req.query.code;
    var state = req.query.state;
    if(state){
      res.redirect("/oauth2/"+state);
    }
  }
});

module.exports = router;
var express = require('express');
var router = express.Router();
var db = require('../lib/MongoDB-user.js');
var api = require('../lib/api.json');

//setup youtube auth URL
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(api.web.client_id, api.web.client_secret, api.web.redirect_uris[1]);
var scopes = 'https://www.googleapis.com/auth/youtube';

router.get('/deauthorize', function(req,res){
  var user = req.session.user;
  //check for a logged in user in order to display content
  if(user){
    db.getAPI(user.name, "YouTube", function(err, results){
      if(err){
        req.flash('profile',"Unable to get credentials. ",err);
        res.redirect('/profile');
      }
      else{
        var access_token = results.access_token;
        db.removeAPI(user.name, "YouTube", function(){
          if(err){
            req.flash('profile',"Unable to remove token. ",err);
            res.redirect('/profile');
          }
          else{
            res.redirect('https://accounts.google.com/o/oauth2/revoke?'+
          'token='+access_token);
          // 'redirect_uri=http://localhost:3000/user/profile');
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
    oauth2Client.getToken(authCode, function(err, tokens){
      if(!err){
        db.addAPI(user.name,state,tokens,function(error, result){
          if(error){
            console.log(error);
            req.flash('profile', error);
            res.redirect('/profile');
          } else {
            console.log("wtf breh");
            res.redirect('/profile');
          }
        });
      } else{
        console.log(err);
        req.flash('profile',err.toString());
        res.redirect('/profile');
      }
    });
  }
});

module.exports = router;

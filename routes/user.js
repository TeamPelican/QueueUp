var express = require('express');
var db = require('../lib/MongoDB-user.js');
var api = require('../lib/api.json');

//get api creds
var api = require('../lib/api.json');
//setup youtube auth URL
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(api.web.client_id, api.web.client_secret, api.web.redirect_uris[1]);
var scopes = 'https://www.googleapis.com/auth/youtube';
var youtube = google.youtube('v3');


var router = express.Router();

router.post('/auth', (req,res) => {
  var user = req.session.user;
  if (user) {
    req.flash("profile");
    res.redirect('/profile');
  } else {
    var name = req.body.name;
    var password = req.body.pass;
    db.login(name , password, function(err, result) {
      if (err) {
        req.flash("login", err);
        res.redirect('/user/login');
      } else {
        if (req.body.rememberme) {
          req.session.cookie.maxAge= 7*24*60*60*1000; // 7 days
        }
        req.session.user = {
          "name"  : result.username,
          "admin" : result.admin
        };
        if (result.admin)
          res.redirect('/admin');
        else
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
  req.session.destroy();
  // maybe add a flash method for saying "Successfully logged out?"
  res.redirect('/user/login');
});

router.get('/profile', function(req, res) {
  var user = req.session.user;
  if (!user) {
    res.redirect('/user/login');
  } else {

    //fill
    var message = req.flash('profile') || '';
    var status = req.session.alertStatus; // use for proper pop-up dialog

    var authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: "YouTube"
    });
    delete req.session.alertStatus; // reset session variable
    res.locals.view_profile = true;
    res.render('profile', {
      title: req.session.user.name + '\'s Profile',
      message: message,
      status: status,
      youtube_url: authUrl
    });
  }
});

router.get('/dashboard', function(req, res) {
  var user = req.session.user;
  var content = [];
  if (!user) {
    res.redirect('/user/login');
  } else {
    db.getAPI(user.name, "YouTube", function(err, results){
      if (err) {
        res.render('dashboard', { title: "QueueUp", message: err});
      } else {
        oauth2Client.setCredentials(results);
        youtube.activities.list(
          {
            part: "snippet,contentDetails",
            // q: "",       //query string, not super helpful
            maxResults: 15,
            home: true,
            //mine: true,
            // order: "viewCount",
            // regionCode: "US",
            //safeSearch: "moderate",
            //type: "video",
            auth: oauth2Client
          }, function(err, response){
            if (err) {
              console.log(err);
              content = [];
            }
            else {
              var recommendation = [];
              for (var item in response.items){
                if (response.items[item].snippet.type==="upload") {
                  recommendation.push(response.items[item]);
                }
              }
              console.log(response.items[0].contentDetails);
              content = recommendation;
            }
            res.locals.view_dashboard = true;
            res.render('dashboard', { title: "QueueUp", content: content });
          });
        }
      });
    }
  });

  router.post('/change-pass', function(req, res) {
    var user = req.session.user;
    if (!user) {
      res.redirect('/login');
    } else {
      var currPass = req.body.currPass;
      db.login(user.name, currPass, function(err) {
        if (err) {
          req.session.alertStatus = 'error';
          if (!req.session.invalidAttempts) {
            req.session.invalidAttempts = 0;
          }
          req.session.invalidAttempts++;
          // logout if 3 invalid attempts
          if (req.session.invalidAttempts > 2) {
            req.flash('login', 'Exceeded amount of incorrect login attempts.');
            res.redirect('/user/logout');
          } else {
            req.flash('profile', 'Incorrect password');
            res.redirect('/user/profile');
          }
        } else {
          var newPass = req.body.newPass;
          delete req.session.invalidAttempts;
          db.changePassword(user.name, newPass, function(err,result) {
            if (err) {
              req.session.alertStatus = 'error';
              req.flash('profile', err);
            } else {
              req.session.alertStatus = 'success';
              req.flash('profile', 'Successfully changed password!');
            }
            res.redirect('/user/profile');
          });
        }
      });
    }
  });

  module.exports = router;

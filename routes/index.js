var express = require('express');
var team = require('../lib/team.js');
var router = express.Router();
//get DB
var db = require('../lib/MongoDB-user.js');
//get api creds
var api = require('../lib/api.json');
//setup youtube auth URL
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(api.web.client_id, api.web.client_secret, api.web.redirect_uris[0]);
var scopes = 'https://www.googleapis.com/auth/youtube';
var youtube = google.youtube('v3');

router.get('/', (req, res) => {
  res.locals.view_splash = true; // for template specific css/js
  var content = [];
  var user = req.session.user;
  //check for a logged in user in order to display content
  if(user){
    db.getYouTubeAPI(user.name, function(err, results){
      if(err){
        content = [];
        res.render('splash', { title: "QueueUp", content: content });

      }else{
        oauth2Client.setCredentials(results);
        youtube.search.list( 
                            {
                              part: "snippet",
                              // q: "",       //query string, not super helpful
                              maxResults: 15,
                              // order: "viewCount",
                              // regionCode: "US",
                              safeSearch: "moderate",
                              type: "video",
                              auth: oauth2Client
                            }, function(err, response){
                              if(err){
                                console.log(err);
                                content = [];
                              }
                              else{
                                content = response.items;
                              }
                              res.render('splash', { title: "QueueUp", content: content });

                            });
      }

    });
  } else {
    content = ["nothing to see here","maybe try logging in"];
    res.render('splash', { title: "QueueUp", content: content });
  }
});

router.get('/login', (req, res) => {
  res.redirect('/user/login');
});

router.get('/signup', (req, res) => {
    res.redirect('/user/signup');
});

router.get('/logout', (req,res) => {
  res.redirect('/user/logout');
});

router.get('/profile', (req, res) => {
    res.redirect('/user/profile');
});

router.get('/about', (req, res) => {
  res.locals.view_about = true; // for template specific css/js
  res.render('about', { title: 'About QueueUp' });
});

router.get('/test', (req,res) => {
  var user = req.session.user;
  if (user){
    console.log(user);
    console.log(req.session);
    var message = req.flash('test') || "login successful!!!!";
    res.render('test', {
      message:message,
      name: user.name
    });
  }else{
    req.flash('login','login first');
    res.redirect('/user/login');
  }
});


//
// A generic route that expects a user name with the 'user' querystring.
// We search for it using team.one() in this single route
// instead of creating multiple specific routes. This approach
// might be preferred if we were to add/remove users.
//
router.get('/team', (req, res) => {
  var result;
  // render a specific member's info if ?member exists
  if (req.query.user)
    result = team.one(req.query.user);
  else
    result = team.all();
  if (!result || !result.success) {
    res.status(404);
    res.render('404');
  } else {
    res.render('team', {
      title: 'The QueueUp Team',
      members: result.data,
      pageTestScript: '/qa/tests-team.js'
    });
  }
});

// BEGIN MOCKUP ROUTES
router.get('/:var(mockups|mockups/splash)',(req,res) => {
  res.render('mockups', {
    title: 'Splash Page',
    image: '/img/mockups/splash.png'
  });
});

router.get('/mockups/login', (req,res) => {
  res.render('mockups', {
    title: 'Login Page',
    image: '/img/mockups/login.png'
  });
});

router.get('/mockups/main', (req,res) => {
  res.render('mockups', {
    title: 'Main Page (Logged in)',
    image: '/img/mockups/main.png'
  });
});

router.get('/mockups/queue', (req,res) => {
  res.render('mockups', {
    title: 'Manage Queue/Advanced',
    image: '/img/mockups/queue.png'
  });
});

router.get('/mockups/userprofile', (req,res) => {
  res.render('mockups', {
    title: 'User Profile',
    image: '/img/mockups/userprofile.png'
  });
});

router.get('/mockups/admin', (req,res) => {
  res.render('mockups', {
    title: 'Admin Console',
    image: '/img/mockups/admin.png'
  });
});

module.exports = router;

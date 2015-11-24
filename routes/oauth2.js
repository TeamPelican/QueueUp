var express = require('express');
var router = express.Router();

router.get('/youtube', function(req, res) {
  var user = req.session.user;

  console.log(process.env.QUEUEUP_YT_OAUTH_ID);

  if (!user) {
    req.flash('login', 'Please login to perform this action.');
    res.redirect('/user/login');
  } else {
    res.redirect('https://accounts.google.com/o/oauth2/auth?' +
    'client_id=' + process.env.QUEUEUP_YT_OAUTH_ID + '&' +
    'redirect_uri=http://localhost:3000/oauth2/oauth2callback&' +
    'scope=https://gdata.youtube.com&' +
    'response_type=code&' +
    'access_type=offline');
  }
});

router.get('/oauth2callback', function(req, res) {
  var user = req.session.user;

  if (!user) {
    req.flash('login', 'Please login to perform this action.');
    res.redirect('/user/login');
  } else {
    var accessCode = req.query.code;
    //var error = window.location.hash;
    console.log("CODE: " + accessCode);
    res.redirect('/user/profile');
  }
});

module.exports = router;

var express = require('express');
var db = require('../lib/MongoDB-user.js');
var router = express.Router();

router.get('/', (req, res) => {
  var user = req.session.user;
  if (user) {
    if (user.admin) {
      res.locals.view_admin = true;
      db.getAllUsers(function(err, users) {
        if (err) {
          res.render('admin', {
            title: 'Administration',
            message: 'Error loading users from database!'
          });
        } else {
          users.sort(function(a, b) {
            if (a.username.toLowerCase() > b.username.toLowerCase()) return 1;
            if (a.username.toLowerCase() < b.username.toLowerCase()) return -1;
            else return 0;
          });
          res.render('admin', {
            title: 'Administration',
            users: users
          });
        }
      });
    } else {
      res.redirect('/user/profile');
    }
  } else {
    res.redirect('/user/login');
  }
});

router.post('/changeAdmin', (req, res) => {
  var user = req.session.user;

  if (user) {
    if (user.admin) {
      var changeToAdmin = (req.body.changeToAdmin === 'true') ? true : false;
      var username = req.body.username;
      db.changeAdmin(username, changeToAdmin, function(err) {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          console.log(err);
          res.end('{"error",' + err + '}');
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end('{"success":true}');
        }
      });
    } else {
      res.redirect('/user/profile');
    }
  } else {
    res.redirect('/user/login');
  }
});

module.exports = router;

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
          console.log(users);
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
          console.log("ERR: " + err);
          req.flash('admin', err);
          res.redirect('/admin/');
        } else {
          console.log("Success!");
          res.redirect('/admin/');
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

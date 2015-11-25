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

module.exports = router;

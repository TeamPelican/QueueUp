var express = require('express');
var db = require('../lib/MongoDB-user.js');
var router = express.Router();

router.get('/', (req, res) => {
  var user = req.session.user;

  if (user) {
    if (user.admin) {
      res.render('admin');
    } else {
      res.redirect('/user/profile');
    }
  } else {
    res.redirect('/user/login');
  }
});

module.exports = router;

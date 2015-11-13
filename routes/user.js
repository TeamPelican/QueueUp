var express = require('express');

var db = require('../lib/MongoDB-user.js');

var router = express.Router();

router.post('/auth', (req,res) => {
  var name = req.body.inputEmail;
  var password = req.body.inputPassword;
  console.log(name);
  console.log(password);
  //console.log(req);
  console.log(req.body);
  db.login(name,password, function(status,msg){
    if (status===true){
      req.session.user = {"name":name};
      req.flash("test",msg);
      res.redirect('/test');
    }else{
      console.log(status);
      console.log(msg);
      req.flash("login",msg);
      res.redirect('/login');
    }
  });
});

module.exports = router;

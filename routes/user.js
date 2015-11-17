var express = require('express');
var db = require('../lib/MongoDB-user.js');

var router = express.Router();

router.post('/auth', (req,res) => {
    var user = req.session.user;
    if (user==='undefined'){
        req.flash("login","Please log in");
        res.redirect('/login');
        return;
    }
    var name = req.body.name;
    var password = req.body.pass;
    db.login(name , password, function(status,msg){
        if (status===true){
            req.session.user = {"name":name};
            req.flash("profile",msg);
            res.redirect('/profile');
        }else{
            req.flash("login",msg);
            res.redirect('/login');
        }
    });
});

router.post('/add', (req,res) => {
    var name = req.body.name;
    var password = req.body.pass;
    db.addUser(name,password,false,function(err){
        if (err) {
            // console.log(err);
            req.flash("signup",err);
            res.redirect('/signup');
            return;
        }
        req.session.user = {"name" : name};
        res.redirect('/profile');
    });
});

router.get('/signup', (req, res) => {
    // TODO: everything!
    var user = req.session.user;
    if (user){
        res.redirect('/profile');
        return;
    }
    var message = req.flash('signup') || '';
    res.locals.view_signup = true;
    res.render('signup', { title : 'Sign up for QueueUp',
    message : message});
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

// router.post('/auth', (req, res) => {
//     var user = req.session.user;
//
//     if (false) {
//         // TODO: change 'false' to actual check to see
//         // if user is already logged in
//     } else {
//         var name = req.body.name;
//         var pass = req.body.pass;
//
//         if (!name || !pass) {
//             // TODO: send helpful message to login saying empty fields
//             req.flash('login', 'Please enter all fields.');
//             res.redirect('/login');
//         } else {
//             model.lookup(name, pass, function(error, user) {
//                 if (error) {
//                     req.flash('login', error);
//                     res.redirect('/user/login');
//                 } else {
//                     // create a session variable to represent stateful connection
//                     req.session.user = user;
//                     // TODO: Change to redirect to "dashboard"
//                     res.redirect('/');
//                 }
//             });
//         }
//     }
// });

router.get('/logout', function(req, res) {
    var user = req.session.user;

    // TODO: add check to see if user session exists AND is NOT already online
    if (false) { // user && !online[user.name]
        delete req.session.user;
    } else {
        // delete online[user.name];
        delete req.session.user;
    }

    // maybe add a flash method for saying "Successfully logged out?"
    res.redirect('/user/login');
});

router.get('/profile', function(req, res) {
    var user = req.session.user;

    if (!user) {
        res.redirect('/login');
    } else {
        res.locals.view_profile = true;
        res.render('profile', {
            title: req.session.user.name + '\'s Profile'
        });
    }
});

module.exports = router;

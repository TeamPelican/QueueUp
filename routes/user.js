var express = require('express');
var model = require('../lib/user');
var db = require('../lib/MongoDB-user.js');

var router = express.Router();

router.post('/auth', (req,res) => {
    var name = req.body.name;
    var password = req.body.pass;
    // console.log(name);
    // console.log(password);
    // //console.log(req);
    // console.log(req.body);
    db.login(name , password, function(status,msg){
        if (status===true){
            req.session.user = {"name":name};
            req.flash("test",msg);
            res.redirect('/test');
        }else{
            // console.log(status);
            // console.log(msg);
            req.flash("login",msg);
            res.redirect('/login');
        }
    });
});

    router.get('/login', (req, res) => {
        // TODO: Redirect if already logged in

        var user = req.session.user;

        if (false) {
            // TODO: change 'false' to actual check to see
            // if user is already logged in
        } else {
            var message = req.flash('login') || '';
            res.locals.view_login = true; // for template specific css/js
            res.render('login', { title   : 'QueueUp Login',
            message : message });
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

    module.exports = router;

// USER ROUTES

var express = require('express');
var model = require('../lib/user');

var router = express.Router();

router.get('/login', (req, res) => {
    // TODO: Redirect if already logged in

    var user = req.session.user;

    if (false) {
        // TODO: change 'false' to actual check to see
        // if user is already logged in
    } else {
        res.locals.view_login = true; // for template specific css/js
        res.render('login');
    }
});

router.post('/auth', (req, res) => {
    var user = req.session.user;

    if (false) {
        // TODO: change 'false' to actual check to see
        // if user is already logged in
    } else {
        var name = req.body.name;
        var pass = req.body.pass;

        if (!name || !pass) {
            // TODO: send helpful message to login saying empty fields
        } else {
            model.lookup(name, pass, function(error, user) {
                if (error) {
                    req.flash('login', error);
                    res.redirect('/user/login');
                } else {
                    // create a session variable to represent stateful connection
                    req.session.user = user;
                    // TODO: Change to redirect to "dashboard"
                    res.redirect('/');
                }
            });
        }
    }
});

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

var express = require('express');

var team = require('../lib/team.js');

var router = express.Router();

router.get('/', (req, res) => {
    res.locals.view_splash = true; // for template specific css/js
    res.render('splash');
});

router.get('/login', (req, res) => {
    res.redirect('/user/login');
});

router.get('/logout', (req,res) => {
    res.redirect('/user/logout');
})

router.get('/about', (req, res) => {
    res.locals.view_about = true; // for template specific css/js
    res.render('about');
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
    if (!result.success) {
        notFound404(req, res);
    } else {
        res.render('team', {
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

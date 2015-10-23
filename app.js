// This requires the necessary libraries for the webapp.
// (1) express - this provides the express web framework
// (2) handlebars - this provides the handlebars templating framework
var express    = require('express');
var handlebars = require('express-handlebars');

//////////////////////////////////////////////////////////////////////
///// Express App Setup //////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

var app = express();

app.set('port', process.env.PORT || 3000);

var view = handlebars.create({ defaultLayout: 'main' });
app.engine('handlebars', view.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

function testmw(req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' &&
    req.query.test;
    // Passes the request to the next route handler.
    next();
}

// This adds our testing middleware to the express app.
app.use(testmw);

//////////////////////////////////////////////////////////////////////
///// User Defined Routes ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

var team = require('./lib/team.js');

app.get('/', (req, res) => {
    res.render('splash');
});

app.get('/about', (req, res) => {
    res.render('about');
});

//
// A generic route that expects a user name with the 'user' querystring.
// We search for it using team.one() in this single route
// instead of creating multiple specific routes. This approach
// might be preferred if we were to add/remove users.
//
app.get('/team', (req, res) => {
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

app.get('/mockups', (req,res) => {
    res.render('mockups', {
        title: 'Splash Page',
        image: '/img/mockups/splash.png'
    });
});

app.get('/mockups/login', (req,res) => {
    res.render('mockups', {
        title: 'Login Page',
        image: '/img/mockups/login.png'
    });
});

app.get('/mockups/main', (req,res) => {
    res.render('mockups', {
        title: 'Main Page (Logged in)',
        image: '/img/mockups/main.png'
    });
});

app.get('/mockups/queue', (req,res) => {
    res.render('mockups', {
        title: 'Manage Queue/Advanced',
        image: '/img/mockups/queue.png'
    });
});

app.get('/mockups/userprofile', (req,res) => {
    res.render('mockups', {
        title: 'User Profile',
        image: '/img/mockups/userprofile.png'
    });
});

app.get('/mockups/admin', (req,res) => {
    res.render('mockups', {
        title: 'Admin Console',
        image: '/img/mockups/admin.png'
    });
});



//////////////////////////////////////////////////////////////////////
///// Error Middleware ///////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

// A middleware function that will be invoked if no other route path
// has been matched. HTTP 404 indicates that the resource was not
// found. We set the HTTP status code in the response object to 404.
// We then render our views/404.handlebars view back to the client.
function notFound404(req, res) {
    res.status(404);
    res.render('404');
}

// A middleware function that will be invoked if there is an internal
// server error (HTTP 500). An internal server error indicates that
// a serious problem occurred in the server. When there is a serious
// problem in the server an additional `err` parameter is given. In
// our implementation here we print the stack trace of the error, set
// the response status code to 500, and render our
// views/500.handlebars view back to the client.
function internalServerError500(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
}

// This adds the two middleware functions as the last two middleware
// functions. Because they are at the end they will only be invoked if
// no other route defined above does not match.
app.use(notFound404);
app.use(internalServerError500);

//////////////////////////////////////////////////////////////////////
//// Application Startup /////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

// Starts the express application up on the port specified by the
// application variable 'port' (which was set above). The second
// parameter is a function that gets invoked after the application is
// up and running.
app.listen(app.get('port'), () => {
    console.log('QueueUp started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate');
});

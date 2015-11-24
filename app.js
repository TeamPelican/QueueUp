// This requires the necessary libraries for the webapp.
var express    = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var MongoStore = require('connect-mongo')(session);

//////////////////////////////////////////////////////////////////////
///// Express App Setup //////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

var app = express();

app.set('port', process.env.PORT || 3000);

//// Start Middleware Setup
// View Engine:
var view = handlebars.create({ defaultLayout: 'main' });
app.engine('handlebars', view.engine);
app.set('view engine', 'handlebars');

// Body Parser:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static File Serving
app.use(express.static(__dirname + '/public'));

// Middleware to pass to the view whether or not the current session user
// exists. This can let us show/hide certain aspects of the view.
// E.g., if the user is logged in, they should not see a "login" button any-
// more, but should see a "logout" button.
function loggedIn(req, res, next) {
    res.locals.loggedIn = false;
    if (req.session.user) {
        res.locals.loggedIn = true;
        res.locals.username = req.session.user.name;
    }
    next();
}

// Test Middleware that we might not even need right now...
function testmw(req, res, next) {
    res.locals.showTests = app.get('env') !== 'production' &&
    req.query.test;
    // Passes the request to the next route handler.
    next();
}

// Session Support:
app.use(session({
  secret: 'notmuchofasecret',
  saveUninitialized: false, // doesn't save uninitialized session
  resave: false, // doesn't save session if not modified
  store: new MongoStore({url : 'mongodb://localhost:27017/session'})
}));

// Custom Middleware.
app.use(loggedIn);
app.use(testmw);

// Flash Support.
app.use(flash());

// Morgan Logging Support.
// Using 'combined' gives you Apache-style logging support.
// 'tiny' provides minimal output.
app.use(morgan('tiny'));


// Body Parser:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cookie Parser:
app.use(cookieParser());

//// End Middleware Setup

//////////////////////////////////////////////////////////////////////
///// User Defined Routes ////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));
app.use('/oauth2', require('./routes/oauth2'));

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
    var db = require('./lib/MongoDB-user');
    db.addUser('admin','admin',true,function(){});
    console.log('QueueUp started on http://localhost:' +
    app.get('port') + '; press Ctrl-C to terminate');
});

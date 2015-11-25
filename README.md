# QueueUp
#### Your streaming media dashboard. - CS326 Team Project

## Overview
A problem that we, the members of Team Pelican, constantly face is that of not being able to decide what to watch online. With so many video streaming services at our disposal, it is easy to forget that one service might offer something much more appealing to you given your current mood. QueueUp aims to grab all of your streaming video content and assemble it into an easy to use streaming media dashboard to help you decide what to watch.

## Setup
### Cloning QueueUp
Clone the QueueUp repository to a location on your machine by running the following command in terminal:

    git clone https://github.com/TeamPelican/QueueUp.git
### Node and npm
QueueUp is a node application, so you'll need the command line tools to install necessary files. Install Node [here](https://nodejs.org/en/). 

Once you have Node installed, navigate to the QueueUp project directory and run the following to install necessary Node packages:

    npm install
This might take a few seconds to finish installing QueueUp's dependencies based on how far along we are in the development process.
### Bower
QueueUp also makes use of a Node package called Bower in order to easily install front end resources to a public directory.

First, you need to install Bower:
    
    npm install -g bower
**Note** that you may need to prefix the above command with ```sudo``` in order to install Bower at the global level.

With Bower now installed, you need to install the front-end dependencies through it's own package managing syntax, similar to npm above:

    bower install
At this point, you should now have all dependencies required to start QueueUp on your machine.

### MongoDB
QueueUp implements data persistence through use of MongoDB. In order to successfully use QueueUp, you must first [install MongoDB](https://docs.mongodb.org/manual/installation/). Once you have MongoDB installed, make sure that both the ```mongo``` and ```mongod``` commands work in your terminal. 

## Running QueueUp
First, you should open a new terminal and run the ```mongod``` command in order to start the local MongoDB server for QueueUp to connect to. This should start a MongoDB server on port 27017.

Once you have all dependencies correctly installed, you can run QueueUp by navigating to the root level of the project directory and running

    node app.js
This will start the QueueUp web application on port 3000 if you do not have an environment variable specified.

## Libraries
**Note:** It is important that you view the dependencies of the following libraries should you have any trouble setting up and/or running QueueUp after cloning this repository.
### Npm Packages
#### [bcrypt](https://github.com/ncb000gt/node.bcrypt.js)
QueueUp uses bcrypt to safely hash passwords when storing them in our database. Unfortunately, we may need to consider replacing this library as it seems there are a large number of hard-to-acquire dependencies that greatly complicates setup of QueueUp for developers using a Windows environment.
#### [body-parser](https://github.com/expressjs/body-parser)
Body-parser is currently used to create middleware that parses either URL-encoded or JSON bodies of HTTP requests.
#### [bower](https://github.com/bower/bower)
Bower is QueueUp's package manager for front-end resources. We use it to quickly and easily import front-end libraries like jQuery, Bootstrap, and sweetalert.
#### [connect-flash](https://github.com/jaredhanson/connect-flash)
QueueUp uses connect-flash to store messages to be used by the session. Specifically, we store a message using connect-flash in one context of QueueUp, and then redirect to another context which will access that message.
#### [connect-mongo](https://github.com/kcbanner/connect-mongo)
QueueUp saves session information to our database using connect-mongo.
#### [express](https://github.com/strongloop/express)
Express wins the contest for Team Pelican's favorite npm package. This package allows us to easily manage HTTP requests to the server, and is widely supported so we could easily find answers online whenever we ran into something we did not know how to tackle.
#### [express-handlebars](https://github.com/ericf/express-handlebars)
Express-handlebars allows Express.js to use Handlebars as the view engine for QueueUp. That is, instead of using one of Express' default view engines, we get to use Handlebars for templating. 
#### [express-session](https://github.com/expressjs/session)
This package allows QueueUp to keep track of a user session when the user logs in. How we manage this session determines which state a user will navigate to as they use QueueUp.
#### [mongdb](https://github.com/mongodb/node-mongodb-native)
QueueUp uses the mongodb package to connect to our MongoDB instance through JavaScript. With this package, we are able to perform insertions, updates, and removals of data in our database.
#### [morgan](https://github.com/expressjs/morgan)
Morgan is a middleware that allows us to easily change how much logging to the server's console we receive upon each HTTP request made to the server. We currently use its 'tiny' amount of logging, but we could use many other options as seen at the link to the GitHub above.

### Bower Packages
#### [bootstrap](https://github.com/twbs/bootstrap)
QueueUp uses Bootstrap as a foundation for CSS styling. Bootstrap allows us to easily get a nice UI with minimal additional CSS.
#### [jquery](http://jquery.com/download/#downloading-jquery-using-bower)
JQuery allows us to easily add functionality to our webpages and make special HTTP requests to the server.
#### [sweetalert](https://github.com/t4t5/sweetalert)
QueueUp makes use of sweetalert to have visually appealing alert messages that get triggered when special events occur.

### Views
In this section, we summarize each of the currently functioning views of QueueUp.
#### Splash
This is a minimal view that acts as the first point of interaction with QueueUp. The purpose of this view is not to overwhelm the user immediately but to easily show the product logo, a brief phrase describing QueueUp, other useful links at the bottom of the page, and the abilities to login or signup.

Keep in mind that the footer is visible on every view, regardless of whether the user is logged in. The functionality of the navbar will change when the user logs in.
#### Login (/login)
This is a very simple login view. QueueUp offers the functionality for a user's login to be "remembered", meaning their logged in session will be preserved for 7 days. A user needs to use this view in order to gain access to QueueUp's main functionality.
#### Signup (/signup)
The layout to the Signup view is almost identical to that of Login's. In order to use QueueUp, a user must create an account at this page if they have not already. They will be automatically logged in after submitting the form, but if any errors are present in the form (E.g. the user name they have chosen already exists), an error dialog will be presented for them to fix those errors.
#### Profile (/profile)
This page contains two sections: an area displaying info about the user (currently only their username) and an option to change their password, and an area displaying which streaming services the user has authorized.
Users will use the Profile page in order to manage which streaming services they have currently activated for their QueueUp account.
#### Dashboard (/dashboard)
This is one of the main views that demonstrates QueueUp's main functionality. Here you will see your main queue in a carousel pulling content from whichever streaming services you have enabled over at the Profile page. Clicking on an element in the queue of the main view will deliver you to view that content in a new tab at that provider's website.
#### About (/about)
This page contains more verbose info about QueueUp's purpose and use cases.
#### Team (/team)
Here you will find information about the developers that make up Team Pelican. This view was adopted from one of our early CS326 projects, and still contains the functionality from that project to query for a team member with ```?user=<team_members_username```. Try it out with ```?user=nfuller```.
#### Mockups (/mockups)
This page contains links to many of the early mockups of QueueUp. These serve as a starting point for us when we develop the front-end of QueueUp.

### Statefulness
QueueUp implements statefulness similarly to how CS326 students were expected to do so in our 3rd individual project assignment. We use the express-session npm package to maintain a session variable and add a "user" object to that variable when a user logs into QueueUp.

For many of QueueUp's routes, we perform a check to see if the user session variable exists before performing the expected logic at that route. For example, for most of the routes defined in ```/routes/user.js```, we redirect users to the Login page if they attempt to navigate to a route while not logged in.

Sometimes, we also feel it is necessary to deliver messages when redirecting users. We use the ```connect-flash``` middleware to attach a useful message to a request for a resource that we eventually redirect to. When we redirect to that resource, the message is extracted and delivered to the view.

An example of a stateful flow of QueueUp would be that which a user takes when changing their password. Assuming the user is already at the Profile page, they will initiate an HTTP POST request upon submission of the change-pass form which gets handled in ```/routes/user.js```. If for some reason the user's session expired before they submitted the form, they will be redirected to the login page. Otherwise, we make use of our MongoDB-user library to check to see that the current password they have entered is correct in order to avoid malicious entities attempting changing passwords of an already logged in user. If the incorrect password is entered too many times, they are redirected to /user/logout which destroys the user session and redirects to /user/login. Otherwise, the database is updated with the new password and the user gets redirected to the Profile page and is shown a message stating that they have successfully changed their password.

### Persistence

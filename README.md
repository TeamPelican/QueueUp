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

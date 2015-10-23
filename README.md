# QueueUp 
#### Your streaming media dashboard. - CS326 Team Project

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

## Running QueueUp
Once you have all dependencies correctly installed, you can run QueueUp by navigating to the root level of the project directory and running

    node app.js
This will start the QueueUp web application on port 3000 if you do not have an environment variable specified.

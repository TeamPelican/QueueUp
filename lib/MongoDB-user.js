
var basic = require('./MongoDB-basic.js');
var database = "mongodb://127.0.0.1:27017/QueueUp";
var bcrypt = require('bcrypt');



// this function can create a user
function addUser(username, password, admin, callback){
  bcrypt.genSalt(10,function(err,salt){
    if (err) {
      callback("hashing error");
    } else {
      bcrypt.hash(password,salt,function(err,hash){
        if (err) {
          callback("hashing error!");
        }
        else {
          basic.findData(database,"Users",{"user.username":username},function(err, result){
            if (err) {
              callback(err);
            } else {
              if (result.length === 0) {
                basic.addData(database,"Users",{
                  "user" : {
                    "username" : username,
                    "password" : hash,
                    "admin" : admin
                  },
                  "APIs" : {
                    "YouTube" : "",
                    "Twitch" : "",
                    "Netflix" : "", // in case they decide to reopen their API, im faithful
                    "HBOGo" : "",
                    "Amazon" : "",
                    // this is all i can think of
                    // if someone think of something, feel free to add
                  }
                },
                function(err, result){
                  if (err) {
                    callback(err);
                  } else {
                    callback(undefined, result);
                  }
                });
              } else{
                callback("User \"" + username + "\" already exists.");
              }
            }
          });
        }
      });
    }
  });
}

// this is the login function
// it checks the username and password
// it requires the input username and password to be strings
// to prevent injection (I hope)
// it callbacks with a boolean to indicate success or not and a message
function login(username, password, callback){
  basic.findData(database,'Users',{
    "user.username" : username,
  },function(err, result){
    if (err) {
      callback(err);
    } else {
      if (result.length===0){
        callback(false,"User or Password incorrect.");
      } else if (result.length === 1){
        bcrypt.compare(password, result[0].user.password, function(err,res) {
          if (err) {
            callback(err);
          } else if (res === true) {
            callback(undefined, result);
          } else {
            // temporary message until I fix these as well
            callback("Passwords do not match. Please contact a system administrator.");
          }
        });
      } else {
        callback("Catastrophic data error!");
      }
    }
  });
}


function changePassword(username,password,callback){
  // TODO: We need to make sure this actually hashes the new password or else
  // the user won't be able to log in.
  basic.updateOneData(database,'Users',{
    "user.username":username
  },{
    "user.password":password
  },function(err, results){
    if (err) {
      callback(err);
    } else {
      callback(undefined, results);
    }
  });
}

exports.addUser = addUser;
exports.login = login;
exports.changePassword = changePassword;

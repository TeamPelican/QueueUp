
var basic = require('./MongoDB-basic.js');
var database = "mongodb://127.0.0.1:27017/QueueUp";
var bcrypt = require('bcrypt');



// this function can create a user
function addUser(username, password, admin, callback){
  bcrypt.genSalt(10,function(err,salt){
    if (err) callback("hashing error");
    bcrypt.hash(password,salt,function(err,hash){
      if (err) callback("hashing error!");
      else{
        basic.findData(database,"Users",{"user.username":username},function(result){
          if (result.length===0){
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
                callback("Successfully created new user \"" + username + "\"!");
              }
            });
          } else{
            callback("User \"" + username + "\" already exists.");
          }
        });
      }
    });
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
  },function(result){
    if (result.length===0){
      callback(false,"User or Password incorrect.");
    }else{
      bcrypt.compare(password,result[0].user.password,function(err,res){
        if (res===true){
          callback(true,"Login successful");
        }else{
          callback(false,"1rwdgsDv");
        }
      });
    }
  });
}


function changePassword(username,password,callback){
  basic.updateOneData(database,'Users',{
    "user.username":username
  },{
    "user.password":password
  },function(){
    console.log("User "+username+" password updated successfully");
  });
  callback();
}

exports.addUser = addUser;
exports.login = login;
exports.changePassword = changePassword;

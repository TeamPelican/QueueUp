
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
                    var info = {
                      "username" : result.user.username,
                      "admin": result.user.admin
                    };
                    callback(undefined, info);
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
        callback("User or Password incorrect.");
      } else if (result.length === 1){
        bcrypt.compare(password, result[0].user.password, function(err,res) {
          if (err) {
            callback(err);
          } else if (res === true) {
            var user = result[0].user;
            var info = {
              "username" : user.username,
              "admin": user.admin
            };
            callback(undefined, info);
          } else {
            callback("User or Password incorrect.");
          }
        });
      } else {
        callback("Catastrophic data error!");
      }
    }
  });
}

function changeAdmin(username, admin, callback){
  console.log(username);
  basic.updateOneData(database,'Users',{
    "user.username" : username
  },{
    "user.admin" : admin
  },function(err,results){
    if (err) {
      callback(err);
    } else {
      if (results.result.n!==1){
        callback("Error setting admin.");
      } else {
        callback(undefined);
      }
    }
  });
}

function changePassword(username,password,callback){
  bcrypt.genSalt(10,function(err,salt){
    if (err) {
      callback("hashing error");
    }else{
      bcrypt.hash(password,salt,function(err,hash){
        if (err){
          callback("hashing error!");
        }else{
          basic.updateOneData(database,'Users',{
            "user.username":username
          },{
            "user.password":hash
          },function(err, results){
            if (results.result.n!==1) {
              callback("Error changing password, user not found!");
            } else {
              callback(undefined, results);
            }
          });
        }
      });
    }
  });
}

function addYouTubeAPI(username, tokens, callback){
  //var serviceName = "APIs."+service;
  var access_token = encrypt(tokens.access_token);
  var refresh_token = encrypt(tokens.refresh_token);
  basic.updateOneData(database,'Users',{
    "user.username" : username
  },{
    YouTube : {
      "access_token" : access_token,
      "refresh_token" : refresh_token
    }
  },function(err, results){
    if (results.result.n!==1){
      callback("Error updating user API, user not found");
    }else{
      callback(undefined, results);
    }
  });
}

function getYouTubeAPI(username, callback){
  //var serviceName = "APIs."+service;
  basic.findData(database,'Users',{
    "user.username" : username
  },function(err,result){
    if (err){
      callback(err);
    }else{
      if (result.length===0){
        callback("User not found");
      }else{
        console.log(result);
        console.log(result.APIs);
        var access_token=decrypt(result[0].APIs.YouTube.access_token);
        var refresh_token=decrypt(result[0].APIs.YouTube.refresh_token);
        callback(undefined,{
          "access_token" : access_token,
          "refresh_token" : refresh_token
        });
      }
    }
  });
}

function getAllUsers(callback){
  var newData = [];
  basic.findData(database,'Users',{},
  function(err,result) {
    if (err) {
      callback(err);
    } else {
      result.forEach(function(data){
        newData.push({
          "username": data.user.username,
          "admin": data.user.admin
        });
      });
      callback(undefined, newData);
    }
  });
}

function encrypt(text){
  var crypto = require('crypto');
  var algorithm = 'aes-256-ctr';
  var password = require('./password.json').password;
  var cipher = crypto.createCipher(algorithm,password);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var crypto = require('crypto');
  var algorithm = 'aes-256-ctr';
  var password = require('./password.json').password;
  var decipher = crypto.createDecipher(algorithm,password);
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}

exports.addUser = addUser;
exports.login = login;
exports.changePassword = changePassword;
exports.addYouTubeAPI = addYouTubeAPI;
exports.getYouTubeAPI = getYouTubeAPI;
exports.getAllUsers = getAllUsers;
exports.changeAdmin = changeAdmin;

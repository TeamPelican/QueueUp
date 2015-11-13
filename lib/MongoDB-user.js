
var basic = require('./MongoDB-basic.js');
var database = "mongodb://127.0.0.1:27017/QueueUp";

// this function can create a user
function addUser(username, password, admin, callback){
  basic.findData(database,"Users",{"user.username":username},function(result){
    if (result.length===0){
      basic.addData(database,"Users",{
        "user" : {
          "username" : username,
          "password" : password,
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
      },function(){
          console.log("Added user: "+username);
      });
      callback();
    }else{
      console.log("User " + username + " already exists.");
    }
  });
}

// this is the login function
// it checks the username and password
// it requires the input username and password to be strings
// to prevent injection (I hope)
// it callbacks with a boolean to indicate success or not and a message
function login(username, password, callback){
  if (typeof username !== 'string' | typeof password !== 'string'){
    console.log("this is happening");
    console.log(typeof username);
    console.log(typeof password);
    callback(false);
    return;
  }
  basic.findData(database,'Users',{
    "user.username" : username,
    "user.password" : password
  },function(result){
    if (result.length===0) {
      callback(false, "Username or Password incorrect.");
      return;
    }
    if (result.length===1 &
      result[0].user.username === username &
      result[0].user.password === password) {
        callback(true, "Login successful.");
      }else{
        callback(false, "Blah. I don't think this is possible.");
      }
    }
  );
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

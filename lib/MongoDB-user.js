
var basic = require('./MongoDB-basic.js');
var database = "mongodb://127.0.0.1:27017/QueueUp";



// this function can create a user
function addUser(username, password, admin, callback){
  basic.findData(database,"Users",{"user.username":username},function(err, result){
    if (err) {
      callback(err);
    } else {
      if (result.length === 0) {
        var encryptedPass = encrypt(password);
        console.log(encryptedPass);
        basic.addData(database,"Users",{
          "user" : {
            "username" : username,
            "password" : encryptedPass,
            "admin" : admin
          },
          "APIs" : {
            "YouTube" : {},
            "Twitch" : {},
            "Netflix" : {}, // in case they decide to reopen their API, im faithful
            "HBOGo" : {},
            "Amazon" : {},
            // this is all i can think of
            // if someone think of something, feel free to add
          },
          "exists":[]
        },
        function(err, res){
          if (err) {
            callback(err);
          } else {
            callback(undefined);
          }
        });
      } else{
        callback("User \"" + username + "\" already exists.");
      }
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
        // bcrypt.compare(password, result[0].user.password, function(err,res) {
        //   if (err) {
        //     callback(err);
        //   } else if (res === true) {
        if (encrypt(password) === result[0].user.password) {
            var user = result[0].user;
            var info = {
              "username" : user.username,
              "admin": user.admin
            };
            callback(undefined, info);
          } else {
            callback("User or Password incorrect.");
          }
      } else {
        callback("Catastrophic data error!");
      }
    }
  });
}

function changeAdmin(username, admin, callback){
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
  basic.updateOneData(database,'Users',{
    "user.username":username
  },{
    "user.password":encrypt(password)
  },function(err, results){
    if (results.result.n!==1) {
      callback("Error changing password, user not found!");
    } else {
      callback(undefined, results);
    }
  });
}

//temporarily hard codeded to youtube
function addAPI(username, service, tokens, callback){
  var newTokens = {};
  if (tokens.refresh_token && tokens.access_token){
    newTokens.access_token = encrypt(tokens.access_token);
    newTokens.refresh_token = encrypt(tokens.refresh_token);
  } else {
    if (tokens.access_token) {
      newTokens.access_token = encrypt(tokens.access_token);
    } else {
      callback("No tokens present, database not modified.");
    }
  }
  var data = {};
  switch(service){
    case "YouTube":
      if (newTokens.refresh_token){
        data = {"$set":{"APIs.YouTube" : newTokens},"$addToSet": {"exists": "YouTube"}};
      }else{
        data = {"$set":{"APIs.YouTube.access_token" : newTokens.access_token},"$addToSet": {"exists": "YouTube"}};
      }
      break;
    case "Twitch":
      if (newTokens.refresh_token){
        data = {"$set":{"APIs.Twitch.access_token" : newTokens.access_token, "APIs.Twitch.refresh_token" : newTokens.refresh_token}, "$addToSet": {"exists": "Twitch"}};
      }else{
        data = {"$set":{"APIs.Twitch.access_token" : newTokens.access_token}, "$addToSet": {"exists": "Twitch"}};
      }
      break;
    case "Netflix":
      if (newTokens.refresh_token){
        data = {"$set":{"APIs.Netflix.access_token" : newTokens.access_token, "APIs.Netflix.refresh_token" : newTokens.refresh_token}, "$addToSet": {"exists": "Netflix"}};
      }else{
        data = {"$set":{"APIs.Netflix.access_token" : newTokens.access_token}, "$addToSet": {"exists": "Netflix"}};
      }
      break;
    case "HBOGo":
      if (newTokens.refresh_token){
        data = {"$set":{"APIs.HBOGo.access_token" : newTokens.access_token, "APIs.HBOGo.refresh_token" : newTokens.refresh_token}, "$addToSet": {"exists": "HBOGo"}};
      }else{
        data = {"$set":{"APIs.HBOGo.access_token" : newTokens.access_token}, "$addToSet": {"exists": "HBOGo"}};
      }
      break;
    case "Amazon":
      if (newTokens.refresh_token){
        data = {"$set":{"APIs.Amazon.access_token" : newTokens.access_token, "APIs.Amazon.refresh_token" : newTokens.refresh_token}, "$addToSet": {"exists": "Amazon"}};
      }else{
        data = {"$set":{"APIs.Amazon.access_token" : newTokens.access_token}, "$addToSet": {"exists": "Amazon"}};
      }
      break;
    default:
      callback("Unspecified service or unrecognized service");
  }
  basic.updateOneData(database,'Users',{
    "user.username" : username
  },data,function(err, results){
    if (results.result.n!==1){
      callback("Error updating user API, user not found");
    } else{
      callback(undefined, results);
    }
  });
}

//temporarily hard coded to youtube
function getAPI(username, service, callback){
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
        if (typeof(service)==='function'){
          callback(undefined,results[0].APIs);
        }else{
          console.log(result[0].exists.length);
          if (result[0].exists.length===0){
            callback("It looks like you haven't authenticated any services. To do so, go to your Profile.");
          }else{
            var data = getAPIhelper(result[0].APIs,service);
            if (!data) callback("Service undefined or not supported");
            callback(undefined,data);
          }
        }
      }
    }
  });
}

function removeAPI(username, service, callback){
  var deleteToken = {"access_token":"", "refresh_token":""};
  addAPI(username,service,deleteToken,function(err,result){
    if (err){
      callback(err);
    }else{
      basic.updateOneData(database,'Users',{
        "user.username" : username
      },{
        $pull: {"exists": service}
      },function(err, results){
        if (results.result.n!==1){
          callback("Error updating user API, user not found");
        }else{
          console.log(service+" API deleted successfully.");
          callback();
        }
      });
    }
  });

  // var deleteToken = {"access_token":"","refresh_token":""};
  // addAPI(username,service,deleteToken,callback);
}

// function getAPI(username, callback){
//   basic.findData(database,'Users',{
//     "user.username": username
//   },function(err, result){
//     if (err){
//       callback(err);
//     }else{
//       if (result.length===0){
//         callback("User not found");
//       }else{
//         callback(undefined,result[0].APIs);
//       }
//     }
//   });
// }

function getAllUsers(callback){
  var newData = [];
  basic.findData(database,'Users',{},
  function(err,result) {
    if (err) {
      callback(err);
    } else {
      result.forEach(function(data){
        // we do not want admin's privileges to be edited
        if(data.user.username !== 'admin'){
          newData.push({
            "username": data.user.username,
            "admin": data.user.admin
          });
        }
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

function getAPIhelper(apis, service){
  var data = {};
  switch(service){
    case "YouTube":
      if (apis.YouTube.access_token){
        data.access_token = decrypt(apis.YouTube.access_token);
      }
      if (apis.YouTube.refresh_token){
        data.refresh_token = decrypt(apis.YouTube.refresh_token);
      }
      break;
    case "Twitch":
      if (apis.Twitch.access_token){
        data.access_token = decrypt(apis.Twitch.access_token);
      }
      if (apis.Twitch.refresh_token){
        data.refresh_token = decrypt(apis.Twitch.refresh_token);
      }
      break;
    case "Netflix":
      if (apis.Netflix.access_token){
        data.access_token = decrypt(apis.Netflix.access_token);
      }
      if (apis.Netflix.refresh_token){
        data.refresh_token = decrypt(apis.Netflix.refresh_token);
      }
      break;
    case "HBOGo":
      if (apis.HBOGo.access_token){
        data.access_token = decrypt(apis.HBOGo.access_token);
      }
      if (apis.HBOGo.refresh_token){
        data.refresh_token = decrypt(apis.HBOGo.refresh_token);
      }
      break;
    case "Amazon":
      if (apis.Amazon.access_token){
        data.access_token = decrypt(apis.Amazon.access_token);
      }
      if (apis.Amazon.refresh_token){
        data.refresh_token = decrypt(apis.Amazon.refresh_token);
      }
      break;
    default:
      return undefined;
  }
  return data;
}

exports.addUser = addUser;
exports.login = login;
exports.changePassword = changePassword;
exports.addAPI = addAPI;
exports.getAPI = getAPI;
exports.removeAPI = removeAPI;
exports.getAllUsers = getAllUsers;
exports.changeAdmin = changeAdmin;

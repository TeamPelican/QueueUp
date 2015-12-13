var db = require('./MongoDB-user.js');
var api = require('./api.json');

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(api.web.client_id, api.web.client_secret, api.web.redirect_uris[1]);
var scopes = 'https://www.googleapis.com/auth/youtube';
var request = require('request');

function getToken(user, authCode, state, callback) {
  oauth2Client.getToken(authCode, function(err, tokens){
    if(!err) {
      db.addAPI(user.name,state,tokens,function(error, result){
        if(error) {
          console.log(error);
          callback(error);
          return;
        }
        callback();
      });
    } else {
      console.log(err);
      callback(err);
    }
  });
}

function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state: "YouTube"
  });
}

// TODO: Finish this
function deauthorize(user, callback) {
  db.getAPI(user.name, "YouTube", function(err, results){
    if(err){
      console.log(err);
      callback(err);
      return;
    }
    var accessToken = results.access_token;
    db.removeAPI(user.name, "YouTube", function(error) {
      if(error){
        callback("Unable to remove token:  " + error);
        return;
      }
      request({
        url: 'https://accounts.google.com/o/oauth2/revoke',
        qs: {token: accessToken},
        method: 'GET'
      }, function(error, response, body){
        if(error){
          console.log(response.statusCode, body);
          callback(error);
        } else {
          console.log(response.statusCode, body);
          callback(undefined,"Token shredded! Great job!");
        }
      });

    });
  });
}


module.exports = {
  getToken: getToken,
  getAuthUrl: getAuthUrl,
  // TODO: put deauth once finished
  deauthorize: deauthorize
};

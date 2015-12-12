var db = require('./MongoDB-user.js');
var api = require('./api.json');

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(api.web.client_id, api.web.client_secret, api.web.redirect_uris[1]);
var scopes = 'https://www.googleapis.com/auth/youtube';

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

// TODO: Finish this
function deauthorize(user, accessToken) {
  db.removeAPI(user.name, "YouTube", function(){
    if(err){
      callback("Unable to remove token.");
    }
    else{
      res.redirect('https://accounts.google.com/o/oauth2/revoke?'+
    'token='+access_token);
    // 'redirect_uri=http://localhost:3000/user/profile';
    }
  });
}

module.exports = {
  getToken: getToken
};

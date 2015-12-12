var db = require('./MongoDB-user.js');
var api = require('./api.json');

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(api.web.client_id, api.web.client_secret, api.web.redirect_uris[1]);
var scopes = 'https://www.googleapis.com/auth/youtube';
var youtube = google.youtube('v3');


function getDashboardContent(user, callback) {
  db.getAPI(user.name, "YouTube", function(err, results){
    if (err) {
      callback(err);
    }
    else {
      oauth2Client.setCredentials(results);
      var opts = {
        part: "snippet,contentDetails",
        // q: "",       //query string, not super helpful
        maxResults: 15,
        home: true,
        //mine: true,
        // order: "viewCount",
        // regionCode: "US",
        //safeSearch: "moderate",
        //type: "video",
        auth: oauth2Client
      };
      youtube.activities.list(opts, function(err, response) {
        if (err) {
          console.log(err);
          content = [];
        } else {
          var recommendation = [];
          for (var item in response.items){
            if (response.items[item].snippet.type==="recommendation") {
              recommendation.push({videoId:response.items[item].contentDetails.recommendation.resourceId.videoId,
                                    title: response.items[item].snippet.title,
                                    thumbnails: response.items[item].snippet.thumbnails.medium.url,
                                    description: response.items[item].snippet.description});
            }
          }
          //console.log(recommendation);
          //if (recommendation.length===0){
            for (var items in response.items){
              if (response.items[items].snippet.type==="upload") {
                // console.log(response.items[items]);
                recommendation.push({videoId:response.items[items].contentDetails.upload.videoId,
                                      title: response.items[items].snippet.title,
                                      thumbnails: response.items[items].snippet.thumbnails.medium.url,
                                      description: response.items[items].snippet.description});
              }
            }
          //}
          //console.log(response.items[0].contentDetails);
          content = recommendation;
        }
        callback(undefined, content);
      });
    }
  });
}

module.exports = {
  getDashboardContent: getDashboardContent
};

// requires a running local mongod
// run mongod --dbpath 'your_DB_path' to start a local mongodb
// or setup a mongodb at anywhere else

// setup
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectId;


// basic add data function
// could use this to make addUser
function addData(dburl, collection, data, callback){
  MongoClient.connect(dburl,function(err,db){
    if (err) {
      console.log(err);
      callback("Error connecting to database:\n" +err);
    } else {
      db.collection(collection).insertOne(data,
        function(err, result) {
          if(err) {
            callback("Error adding to database:\n" + err);
          } else {
            db.close();
            console.log ("Successfully added data into collection "+collection+" , db connection closed");
            callback(undefined, result);
            // pass undefined message to indicate success, pass result as well just in case
            // we need it for debugging at some point. Right now, we don't need result's info to be
            // made visible to the user
          }
        }
      );
    }
  });
}

// basic find data function
// input criteria and it will give you an array of results
// by calling callback.
// so put whatever you want to do in the callback function
// and it run on the results
function findData(dburl, collection, criteria, callback){
  MongoClient.connect(dburl,function(err,db){
    if (err) {
      console.log(err);
      callback("Error connecting to db: " + err);
    } else {
      var cursor = db.collection(collection).find(criteria);
      var result = [];
      cursor.each(function(err, doc) {
        if (err) {
          callback("Error accessing collection \"" + collection + "\": " + err);
        } else {
          if (doc !== null) {
            result.push(doc);
          } else {
            db.close();
            console.log("findData finished, db connection closed");
            callback(undefined, result);
          }
        }
      });
    }
  });
}

// basic update data function
// criteria to find data to update
// newData to update old dataset into new dataset
// this function will update one data set found with criteria
function updateOneData(dburl, collection, criteria, newData, callback){
  MongoClient.connect(dburl,function(err,db){
    db.collection(collection).updateOne(
      criteria,
      newData,
      function (err, results){
        if(err) {
          //TODO: provide less verbose error in production vs development
          callback("Error updating data in database" + err);
        } else {
          db.close();
          callback(undefined, results);
        }
      }
    );
  });
}

// basic update data function
// same as above but it updates all dataset it finds under criteria
function updateData(dburl, collection, criteria, newData, callback){
  MongoClient.connect(dburl,function(err,db){
    db.collection(collection).updateMany(
      criteria,
      newData,
      function (err, results){
        assert.equal(err, null);
        db.close();
        console.log("successfully updated data, db connection closed");
        callback();
      }
    );
  });
}

// basic delete data function
// it will delete ONE data set matching the criteria
function deleteOneData(dburl, collection, criteria, callback){
  MongoClient.connect(dburl,function(err,db){
    db.collection(collection).deleteOne(
      criteria,
      function(err, results) {
        assert.equal(err,null);
        db.close();
        console.log("successfully deleted data, db connection closed");
        callback();
      }
    );
  });
}

// basic delete data function
// this function however will delete all dataset matching criteria
function deleteData(dburl, collection, criteria, callback) {
  MongoClient.connect(dburl,function(err,db){
    db.collection(collection).deleteMany(
      criteria,
      function(err, results) {
        assert.equal(err,null);
        db.close();
        console.log("successfully deleted data, db connection closed");
        callback();
      }
    );
  });
}

// this function will DROP THE ENTIRE COLLECTION
function deleteAll(dburl, collection, callback){
  MongoClient.connect(dburl,function(err,db){
    db.collection(collection).deleteMany(
      {},
      function(err, results) {
        assert.equal(err,null);
        db.close();
        console.log("successfully deleted data, db connection closed");
        callback();
      }
    );
  });
}


exports.addData = addData;
exports.findData = findData;
exports.updateOneData = updateOneData;
exports.updateData = updateData;
exports.deleteOneData = deleteOneData;
exports.deleteData = deleteData;
exports.deleteAll = deleteAll;

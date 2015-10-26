// requires a running local mongod
// run mongod --dbpath 'DB/' at root QueueUp directory to start a local mongodb
// or setup a mongodb at anywhere else

// setup
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectId;
var dburl = 'mongodb://127.0.0.1:27017/QueueUp';

// basic add data function
// could use this to make addUser
var addData = function (db, collection, data, callback){
  db.collection(collection).insertOne(data,
    function(err, result) {
      assert.equal(err, null);
      console.log ("Successfully added data into collection "+collection);
      callback(result);
    });
  };

// basic find data function
// input criteria and it will give you an array of results
// by calling callback.
// so put whatever you want to do in the callback function
// and it run on the results
var findData = function (db, collection, criteria, callback){
  var cursor = db.collection(collection).find(criteria);
  var result = [];
  cursor.each(function(err, doc) {
    assert.equal(err,null);
    if (doc!==null){
      result.push(doc);
    } else {
      callback(result);
    }
  });
};

// basic update data function
// criteria to find data to update
// newData to update old dataset into new dataset
var updateData = function (db, collection, criteria, newData, callback){
  db.collection(collection).updateOne(
    criteria,
    {
      $set: newData,
      $currentDate: {"lastModified":true}
    },
    function (err, results){
      assert.equal(err, null);
      console.log(results);
      callback();
    }
  );
};

// basic delete data function
// it will delete ONE data set matching the criteria
var deleteData = function (db, collection, criteria, callback){
  db.collection(collection).deleteOne(
    criteria,
    function(err, results) {
      assert.equal(err,null);
      console.log(results);
      callback();
    }
  );
};

// this function will DROP THE ENTIRE COLLECTION
var deleteAll = function (db, collection, callback){
  db.collection(collection).deleteMany(
    {},
    function(err, results) {
      console.log(results);
      callback();
    }
  );
};

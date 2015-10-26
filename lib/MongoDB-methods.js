// requires a running local mongod
// run mongod --dbpath 'DB/' at root QueueUp directory to start a local mongodb
// or setup a mongodb at anywhere else

// setup
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectId;
var dburl = 'mongodb://127.0.0.1:27017/QueueUp';

var addData = function (db, collection, data, callback){
  db.collection(collection).insertOne(data,
    function(err, result) {
      assert.equal(err, null);
      console.log ("Successfully added data into collection "+collection);
      callback(result);
    });
  };

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

var deleteAll = function (db, collection, callback){
  db.collection(collection).deleteMany(
    {},
    function(err, results) {
      console.log(results);
      callback();
    }
  );
};

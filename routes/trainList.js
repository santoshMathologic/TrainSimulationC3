var mongoose = require('mongoose');
var trainList = require('../models/trainList.js');
var q = require('q');
var queryResolver = require('../lib/queryResolver.js');
require('mongoose-query-paginate');



var trainLists = {
    /**
     * Insert Trains Into DB
     */
    createTrainList: function(data) {
        var deferred = q.defer();
        trainList.insertMany(data, function(err, post) {
            if (err) return err;
            console.log("post");
            deferred.resolve(post);

        });
        return deferred.promise;
    },

    /**
     * Get All trains from database
     */
    getTrainList: function(req, res) {
        var options = {
            perPage: parseInt(req.query.limit) || 10,
            page: parseInt(req.query.page) || 1,
            order: req.query.order || 'trainNo'
        };
        var query;
        queryResolver.resolveQuery(req.query, trainList, options).then(function(response) {
            res.json(response);
        });

    },



    deleteTrainList: function(data) {
        var deferred = q.defer();
        trainList.remove({ trainNo: { $in: data } }, function(err, docs) {
            if (err) console.log(err);
            deferred.resolve(docs);
        });

        return deferred.promise;
    },


    updateTrainList: function(data) {
        var deferred1 = q.defer();

        trainList.findByIdAndUpdate(data.id, { 'trainName': data.trainName, 'fromStation': data.fromStation, 'toStation': data.toStation, 'runningDays': data.runningDays, 'trainType': data.trainType }).then(function(result) {
            deferred1.resolve(result);
        }, function(error) {
            console.log(error);
        })
        return deferred1.promise
    },


    doesTrainExist: function(data) {
        var deferred = q.defer();


        trainList.find({ 'trainNo': data.trainNo }).then(function(result) {

            deferred.resolve({ originalData: data, result: result });

        }, function(error) {
            console.log(error);
        });
        return deferred.promise;

    }

};

module.exports = trainLists;
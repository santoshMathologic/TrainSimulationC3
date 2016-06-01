var mongoose = require('mongoose');
var ts = require('../models/trainStation.js');
var q = require('q');
var queryResolver = require('../lib/queryResolver.js');
require('mongoose-query-paginate');


var trainStations = {
    createTrainStation: function (data) {
        var deferred = q.defer();
        ts.insertMany(data, function (err, post) {
            if (err) return err;
            //  console.log(post);
            deferred.resolve(post);
        });
        return deferred.promise;
    },

    findTrain: function (req,res) {
        var options = {
            perPage: parseInt(req.query.limit) || 10,
            page: parseInt(req.query.page) || 1,
            order : req.query.order || 'stopNo'
       };
        var query;
        queryResolver.resolveQuery(req.query, ts, options).then(function(response) {
            res.json(response);
        });
    },
    deleteTrainStations: function(data){
        var deferred =q.defer();
        ts.remove({ trainNo: { $in: data } }, function(err, docs) {
            if (err) console.log(err);
            deferred.resolve(docs);
        });
        return deferred.promise;
    }



};
module.exports = trainStations;
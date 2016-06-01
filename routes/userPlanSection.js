var mongoose = require('mongoose');
var userPlanSectionModel = require('../models/userPlanSection.js');
var globalSectionModel = require('../models/globalSection.js');
var q = require('q');
var queryResolver = require('../lib/queryResolver.js');
require('mongoose-query-paginate');

var userPlanSections = {

    createUserPlanSection: function(req, res) {
        userPlanSectionModel.create(req.body, function(err, result) {
            if (err) console.log(err);
            else {
                res.json(result);
                console.log(result);
            }
        })

    },

    saveCopiedUserPlanSection: function(req, res) {
        var data = req.body;
        //  console.log("data " ,data);

        userPlanSectionModel.insertMany(data, function(err, result) {
            if (err) console.log(err);
            else {
                res.json(result);
                console.log(result);
            }
        })


    },


    getAllUserPlanSection: function() {
        var deferred = q.defer();
        userPlanSectionModel.find({}, function(err, res) {
            if (err) console.log(err);
            deferred.resolve(res);

        })
        return deferred.promise;
    },


    getUserPlanSection: function(data) {
        var deferred = q.defer();
        userPlanSectionModel.find({ trainNo: { $in: data } }, function(err, res) {
            if (err) console.log(err);
            deferred.resolve(res);

        })
        return deferred.promise;
    },

    getUserPlanSections: function(req, res) {
        var options = {
            perPage: parseInt(req.query.limit) || 10,
            page: parseInt(req.query.page) || 1,
            order: req.query.order || 'trainNo'
        };
        var query;
        var trainNoArray = [];

        if (req.query.sectionType == 'userPlanSection') {
            queryResolver.resolveQuery(req.query, userPlanSectionModel, options).then(function(response) {
                res.json(response);
            });
        }
        else if (req.query.sectionType == 'globalSection') {
            queryResolver.resolveQuery(req.query, globalSectionModel, options).then(function(response) {
                res.json(response);
            });
        }
        else {
            queryResolver.resolveQuery(req.query, userPlanSectionModel, options).then(function(response) {
                for (var i = 0; i < response.results.length; i++) {
                    if (trainNoArray.indexOf(response.results[i]._doc.trainNo) == -1)
                        trainNoArray.push(response.results[i]._doc.trainNo);
                }
                console.log(trainNoArray);
                queryResolver.resolveQuery(req.query, globalSectionModel, options, trainNoArray).then(function(sections) {
                   // sections.count += response.count;
                    //sections.last += response.last;
                    for (var i = 0; i < response.results.length; i++) {
                        sections.results.push(response.results[i]);
                    }
                    res.json(sections);
                });
            });
        }
    },

    removeUserPlanSection: function(req, res) {
        console.log("at Delete ")
        var trainNo = req.params.trainNo;
        var deferred = q.defer();
        userPlanSectionModel.remove({ trainNo: trainNo }, function(err, post) {
            if (err) console.log(err);
            res.status(201);
            res.json({
                "status": 200,
                "message": "Clear Section Successfully"
            })

            deferred.resolve(res);
        });
        return deferred.promise;
    }





};



module.exports = userPlanSections;
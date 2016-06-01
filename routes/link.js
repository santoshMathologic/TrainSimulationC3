var mongoose = require('mongoose');
var linkModel = require('../models/link.js');
var planModel = require('../models/plan.js');
var trainListModel = require('../models/trainList.js');
var globalSectionModel = require('../models/globalSection.js');
var userPlanSection = require('./userPlanSection.js');
var planRoute = require('./plans.js');
var timeCal = require('../lib/timeCal.js');
var q = require('q');
var data;
var post;
var newPromise;
var promises = [];
var linksArray = [];
var globalSectionsData = [];
var userPlanSectionsData = [];
var globalSectionMap = {};
var userPlanSectionMap = {};
var trainListData;
var trainNoArray = [];
var userTrainNoArray = [];
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var planId = 0;
var queryResolver = require('../lib/queryResolver.js');
require('mongoose-query-paginate');

var links = {

    list: function (req, res) {

        var options = {
            perPage: parseInt(req.query.limit) || 10,
            page: parseInt(req.query.page) || 1,
            order: req.query.order || 'linkName'
        };
        var query;
        queryResolver.resolveQuery(req.query, linkModel, options).then(function (response) {
            console.log(response);
            res.json(response);
        });
    },

   

    getLinksWithUserPlanId: function (req, res) {
        var planId = req.query.planId;
        linkModel.find({ planId: planId }, function (err, docs) {
            if (err) console.log(err);

            console.log(docs);

            res.json(docs);
        });
    },

  
    /**
     * Function used to find links.
     */
    findLinks: function (req, res) {
        var options = {
            perPage: parseInt(req.query.limit) || 10,
            page: parseInt(req.query.page) || 1,
            order: req.query.order || 'fromStation'
        };
        var query;
        queryResolver.resolveQuery(req.query, linkModel, options).then(function (response) {
            res.json(response);
        });
    },
    /**
     * Funtion used to create loco links from chart
     */

    mergeLinks: function (req, res) {
        linkModel.remove({ _id: { $in: req.body.previousLinks } }, function (err, deleteLinks) {
            if (err) res.json(err);
            else {
                linkModel.insertMany(req.body.links, function (err, result) {
                    if (err) res.json(err);
                    res.json({
                        "status": 201,
                        "message": "Links Creation Successfull"
                    });
                });
            }
        });
    },

    /**
     * Function used to create multiple links. this function will only be called once per plan.
     */
    generateLink: function (req, res) {
        planId = req.body.planId;
        var deferred = q.defer();
        trainListModel.find({}, function (err, trainLists) {
            trainListData = trainLists;
            getTrainNoArray();
            if (err) console.log(err);

            else if (trainLists.length == 0) {
                res.json({
                    "message": "No trains found in the database"
                })
            }
            else {

                userPlanSection.getAllUserPlanSection().then(function (userSections) {
                    console.log("userSections size is " + userSections.length);
                    userPlanSectionsData = userSections;
                    getUserTrainNoArray();
                    try {
                        if (userSections.length != 0) {
                            processGlobalSectionData(true).then(function (globalSections) {
                                convertToMap(trainListData, 'userPlanSection');
                                convertToMap(trainListData, 'globalSection');
                                parseData(trainListData, 'userPlanSection').then(function (userPlanSectionData) {
                                    console.log("userPlanSectionData parsed");
                                    parseData(trainListData, 'globalSection').then(function (globalSectionResultData) {
                                        console.log("globalSectionData parsed");
                                        insertBulkData().then(function (insertDataResult) {
                                            planRoute.setUserPlan(planId).then(function (userPlanResult) {
                                                res.json({
                                                    "status": 201,
                                                    "message": "Links creation successfull"
                                                });
                                                linksArray = [];
                                                globalSectionsData = [];
                                                userPlanSectionsData = [];
                                                globalSectionMap = {};
                                                userPlanSectionMap = {};
                                                trainListData = [];
                                                trainNoArray = [];
                                                userTrainNoArray = [];
                                                planId = 0;
                                                deferred.resolve(userPlanResult);
                                            });

                                        });

                                    })
                                });
                            });
                        }
                        else {

                            processGlobalSectionData(false).then(function (globalSections) {
                                console.log("when usersection length == 0");
                                convertToMap(trainListData, 'globalSection');
                                parseData(trainListData, 'globalSection').then(function (userPlanSectionData) {
                                    insertBulkData().then(function (insertDataResult) {
                                        planRoute.setUserPlan(planId).then(function (userPlanResult) {
                                            res.json({
                                                "status": 201,
                                                "message": "Links creation successfull"
                                            });
                                            linksArray = [];
                                            globalSectionsData = [];
                                            userPlanSectionsData = [];
                                            globalSectionMap = {};
                                            userPlanSectionMap = {};
                                            trainListData = [];
                                            trainNoArray = [];
                                            userTrainNoArray = [];
                                            planId = 0;
                                            deferred.resolve(userPlanResult);
                                        });
                                    });
                                });
                            });
                        }
                    }
                    catch (Error) {
                        console.log(Error);
                    }

                });
            }
        });

        return deferred.promise;
    }
};


/**
 * Function to get TrainNoArray for trains returned by trainlists collection
 */
function getTrainNoArray() {
    for (var i = 0; i < trainListData.length; i++) {
        trainNoArray.push(trainListData[i]._doc.trainNo);
    }
}

/**
 * Function to get data from globalSection table
 * depeneding upon whether 
 * user plan section exists or not
 */
function processGlobalSectionData(doesUserPlanSectionsExist) {
    var deferred6 = q.defer();
    console.log("does user plan exist" + doesUserPlanSectionsExist);
    switch (doesUserPlanSectionsExist) {
        case false:
            console.log("fetching all global sections");
            globalSectionModel.find({}, function (err, globalSections) {
                console.log("globalSections size is " + globalSections.length)
                if (err) console.log(err);
                globalSectionsData = globalSections;
                deferred6.resolve(globalSections);

            });
            break;

        case true:
            console.log("fetching global sections that dont clash with userPlanSection");
            globalSectionModel.find({ trainNo: { $nin: userTrainNoArray } }, function (err, globalSections) {
                console.log("globalSections size is " + globalSections.length)
                if (err) console.log(err);
                globalSectionsData = globalSections;
                deferred6.resolve(globalSections);
            });
            break;
    }
    return deferred6.promise;
}

/**
 * Function to get train number array for trains
 * existing in user plan section
 */
function getUserTrainNoArray() {
    for (var i = 0; i < userPlanSectionsData.length; i++) {
        userTrainNoArray.push(userPlanSectionsData[i]._doc.trainNo);
    }
}

/**
 * Function that converts
 * user plan section to map
 * OR
 * global section to map
 * depending upon condition
 */
function convertToMap(data, section) {
    var tempArray = [];
    console.log("section in convert to map is : " + section);
    switch (section) {

        case 'userPlanSection': case 'user':
            console.log("creating usersectionMap");
            for (var i = 0; i < trainNoArray.length; i++) {
                for (var j = 0; j < userPlanSectionsData.length; j++) {
                    if (trainNoArray[i] === userPlanSectionsData[j]._doc.trainNo) {
                        userPlanSectionMap[trainNoArray[i]] = userPlanSectionMap[trainNoArray[i]] || [];
                        userPlanSectionMap[trainNoArray[i]].push(userPlanSectionsData[j]);
                    }

                }
            }
            break;
        case 'globalSection': case 'global':
            console.log("creating globalsectionMap");
            for (var i = 0; i < trainNoArray.length; i++) {
                for (var j = 0; j < globalSectionsData.length; j++) {
                    if (trainNoArray[i] === globalSectionsData[j]._doc.trainNo) {
                        globalSectionMap[trainNoArray[i]] = globalSectionMap[trainNoArray[i]] || [];
                        globalSectionMap[trainNoArray[i]].push(globalSectionsData[j]);
                    }

                }
            }
            break;
    }

}

/**
 * Function that will insert
 * links into DB
 */
function insertBulkData() {
    console.log("inserting bulk data");
    var deferred5 = q.defer();
    linkModel.insertMany(linksArray, function (err, result) {
        if (err) console.log(err);
        console.log("done");
        deferred5.resolve("done");
    })
    return deferred5.promise;
}

/**
 * Function that will parse data 
 * 
 */
function parseData(data, section) {
    var deferred3 = q.defer();
    var i = 0;
    var docs = [];
    switch (section) {
        case 'globalSection': case 'global':
            console.log("in parse data of global section");
            trainListData.forEach(function (train) {
                docs = globalSectionMap[train._doc.trainNo];
                if (docs != null || docs != undefined) {
                    createLinks(train, docs).then(function (links) {
                        deferred3.resolve("done");
                    });
                }
            });
            break;

        case 'userPlanSection': case 'userPlan':
            console.log("in parse data of userPlan section");

            trainListData.forEach(function (train) {
                docs = userPlanSectionMap[train._doc.trainNo];

                if (docs != null || docs != undefined) {
                    createLinks(train, docs).then(function (links) {
                        deferred3.resolve("done");
                    });
                }
                else {
                    deferred3.resolve("done");
                }

            });
            break;
    }


    return deferred3.promise;
}

/**
 * Function that will insert data model 
 * into db object of link table.
 * no of links for a train inserted =  no of global sections * runningDays
 */
function createLinks(train, docs) {
    var deferred2 = q.defer();
    var runningDays = train._doc.runningDays;
    var i;
    try {
        for (i = 0; i < docs.length; i++) {
            var newDocStr = JSON.stringify(docs[i]);
            for (var j = 0; j < runningDays.length; j++) {
                var newDoc = JSON.parse(newDocStr);
                newDoc.startDay = runningDays[j];
                newDoc.arrivalDay = newDoc.arrivalDay + runningDays[j];
                newDoc.arrivalDay = (newDoc.arrivalDay > 6) ? newDoc.arrivalDay - 7 : newDoc.arrivalDay;
                newDoc.departureDay = newDoc.departureDay + runningDays[j];
                newDoc.departureDay = (newDoc.departureDay > 6) ? newDoc.departureDay - 7 : newDoc.departureDay;
                var arrivalDateTimeObj = { day: newDoc.arrivalDay, time: newDoc.arrivalTime };
                var departureDateTimeObj = { day: newDoc.departureDay, time: newDoc.departureTime };
                var arrivalTimeMinutes = timeCal.convertDateTimeObjToNumber(arrivalDateTimeObj);
                var departureTimeMinutes = timeCal.convertDateTimeObjToNumber(departureDateTimeObj);
                newDoc.arrivalMinutes = arrivalTimeMinutes;
                newDoc.departureMinutes = departureTimeMinutes;
                var passingStations = [];
                passingStations.push(newDoc.fromStation);
                passingStations.push(newDoc.toStation);
                var dataModel = {
                    linkName: newDoc.fromStation + '_' + newDoc.toStation + '_' + train._doc.trainNo,
                    fromStation: newDoc.fromStation,
                    toStation: newDoc.toStation,
                    passingStations: passingStations,
                    linkDescription: train._doc.trainNo + '_' + days[runningDays[j]] + '_' + newDoc.fromStation + '_' + newDoc.toStation,
                    sections: newDoc,
                    planId: planId
                };
                linksArray.push(dataModel);
            }
        }
    }
    catch (err) {
        console.log(err);
    }

    if (i == docs.length) {
        deferred2.resolve(linksArray);
    }
    return deferred2.promise;
}

module.exports = links;
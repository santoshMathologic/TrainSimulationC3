/**
 * Query Resolver module which will take 
 * Request Query Object and Model as paramters
 *  and will return query which should be 
 * used in conjuction with pagination.
 */
var query;
var q = require('q');
var objectArray = [];
var nonDBFieldsArray = ['limit', 'page', 'order', 'sectionType'];
var numberFilterArray = ['stopNo', 'dayOfJourney', 'distance', 'startDay'];
var trainStationModel = require('../models/trainStation.js');
var booleanFields = ['isLocoChange', 'markDelete'];
var dbArrayFields = ['passingStations'];
require('mongoose-query-paginate');
var queryResolver = {
    resolveQuery: function (queryObject, Model, options, trainNoArray) {
        try {
            var deferred = q.defer();
            objectArray = [];
            if (queryObject.passingStation1 && queryObject.passingStation2 &&
                queryObject.passingStation1 != '' && queryObject.passingStation2 != '') {
                getTrainNumbers(queryObject.passingStation1, queryObject.passingStation2, 2).then(function (trainNumbers) {
                    query = processFields(trainNumbers, queryObject, Model, options, trainNoArray);
                    query.paginate(options, function (err, response) {
                        if (err) console.log(err);
                        deferred.resolve(response);
                    });
                });
            }
            else if (queryObject.passingStation1 && queryObject.passingStation1 != '') {
                getTrainNumbers(queryObject.passingStation1, null, 1).then(function (trainNumbers) {
                    query = processFields(trainNumbers, queryObject, Model, options, trainNoArray);
                    query.paginate(options, function (err, response) {
                        if (err) console.log(err);
                        deferred.resolve(response);
                    });
                });
            }
            else if (queryObject.passingStation2 && queryObject.passingStation2 != '') {
                getTrainNumbers(queryObject.passingStation2, null, 1).then(function (trainNumbers) {
                    query = processFields(trainNumbers, queryObject, Model, options, trainNoArray);
                    query.paginate(options, function (err, response) {
                        if (err) console.log(err);
                        deferred.resolve(response);
                    });
                });
            }
            else {
                query = processFields(null, queryObject, Model, options, trainNoArray);
                query.paginate(options, function (err, response) {
                    if (err) console.log(err);
                    deferred.resolve(response);
                });
            }
            return deferred.promise;
        }
        catch (Error) {
            console.log(Error);
        }

    }
};



function processFields(trainNumbers, queryObject, Model, options, trainNoArray) {
    try {
        for (var query in queryObject) {
            if (queryObject[query] != '' && nonDBFieldsArray.indexOf(query) === -1) {
                if (query === 'trainNo') {
                    var q = {};
                    q[query] = getTrainNumberQuery(queryObject[query]);
                    objectArray.push(q);
                } else if (numberFilterArray.indexOf(query) != -1) {
                    var q = {};
                    q[query] = { $gte: parseInt(queryObject[query]) };
                    objectArray.push(q);
                } else if (booleanFields.indexOf(query) != -1) {
                    var q = {};
                    q[query] = (queryObject[query] === 'true');
                    objectArray.push(q);
                }
                else if (dbArrayFields.indexOf(query) != -1) {
                    var q = {};
                    q[query] = { $elemMatch: { $regex: queryObject[query], $options: 'i' } };
                    objectArray.push(q);
                }
                else if (query == '_id' || query == 'planId') {
                    var q = {};
                    q[query] = queryObject[query];
                    objectArray.push(q);
                }
                else if (query != 'passingStation1' && query != 'passingStation2') {
                    if (queryObject[query].indexOf('!') != -1) {
                        var fieldValue = queryObject[query];
                        fieldValue = fieldValue.slice(1);
                        var newRegEx = new RegExp(fieldValue, 'i');
                        var q = {};
                        q[query] = { $not: newRegEx };
                        objectArray.push(q);
                    }
                    else {
                        var q = {};
                        q[query] = { $regex: queryObject[query], $options: 'i' };
                        objectArray.push(q);
                    }
                }

            }
        }
        if (trainNoArray != undefined && trainNoArray.length != 0) {
            var q = { trainNo: { $nin: trainNoArray } };
            objectArray.push(q);
        }
        if (objectArray.length == 0) {
            query = Model.find({}).sort(options.order);
        }
        else if (objectArray.length > 0) {
            query = Model.find({}).and([objectArray[0]]).sort(options.order);
            for (var i = 1; i < objectArray.length; i++) {
                query._conditions.$and.push(objectArray[i]);
            }
        }
        if (trainNumbers != null) {
            if (objectArray.length == 0)
                query = Model.find({ trainNo: { $in: trainNumbers } }).sort(options.order);
            else
                query._conditions.$and.push({ trainNo: { $in: trainNumbers } });
        }
    }

    catch (Error) {
        console.log(Error);
    }
    return query;
}


/**
 * Function that will return either a query or condition
 *  object depending upon the 
 * number of search criterias selected
 */
function getTrainNumberQuery(trainNumber) {
    trainNumber = trainNumber.toString();
    console.log(trainNumber.length);
    var toTrainNumber = trainNumber;
    var fromTrainNumber = trainNumber;
    var i = 5 - trainNumber.length;
    for (var j = 0; j < i; j++) {
        fromTrainNumber += '0';
        toTrainNumber += '9';
    }
    console.log(parseInt(fromTrainNumber));
    console.log(parseInt(toTrainNumber));

    var obj = { $gte: fromTrainNumber, $lte: toTrainNumber };
    return obj;

}


function getTrainNumbers(passingStation1, passingStation2, numFields) {
    var deferredTrainNumbers = q.defer();
    if (numFields == 1) {
        trainStationModel.distinct('trainNo', { stationCode: { $regex: passingStation1 } }, function (err, trainNumbers) {
            if (err) console.log(err);
            deferredTrainNumbers.resolve(trainNumbers);
        });
    }
    else {
        trainStationModel.distinct('trainNo', { stationCode: { $regex: passingStation1 } }, function (err, trainNumbers) {
            if (err) console.log(err);
            trainStationModel.distinct('trainNo', { $and: [{ trainNo: { $in: trainNumbers } }, { stationCode: passingStation2 }] }, function (err, newTrainNumbers) {
                if (err) console.log(err);
                deferredTrainNumbers.resolve(newTrainNumbers);
            });

        });
    }
    return deferredTrainNumbers.promise;
}
module.exports = queryResolver;
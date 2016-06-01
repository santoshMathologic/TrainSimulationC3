var express = require('express');
var multer = require('multer')
var upload = multer()
var router = express.Router();
var mongoose = require('mongoose');
var newUpload = require('../models/newUpload.js');
var fs = require('fs');
var trainListRoute = require('./trainList.js');
var trainStationRoute = require('./trainStation.js');
var globalSectionRoute = require('./globalSection.js');
var trainListArray = [];
var Q = require('q');
var globalSectionsArray = [];
var sourceTrainNo = 0;
var sourceLocoType = "";
var sourceStation = "";
var startDay = "";
var sourceDepartureDay = "";
var sourceDepartureTime = "";
var sourceDepartureMinutes = "";
var sourceDepartureDateTime = "";
var sourceDistance = 0;
var sectionDistance = 0;
var sectionDurationMinutes = 0;
var lastArrivalDay = "";
var lastArrivalTime = "";
var lastArrivalMinutes = "";
var lastArrivalDateTime = "";
var previousDistance = 0;
var previousMinutes = 0;
var previousStation = "";
var previousArrivalDay = "";
var previousArrivalTime = "";
var previousArrivalDateTime = "";
var previousLocoType = "";
var trainNo = 0;
var stopNo;
var stationCode = "";
var arrivalDay;
var arrivalTime = "";
var departureTime = "";
var departureDay;
var arrivalTimeMinutes;
var departureTimeMinutes;
var dayOfJourney;
var timeCal = require('../lib/timeCal.js');
var isLocoChanged = false;





var newUploads = {


    /* 
        Function to get upload list from database starts here
    */


    getAllUploads: function(req, res) {
        
         newUpload.find({}, { "dataType": true, "fileType": true, "originalFileName": true, "uploadedBy": true, "isProcessed": true, "status": true }, function(err, allUploads) {
            if (err) return res.json(err);
            res.json(allUploads);
        });
    },



    /* 
        Function to get upload list from database ends here
    */


    /* 
        Function to process upload file based on id starts here
    */




    processUpload: function(req, res) {

        switch (req.body.dataType) {
            case 'TrainDetails': {
                newUpload.findById(req.params.id, function(err, post) {
                    if (err) return err;
                    var data = post.data;
                    parseTrainDetails(data).then(function(result) {
                        updateUpload(req.params.id).then(function(result) {
                            trainListArray = [];
                            res.json("Upload Successfull");
                        },
                            function(error) {
                                console.log(error);
                            });
                    }, function(error) {
                        console.log(error);
                    });

                });

            }
                break;
            case 'TrainStation': {
                newUpload.findById(req.params.id, function(err, post) {
                    if (err) return next(err);
                    parseTrainStation(post.data).then(function(result) {
                        updateUpload(req.params.id).then(function(result) {
                            globalSectionsArray = [];
                            res.json("Upload Successfull");
                        });
                    });



                });

            }
                break;

        }


    },




    /* 
       Function to process upload file based on id ends here
   */





    /* 
        Function to upload files to database starts here
    */

    createNewUpload: function(req, res, next) {

        fileName = req.file.originalname;
        console.log(fileName);
        var file = __dirname + "/" + req.file.name;
        console.log("File Path : " + req.file.path);
        var filePath = req.file.path;
        fs.readFile(req.file.path, function(err, data) {

            if (err) {
                console.log(err);
            }
            else {
                fs.writeFile(file, data, function(err) {

                    var uploadData = new UploadData(data, req.body.dataType, req.body.fileType, fileName, req.body.username);

                    if (err) {
                        console.log(err);
                    }
                    else {
                        newUpload.create(uploadData, function(err, post) {
                            if (err) return next(err);
                            res.json(post.id);
                        });
                        fs.unlink(file, function(err) {
                            if (err) console.log(err);
                            else {
                                console.log("file deleted" + file);

                            }
                        });
                        fs.unlink('./' + filePath);
                    }

                });
            }
        })
    }

    /* 
        Function to upload files to database ends here
    */

};


// Function to Parse TrainStataion
function parseTrainStation(data) {

    var deferred = Q.defer();
    var trainNo;
    var stationCode;
    var arrivalDay;
    var departureDay;
    var arrival;
    var departure;
    var distance;
    var trainNo = 0;
    var trainStations = [];
    var promises = [];
    var trainNoArray = [];
    /**
     * Variables for creating global sections
     */

    data += '\n';
    var re = /\r\n|\n\r|\n|\r/g;
    var rows = data.replace(re, "\n").split("\n");

    for (var i = 1; i < rows.length; i++) {
        var rowdata = rows[i].split(",");
        if (rowdata[0] === "") {
            trainStations.push({
                trainNo: trainNo,
                stopNo: stopNo,
                stationCode: stationCode,
                arrivalTime: arrivalTime,
                departureTime: departureTime,
                arrivalMinutes: arrivalTimeMinutes,
                departureMinutes: departureTimeMinutes,
                arrivalDateTime: arrivalDateTime,
                departureDateTime: departureDateTime,
                arrivalDay: arrivalDay,
                departureDay: departureDay,
                dayOfJourney: dayOfJourney,
                distance: distance,
                locoType: locoType,
                isLocoChange: true
            });
            pushToGlobalSectionsArray(stationCode, arrivalDay, arrivalTime, arrivalTimeMinutes, arrivalDateTime, distance);
            console.log("breaking up");
            break;
        }
        if (trainNo != 0) {
            trainStations.push({
                trainNo: trainNo,
                stopNo: stopNo,
                stationCode: stationCode,
                arrivalTime: arrivalTime,
                departureTime: departureTime,
                arrivalMinutes: arrivalTimeMinutes,
                departureMinutes: departureTimeMinutes,
                arrivalDateTime: arrivalDateTime,
                departureDateTime: departureDateTime,
                arrivalDay: arrivalDay,
                departureDay: departureDay,
                dayOfJourney: dayOfJourney,
                distance: distance,
                locoType: locoType,
                isLocoChange: isLocoChange
            });
        }



        trainNo = rowdata[0];
        stopNo = rowdata[1];
        stationCode = rowdata[2];
        dayOfJourney = rowdata[3];
        arrivalDay = dayOfJourney - 1;
        arrivalTime = rowdata[4];
        departureTime = rowdata[5];
        departureDay = arrivalDay;
        var arrivalDateTimeObj = { day: arrivalDay, time: arrivalTime };
        var departureDateTimeObj = { day: departureDay, time: departureTime };
        arrivalTimeMinutes = timeCal.convertDateTimeObjToNumber(arrivalDateTimeObj);
        departureTimeMinutes = timeCal.convertDateTimeObjToNumber(departureDateTimeObj);
        var departureDate;
        var arrivalDate;

        arrivalDate = dayOfJourney + ' Jan 2012 ' + arrivalTime + ':00 GMT+0000';

        if (arrivalTimeMinutes > departureTimeMinutes) {
            departureDay = parseInt(arrivalDay) + 1;
            departureDate = (dayOfJourney + 1) + ' Jan 2012 ' + departureTime + ':00 GMT+0000';
        }
        else {
            departureDay = arrivalDay;
            departureDate = (dayOfJourney) + ' Jan 2012 ' + departureTime + ':00 GMT+0000';
        }

        var arrivalDateTime = new Date(arrivalDate);
        var departureDateTime = new Date(departureDate);
        var distance = rowdata[6];
        var locoType = rowdata[7];
        var isLocoChange = false;

        if (locoType !== previousLocoType) {
            isLocoChange = true;
        }


        if (i == 1) {

            setSourceDetails(trainNo, locoType, stationCode, arrivalDay, departureDay, departureTime, departureTimeMinutes, departureDateTime, distance);

        }

        // else if (departureTimeMinutes == 0) {
        //     pushToGlobalSectionsArray(stationCode, arrivalTime, distance);
        // }

        else if (sourceTrainNo == trainNo && sourceLocoType == locoType) {
            processDetails(previousMinutes, arrivalTimeMinutes, previousDistance, distance);

        }

        else {
            if (sourceTrainNo == trainNo && sourceLocoType != locoType) { //loco changed
                isLocoChanged = true;
                processDetails(previousMinutes, arrivalTimeMinutes, previousDistance, distance);
                pushToGlobalSectionsArray(stationCode, arrivalDay, arrivalTime, arrivalTimeMinutes, arrivalDateTime, distance);
                setSourceDetails(trainNo, locoType, stationCode, arrivalDay, departureDay, departureTime, departureTimeMinutes, departureDateTime, distance);

            }
            else { //train changed

                pushToGlobalSectionsArray(previousStation, previousArrivalDay, previousArrivalTime, previousMinutes, previousArrivalDateTime, distance);
                setSourceDetails(trainNo, locoType, stationCode, arrivalDay, departureDay, departureTime, departureTimeMinutes, departureDateTime, distance);
            }
        }



        trainNoArray.push(trainNo);


        previousDistance = distance;
        if (stopNo == 1 || isLocoChanged) {
            previousMinutes = departureTimeMinutes;
            isLocoChanged = false;    
    }
        else
            previousMinutes = arrivalTimeMinutes;
        previousStation = stationCode;
        previousArrivalDay = arrivalDay;
        previousArrivalTime = arrivalTime;
        previousArrivalDateTime = arrivalDateTime;
        previousLocoType = locoType;
    }

    trainStationRoute.deleteTrainStations(trainNoArray).then(function(result) {
        trainStationRoute.createTrainStation(trainStations).then(function(result) {
            deferred.resolve(result);
        })
    })

    globalSectionRoute.deleteTrainSections(trainNoArray).then(function(result) {
        globalSectionRoute.createGlobalSections(globalSectionsArray);
    })




    function processDetails(previousMinutes, arrivalTimeMinutes, sourceDistance, distance) {

        sectionDistance += distance - sourceDistance;
        sectionDurationMinutes += ((arrivalTimeMinutes >= previousMinutes) ?
            arrivalTimeMinutes - previousMinutes :
            arrivalTimeMinutes + 1440 - previousMinutes);

    }

    return deferred.promise;

}






var trainExistData = "";

function parseTrainDetails(data) {
    var deferred = Q.defer();
    var trainNoArray = [];
    var runningDaysArray = [];
    var trainDaysMap = {};
    var runningTrainArray = [];
    var trainListRunningDaysArray = [];
    counter = 1;
    counter1 = 2;
    var re = /\r\n|\n\r|\n|\r/g;
    var rows = data.replace(re, "\n").split("\n");
    for (var i = 1; i < rows.length; i++) {
        var trainNo = 0;
        var fromStation;
        var toStation;
        var trainType;
        var trainName;
        var runningDaysArray = [];

        var data = rows[i].split(',');

        trainNo = data[0]
        trainName = data[1]
        fromStation = data[2]
        toStation = data[3]
        for (var j = 0; j < 7; j++) {
            var runningDay = data[4 + j];
            if (runningDay != "") {
                runningDaysArray.push(j);
                trainListRunningDaysArray.push(j)
            }
        }
        trainType = data[11];
        locoType = data[12];


        if (trainNo != "") {
            trainNoArray.push(trainNo);
            pushDataToArray(trainNo, trainName, fromStation, toStation, runningDaysArray, trainType, locoType);
        }
    }

    trainListRoute.deleteTrainList(trainNoArray).then(function(result) {
        trainListRoute.createTrainList(trainListArray).then(function(result) {
            deferred.resolve(result);
        });

    });

    return deferred.promise;

}

/* 
   Below are Util Functions
*/


/* Function to get nth index of a pattern of a string  */
function getnthIndex(str, pat, n) {
    var L = str.length, i = -1;
    while (n-- && i++ < L) {
        i = str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}

/** Function to push data to array which will hold information of all the trains */
function pushDataToArray(trainNo, trainName, fromStation, toStation, runningDays, trainType, locoType) {
    trainListArray.push({
        trainNo: trainNo,
        trainName: trainName,
        fromStation: fromStation,
        toStation: toStation,
        runningDays: runningDays,
        trainType: trainType,
        locoType: locoType

    })

}

/** Function used to create new Uploads */

function UploadData(data, dataType, fileType, originalFileName, uploadedBy) {
    this.data = data;
    this.dataType = dataType;
    this.fileType = fileType;
    this.originalFileName = originalFileName;
    this.uploadedBy = uploadedBy;
}


/** update fields of new uploads table based on ID once the data is completely parsed */
function updateUpload(data) {
    var deferredUpdate = Q.defer();
    newUpload.findByIdAndUpdate(data, { 'isProcessed': true, 'status': "processed" }, function(error, result) {
        if (error) return error;
        deferredUpdate.resolve(result);
    })
    return deferredUpdate.promise;
}

function hrsToMinutes(time) {
    time = time.split(":");
    return parseInt(time[0]) * 60 + parseInt(time[1]);
}

function minutesToHours(minutes) {
    var mins = Math.round(parseInt((((minutes / 60) % 1).toFixed(2).substring(2))) * 0.6);
    mins = (mins < 10) ? "0" + mins : mins;
    var hrs = Math.floor(minutes / 60);
    hrs = (hrs < 10) ? "0" + hrs : hrs;
    return hrs + ":" + mins;
}

function setSourceDetails(trainNo, locoType, stationCode, arrivalDay, departureDay, departureTime, departureTimeMinutes, departureDateTime, distance) {
    sourceTrainNo = trainNo;
    sourceLocoType = locoType;
    sourceStation = stationCode;
    startDay = arrivalDay;
    sourceDepartureDay = departureDay;
    sourceDepartureTime = departureTime;
    sourceDepartureMinutes = departureTimeMinutes;
    sourceDepartureDateTime = departureDateTime;
    sourceDistance = distance;
    sectionDistance = 0;
    sectionDurationMinutes = 0;
}


function pushToGlobalSectionsArray(stationCode, arrivalDay, arrivalTime, arrivalMinutes, arrivalDateTime, distance) {
    globalSectionsArray.push({
        trainNo: sourceTrainNo,
        startDay: startDay,
        fromStation: sourceStation,
        toStation: stationCode,
        arrivalDay: arrivalDay,
        departureDay: sourceDepartureDay,
        arrivalTime: arrivalTime,
        departureTime: sourceDepartureTime,
        locoType: sourceLocoType,
        arrivalMinutes: arrivalMinutes,
        departureMinutes: sourceDepartureMinutes,
        arrivalDateTime: arrivalDateTime,
        departureDateTime: sourceDepartureDateTime,
        distance: sectionDistance,
        duration: sectionDurationMinutes,
        preSectionFrom: null,
        nextSectionTo: null,
        distanceFromSource: 0,
        distanceFromPreSectionFrom: 0,
        distanceFromPreInspection: 0,
        distanceToNextSectionTo: 0,
        distanceToNextInspection: 0,
        distanceToDestination: 0,
        durationFromSource: 0,
        durationFromPreSectionFrom: 0,
        durationFromPreInspection: 0,
        durationToNextSectionTo: 0,
        durationToNextInspection: 0,
        durationToDestination: 0,
    })
}

module.exports = newUploads;
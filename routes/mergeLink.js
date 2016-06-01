var mongoose = require('mongoose');
var linkModel = require('../models/link.js');
var planModel = require('../models/plan.js');
var timeCal = require('../lib/timeCal.js');
var q = require('q');
var queryResolver = require('../lib/queryResolver.js');
require('mongoose-query-paginate');
var fromSectionData = [];
var toSectionData = [];
var previousLinks = [];
var fromLinkData = [];
var toLinkData = [];
var links = [];
var planId = 0;

var links = {
    mergeLinks: function(req, res) {
        fromLinkData = [];
        toLinkData = [];
        var fromOptions = {
            perPage: parseInt(req.query.fromLimit) || 10,
            page: parseInt(req.query.fromPage) || 1,
            order: req.query.order || 'linkName'
        };

        var toOptions = {
            perPage: parseInt(req.query.toLimit) || 10,
            page: parseInt(req.query.toPage) || 1,
            order: req.query.order || 'linkName'
        };
        var query = linkModel.find({ fromStation: req.query.passingStations });
        var newQuery = linkModel.find({ toStation: req.query.passingStations });
        query.paginate(fromOptions, function(err, fromData) {
            if (err) console.log(err);
            fromLinkData = fromData;
            newQuery.paginate(toOptions, function(err, toData) {
                if (err) console.log(err);
                toLinkData = toData;
                var response = {};
                response["fromData"] = fromData;
                response["toData"] = toData;
                res.json(response);
            });
        });
    },
    autoConnectLinks: function(req, res) {
        fromData = [];
        toData = [];
        linkModel.find({ fromStation: req.query.passingStations }, function(err, fromData) {
            if (err) console.log(err);
            else {
                linkModel.find({ toStation: req.query.passingStations }, function(err, toData) {
                    if (err) console.log(err);
                    else {
                        fromLinkData = fromData;
                        toLinkData = toData;
                        planId = req.body.planId;
                        getSections(fromData, toData, req.query.passingStations);
                        res.json(links);
                    }
                })
            }
        });
    }
};




function getSections(fromLinkData, toLinkData, passingStations) {
    try {
        fromSectionData = [];
        toSectionData = [];
        linksMap = {};
        previousLinks = [];
        links = [];
        for (var l = 0; l < fromLinkData.length; l++) {
            for (var s = 0; s < fromLinkData[l].sections.length; s++) {
                var section = fromLinkData[l].sections[s];
                if (section.fromStation == passingStations || section.toStation == passingStations) {
                    fromSectionData.push(section);
                    section.linkId = fromLinkData[l]._id;
                    linksMap[section.linkId] = linksMap[section.linkId] || [];
                    if (!linksMap[section.linkId])
                        linksMap[section.linkId] = fromLinkData[l];
                    else
                        linksMap[section.linkId].push(section);
                }
            }
        }

        for (var l = 0; l < toLinkData.length; l++) {
            for (var s = 0; s < toLinkData[l].sections.length; s++) {
                var section = toLinkData[l].sections[s];
                if (section.fromStation == passingStations || section.toStation == passingStations) {
                    section.linkId = toLinkData[l]._id;
                    toSectionData.push(section);
                    linksMap[section.linkId] = linksMap[section.linkId] || [];
                    if (!linksMap[section.linkId])
                        linksMap[section._id] = toLinkData[l];
                    else
                        linksMap[section.linkId].push(section);
                }
            }
        }


        fromSectionData.sort(compareFromData);
        toSectionData.sort(compareToData);

        var minutes = fromSectionData[fromSectionData.length - 1].departureMinutes;
        var high = getClosestK(toSectionData, "arrivalMinutes", minutes);
        for (var i = high, c = 0; i != high || c < toSectionData.length; i = (i + 1) % toSectionData.length, c++) {
            var arrivalMinutes = toSectionData[i].arrivalMinutes + 120;
            var index = getClosestK(fromSectionData, "departureMinutes", arrivalMinutes);
            createLink(i, index);
            fromSectionData.slice(index, 1);
        }
    }
    catch (Error) {
        console.log(Error);
    }

}
function createLink(toDataIndex, fromDataIndex) {

    var sections = [];
    var linkDescription = "";
    var toLinkId = toSectionData[toDataIndex].linkId;
    var fromLinkId = fromSectionData[fromDataIndex].linkId;
    var passingStations = [];
    var fromPassingStations = [];
    var toPassingStations = [];
    var passingStations = [];
    var fromPassingStations = [];
    var toPassingStations = [];
    sections = linksMap[toLinkId];
    var maxOrderNo = sections.length;
    for (var i = 0; i < linksMap[fromLinkId].length; i++) {
        linksMap[fromLinkId][i].orderNo = maxOrderNo + 1;
        sections.push(linksMap[fromLinkId][i]);
    }

    previousLinks.push(fromLinkId);
    previousLinks.push(toLinkId);
    for (var i = 0; i < fromLinkData.length; i++) {
        if (fromLinkData[i]._id == fromSectionData[fromDataIndex].linkId) {
            for (var j = 0; j < fromLinkData[i].passingStations.length; j++) {
                fromPassingStations.push(fromLinkData[i].passingStations[j]);
            }
        }
    }

    for (var i = 0; i < toLinkData.length; i++) {
        if (toLinkData[i]._id == toSectionData[toDataIndex].linkId) {
            for (var j = 0; j < toLinkData[i].passingStations.length; j++) {
                toPassingStations.push(toLinkData[i].passingStations[j]);
            }
        }
    }

    for (var i = 0; i < fromPassingStations.length; i++) {
        if (passingStations.indexOf(fromPassingStations[i]) == -1) {
            passingStations.push(fromPassingStations[i]);
        }
    }
    for (var i = 0; i < toPassingStations.length; i++) {
        if (passingStations.indexOf(toPassingStations[i]) == -1) {
            passingStations.push(toPassingStations[i]);
        }
    }
    var fromStation = toSectionData[toDataIndex].fromStation;
    var toStation = fromSectionData[fromDataIndex].toStation
    var fromTrainNo = fromSectionData[fromDataIndex].trainNo;
    var toTrainNo = toSectionData[toDataIndex].trainNo;

    var dataModel = {
        linkName: fromStation + '_' + toStation + '_' + fromTrainNo + '_' + toTrainNo,
        fromStation: fromStation,
        toStation: toStation,
        passingStations: passingStations,
        linkDescription: fromTrainNo + '_' + toTrainNo + '_' + fromStation + '_' + toStation,
        sections: sections,
        planId: '112'
    };
    links.push(dataModel);
}



function compareFromData(item1, item2) {
    var d;

    d = item1.departureMinutes - item2.departureMinutes;
    if (d == 0) {
        d = (item2.departureMinutes - item2.departureMinutes) - (item1.departureMinutes - item1.departureMinutes);
    }

    return d;
}

function compareToData(item1, item2) {
    var d;

    d = item1.arrivalMinutes - item2.arrivalMinutes;
    if (d == 0) {
        d = (item2.arrivalMinutes - item2.arrivalMinutes) - (item1.arrivalMinutes - item1.arrivalMinutes);
    }

    return d;
}




function getClosestK(roundTrips, field, x) {

    var low = 0;
    var high = roundTrips.length - 1;

    if (high < 0)
        throw new IllegalArgumentException("The array cannot be empty");

    OUTER:
    while (low < high) {
        var mid = Math.floor((low + high) / 2);
        var d1 = Math.abs(roundTrips[mid][field] - x);
        var d2 = Math.abs(roundTrips[mid + 1][field] - x);
        if (d2 < d1)
            low = mid + 1;
        else if (d2 > d1)
            high = mid;
        else { // --- handling "d1 == d2" ---
            for (var right = mid + 2; right <= high; right++) {
                d2 = Math.abs(roundTrips[right][field] - x);
                if (d2 < d1) {
                    low = right;
                    continue OUTER;
                } else if (d2 > d1) {
                    high = mid;
                    continue OUTER;
                }
            }
            high = mid;
        }
    }
    if (roundTrips[high][field] < x) {
        var rev = false;
        for (var i = high, c = 0; i != high || c < roundTrips.length; i = (i + 1) % roundTrips.length, c++) {
            var d = roundTrips[i][field] - x;
            if (d < 0 && rev) {
                return i;
            } if (d >= 0) {
                return i;
            }
            if (i == roundTrips.length - 1) {
                rev = true;
            }
        }
    }
    return high;
}



module.exports = links;
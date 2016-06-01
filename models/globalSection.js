var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var globalSectionSchema = new mongoose.Schema({
    orderNo:{type:Number,default:1},
    trainNo: Number,
    startDay: Number,
    fromStation: String,
    toStation: String,
    arrivalDay: Number,
    departureDay: Number,
    arrivalTime: String,
    departureTime: String,
    locoType: String,
    arrivalMinutes: Number,
    departureMinutes: Number,
    arrivalDateTime: Date,
    departureDateTime: Date,
    distance: Number,
    duration: Number,
    preSectionFrom: String,
    nextSectionTo: String,
    distanceFromSource: Number,
    distanceFromPreSectionFrom: Number,
    distanceFromPreInspection: Number,
    distanceToNextSectionTo: Number,
    distanceToNextInspection: Number,
    distanceToDestination: Number,
    durationFromSource: Number,
    durationFromPreSectionFrom: Number,
    durationFromPreInspection: Number,
    durationToNextSectionTo: Number,
    durationToNextInspection: Number,
    durationToDestination: Number,
    markDelete: { type: Boolean, default: false },
    uploadedTime: { type: Date, default: Date.now }
})
module.exports = mongoose.model('globalSection', globalSectionSchema);





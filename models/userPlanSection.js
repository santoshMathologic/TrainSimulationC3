var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userPlanSectionSchema = new mongoose.Schema({
    userPlanId: { type: Schema.Types.ObjectId, ref: 'plan' },
    orderNo: { type: Number, default: 1 },
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
    createTime: { type: Date, default: Date.now }
})

module.exports = mongoose.model('userPlanSection', userPlanSectionSchema);
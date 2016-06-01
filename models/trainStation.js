var mongoose = require('mongoose');
var trainStationSchema = new mongoose.Schema({
    trainNo: Number,
    stopNo: Number,
    stationCode: String,
    arrivalTime: String,
    departureTime: String,
    arrivalMinutes: Number,
    departureMinutes: Number,
    arrivalDateTime: { type: Date },
    departureDateTime: { type: Date },
    arrivalDay: { type: Number },
    departureDay: { type: Number },
    dayOfJourney: { type: Number },
    distance: { type: Number },
    locoType: String,
    isLocoChange: { type: Boolean, default: false },
    markDelete: { type: Boolean, default: false },
    createdTime: { type: Date, default: Date.now }
})
module.exports = mongoose.model('trainStation', trainStationSchema);
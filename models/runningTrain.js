var mongoose = require('mongoose');
var runningTrainSchema = new mongoose.Schema({
    trainNo: Number,
    startDay: Number,
    createdTime: {type:Date , default:Date.now}})
module.exports = mongoose.model('runningTrain', runningTraintSchema);
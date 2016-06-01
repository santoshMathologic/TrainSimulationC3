var mongoose = require('mongoose');
var trainListSchema = new mongoose.Schema({
    trainNo: Number,
    trainName:String,
    fromStation : String,
    toStation: String,
    runningDays: [{type:Number}],
    trainType: String,
    markDelete:{type:Boolean,default:false},
    locoType:{type:String},
    createdTime: {type:Date , default:Date.now}})
module.exports = mongoose.model('trainList', trainListSchema);
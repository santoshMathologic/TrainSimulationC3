var mongoose = require('mongoose');
var privilegeSchema = new mongoose.Schema({
    privilegeCode: {type:String,default:'Other'},
    default:{type:Boolean,default:false},
    viewDashboard:{type:Boolean,default:true},
    createdTime: {type:Date , default:Date.now}})
module.exports = mongoose.model('privilege', privilegeSchema);
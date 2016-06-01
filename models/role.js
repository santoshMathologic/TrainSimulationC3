var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var roleSchema = new mongoose.Schema({
    roleCode: {type:String,default:'Guest'},
    roleDescription:{type:String, default:'Only View Privilege'},
    privilegeId : {type:Schema.Types.ObjectId, ref:'user'},
    privilegeCode: {type:String,default:'Other'},    
    createdTime: {type:Date , default:Date.now}})
module.exports = mongoose.model('role', roleSchema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new mongoose.Schema({
    userName: String,
    firstName:String,
    lastName : String,
    password: String,
    email: String,
    roleCode: {type:String, ref:'role', default:'Planner'},
    markDelete:{type:Boolean,default:false},
    createdTime: {type:Date , default:Date.now}})
module.exports = mongoose.model('user', userSchema);
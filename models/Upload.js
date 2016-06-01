var mongoose = require('mongoose');
var newUploadSchema = new mongoose.Schema({
    data: String,
    dataType : String,
    fileType: String,
    originalFileName :String,
    uploadedBy: String,
    uploadedTime: {type:Date , default:Date.now}})
module.exports = mongoose.model('newUploads', newUploadSchema);
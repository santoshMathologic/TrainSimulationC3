var mongoose = require('mongoose');
var newUploadSchema = new mongoose.Schema({
    data: String,
    dataType: String,
    fileType: String,
    originalFileName: String,
    uploadedBy: String,
    isProcessed: { type: Boolean, default: false },
    status: { type: String, default: null },
    message: String,
    markDelete: { type: Boolean, default: false },
    uploadedTime: { type: Date, default: Date.now }
})
module.exports = mongoose.model('newUploads', newUploadSchema);
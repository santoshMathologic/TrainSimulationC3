var mongoose = require('mongoose');
var sectionSchema = require('./globalSection');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var linkSchema = new mongoose.Schema({
    linkName: String,
    fromStation: String,
    toStation: String,
    passingStations: [String],
    linkDescription: String,
    sections: [sectionSchema.schema],
    planId: { type: Schema.Types.ObjectId, ref: 'plan' },
    markDelete: { type: Boolean, default: false },
    uploadedTime: { type: Date, default: Date.now }
})
linkSchema.plugin(deepPopulate);
module.exports = mongoose.model('link', linkSchema);
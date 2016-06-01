var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var planSchema = new mongoose.Schema({
    planName: String,
    isComplete: { type: Boolean, default: false },
    isUnderReview: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
    coPlanners: [String],
    reviewer: { type: String },
    owner: { type: String },
    isLinkGenerated: { type: Boolean, default: false },
    markDelete: { type: Boolean, default: false },
    createdTime: { type: Date, default: Date.now }
});
module.exports = mongoose.model('plan', planSchema);
var mongoose = require('mongoose');

var CampaignSchema = new mongoose.Schema({
    startTime: String,
    endTime: String,
    // startDate: Date,
    // endDate: Date,
    beforeCampaignMessage: String,
    duringCampaignMessage: {
    	withNameCard: String,
    	withoutNameCard: String,
    },
    afterCampaignMessage: String,
    keyword: String,
    uniqueKeyword: String,
    eventName: String,
    createdBy: String,
    companyName: String,
    registeredUser: String,
    newUser: String,
  	reserve1: String,
	reserve2: String,
  	created_at: { type: Date, default: Date.now },
  	updated_at: { type: Date }
});

module.exports = mongoose.model('Campaign', CampaignSchema);
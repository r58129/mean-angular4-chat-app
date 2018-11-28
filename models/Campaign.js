var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CampaignSchema = new mongoose.Schema({
    startTime: String,
    endTime: String,
    type: String,
    beforeCampaignMessage: String,
    duringCampaignMessage: {
    	withNameCard: String,
    	withoutNameCard: String,
    },
    afterCampaignMessage: String,
    registerFailedMessage: {
        nameCardCampaign: String,
        phoneNumCampaign: String,        
    },
    keyword: String,
    uniqueKeyword: String,
    eventName: String,
    createdBy: String,
    companyName: String,
    registeredUser: [{ 
        type: String,
        // unique: true,
    }],
    registeredUserwithNameCard: [{ 
        type: String,
        // unique: true,
    }],
    newUser: String,
    // InUserList: [{ 
    //     type: Schema.Types.ObjectId, 
    //     ref: 'User'
    // }],
  	reserve1: String,
	reserve2: String,
  	created_at: { type: Date, default: Date.now },
  	updated_at: { type: Date }
});

module.exports = mongoose.model('Campaign', CampaignSchema);
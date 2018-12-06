var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BroadcastSchema = new mongoose.Schema({
    jobID: String,
    message: String,
    contactListCsv: String,
    contactListCsvName: String,
    imagefile: String,
    imagefilename: String,    
    notSendAck: String,
    prependContactName: String,
    jobStatus: String,    
    jobDetail: {
        success: String,
        messageID: String,
        message: String,
        image: String,
        jobEntires: [{
            name:String,
            number:String,
            location:String,
            hasContact:String,
            sent:String
        }]

    },
    created_at: { type: Date, default: Date.now },
  	completed_at: { type: Date }
});

module.exports = mongoose.model('Broadcast', BroadcastSchema);
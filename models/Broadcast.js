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
    groupName: String,
    senderPhoneNumber: String,
    jobStatus: String,  
    Results:[{
        Phone: String,
        Result: String
    }],     
    created_at: { type: Date, default: Date.now },
  	completed_at: { type: Date }
});

module.exports = mongoose.model('Broadcast', BroadcastSchema);
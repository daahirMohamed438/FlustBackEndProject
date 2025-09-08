const mongoose  = require('mongoose')
 

// model file: joininigTables.js
 

const joinedTables = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: Date,
    status: String,
});
  
const showMeBookingInforSchema = new mongoose.Schema({
  bookingId:{
   type:mongoose.Schema.Types.ObjectId
  }
})

const JoinAllTablesModel = mongoose.model("joinedTables", joinedTables);
const ShowMeBookingInfoModel = mongoose.model("showMeBookingInforSchema", showMeBookingInforSchema);

module.exports = {
  joinAllTables: JoinAllTablesModel,
  showMeBookingInfo: ShowMeBookingInfoModel,
}
const mongoose =  require("mongoose")

const hoursAvailableSchema = new mongoose.Schema({
    startHours:{
       type:String,
       required:true,
       unique:true
    },
    endHours:{
        type:String,
        required:true,
        unique:true
     },

     footSelId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Flat",
        required:true
     },
     price:{
        type:Number,
        required:true,
        
     },

     status: { 
        type: String, 
        enum: ["available", "unavailable"], 
        default: "available" 
      },

    //  footSelName:{
    //     type:String,
    //     require:true,
    //  },

    // Flat info snapshot
    flatName: String,
    region: String,
    district: String,
    village: String,
    startHour: String, // from Flat
    endHour: String,   // from Flat
},{
      timestamps: true  
})

module.exports = mongoose.model("HoursAvailable", hoursAvailableSchema)
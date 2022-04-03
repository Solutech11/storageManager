const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const history = new Schema({
    date:{
        type:Date,
        default:Date.now
    },
    userName:String,
    itemName:String,
    action:String,
    qauntityActed:Number,
});

const AddHistory = mongoose.model("History", history);

module.exports= AddHistory
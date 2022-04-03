const mongoose= require('mongoose');

const Schema= mongoose.Schema;

const Item = new Schema({
    // myId:Number,
    itemName:String,
    userName:String,
    quantity: Number,
    Date: String,
})


const addItems= mongoose.model("addItem",Item);

module.exports= addItems;
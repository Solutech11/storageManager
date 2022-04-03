const mongoose= require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:String,
    address:String,
    password:String
});

var userLogin = mongoose.model("userLogin", userSchema);

module.exports = userLogin;
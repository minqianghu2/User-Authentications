
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//set up the database schema
var UserSchema = new mongoose.Schema({
    username: String,
    password: String 
});


UserSchema.plugin(passportLocalMongoose);

//compile to models and module exports
module.exports = mongoose.model("User", UserSchema);
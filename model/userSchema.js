const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    "name" : {
        type : String,
        required : [true, "Please provide name"]
    },
    "email" : {
        type : String,
        required : [true, "Please provide valid email"]
    },
    "password" : {
        type : String,
        select : false
    },
    "provider" : {
        type : String
    },
    "providerId" : {
        type : String
    },
    "role" : {
        type : String
    }
});


userSchema.pre("save", async function(){
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
})

userSchema.methods.is_valid_password = async function(user_password){
    return await bcrypt.compare(this.password, user_password);
}

const user = mongoose.model("User", userSchema);
module.exports = user
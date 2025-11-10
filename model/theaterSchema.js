const mongoose = require("mongoose");

const Theater = new mongoose.Schema({
    "name" : {
        "type" : String,
        require : true,
    },
    "location" : {
        "city" : {
            "type" : String,
            require : true,
        },
        "address" : {
            "type" : String,
            require : true,
        },
    },
    "screens": [screenId]
})
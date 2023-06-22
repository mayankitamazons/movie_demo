const mongoose = require('mongoose');
// const URLSlug = require("mongoose-slug-generator");
// mongoose.plugin(URLSlug);

const Schema = new mongoose.Schema({
    movie_name:{
        type:String,
        index: true
    },
    // slug: { type: String, slug: "movie_name", unique: true },
    
    released_date: {
        type: Date,
    },
    rating:{
        type:Number,

    },
    cover_image: String,
    status: {
        type: Number,
        default: 1
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Movie', Schema);
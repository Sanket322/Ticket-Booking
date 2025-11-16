const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide movie title'],
            unique: true,
        },
        description: String,
        language: [String],
        genres: [String],
        duration: String,
        releaseDate: Date,
        image: {
            type: String,
            // required : [true, "Please provide movie image"]
        },
        cast: [String],
        director: String,
    },
    {
        timestamps: true,
    }
);

const movie = mongoose.model('Movie', movieSchema);
module.exports = movie;

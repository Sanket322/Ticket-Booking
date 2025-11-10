const Movie = require("../model/movieSchema");
const catchAsync = require("../utils/asyncHandler");

exports.add_movie = catchAsync( async (req, res) => {
    const {title, description, language, genres, duration, releaseDate, image, cast, director} = req.body;
    const movie = await Movie.create({
        title,
        description,
        language,
        genres,
        duration,
        releaseDate,
        image,
        cast,
        director
    })

    return res.status(201).json({
        status : "success",
        data : "Movie added successfullly"
    })
})

exports.get_movies = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;  
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const movies = await Movie.find({}).select("-createdAt -updatedAt -__v")
        .skip(skip)
        .limit(limit);

    return res.status(200).json({
        data : movies
    })
})

exports.movie_details = catchAsync(async (req, res) => {
    const id = req.params.id;
    const movie = await Movie.findById(id).select("-createdAt -updatedAt -__v");

    let statusCode = 200;
    let message = movie;

    if(!movie){
        statusCode = 404
        message = "Movie not found"
    }
    return res.status(statusCode).json({
        data : message
    })
})


exports.update_movie = catchAsync(async(req, res) => {
    const movie_id = req.params.id;
    const movie = await Movie.findByIdAndUpdate(movie_id, req.body, {new : true}).select("-createdAt -updatedAt -__v");
    return res.status(200).json({
        data : movie
    })
})


exports.delete_movie = catchAsync(async(req, res) => {
    const movie_id = req.params.id;
    const movie = await Movie.findByIdAndDelete(movie_id);
    return res.status(200).json({
        "message" : "Movie deleted successfully"
    })
})
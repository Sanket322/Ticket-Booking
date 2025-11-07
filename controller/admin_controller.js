const Movie = require("../model/movieSchema");
const catchAsync = require("../utils/asyncHandler");
const { createMovieSchema } = require("../validators/movie.validator");

exports.add_movie = catchAsync( async (req, res) => {
    const validatedData = createMovieSchema.parse(req.body);
    
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
        data : movie
    })
})

exports.get_movies = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;  
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const movies = await Movie.find({})
        .skip(skip)
        .limit(limit);

    return res.status(200).json({
        data : movies
    })
})

exports.movie_details = catchAsync(async (req, res) => {
    const id = req.params.id;
    const movie = await Movie.findById(id);

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
    const movie = await Movie.findByIdAndUpdate(movie_id, req.body);
    return res.status(200).json({
        data : movie
    })
})


exports.delete_movie = catchAsync(async(req, res) => {
    const movie_id = req.params.id;
    const movie = await Movie.findByIdAndDelete(movie_id);
    return res.status(200).json({
        data : movie
    })
})
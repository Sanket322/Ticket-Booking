const Movie = require('../model/movieSchema');
const Screen = require('../model/screenSchema');
const Show = require('../model/showSchema');
const catchAsync = require('../utils/asyncHandler');
const Theater = require('../model/theaterSchema');

// // // // // // // //  Movie Admin // // // // // // // // // //

exports.add_movie = catchAsync(async (req, res) => {
    const { title, description, language, genres, duration, releaseDate, image, cast, director } =
        req.body;
    await Movie.create({
        title,
        description,
        language,
        genres,
        duration,
        releaseDate,
        image,
        cast,
        director,
    });

    return res.status(201).json({
        status: 'success',
        data: 'Movie added successfullly',
    });
});

exports.get_movies = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const movies = await Movie.find({})
        .select('-createdAt -updatedAt -__v')
        .skip(skip)
        .limit(limit);

    return res.status(200).json({
        data: movies,
    });
});

exports.movie_details = catchAsync(async (req, res) => {
    const id = req.params.id;
    const movie = await Movie.findById(id).select('-createdAt -updatedAt -__v');

    let statusCode = 200;
    let message = movie;

    if (!movie) {
        statusCode = 404;
        message = 'Movie not found';
    }
    return res.status(statusCode).json({
        data: message,
    });
});

exports.update_movie = catchAsync(async (req, res) => {
    const movie_id = req.params.id;
    const movie = await Movie.findByIdAndUpdate(movie_id, req.body, {
        new: true,
    }).select('-createdAt -updatedAt -__v');
    return res.status(200).json({
        data: movie,
    });
});

exports.delete_movie = catchAsync(async (req, res) => {
    const movie_id = req.params.id;
    const movie = await Movie.findByIdAndDelete(movie_id);

    if (!movie) {
        return res.status(404).json({
            message: 'Movie not found',
        });
    }

    return res.status(200).json({
        message: 'Movie deleted successfully',
    });
});

// // // // // // // // Theater // // // // // // // //

exports.add_theater = catchAsync(async (req, res) => {
    await Theater.create(req.body);

    return res.status(201).json({
        status: 'success',
        data: 'Theater added successfullly',
    });
});

exports.get_theaters = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const theaters = await Theater.find()
        .select(-'createdAt -updatedAt -__v')
        .skip(skip)
        .limit(limit);

    return res.status(200).json({
        data: theaters,
    });
});

exports.theater_details = catchAsync(async (req, res) => {
    const id = req.params.id;
    const theater = await Theater.findById(id).select('-createdAt -updatedAt -__v');

    if (!theater) {
        return res.status(404).json({
            message: 'Theater not found',
        });
    }

    return res.status(200).json({
        data: theater,
    });
});

exports.update_theater = catchAsync(async (req, res) => {
    const theater_id = req.params.id;
    const theater = await Theater.findByIdAndUpdate(theater_id, req.body, {
        new: true,
    }).select('-createdAt -updatedAt -__v');
    return res.status(200).json({
        data: theater,
    });
});

exports.delete_theater = catchAsync(async (req, res) => {
    const movie_id = req.params.id;
    const movie = await Theater.findByIdAndDelete(movie_id);

    if (!movie) {
        return res.status(404).json({
            message: 'Theater not found',
        });
    }

    return res.status(200).json({
        message: 'Movie deleted successfully',
    });
});

// ---------------------------------------   Screen ----------------------------------------

exports.requireTheaterId = (req, res, next) => {
    const theater_id = req.body.theaterId;
    if (!theater_id) return res.status(400).json({ error: "Theater ID required" });
    next();
}


exports.get_screens = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const screen = await Screen.find({})
        .select('-createdAt -updatedAt -__v')
        .skip(skip)
        .limit(limit);

    return res.status(200).json({
        data: screen,
    });
});

exports.add_screen = catchAsync(async (req, res) => {
    const theater_id = req.body.theaterId;

    await Screen.create(req.body);
    await Theater.findByIdAndUpdate(
        theater_id,
        { $push: { screens: req.body._id } },
        { new: true }
    );

    return res.status(201).json({
        status: 'success',
        data: 'Screen added successfully',
    });
});

exports.screen_details = catchAsync(async (req, res) => {
    const id = req.params.id;
    const screen = await Screen.findById(id).select('-createdAt -updatedAt -__v');

    let statusCode = 200;
    let message = screen;

    if (!screen) {
        statusCode = 404;
        message = 'Screen not found';
    }
    return res.status(statusCode).json({
        data: message,
    });
});

exports.update_screen = catchAsync(async (req, res) => {
    const screen_id = req.params.id;
    const screen = await Screen.findByIdAndUpdate(screen_id, req.body, {
        new: true,
    }).select('-createdAt -updatedAt -__v');

    if (!screen) {
        return res.status(404).json({
            message: 'Screen not found',
        });
    }

    return res.status(201).json({
        status: 'success',
        data: screen,
    });
});

exports.delete_screen = catchAsync(async (req, res) => {
    const screen_id = req.params.id;
    const screen = await Screen.findByIdAndDelete(screen_id);

    if (!screen) {
        return res.status(404).json({
            message: 'Screen not found',
        });
    }

    return res.status(200).json({
        status: 'success',
        data: 'Screen deleted successfully',
    });
});


// ---------------------------------------   Show ----------------------------------------

exports.requiredDetails = (req, res, next) => {
    const theaterId = req.body.theaterId;
    const movie_id = req.body.movieId;
    const screen_id = req.body.screenId;

    if (!theaterId || !movie_id || !screen_id) {
        return res.status(400).json({ error: 'Theater Id, Movie Id and Screen Id required' });
    }
    next();
}

exports.add_show = catchAsync(async (req, res) => {
    await Show.create(req.body);
    return res.status(201).json({
        status: 'success',
        data: 'Show Created Successfully',
    });
});

exports.get_shows = catchAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const shows = await Show.find({}).select('-createdAt -updatedAt -__v').skip(skip).limit(limit);

    return res.status(200).json({
        data: shows,
    });
});

exports.show_details = catchAsync(async (req, res) => {
    const id = req.params.id;
    const show = await Show.findById(id).select('-createdAt -updatedAt -__v');

    let statusCode = 200;
    let message = show;

    if (!show) {
        statusCode = 400;
        message = 'Show not available';
    }

    return res.status(statusCode).json({
        data: message,
    });
});

exports.update_show = catchAsync(async (req, res) => {
    const show_id = req.params.id;
    const show = await Show.findByIdAndUpdate(show_id, req.body, {
        new: true,
    }).select('-createdAt -updatedAt -__v');
    return res.status(200).json({
        data: show,
    });
});

exports.delete_show = catchAsync(async (req, res) => {
    const show_id = req.params.id;
    await Show.findByIdAndDelete(show_id);
    return res.status(200).json({
        message: 'Show deleted successfully',
    });
});

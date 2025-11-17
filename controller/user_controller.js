const Movie = require('../model/movieSchema');
const Screen = require('../model/screenSchema');
const Show = require('../model/showSchema');
const Theater = require('../model/theaterSchema');
const catchAsync = require('../utils/asyncHandler');

exports.get_movie_details = catchAsync(async (req, res) => {
    const id = req.params.id;
    const movie = await Movie.findById(id).select('-createdAt -updatedAt -__v').lean();

    if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
    }

    const shows = await Show.find({ movieId : id })
        .populate("theaterId", "name location") 
        .select("_id startTime theaterId screenId")
        // .lean();

    console.log(shows, "shows");

    // Group by theater
    const grouped = {};
    for (const show of shows) {
        const theater = show.theaterId;
        const tId = theater._id.toString();

        if (!grouped[tId]) {
            grouped[tId] = {
                theater_id: tId,
                name: theater.name,
                location: theater.location,
                shows: []
            };
        }

        grouped[tId].shows.push({
            id: show._id,
            timing: show.startTime,
            screenId: show.screenId
        });
    }

    const theaters = Object.values(grouped);

    return res.status(200).json({
        status: 'success',
        movie,
        theaters,
    });
});

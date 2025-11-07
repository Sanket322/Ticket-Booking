const { z } = require("zod");

const createMovieSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  language: z.array(z.string()).min(1, "Language is required"),
  genres: z.array(z.string()).optional(),
  duration: z.string(),
  releaseDate: z.string().min(1),
  image: z.string().url().optional(),
  cast: z.array(z.string()).optional(),
  director: z.string().optional()
});

module.exports = { createMovieSchema };

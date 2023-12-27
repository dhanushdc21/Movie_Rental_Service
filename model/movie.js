const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Year: String,
  Rated: String,
  Released: String,
  Runtime: String,
  Genre: String,
  Director: String,
  Writer: String,
  Actors: String,
  Plot: String,
  Language: String,
  Country: String,
  Awards: String,
  Poster: String,
  Metascore: String,
  imdbRating: String,
  imdbVotes: String,
  imdbID: {
    type: String,
    unique: true,
    required: true,
  },
  Type: String,
  Response: String,
  Images: {
    type: [String], // Array of image URLs
    default: [],
  },
  rentaCost: {
    type: Number,
    required: true
  }
});

// Update the model definition
module.exports = mongoose.model('Movie', movieSchema, 'movie');


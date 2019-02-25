var express = require('express');
var router = express.Router();

const movieDetails = require('../data/movieDetails');

function requireJSON(req, res, next) {
  if (!req.is('appicaltion/json')) {
    res.json({ msg: "Content type must be application/json"})
  } else {
    next();
  };
};

router.param(('movieId'), (req, res, next) => {
  console.log('Route hit');
  next();
})

// GET top rated
router.get('/top_rated', (req, res, next) => {
  let page = req.query.page;
  if (!page) { page = 1 };
  const results = movieDetails.sort((a, b) => {
    return b.vote_average - a.vote_average;
  }) 
  const indexToStart = (page - 1) * 20;
  res.json(results.slice(indexToStart, indexToStart + 20));
});

/* GET movie page. */
router.get('/:movieId', (req, res, next) => {
  const movieId = req.params.movieId;
  const results =  movieDetails.find((movie) => {
    return movie.id == movieId;
  });
  if (!results) {
    res.json({
      msg: "Movie ID is not found",
      production_companies: []
    })
  } else {
    res.json(results);
  };
});

// POST rating
router.post('/:movieId/rating', requireJSON, (req, res, next) => {
  const movieId = req.params.movieId;
  const userRating = req.body.value;
  if (userRating < 0.5 || (userRating) > 10) {
    res.json({msg: "Rating must be between 0.5 and 10"})
  } else {
    res.json({msg: "Thanks for submitting your rating!", status_code: 200})
  };
});

// DELETE
router.delete('/:movieId/rating', requireJSON, (req, res, next) => {
  res.json({msg: "Rating deleted."});
});


module.exports = router;

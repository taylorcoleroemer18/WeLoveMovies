const service = require('./movies.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

// validation middleware
async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await service.read(movieId);
  
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({
    status: 404,
    message: `Product cannot be found.`,
  });
}

// http methods
function read(req, res, next) {
  res.json({ data: res.locals.movie });
}

async function list(req, res, next) {
  const data = await service.list(req.query.is_showing);
  res.json({ data });
}

module.exports = {
  read: [asyncErrorBoundary(movieExists), read],
  list: [asyncErrorBoundary(list)],
};
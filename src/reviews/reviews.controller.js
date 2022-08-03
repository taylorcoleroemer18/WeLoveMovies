const service = require('./reviews.service');
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

// validation middleware
async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await service.read(reviewId);

  if (review) {
    res.locals.review = review;
    return next();
  }
  next({
    status: 404,
    message: `Review cannot be found.`,
  });
}

// http requests
async function list(req, res, next) {
  const { movieId } = req.params;
  const data = await service.list(movieId);
  res.json({ data });
}

async function destroy(req, res, next) {
  const data = await service.delete(res.locals.review.review_id);
  res.status(204).json({ data });
}

async function update(req, res, next) {
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  const data = await service.update(updatedReview);

  res.json({ data });
}

module.exports = {
  list,
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
};
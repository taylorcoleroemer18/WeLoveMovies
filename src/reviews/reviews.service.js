const knex = require('../db/connection');

function getCritic(critic_id) {
  return knex('critics').select('*').where({ critic_id }).first();
}

async function _setCritics(review) {
  review.critic = await getCritic(review.critic_id);
  return review;
}

async function list(movie_id) {
  return knex('reviews')
    .where({ movie_id })
    .then((reviews) => Promise.all(reviews.map(_setCritics)));
}

async function read(reviewId) {
  return knex('reviews').where({ review_id: reviewId }).first();
}

async function update(review) {
  return knex('reviews')
    .where({ review_id: review.review_id })
    .update(review, '*')
    .then(() => read(review.review_id))
    .then(_setCritics);
}

function destroy(review_id) {
  return knex('reviews').where({ review_id }).del();
}

module.exports = {
  list,
  read,
  update,
  delete: destroy,
};
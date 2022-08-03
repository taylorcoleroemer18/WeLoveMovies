const knex = require('../db/connection');

function read(movie_id) {
  return knex('movies')
    .select()
    .where({ 'movies.movie_id': movie_id }).first()
  ;
}

function list(isShowing) {
  return knex('movies as m')
    .select('m.*')
    .modify((showing) => {
      if (isShowing) {
        showing
          .join('movies_theaters as mt', 'm.movie_id', 'mt.movie_id')
          .where({ 'mt.is_showing': true })
          .groupBy('m.movie_id')
        ;
      }
    })
  ;
}

module.exports = {
  read,
  list,
};
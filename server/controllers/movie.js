const DB = require('../utils/db.js')
module.exports = {
  movie: async ctx => {
    ctx.state.data = await DB.query("SELECT * FROM movie;")
  },
  detail: async ctx => {
    movieId = + ctx.params.id
    if (!isNaN(movieId)) {
      ctx.state.data = (await DB.query("SELECT * FROM movie where movie.id = ?", [movieId]))[0]
    } else {
      ctx.state.data = {}
    }
  },
}
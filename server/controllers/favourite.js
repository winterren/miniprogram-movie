const DB = require('../utils/db.js')
module.exports = {
  favourite: async ctx => {
    // let user = ctx.state.$wxInfo.userinfo.openId
    user = ctx.params.id
    // if (!isNaN(user)) {
      ctx.state.data = (await DB.query("SELECT * FROM m_favourite, m_comment, movie WHERE  m_comment.comment_id = m_favourite.comment_id AND m_comment.id = movie.id and m_favourite.user=?",[user]))
      // ctx.state.data = (await DB.query("SELECT m_comment.user AS `a`, m_favourite.user AS `b` FROM m_comment LEFT JOIN m_favourite ON m_comment.comment_id = m_favourite.comment_id WHERE m_favourite.user=?", [user]))
      // ctx.state.data = (await DB.query("SELECT * FROM m_comment where m_comment.user = ?", [user]))
    // } else {
    //   ctx.state.data = {}
    // }
  },
  add: async ctx => {
    
    let user = ctx.state.$wxInfo.userinfo.openId
    let commentId = ctx.request.body.comment_id

    if (!isNaN(commentId)) {
      await DB.query('INSERT INTO m_favourite(user, comment_id) VALUES (?, ?)', [user, commentId])
    }

    ctx.state.data = {}
  },
  del: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let commentId = ctx.request.body.comment_id
    if (!isNaN(commentId)) {
      await DB.query('DELETE FROM m_favourite WHERE m_favourite.user = ? AND m_favourite.comment_id = ?', [user, commentId])
    }

    ctx.state.data = {}
  },
  check: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    // let user = ctx.params.user
    let commentId = ctx.params.id
    // ctx.state.data = ctx.request.params
    // ctx.state.data = (await DB.query("SELECT * FROM m_favourite where m_favourite.comment_id = ?", [commentId]))
    ctx.state.data = (await DB.query('SELECT * FROM m_favourite where m_favourite.user = ? AND m_favourite.comment_id = ?', [user, commentId]))
  },
  
}

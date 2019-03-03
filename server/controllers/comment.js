const DB = require('../utils/db.js')
module.exports = {
  /**
   * 读取评论
   */
  // 读取指定电影评论
  comment: async ctx => {
    movieId = + ctx.params.id
    if (!isNaN(movieId)) {
      ctx.state.data = (await DB.query("SELECT * FROM m_comment where m_comment.id = ?", [movieId]))
    } else {
      ctx.state.data = {}
    }
    // ctx.state.data = await DB.query("SELECT * FROM m_comment;")
  },
  // 读取随机评论
  randomcomment: async ctx =>{
    ctx.state.data = await DB.query("select * from m_comment order by rand() LIMIT 1;")
  },
  // 读取指定单个评论
  commentdetail: async ctx => {
    id = + ctx.params.id
    if (!isNaN(id)) {
      ctx.state.data = (await DB.query("SELECT * FROM m_comment where m_comment.comment_id = ?", [id]))[0]
    } else {
      ctx.state.data = {}
    }
  },
  // 读取指定电影和用户的评论
  userscomment: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let movieId = ctx.params.id
    
    ctx.state.data = (await DB.query("SELECT * FROM m_comment WHERE m_comment.id = ? AND m_comment.user = ?", [movieId, user]))

  },
  // 指定用户的评论
  oneuserscomment: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId

    ctx.state.data = (await DB.query("SELECT * FROM m_comment, movie WHERE m_comment.id = movie.id AND m_comment.user = ?", [user]))

  },
  /**
   * 添加评论
   */
  add: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let username = ctx.state.$wxInfo.userinfo.nickName
    let avatar = ctx.state.$wxInfo.userinfo.avatarUrl

    let movieId = +ctx.request.body.moive_id
    let type = ctx.request.body.type
    let duration = ctx.request.body.duration
    let content = ctx.request.body.content || null

    if (!isNaN(movieId)) {
      await DB.query('INSERT INTO m_comment(user, username, avatar, content, id, type, duration) VALUES (?, ?, ?, ?, ?,  ?, ?)', [user, username, avatar, content, movieId, type, duration])
    }

    ctx.state.data = {}
  },
}
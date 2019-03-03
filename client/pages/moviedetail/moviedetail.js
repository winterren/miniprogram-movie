const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    test: 'testsuc',
    userscomment:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieDetail(options.id);

    // 登录
    app.checkSession({
      success: (userInfo) => {
        console.log('1')
      },
      error: (err) => {
        console.log(err)
      }
    });
    qcloud.setLoginUrl(config.service.loginUrl);
    qcloud.login({
      success: res => {
        this.setData({
          userInfo: res
        })
        // 查看是否被评论过
        this.checkUsersComment(this.data.movie.id)
      },
      fail: res => {
        console.log('fail');
        console.log(res);
      }
    })
  },

  // 查看用户是否对该电影有过评价
  checkUsersComment(id) {
    qcloud.request({
      url: config.service.getUsersComment + id,
      login: true,
      success: (res) => {
        if (!res.data.code) {
          this.setData({
            userscomment: res.data.data
          })
          console.log(res)
          console.log(this.data.userscomment.length);
        } else {
          console.log(res);
        }
      },
      fail: function (err) {
        console.log(err);
      },
    });
  },
  // 跳转到我的影评
  onTapMyComment: function () {
    console.log(this.data.userscomment)
    console.log(!this.data.userscomment)
    wx.navigateTo({
      url: '../commentdetail/commentdetail?commentid=' + this.data.userscomment[0].comment_id,
    })
  },

  // 获得单个电影
  getMovieDetail(id) {
    wx.showLoading({
      title: '电影加载中...',
    })
    qcloud.request({
      url: config.service.getMovieDetail + id,
      success: (res) => {
        wx.hideLoading();
        if (!res.data.code) {
          this.setData({
            movie: res.data.data
          })
          console.log(res.data.data);
        } else {
          wx.showToast({
            title: '电影数据加载失败！',
          })
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: '电影数据加载失败！',
        })
      }
    });
  },
  // 查看影评
  // 点击跳转文章函数
  onTapComment(res){
    console.log(1)
    console.log(this.data.test)
    console.log(this.data.movie)
    console.log(this.data.movie.id)
    wx.navigateTo({
      url: '../comment/comment?id=' + this.data.movie.id,
    })
  },
  // 添加评论
  onTapAddComment: function(res) {
    
    // if (this.data.userscomment.length>0){
    //   wx.showToast({
    //     title: '已经评论过啦',
    //   })
    //   return 0;
    // }
    wx.showActionSheet({
      itemList: ['文字', '语音'], //0,1
      success:(res)=>{
        wx.navigateTo({
          url: '../addcomment/addcomment?id=' + this.data.movie.id + '&type=' + res.tapIndex
        })
      },
      fail:(res)=>{
        console.log(res.errMsg)
      }
    })

  },
 
})
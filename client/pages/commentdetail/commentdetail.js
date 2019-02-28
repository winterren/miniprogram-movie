const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: [],
    movie:[],
    isFavourite:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.audioCtx = wx.createAudioContext('myAudio');
    app.checkSession({
      success: (userInfo) => {
        console.log('1')
      },
      error: (err) => {
        console.log(err)
      }
    });
    // app.checkSession({
    //   success: ( userInfo ) => {
    //     console.log(1);
    //     this.setData({
    //       userInfo: userInfo
    //     });
    //     // 获得影评
    //     this.getCommentDetail(options.commentid, () => {
    //       this.getMovieDetail(this.data.comment.id)
    //       // this.checkFavourite()
    //     });

    //   },
    //   error: (err) => {
    //     console.log(err)
    //   }
    // })
    qcloud.setLoginUrl(config.service.loginUrl);
    qcloud.login({
      success: res => {
        console.log(2);
        console.log(res.openId);

        this.setData({
          userInfo: res
        })
        // 获得影评
        this.getCommentDetail(options.commentid, () => {
          this.getMovieDetail(this.data.comment.id)
          this.checkFavourite()
        });
      },
      fail: res => {
        console.log('fail');
        console.log(res);
      }
    // console.log(options.commentid);
    // this.getCommentDetail(options.commentid, () => { 
    //   this.getMovieDetail(this.data.comment.id)
    //   this.checkFavourite()
    });

  },
  // 获得单个评论
  getCommentDetail(id,callback) {
    wx.showLoading({
      title: '评论加载中...',
    })
    qcloud.request({
      url: config.service.getCommentDetail + id,
      success: (res) => {
        wx.hideLoading();
        if (!res.data.code) {
          this.setData({
            comment: res.data.data
          })
        } else {
          wx.showToast({
            title: '评论数据加载失败！',
          })
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: '评论数据加载失败！',
        })
      },
      complete: ()=>{
        callback && callback();
      }
    });
  },
  // 播放影评声音
  onTapPlayVoice:function(){
    console.log(this.data.comment.content);
    this.audioCtx.setSrc(this.data.comment.content)
    this.audioCtx.play()
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
  
  // 检查是否收藏
  checkFavourite() {
    qcloud.request({
      url: config.service.checkFavourite + this.data.comment.comment_id,
      login: true,
      data: {
        user: this.data.userInfo.openId,
        comment_id: this.data.comment.comment_id
      },
      success: (res) => {
        console.log(this.data.userInfo.openId)
        console.log(this.data.comment.comment_id)
        console.log(res)
        if (!res.data.code) {
          // 标记是否收藏
          this.setData({
            isFavourite: !!res.data.data.length
          })
          
          console.log(this.data.isFavourite);
        } else {
          
        }
      },
      fail: function (err) {
        console.log(err);
      }
    });
  },
  // 添加评论
  onTapAddComment(res) {
    wx.showActionSheet({
      itemList: ['文字', '语音'], //0,1
      success: (res) => {
        wx.navigateTo({
          url: '../addcomment/addcomment?id=' + this.data.comment.id + '&type=' + res.tapIndex
        })
      },
      fail: (res) => {
        console.log(res.errMsg)
      }
    })
    // wx.navigateTo({
    //   url: '../addcomment/addcomment?id=' + this.data.comment.id
    // })
  },
  // 取消收藏
  onTapCancelFavourite(){
    wx.showLoading({
      title: '正在取消收藏'
    })
    qcloud.request({
      url: config.service.delFavourite,
      login: true,
      method: 'post',
      data: {
        comment_id: this.data.comment.comment_id
      },
      success: result => {
        wx.hideLoading()

        let data = result.data
        console.log(result)
        if (!data.code) {
          wx.showToast({
            title: '已经取消收藏'
          })
          this.setData({
            isFavourite: false
          })

          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        } else {
          wx.showToast({
            icon: 'none',
            title: '取消收藏失败'
          })
        }
      },
      fail: (res) => {
        console.log(res)
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '取消收藏失败'
        })
      }
    })

  },
  // 添加收藏
  onTapFavourite() {
    wx.showLoading({
      title: '正在收藏'
    })
    qcloud.request({
      url: config.service.addFavourite,
      login: true,
      method: 'PUT',
      data: {
        comment_id: this.data.comment.comment_id
      },
      success: result => {
        wx.hideLoading()

        let data = result.data
        console.log(result)
        if (!data.code) {
          wx.showToast({
            title: '收藏成功'
          })
          this.setData({
            isFavourite: true
          })

          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        } else {
          wx.showToast({
            icon: 'none',
            title: '收藏失败'
          })
        }
      },
      fail: (res) => {
        console.log(res)
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '收藏失败'
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
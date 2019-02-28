const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();
// pages/user/user.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // app.checkSession(
    //   { success: (user) => { console.log(user) } }
    // )
    // console.log(userInfo);
    // this.getFavourite(userInfo.openId);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.checkSession({
      success: ({ userInfo }) => {
        console.log(1);
        
        this.setData({
          userInfo: userInfo
        });
        // 获得收藏
        this.getFavourite(this.data.userInfo.openId);
        
      },
      error: (err) => {
        console.log(err)
      }
    })
    qcloud.setLoginUrl(config.service.loginUrl);
    qcloud.login({
      success: res => {
        console.log(2);
        console.log(res.openId);
        
        this.setData({
          userInfo: res
        })
        // 获得收藏
        this.getFavourite(this.data.userInfo.openId);
      },
      fail: res => {
        console.log('fail');
        console.log(res);
      }
    })
  },

  // 获得电影
  getFavourite(user) {
    wx.showLoading({
      title: '收藏加载中...',
    })
    qcloud.request({
      url: config.service.getFavourite+user,
      success: (res) => {
        wx.hideLoading();
        if (!res.data.code) {
          this.setData({
            movieList: res.data.data
          })
          console.log(this.data.movieList);
        } else {
          wx.showToast({
            title: '收藏加载失败！',
          })
        }
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          title: '收藏加载失败！',
        })
        console.log(err)
      },

    });
  },

  onTapLogin: function () {
    qcloud.setLoginUrl(config.service.loginUrl)
    qcloud.login({
      success: result => {
        console.log('success')
        console.log(result)
        this.setData({
          userInfo: result
        })
      },
      fail: result => {
        console.log('fail')
        console.log(result)
      }
    })
  },

  onTapComment: function(res){
    let comment_id = res.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../commentdetail/commentdetail?commentid=' + comment_id,
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
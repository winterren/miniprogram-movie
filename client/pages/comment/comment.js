const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getComment(options.id);
    console.log(this.data.comment);
  },
  // 获得评论
  getComment(id) {
    wx.showLoading({
      title: '评论加载中...',
    })
    qcloud.request({
      url: config.service.getComment+id,
      success: (res) => {
        wx.hideLoading();
        if (!res.data.code) {
          this.setData({
            comment: res.data.data
          })
          console.log(res.data.data);
          // console.log(this.data.comment[0].id);
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
    });
  },
  onTapBackHome(res) {
    wx.navigateTo({
      url: '../index/index',
    })
  },
  onTapComment(res) {
    console.log(res.currentTarget.dataset.commentid);
    wx.navigateTo({
      url: '../commentdetail/commentdetail?commentid=' + res.currentTarget.dataset.commentid
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
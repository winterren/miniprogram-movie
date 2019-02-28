const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {},
    test: 'testsuc'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieDetail(options.id);
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
    // console.log('tapped')
    // wx.navigateTo({
    //   url: '../addcomment/addcomment?id=' + this.data.movie.id
    // })
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
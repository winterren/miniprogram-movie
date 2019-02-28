const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
// pages/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment:[],
    movie:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRandomComment(function(){console.log('x')});
  },
  // 获得电影
  getMovie() {
    wx.showLoading({
      title: '电影加载中...',
    })
    qcloud.request({
      url: config.service.getMovie,
      success: (res) => {
        wx.hideLoading();
        if (!res.data.code) {
          this.setData({
            productList: res.data.data
          })
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
      },
      
    });
  },
  // 获得评论
  getComment(callback) {
    wx.showLoading({
      title: '评论加载中...',
    })
    qcloud.request({
      url: config.service.getComment,
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
      complete: () => {
        console.log(this.data.comment[0].id);
        this.getMovieDetail(this.data.comment[0].id);
        callback&&callback();
      },
    });
  },
  // 获得随机评论
  getRandomComment(callback) {
    wx.showLoading({
      title: '评论加载中...',
    })
    qcloud.request({
      url: config.service.getRandomComment,
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
      complete: () => {
        console.log(this.data.comment[0].id);
        this.getMovieDetail(this.data.comment[0].id);
        return res.data.data;
        callback && callback();
      },
    });
  },
  // 获得单个电影
  getMovieDetail(id) {
    wx.showLoading({
      title: '电影加载中...',
    })
    qcloud.request({
      url: config.service.getMovieDetail+id,
      success: (res) => {
        wx.hideLoading();
        if (!res.data.code) {
          this.setData({
            movie: res.data.data
          })
          console.log(res.data.data);
          console.log(this.data.movie.title);
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
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
// pages/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: [],
    movie: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获得随机评论-->回调-->得到该评论对应电影
    this.getRandomComment(
        () => { 
          this.getMovieDetail(this.data.comment[0].id);
        }
      );
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
        callback && callback();
      },
    });
  },
  // 获得单个评论
  getCommentDetail(id) {
    wx.showLoading({
      title: '评论加载中...',
    })
    qcloud.request({
      url: config.service.getCommentDetail+id,
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
    });
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
        
        callback && callback();
      },
    });
  },

  // 点击跳转文章函数
  onTapPost(res) {
    wx.navigateTo({
      url: '../moviedetail/moviedetail?id=' + this.data.comment[0].id,
    })
  },
  // 点击跳转热门函数
  onTapHot(res) {
    wx.navigateTo({
      url: '../movie/movie',
    })
  },
  // 点击跳转我的函数
  onTapMy(res) {
    wx.navigateTo({
      url: '../my/my',
    })
  },
  onTapComment(res){
    wx.navigateTo({
      url: '../commentdetail/commentdetail?commentid=' + this.data.comment[0].comment_id
    })
  },

})
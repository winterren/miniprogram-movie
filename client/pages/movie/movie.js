// client/pages/movie/movie.js
const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovie();
  },
  // 监听下拉刷新
  onPullDownRefresh() {
    this.onLoad();
    console.log("PullDownFresh");
    wx.stopPullDownRefresh();
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
            movieList: res.data.data
          })
          console.log(this.data.movieList);
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

  onTapMovie(res){
    let id = res.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '../moviedetail/moviedetail?id=' + id,
    })
  },

})
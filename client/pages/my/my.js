const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();
// pages/user/user.js
Page({

  data: {
    // 选项卡相关
    tabs: ['我的收藏', '我发布的'],// 导航菜单栏
    curIdx: 0,// 当前导航索引
    scrollHeight: 0, //滚动高度 = 设备可视区高度 -  导航栏高度
    list: [],// 内容区列表
    // 登录相关
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
    // 100为导航栏swiper-tab 的高度
    this.setData({
      scrollHeight: wx.getSystemInfoSync().windowHeight - (wx.getSystemInfoSync().windowWidth / 750 * 420),
    })
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
        this.checkOneUsersComment();
      },
      fail: res => {
        console.log('fail');
        console.log(res);
      }
    })
  },
  // 导航条相关
  //导航条点击切换
  clickTab: function (e) {
    this.setData({
      curIdx: e.currentTarget.dataset.current
    })
  },
  //导航条滑动切换
  swiperTab: function (e) {
    this.setData({
      curIdx: e.detail.current
    });
  },
  // 查看用户的评价
  checkOneUsersComment() {
    qcloud.request({
      url: config.service.getOneUsersComment,
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

})
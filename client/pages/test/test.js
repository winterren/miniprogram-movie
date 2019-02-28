const qcloud = require('../../vendor/wafer2-client-sdk/index.js');
const config = require('../../config.js');
const app = getApp();

const recorderManager = wx.getRecorderManager()
const options = {
  duration: 10000,
  sampleRate: 44100,
  numberOfChannels: 1,
  encodeBitRate: 192000,
  format: 'aac',
  frameSize: 50
}




Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempRecord:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
    // this.audioCtx.setSrc('http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46')


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
        console.log(2);
        console.log(res);
        this.setData({
          userInfo: res
        })
      },
      fail: res => {
        console.log('fail');
        console.log(res);
      }
    })
  },

  // 播放
  // audioPlay() {
  //   this.audioCtx.play()
  // },
  // audioPause() {
  //   this.audioCtx.pause()
  // },
  // audio14() {
  //   this.audioCtx.seek(14)
  // },
  // audioStart() {
  //   this.audioCtx.seek(0)
  // },
  // 录音
  recordPlay:function(){
    this.audioCtx.setSrc(this.data.newRecord.data.imgUrl)
    this.audioCtx.play()
  },
  recordStart: ()=>{
    recorderManager.start(options)
    recorderManager.onStart(() => {
      console.log('recorder start')
    })
  },
  recordStop: function(){
    recorderManager.stop()
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      const { tempFilePath } = res
      this.setData({
        tempRecord: res
      });


    });
    
  },
  recordUpload:function(){
    wx.uploadFile({
      url: config.service.uploadUrl, //接口地址
      filePath: this.data.tempRecord.tempFilePath,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: {
        user: 'test'
      },
      success:(res)=>{
        const data = res.data
        // do something
        console.log(res)
        this.setData({
          newRecord: JSON.parse(res.data)
        });
        console.log(this.data.newRecord);
        console.log(this.data.newRecord.data.imgUrl)
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
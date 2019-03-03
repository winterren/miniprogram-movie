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
    recordstatus: 'unrecord',
    recordtext:'开始录音',
    temprecord:null,
    // type: 1,
    movie: {},
    commentValue: '',
    isEditing: true,
    newRecordDuration:0,
    newRecord:{data:{}}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadType(options.type);
    this.getMovieDetail(options.id);
    
    this.audioCtx = wx.createAudioContext('myAudio');
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
  // 监听键盘输入
  onInput(event) {
    this.setData({
      commentValue: event.detail.value.trim()
    })
  },
  // 录音
  onTapRecord:function(){

    if(this.data.recordstatus=='unrecord'){
      recorderManager.start(options)
      recorderManager.onStart(() => {
        console.log('recorder start')
        this.setData({
          recordstatus: 'recording',
          recordtext: '结束录音'
        });
      })
    }
    else{
      recorderManager.stop()
      recorderManager.onStop((res) => {
        console.log('recorder stop', res)
        const { tempFilePath } = res
        this.setData({
          recordstatus: 'unrecord',
          recordtext: '重新录音',
          temprecord: res
        });
      })
    }
  },
  // 区分文字、语音
  loadType: function (number) {
    this.setData({
      type: number
    });
  },
  // 播放预览
  onTapPlayTempVoice:function(){
    this.audioCtx.setSrc(this.data.temprecord.tempFilePath)
    this.audioCtx.play()
  },
  // 添加评论
  addComment: function(event) {
    let tempcontent = this.data.commentValue
    // console.log(tempcontent)
    if ((!this.data.type) && (!tempcontent)) return
    if (this.data.type==1){
      tempcontent = this.data.newRecord.data.imgUrl
    }
    console.log(this.data.type)
    console.log(tempcontent)

    wx.showLoading({
      title: '正在发表评论'
    })
    qcloud.request({
      url: config.service.addComment,
      login: true,
      method: 'PUT',
      data: {
        type: this.data.type,
        content: tempcontent,
        duration: this.data.newRecordDuration,
        moive_id: this.data.movie.id
      },
      success: result => {
        wx.hideLoading()

        let data = result.data
        console.log(result)
        if (!data.code) {
          wx.showToast({
            title: '发表评论成功'
          })

          setTimeout(() => {
            this.checkUsersComment(this.data.movie.id)
          }, 1500)
          setTimeout(() => {
            wx.navigateTo({
              url: '../commentdetail/commentdetail?commentid=' + this.data.userscomment[0].comment_id,
            })
          }, 2500)
        } else {
          wx.showToast({
            icon: 'none',
            title: '发表评论失败'
          })
        }
      },
      fail: (res) => {
        console.log(res)
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '发表评论失败'
        })
      }
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
  onTapComment(res) {
    console.log(1)
    console.log(this.data.test)
    console.log(this.data.movie)
    console.log(this.data.movie.id)
    wx.navigateTo({
      url: '../comment/comment?id=' + this.data.movie.id,
    })
  },
  // 切换编辑状态(上传录音)
  toggleEditing(){
    if (this.data.userscomment.length>0){
      wx.showToast({
        title: '只能评论一次哦',
      })
      return 0;
    }
    if ((this.data.type == 1) && (!this.data.temprecord)){
      wx.showToast({
        title: '请先录音！',
      })
      return 0;
    }
    // 上传录音
    if(this.data.type==1){
      wx.uploadFile({
        url: config.service.uploadUrl, //接口地址
        filePath: this.data.temprecord.tempFilePath,
        name: 'file',
        header: {
          'content-type': 'multipart/form-data'
        },
        formData: {
          user: 'test'
        },
        success: (res) => {
          const data = res.data
          // do something
          console.log(res)
          this.setData({
            newRecord: JSON.parse(res.data),
            newRecordDuration: Math.ceil(this.data.temprecord.duration/1000)
          });
          console.log(this.data.newRecord);
          console.log(this.data.newRecordDuration);
          console.log(this.data.newRecord.data.imgUrl)
        }
      })
    }
    this.setData({
      isEditing: !this.data.isEditing
    })
  },

})
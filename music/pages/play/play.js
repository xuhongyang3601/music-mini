// pages/play/play.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    audio:{},
    lyric:{},
    time:"",
    count:0,
    i:0,
    duration:0,
    pic:"",
    begin:true,
    page:0,
    trackIds:[]
  },
  // 播放与暂停
  play(){
    if(this.data.audio.paused){
      this.data.audio.play()
      this.setData({
       begin:true 
      })
    }else{
      this.data.audio.pause()
      this.setData({
        begin:false
      })
    }
  },
  // 拖拽滑块,跳转到对应的进度
  seek(e){
    // 将当前歌曲进度调整到与滑块数据相同的位置
    this.data.audio.seek(e.detail.value)
    // 获取当前播放时间
    let current = this.data.audio.currentTime
    // 遍历所有歌词
    this.data.lyric.forEach((elem,i,arr)=>{
      // 如果当前的播放时间与所有歌词中的某个时间一致时
      if(current==elem.time){
        // 将页面中的歌词位置调整到当前拖拽后的歌词位置
        this.setData({
          i
        })
      }
    })
  },
  music(id){
    this.data.audio.src = `https://music.163.com/song/media/outer/url?id=${id}`;
    wx.request({
      url: `https://musicapi.leanapp.cn/song/detail?ids=${id}`,
      success:res=>{
        let pic = res.data.songs[0].al.picUrl
        this.setData({
          pic
        })
        wx.setNavigationBarTitle({
          title: res.data.songs[0].name,
        })
      }
    })
    let  get_duration=() =>{
      if (this.timer)
          clearTimeout(this.timer);
      if (this.data.audio.duration>0) {
          this.setData({
            duration:Math.floor(this.data.audio.duration)
          })
      } else {
          this.timer = setTimeout(get_duration, 1000)
      }
    }
    this.data.audio.onCanplay(get_duration)
    wx.request({
      url: `https://api.imjad.cn/cloudmusic/?type=lyric&id=${id}`,
      success:res=>{
        let lyric = res.data.lrc.lyric;
        lyric=lyric.split("\n")
        let lyricObj=[];
        let reg = /\[[0-9:\.]+\]+/gi;
        // 获取每一句歌词的时间
        lyric.forEach(elem=>{
          let lyric = {}
          let text = elem.slice(elem.lastIndexOf("]")+1)
          let timer
          do {
            timer = reg.exec(elem)
            if(timer){
              let time = timer[0].substr(1,elem.indexOf("]")-1);
              time = parseInt(time.slice(0,time.indexOf(":")) * 60 + parseInt(time.slice(time.indexOf(":")+1)));
              lyric.time = time
              lyric.text = text
            }
          } while (timer);    
          lyricObj.push(lyric)

        })
        // lyricObj对象的属性是歌词对应的时间,属性值是对应时间的歌词
        this.setData({
          lyric:lyricObj
        })
        wx.hideLoading({
          success:()=>{
            this.data.audio.play()
            this.setData({
              begin:true
            })
          }
        })
      }
    })
    // timeUpdate会在当前播放时间更新(播放时)触发
    this.data.audio.onTimeUpdate(()=>{
      // 获取当前音频的最大时间
      // current是当前播放时间
      let current = parseInt(this.data.audio.currentTime);
      this.setData({
        time:current
      })
      this.data.lyric.forEach((elem,i,arr)=>{
        if(current==elem.time){
          this.setData({
            i
          })
        }
      })
    })
  },
  next(){
    if(this.data.page==this.data.trackIds.length){
      this.data.page = 0
    }
    this.setData({
      page:++this.data.page,
      i:0
    })
    this.music(this.data.trackIds[this.data.page].id)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let audio = wx.createInnerAudioContext();
    wx.showLoading({
      title: '加载中',
    })
    this.setData({audio});
    if(app.globalData.trackIds.length){
      // 如果trackIds有数据的话表名想要播放全部
      let trackIds = app.globalData.trackIds;
      this.setData({
        trackIds
      })
      this.music(this.data.trackIds[this.data.page].id)
    }else{   
      let id = options.id
      this.music(id)
    }
  //   // 当播放结束时停止转动
    audio.onEnded(()=>{
      if(this.data.trackIds.length){
        this.next()
      }
      this.setData({
        begin:false
      })
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
    this.data.audio.pause()
    app.globalData.trackIds = []
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
const app = getApp();
// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songs:[],
    kw:"",
    page:0,
    research:[],
    hasMore:true,
    canSearch:false
  },
  lower(){
    if(!this.data.canSearch){
      this.data.page++
      if(this.data.hasMore){
        wx.showLoading({
          title: '加载中...',
        })
        wx.request({
          url: `https://musicapi.leanapp.cn/search?keywords= ${this.data.kw}&offset=${(this.data.page-1)*30}`,
          success:res=>{
            let songs = this.data.songs.concat(res.data.result.songs);
            this.setData({
              songs,
              hasMore:res.data.result.hasMore
            })
            wx.hideLoading()
          }
        })
      }
    }
  },
  request(kw){
    wx.request({
      url: `https://musicapi.leanapp.cn/search?keywords= ${kw}&limit=10`,
      success:res=>{
        let research=res.data.result.songs;
        this.setData({
          research
        })
      }
    })
  },
  search(){
    
    this.setData({
      canSearch:true
    })
    if(this.data.kw.trim()){
      this.request(this.data.kw)
    }
  },
  research(e){
    if(!e.detail.value){
      wx.navigateTo({
        url: '/pages/search/search',
      })
    }else if(this.data.kw.trim()){
      this.request(e.detail.value)
      this.setData({
        kw:e.detail.value
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户点击的详细歌曲
    wx.request({
      url: `https://musicapi.leanapp.cn/search?keywords= ${options.name}`,
      success:res=>{
        let songs = res.data.result.songs
        this.setData({
          songs,
          kw:options.name,
          hasMore:res.data.result.hasMore
        })
      }
    })
    // 创建数组保存当前用户所有搜索过的内容
    if(wx.getStorageSync('history')){
      app.globalData.history = wx.getStorageSync('history')
      app.globalData.history.push(options.name);
      // 搜索同一首歌曲时不能继续将同一首歌添加到历史记录
      app.globalData.history = [...new Set(app.globalData.history)]
    }else{
      app.globalData.history.push(options.name)
    }
    wx.setStorageSync('history', app.globalData.history);
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
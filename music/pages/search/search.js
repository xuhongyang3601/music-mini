const app = getApp()
// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songs:[],
    kw:"",
    list:[],
    history:[]
  },
  search(e){
    // 根据用户输入的内容获取搜索结果
    let kw = e.detail.value
    if(kw.trim()){
      wx.request({
        url: `https://musicapi.leanapp.cn/search?keywords= ${kw}&limit=10`,
        success:res=>{
          let songs = res.data.result.songs
          this.setData({
            songs,
            kw
          })
        }
      })
    }else{
      this.setData({
        songs:[]
      })
    }
  },
  delete(){
    wx.removeStorageSync('history')
    this.setData({
      history:[]
    })
    app.globalData.history=[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '搜索',
    })
    // 获取每日新歌推荐列表
    wx.request({
      url: 'https://musicapi.leanapp.cn/personalized/newsong',
      success:res=>{
        this.setData({
          list:res.data.result
        })
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
    // 获取历史记录
    if(app.globalData.history.length){
      this.setData({
        history:app.globalData.history
      })
    }else{
      this.setData({
        history:wx.getStorageSync('history')
      })
    }
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
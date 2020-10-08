// pages/list/list.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songs:[],
    imgs:[
      "/img/icon/chn.jpg",
      "/img/icon/popular.jpg",
      "/img/icon/ballad.jpg",
      "/img/icon/electronic.jpg",
      "/img/icon/personality.png",
      "/img/icon/light.jpg",
      "/img/icon/ACG.jpg"
    ],
    name:"",
    index:0,
    trackIds:[]
  },
  playAll(){
    app.globalData.trackIds = this.data.trackIds
    wx.navigateTo({
      url: '/pages/play/play?trackIds',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title:"加载中..."
    })
    this.setData({
      name:options.name,
      index:options.index
    })
    wx.request({
      url: `https://musicapi.leanapp.cn/playlist/detail?id=${options.id}`,
      success:res=>{
        let songs = []
        let trackIds = res.data.playlist.trackIds;
        this.setData({
          trackIds
        })
        trackIds.forEach((elem,i)=>{
          wx.request({
            url: `https://musicapi.leanapp.cn/song/detail?ids=${elem.id}`,
            success:res=>{
              if(i==9){
                wx.hideLoading()
              }
              songs.push(res.data.songs[0])
              this.setData({
                songs
              })
            }
          })
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
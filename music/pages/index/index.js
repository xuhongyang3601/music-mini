//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    list:[],
    imgs:[
      "/img/icon/chn.jpg",
      "/img/icon/popular.jpg",
      "/img/icon/ballad.jpg",
      "/img/icon/electronic.jpg",
      "/img/icon/personality.png",
      "/img/icon/light.jpg",
      "/img/icon/ACG.jpg"
    ]
  },
  changePage(){
    wx.setNavigationBarTitle({
      title: '歌单',
    })
    wx.setNavigationBarColor({
      backgroundColor: '#9fa5d5',
      frontColor: '#ffffff',
    })
  },
  goSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  onLoad: function (options) {
    let music = []
    // 获取首页歌单的数据
    wx.request({
      url: 'https://musicapi.leanapp.cn/playlist/hot',
      success:res=>{
        res.data.tags.splice(2,1)
        res.data.tags.splice(6,2)
        let list = res.data.tags
        list.forEach(elem=>{
          wx.request({
            url: `https://musicapi.leanapp.cn/playlist/detail?id=${elem.id}`,
            success:res=>{
              elem.tarcks = res.data.playlist.tracks.splice(0,3);
              this.setData({
                list
              })              
            }
          })
        })
      }
    })
  },
  getUserInfo: function(e) {
    
  }
})

// pages/dianpingyoujiang/dpyj.js
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fullStar: '../../images/icon-start-full.png',
    emptyStar: '../../images/icon-start-empty.png',
    userStars: [
      '../../images/icon-start-full.png',
      '../../images/icon-start-empty.png',
      '../../images/icon-start-empty.png',
      '../../images/icon-start-empty.png',
      '../../images/icon-start-empty.png'
    ],
    numScores:[
      0,1,2,3,4,5,6,7,8,9,10
    ],
    dpyjDatas:[
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tableInfo=wx.getStorageSync('tableInfo')
    console.log("tableInfo=",tableInfo);
    var that=this;

    var bindTemplate=function(datas){

    }

     wx.request({
       url: config.service.remarkTemplate,
       method:'GET',
       success:function(res){
         console.log("get remarkTemplate res=",res);
         that.setData({
           dpyjDatas:res.data.data
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
  
  },
  // 星星点击事件
  starTap: function (e) {
    console.log("starTap e = ",e);
    var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
    var tempUserStars = this.data.userStars; // 暂存星星数组
    var len = tempUserStars.length; // 获取星星数组的长度
    for (var i = 0; i < len; i++) {
      if (i <= index) { // 小于等于index的是满心
        tempUserStars[i] = '../../images/icon-start-full.png'
      } else { // 其他是空心
        tempUserStars[i] = '../../images/icon-start-empty.png'
      }
    }
    // 重新赋值就可以显示了
    this.setData({
      userStars: tempUserStars
    })
  },

  /**  评论框的输入 */
  inputExtraDesc:function(e){
    console.log("input =  ", e.detail.value)
  },
  bindFormSubmit: function (e) {
    console.log("form detail = ",e.detail.value)
  }
})
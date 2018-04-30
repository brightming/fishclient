// pages/fish/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
        user_scope_location:false,
        user_scope_userinfo:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //判断用户授权
	wx.showModal({
        title: '需要您的位置信息',
        content: '需要您的位置信息',
      })
    //var authorize_location = false
  //while (authorize_location==false) {
      //wx.showModal({
      //  title: '需要您的位置信息',
      //  content: '需要您的位置信息',
     // })
     // wx.getSetting({
     //   success: function (res) {
      //    consloe.log('---', res.authSetting['scope.userLocation'])
      //    authorize_location = res.authSetting['scope.userLocation']
      //  }
     // })
   // }
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
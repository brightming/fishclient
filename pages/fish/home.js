// pages/fish/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_scope_location: false,
    user_scope_userinfo: false,
    userInfo:{}
  },

  doit: function () {
    console.log('do it');
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '海门鱼仔'
    })
  },

  authorizeUserLocation(options) {
    console.log('options=', options)
    var that = this;
    that.options = options;
    wx.authorize({
      scope: 'scope.userLocation',
      success(res) {
        console.log('get authorize success-->', res)
        console.log('that.options==', that.options)
        if (that.options.success) {
          console.log("has success function")
          that.options.success();
        }
      }, fail(res) {
        console.log("authorize fail-->", res)
        //}, complete(res) {
        console.log("authorize complete-->", res)
        wx.getSetting({
          success: function (res) {
            console.log("getsetting result=", res);
            console.log('---', res.authSetting['scope.userLocation'])
            //authorize_location = res.authSetting['scope.userLocation'];
            if (!res.authSetting['scope.userLocation']) {
              //判断用户授权
              wx.showModal({
                title: '需要您的位置信息',
                content: '需要您的位置信息',
                success: function (res) {
                  if (res.confirm) {
                    console.log("try to let user setting scope.userLocation");
                    wx.openSetting({
                      scope: ['scope.userLocation'],
                      success: (res) => {
                        if (res.authSetting["scope.userLocation"]) {
                          //继续验证
                          console.log("userlocation is ok,continue another authorize");
                          if (options.success) {
                            options.success();
                          }
                        } else {
                          //拒绝授权，重新来过
                          wx.redirectTo({
                            url: 'home'
                          })
                        }
                      }
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                    wx.redirectTo({
                      url: 'home'
                    })
                  }
                }
              });
            }
          }
        });
      }
    })
  },

  authorizeUserInfo(options) {
    console.log("in authorizeUserInfo")
    wx.getSetting({
      success: function (res) {
        console.log("getsetting userInfo result=", res);
        console.log('---', res.authSetting['scope.userInfo'])
        //authorize_location = res.authSetting['scope.userLocation'];
        if (!res.authSetting['scope.userInfo']) {
          //判断用户授权
          wx.showModal({
            title: '需要您的基本信息',
            content: '需要您的基本信息',
            success: function (res) {
              if (res.confirm) {
                console.log("try to let user setting scope.userInfo");
                wx.openSetting({
                  //scope: 'scope.userInfo',
                  success: (res) => {
                    if (res.authSetting["scope.userInfo"]) {
                      //继续验证
                      console.log("userinfo is ok,continue another authorize");
                      if (options.success) {
                        options.success();
                      }
                    } else {
                      //拒绝授权，重新来过
                      wx.redirectTo({
                        url: 'home'
                      })
                    }
                  }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
                wx.redirectTo({
                  url: 'home'
                })
              }
            }
          });
        }else{
          console.log("userinfo authorize ok");
          if (options.success) {
            options.success();
          }
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //先请求授权再说
    wx.authorize({
      scope: 'scope.userInfo',
    })
    wx.authorize({
      scope: 'scope.userLocation',
    })

    var that = this;
    this.authorizeUserLocation({
      success: function () {
        console.log("in authorizeUserLocation options success function")
        that.authorizeUserInfo({
          success:function(){
            wx.getUserInfo({
              success: function (res) {
                var userInfo = res.userInfo
                var nickName = userInfo.nickName
                var avatarUrl = userInfo.avatarUrl
                var gender = userInfo.gender //性别 0：未知、1：男、2：女
                var province = userInfo.province
                var city = userInfo.city
                var country = userInfo.country
                that.setData({
                  userInfo:userInfo,
                  nickname:userInfo.nickName
                })

                wx.getLocation({
                  type: 'wgs84',
                  success: function (res) {
                    var latitude = res.latitude
                    var longitude = res.longitude
                    var speed = res.speed
                    var accuracy = res.accuracy
                    
                    
                    console.log('user lat=',latitude,',lng=',longitude,',speed=',speed,
                    ',accuracy=',accuracy)

                    //缓存用户信息
                    wx.setStorageSync('userPosition', res);
                  }
                })
                //缓存用户信息
                wx.setStorageSync('userInfo', userInfo)

              }
            })
          }
        });
      }
    });
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

  checkauthorize:function(){
    wx.openSetting({
      
    })
  }
})
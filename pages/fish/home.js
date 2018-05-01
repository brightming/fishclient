// pages/fish/home.js
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    logged: false
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
        } else {
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

   var applyAuth=function(options){
     console.log("in applyAuth......");
     //先请求授权再说，不然在后面的opensetting中会看不到相关的权限。
     wx.authorize({
       scope: 'scope.userInfo',
       fail: function () {
         console.log("in authorize scope.userInfo fail!")
         wx.redirectTo({
           url: 'home'
         })
       },
       success: function () {
         console.log("in authorize scope.userInfo success!")
         wx.authorize({
           scope: 'scope.userLocation',
           fail: function () {
             console.log("in authorize scope.userLocation fail!")
             wx.redirectTo({
               url: 'home'
             })
           },
           success: function () {
             console.log("in authorize scope.userLocation success!")
             wx.authorize({
               scope: 'scope.camera',
               success: function () {
                 console.log("in authorize scope.camera success!")
                 options.cb(options.obj);
               },
               fail: function () {
                 console.log("in authorize scope.camera fail!")
                 wx.redirectTo({
                   url: 'home'
                 })
               }
             })
           }
         })
       }
     })
   }

   var pagePointer=this;
   var that=this;
   var checkAuthAgain = function (pagePointer){
     console.log("in checkAuthAgain.....");
     var that = pagePointer;
     this.authorizeUserLocation({
       success: function () {
         console.log("in authorizeUserLocation options success function")
         that.authorizeUserInfo({
           success: function () {
             wx.getUserInfo({
               withCredentials: true,
               success: function (res) {
                 console.log("authorizeUserInfo cb userinfo=", res.userInfo)
                 var userInfo = res.userInfo
                 var nickName = userInfo.nickName
                 var avatarUrl = userInfo.avatarUrl
                 var gender = userInfo.gender //性别 0：未知、1：男、2：女
                 var province = userInfo.province
                 var city = userInfo.city
                 var country = userInfo.country
                 that.setData({
                   userInfo: userInfo,
                   nickName: userInfo.nickName
                 })

                 wx.getLocation({
                   type: 'wgs84',
                   success: function (res) {
                     var latitude = res.latitude
                     var longitude = res.longitude
                     var speed = res.speed
                     var accuracy = res.accuracy


                     console.log('user lat=', latitude, ',lng=', longitude, ',speed=', speed,
                       ',accuracy=', accuracy)

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
   }

    //用户登录
    if (this.data.logged) return
    qcloud.login({
      success(result) {
        if (result) {
          util.showSuccess('登录成功')
          console.log('login  success', result.avatarUrl)
          that.setData({
            userInfo: result,
            logged: true
          })
          wx.setStorageSync('userInfo', result)

          applyAuth({ cb: checkAuthAgain, obj: pagePointer });//申请授权
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              util.showSuccess('登录成功')
              console.log("not first time.", result.data.data.avatarUrl)
              pagePointer.setData({
                userInfo: result.data.data,
                logged: true
              })
              wx.setStorageSync('userInfo', result.data.data)
              console.log("userInfo=", result.data.data)
              applyAuth({ cb: checkAuthAgain, obj: pagePointer });//申请授权

            },

            fail(error) {
              util.showModel('请求失败', error)
              console.log('request fail', error)
              wx.navigateBack({
                delta: -1
              })
            }
          })
        }
      },

      fail(error) {
        util.showModel('登录失败', error)
        console.log('登录失败', error)
        wx.navigateBack({
          delta: -1
        })
      }
    })

    
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

  //---测试，看当前申请的情况----//
  checkauthorize: function () {
    wx.openSetting({

    })
  },


  //----获取用户最新作的点评----//


  //--点评有奖-----//
  /*
  先要求用户扫描桌面二维码，扫描解析成功，才进入到点评有奖的页面。
  再次进入点评有奖页面时，如果上一次扫描时间小于20分钟，则不用再扫描
  
  缓存的信息:
  scanTime:最近扫描的时间
  tableInfo:二维码解析出来的桌位信息
  */
  clickDpyj: function () {
    var date = new Date();//当前时间
    var hasScanBef=false;
    console.log('current time:', util.formatTime(date))
    var lastdate = new Date('1970/01/01 00:00:00')
    try {
      var tmplastdate = wx.getStorageSync('scanTime')
      if (tmplastdate) {
          lastdate=tmplastdate;
          hasScanBef=true;
      }else{
        console.log('no scan before')
      }
    } catch (e) {
      console.log(e);
    }

    //----计算时间差值--//
    //计算分钟为单位的时间差
    var date3 = date.getTime() - lastdate.getTime();   //时间差的毫秒数 
    //计算出相差天数  
    var days = Math.floor(date3 / (24 * 3600 * 1000))
    //计算出小时数  
    var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数  
    var hours = Math.floor(leave1 / (3600 * 1000))
    //计算相差分钟数  
    var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数  
    console.log('days=', days, ',deltahours=', hours, 'deltamin=', leave2);

    //上一次扫描时间距离现在大于20分钟
    if (leave2>20){
      console.log('should scan again');
      // 只允许从相机扫码
      wx.scanCode({
        onlyFromCamera: true,
        success: (res) => {
          console.log(res)
          this.show = "结果:" + res.result + "二维码类型:" + res.scanType + "字符集:" + res.charSet + "路径:" + res.path;
          console.log(this.show);
          var params = util.parseUriParam(res.result);
          console.log("params=",params);
          //检查参数
          if(util.checkTableQrCodeParam(params)){
            //后台判断用户是否已经点评过 TODO
            wx.setStorageSync('tableInfo', params);
            wx.setStorageSync('scanTime', date)
            wx.navigateTo({
              url: '../dianpingyoujiang/dpyj',
            })

          }
        }
      })
    }else{//已经在近时间距离扫描过了
      //用户是否已经点评
      wx.request({
        url: config.service.latestRemark,        
        success(res){
             //如果对同样的桌台，近距离时间做了点评，则不能再点评
             if(0){

             }else{//否则可以跳入点评页面
               wx.navigateTo({
                 url: '../dianpingyoujiang/dpyj',
               })
             }
        }
      })
     
    }
  }
})
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
    numScores:[
      0,1,2,3,4,5,6,7,8,9,10
    ],
    dpyjDatas: [
    ],
    dpyjStars: [//二维数组，每个数组对应点评模板的一项，让各自可以独立开来，在得到dpyjDatas的时候创建

    ],
    dpyjScores: [//对应的分数

    ],
    extraDesc: ''//额外的评价
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tableInfo=wx.getStorageSync('tableInfo')
    console.log("tableInfo=",tableInfo);
    var that=this;


    var createdata=function(datas) {
      var dpsj = [];
      var itemIcons = [];
      var scores = [];
      var dataLen=datas.length;
      //构建训练列表的字段，除了后台返回的数据外，再加上：currentScore,iconList,scoreList，其中iconList,socreList是
      //用于在循环中显示图标或数字用的
      for (var i = 0; i < dataLen;i++) {
        dpsj.push(datas[i]);
        dpsj[i].currentScore=1;//默认当前得分是1
        dpsj[i].iconList=[];
        dpsj[i].scoreList=[];
        dpsj[i].viewId = 'view-' + datas[i].id; //字符串id，用于页面的id
        var len = datas[i].level;
        for (var k = 0; k < len; k++) {
          dpsj[i].scoreList.push(k);
          if(k==0){
            dpsj[i].iconList.push(that.data.fullStar);
            continue;
          }
          dpsj[i].iconList.push(that.data.emptyStar);
        }
      }
      console.log("dpsj=", dpsj);
      console.log("itemIcons=", itemIcons);
      console.log("scores=", scores);

      that.setData({
        dpyjDatas: dpsj //评价
      })
      console.log("dpyjDatas=", that.data.dpyjDatas)
     }

     wx.request({
       url: config.service.remarkTemplate,
       method:'GET',
       success:function(res){
         console.log("get remarkTemplate res=",res);
         console.log("remarktemp data=",res.data.data)
        // that.setData({
        //   dpyjDatas:res.data.data
        // })
         createdata(res.data.data);
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
    console.log("starTap e = ", e);
    var viewId = e.currentTarget.id;
    var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
    console.log("viewId=", viewId, "index=", index)
    var tempDatas = this.data.dpyjDatas; // 暂存星星数组

    //看是对应的哪一个点评模板
    var dataLen = tempDatas.length;
    var dataIdx=0;
    for(var i=0;i<dataLen;i++){
      if (tempDatas[i].viewId == viewId){
        dataIdx=i;
        break;
      }
    }
    console.log("find data index=",dataIdx);
    var len = tempDatas[dataIdx].iconList.length; // 获取星星数组的长度
    for (var i = 0; i < len; i++) {
      if (i <= index) { // 小于等于index的是满心
        tempDatas[dataIdx].iconList[i] = '../../images/icon-start-full.png'
      } else { // 其他是空心
        tempDatas[dataIdx].iconList[i] = '../../images/icon-start-empty.png'
      }
    }
    //当前分数
    tempDatas[dataIdx].currentScore=index+1;//index是从0开始的，但是对于星星类型的评分，是从1开始的

    // 重新赋值就可以显示了
    console.log("星星点评后 tempDatas=", tempDatas)   
    this.setData({
      dpyjDatas: tempDatas
    })
    console.log("星星点评后 this.data.dpyjDatas=", this.data.dpyjDatas)
  },

  /**  评论框的输入 */
  inputExtraDesc:function(e){
    console.log("input =  ", e.detail.value)
    this.setData({
      extraDesc: e.detail.value
    })
  },
  bindFormSubmit: function (e) {
    console.log("bindFormSubmit dpyjScores=", this.data.dpyjScores);
    console.log("form detail = ", e.detail.value)
    var tableInfo = wx.getStorageSync('tableInfo')
    var userInfo = wx.getStorageSync('userInfo')
    console.log("form submit userInfo=",userInfo)

    var scores=[]  
    var len = this.data.dpyjDatas.length
    for(var i=0;i<len;i++){
      var one={};
      one.remarkTempId = this.data.dpyjDatas[i].id;
      one.score = this.data.dpyjDatas[i].currentScore;
      scores.push(one)
    }
    var datas = {
      'extraDesc': this.data.extraDesc,
      'scores': scores,
      'storeId':tableInfo.storeId,
      'tableId':tableInfo.tableId,
      'openId': userInfo.openId
    }
    console.log("form data:", datas)
    wx.request({
      url: config.service.addRemark,
      data: datas,
      header: {
        'Content-Type': 'application/json'
      },
      method: "POST", 
      success: function (res) {
        console.log(res.data)
      }
    })  
  }
})
// pages/tousu/tousu.js
var util = require('../../utils/util.js')
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    extraDesc: '',
    img_arr: [],
    default_jia_paths: '../../images/u2233.png',
    tousuTemplates: [
      {
        'id': 1,
        'content': '菜不好吃',
        'select': 0,
        'type': 'default'
      },
      {
        'id': 2,
        'content': '上菜慢',
        'select': 0,
        'type': 'default'
      },
      {
        'id': 3,
        'content': '服务差',
        'select': 0,
        'type': 'default'
      },
      {
        'id': 4,
        'content': '环境吵',
        'select': 0,
        'type': 'default'
      },
      {
        'id': 5,
        'content': '厨房脏',
        'select': 0,
        'type': 'default'
      },
      {
        'id': 6,
        'content': '感觉不舒服',
        'select': 0,
        'type': 'default'
      }
    ]

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var bindtousuTemplates = function () {

    };

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

  changeSelect: function (e) {
    console.log("changeSelect.e=", e);
    var btn_id = e.currentTarget.id;
    var tempDatas = this.data.tousuTemplates;
    console.log("btn_id=", btn_id, ",tempDatas=", tempDatas);
    for (var idx in tempDatas) {
      var obj = tempDatas[idx];
      console.log("obj=", obj, ",obj.id=", obj.id, ",btn_id=", btn_id);
      if (obj.id == btn_id) {
        console.log("find btn array");
        if (obj.type == 'default') {
          obj.type = 'warn';
        } else {
          obj.type = 'default';
        }
        break;
      }
    }
    this.setData({
      tousuTemplates: tempDatas
    })
  },

  /**
   * 增加图片
   */
  chooseimage: function () {
    var that = this;
    if (this.data.img_arr.length < 1) {
      wx.chooseImage({
        sizeType: ['original'],////original原图，compressed压缩图
        sizeType: ['original', 'compressed'],
        success: function (res) {
          //判断是否有重复
          for (var i in that.data.img_arr) {
            console.log("i=", i, ",res.tempFilePaths=", res.tempFilePaths,
              ",that.data.img_arr[i]=", that.data.img_arr[i]);
            if (res.tempFilePaths == that.data.img_arr[i]) {
              wx.showToast({
                title: '不能上传重复图片',
                icon: 'loading',
                duration: 2000
              });
              return;
            }
          }
          that.setData({
            img_arr: that.data.img_arr.concat(res.tempFilePaths)
          })
        }
      })
    } else {
      wx.showToast({
        title: '最多上传三张图片',
        icon: 'loading',
        duration: 3000
      });
    }
  },
  /**  评论框的输入 */
  inputExtraDesc: function (e) {
    console.log("input =  ", e.detail.value)
    this.setData({
      extraDesc: e.detail.value
    })
  },

  /**
   * 表单提交
   */
  bindFormSubmit: function (e) {
    console.log("bindFormSubmit dpyjScores=", this.data.dpyjScores);
    console.log("form detail = ", e.detail.value)
    var tableInfo = wx.getStorageSync('tableInfo')
    var userInfo = wx.getStorageSync('userInfo')

    var openId = userInfo.openId;
    var tableId = tableInfo.tableId;
    var storeId = tableInfo.storeId;
    var datas = []
    for (var i in this.data.tousuTemplates) {
      if (this.data.tousuTemplates[i].type == 'warn') {
        datas.push(this.data.tousuTemplates[i].id);
      }
    }
    console.log('datas=', datas);
    var extraDesc = this.data.extraDesc.trim();

    console.log("datas.size=", datas.length, ",extraDesc=[", extraDesc, ']');

    if (datas.length == 0 && extraDesc == '') {
      console.log("no content");
      wx.showModal({
        title: '请选择要投诉的内容',
        content: '请选择要投诉的内容',
      })

      return;
    }


    //---begin to submit datas--//
    console.log("begin to submit");

    var formData = {
      'tousu': datas,
      'extraDesc': extraDesc,
      'openId': openId,
      'storeId': storeId,
      'tableId': tableId
    };
    var filePath = '';
    if (this.data.img_arr.length > 0) {
      filePath = this.data.img_arr[0];
      wx.uploadFile({
        url: config.service.addTousu,
        formData: formData,
        name: 'upict',
        filePath: filePath,
        header: {
          'content-type': 'multipart/form-data'
        },
        success: function (e) {
          console.log(res);
        }
      });
    }else{
      //no pict
      wx.request({
        url: config.service.addTousuNoPict,
        data: formData,
        header: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        success: function (res) {
          console.log(res.data)
        }
      }) 
    }
  },


})
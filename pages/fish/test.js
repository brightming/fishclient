
Page({
  data: {
    userStars: [
      '../../images/icon-start-full.png',
      '../../images/icon-start-empty.png',
      '../../images/icon-start-empty.png',
      '../../images/icon-start-empty.png',
      '../../images/icon-start-empty.png'
    ],
    conts:[{ content: '上菜水平' },
    { content: '服务态度' },
    { content: '菜品' }
    ],
    dpyjDatas: [
    ],
    dpyjStars:[//二维数组，每个数组对应点评模板的一项，让各自可以独立开来，在得到dpyjDatas的时候创建

    ],
    dpyjScores:[//对应的分数

    ],
    extraDesc:''//额外的评价
  },
  onLoad: function () {
    console.log('page on load')
    wx.getSetting({
      success: (res) => {
        console.log("res=", res)
        var cont
        for (var r in res.authSetting) {
          console.log("---", r, '=', res.authSetting[r])
          cont = cont + r + "=" + res.authSetting[r] + "\n"
        }
        this.setData({
          authorDetails: cont
        })
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success: () => {
              console.log('yes')
            }
          })
        }
      }
    })
  },
  openSetting: function () {
    wx.openSetting({
      success: (res) => {
        console.log("res=", res)
        var cont
        for (var r in res.authSetting) {
          console.log("---", r, '=', res.authSetting[r])
          cont = cont + r + "=" + res.authSetting[r] + "\n"
        }
        this.setData({
          authorDetails: cont
        })
      }
    })
  },
  authorize: function () {
    wx.authorize({
      scope: 'scope.address',
      success(res) {
        console.log('get authorize')
      }
    })
  },

  // 星星点击事件
  starTap: function (e) {
    console.log("starTap e = ", e);
    var itemId=e.currentTarget.id;
    var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
    console.log("itemId=", itemId, "index=", index)

    var tempUserStars = this.data.dpyjStars; // 暂存星星数组
    this.data.dpyjScores[itemId]=index+1; //设置得分

    var len = tempUserStars[itemId].length; // 获取星星数组的长度

    for (var i = 0; i < len; i++) {
      if (i <= index) { // 小于等于index的是满心
        tempUserStars[itemId][i] = '../../images/icon-start-full.png'
      } else { // 其他是空心
        tempUserStars[itemId][i] = '../../images/icon-start-empty.png'
      }
    }
    // 重新赋值就可以显示了
    console.log("星星点评后 this.data.dpyjScores=", this.data.dpyjScores)
    this.setData({
      dpyjStars: tempUserStars
    })
  },

  createdata:function(){
    var conts=this.data.conts;
    console.log("conts=",this.data.conts)
    var dpsj=[];
    var itemstars=[];
    var scores=[];
    for(var i in this.data.conts){
      console.log("i=",i,",content=",this.data.conts[i].content);
      dpsj.push({ 'id': i, 'seq': i, "content": this.data.conts[i].content});
      scores.push(1);
      itemstars.push([]);
      var len = this.data.userStars.length;
      for (var k=0;k<len;k++){
        itemstars[i].push(this.data.userStars[k]);
      }
    }
    console.log("dpsj=",dpsj);
    console.log("itemstars=", itemstars);
    console.log("scores=", scores);

    this.setData({
      dpyjDatas:dpsj,
      dpyjStars:itemstars,
      dpyjScores:scores
    })
    console.log("dpyjScores=", this.data.dpyjScores)
  },

  /**  评论框的输入 */
  inputExtraDesc: function (e) {
    console.log("input =  ", e.detail.value)
    this.setData({
      extraDesc:e.detail.value
    })
  },
  bindFormSubmit: function (e) {
    console.log("bindFormSubmit dpyjScores=", this.data.dpyjScores);
    console.log("form detail = ", e.detail.value)
    var datas={
      'extraDesc':this.data.extraDesc,
      'scores':this.data.dpyjScores
    }
    console.log("form data:",datas)
  }
})
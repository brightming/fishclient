
Page({
  onLoad:function(){
    console.log('page on load')
    wx.getSetting({
      success:(res)=>{
        console.log("res=",res)
        var cont
        for (var r in res.authSetting ){
            console.log("---",r,'=',res.authSetting[r])
            cont=cont+r+"="+res.authSetting[r]+"\n"
        }
        this.setData({
          authorDetails:cont
        })
        if(!res.authSetting['scope.userLocation']){
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
  openSetting:function(){
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
  authorize:function(){
    wx.authorize({
      scope: ['scope.writePhotosAlbum','scope.address'],
      success(res){
        console.log('get authorize') 
      }
    })
  }
})
//app.js
App({
  onLaunch: function () {//监听初始化
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow: function() {},//监听显示（进入前台）
  onHide: function() {},//监听隐藏（进入后台：按home离开微信）
  onError: function(msg) {},//监听错误
  //如下为自定义的全局方法和全局变量
  globalFun:function() {},
  setlocal: function (id, val) {
    wx.setStorageSync(id, val);//API：设置本地缓存
  },
  globalData: {
    userInfo: null,
    curid: "CN101010100",
    version: "1.0"
  }
})
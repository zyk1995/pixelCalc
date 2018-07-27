//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    idb: "back",
    idc: "clear",
    idt: "toggle",
    idadd: "＋",
    id9: "9",
    id8: "8",
    id7: "7",
    idj: "－",
    id6: "6",
    id5: "5",
    id4: "4",
    idx: "×",
    id3: "3",
    id2: "2",
    id1: "1",
    iddiv: "÷",
    id0: "0",
    idd: ".",
    ide: "＝",
    screenData: "0",
    operaSymbo: { "＋": "+", "－": "-", "×": "*", "÷": "/", ".": "." },
    lastIsOperaSymbo: false,
    iconType: 'waiting_circle',
    iconColor: 'white',
    arr: [],
    logs: []
  },
  onLoad: function () {//监听加载
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在     Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onReady: function() {},//监听初次渲染完成
  onShow: function() {},//监听显示
  onHide: function() {},//监听隐藏
  onUnload: function() {}, //监听卸载
  onPullDownRefresh: function() {},//监听下拉
  onReachBottom: function() {},//监听上拉触底
  onShareAppMessage: function() {},//监听右上角分享
  //如下为自定义的事件处理函数（视图中绑定的）
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  clickMe: function (event) {
    console.log(event)
  },
  viewTap: function() {
    console.log("点击事件")
  },
  clickBtn: function (event) {
    var id = event.target.id;

    switch(id) {
      case this.data.idb:
        var data = this.data.screenData;
        if (data == "0") {
          return;
        }
        data = data.substring(0, data.length - 1);
        if (data == "" || data == "－") {
          data = 0;
        }
        this.setData({ "screenData": data });
        this.data.arr.pop();
      case this.data.idc:
        this.setData({ "screenData": "0" });
        this.data.arr.length = 0;
      case this.data.idt:
        var data = this.data.screenData;
        if (data == "0") {
          return;
        }
        var firstWord = data.charAt(0);
        if (data == "－") {
          data = data.substr(1);
          this.data.arr.shift();
        } else {
          data = "－" + data;
          this.data.arr.unshift("－");
        }
        this.setData({ "screenData": data });
      case this.data.ide:
        var data = this.data.screenData;
        if (data == "0") {
          return;
        }
        //eval是js中window的一个方法，而微信页面的脚本逻辑在是在JsCore中运行，JsCore是一个没有窗口对象的环境，所以不能再脚本中使用window，也无法在脚本中操作组件                 
        //var result = eval(newData);           

        var lastWord = data.charAt(data.length);
        if (isNaN(lastWord)) {
          return;
        }

        var num = "";

        var lastOperator = "";
        var arr = this.data.arr;
        var optarr = [];
        for (var i in arr) {
          if (isNaN(arr[i]) == false || arr[i] == this.data.idd || arr[i] == this.data.idt) {
            num += arr[i];
          } else {
            lastOperator = arr[i];
            optarr.push(num);
            optarr.push(arr[i]);
            num = "";
          }
        }
        optarr.push(Number(num));
        var result = Number(optarr[0]) * 1.0;
        console.log(result);
        for (var i = 1; i < optarr.length; i++) {
          if (isNaN(optarr[i])) {
            if (optarr[1] == this.data.idadd) {
              result += Number(optarr[i + 1]);
            } else if (optarr[1] == this.data.idj) {
              result -= Number(optarr[i + 1]);
            } else if (optarr[1] == this.data.idx) {
              result *= Number(optarr[i + 1]);
            } else if (optarr[1] == this.data.iddiv) {
              result /= Number(optarr[i + 1]);
            }
          }
        }
        //存储历史记录
        this.data.logs.push(data + result);
        wx.setStorageSync("calclogs", this.data.logs);

        this.data.arr.length = 0;
        this.data.arr.push(result);

        this.setData({ "screenData": result + "" });
      default:
        if (this.data.operaSymbo[id]) { //如果是符号+-*/
          if (this.data.lastIsOperaSymbo || this.data.screenData == "0") {
            return;
          }
        }

        var sd = this.data.screenData;
        var data;
        if (sd == 0) {
          data = id;
        } else {
          data = sd + id;
        }
        this.setData({ "screenData": data });
        this.data.arr.push(id);

        if (this.data.operaSymbo[id]) {
          this.setData({ "lastIsOperaSymbo": true });
        } else {
          this.setData({ "lastIsOperaSymbo": false });
        }
    }

  },
})

//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()


Page({
  data: {
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    imgUrl: '',

    bonds:0
  },

  onLoad: function(e){
    this.data.logged = e.logged;
    if (e.logged) {
      this.setData({ 
        userInfo: app.globalData.userInfo,
        logged: e.logged
      })
    }else{
      //this.autoGetUserInfo();
    }
    
  },
  onShow: function () {
    this.autoGetBonds();
  },

  bindGetUserInfo: function () {
    //this.autoGetUserInfo()
    var that=this
    util.showBusy('正在登录')
    wx.getUserInfo({
      success(userResult) {
        util.showSuccess('登录成功');
        //console.log('userResult', userResult)
        that.setData({ userInfo: userResult.userInfo, logged: true })
        app.globalData.userInfo = that.data.userInfo;
      },
      fail(userError) {
        util.showModel('错误提示','获取用户信息失败');
      }
    });

/*
    wx.login({
      success(res) {
        if (res.code) {
          // 发起网络请求
          wx.request({
            //url: 'http://127.0.0.1:8000/wxBond/login',
            url: 'https://testdjango.arjen.club/wxBond/login',
            data: {
              code: res.code
            },
            success: loginResult => {
              //console.log('loginResult',loginResult)
              wx.getUserInfo({
                success(userResult) {
                  util.showSuccess('登录成功');
                  //console.log('userResult', userResult)
                  that.setData({ userInfo: userResult.userInfo, logged: true })
                  app.globalData.userInfo = that.data.userInfo;
                },
                fail(userError) {
                  util.showModel('获取用户信息失败');
                }
              });
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    */
  },
  bindItemsTap: function () {
    var tmp = app.globalData.userInfo;
    if (!tmp && typeof (tmp) != "undefined" && tmp != 0) return;
    wx.navigateTo({
      url: '../items/items'
    })
  },
  bindWalletTap: function () {
    var tmp = app.globalData.userInfo;
    if (!tmp && typeof (tmp) != "undefined" && tmp != 0) return;
    wx.navigateTo({
      url: '../wallet/wallet'
    })
  },
  // 获得用户信息
  autoGetUserInfo: function () {
    if (this.data.logged) return

    util.showBusy('正在登录')

    const session = qcloud.Session.get()

    if (session) {//session false
      qcloud.loginWithCode({
        success: res => {
          this.setData({ userInfo: res, logged: true })
          app.globalData.userInfo=this.data.userInfo;
          this.autoGetBonds();
          util.showSuccess('登录成功');
        },
        fail: err => {
          console.error(err)
          //util.showModel('登录错误', err.message)
          this.login();
        }
      })
    } else {
      this.login();
    }
  },
  login : function(){
    qcloud.login({
      success: res => {
        this.setData({ userInfo: res, logged: true })
        app.globalData.userInfo = this.data.userInfo;
        this.autoGetBonds();
        util.showSuccess('登录成功');
      },
      fail: err => {
        console.error(err)
        util.showModel('登录错误', err.message)
      }
    })
  },
  autoGetBonds: function(){
    var tmp = app.globalData.userInfo;
    if (!tmp && typeof (tmp) != "undefined" && tmp != 0) {
      return;
    }
    var that=this; 

    //wx.cloud.init();
    //const db = wx.cloud.database();
    //const bond = db.collection('bond');
    const db = app.globalData.db;
    const bond = app.globalData.col;

    bond.where({
      _openid: this.data.userInfo.openId
    }).get({
      success: function (res) {
        app.globalData.itemList=res.data;
        that.setData({
          bonds:app.sumBonds()
        })
      }
    })
  },

  bindRequest: function () {
    /*
    var that = this
    wx.request({
      //url: 'http://127.0.0.1:8000/wxBond/login',
      url: 'https://testdjango.arjen.club/wxBond/login',
      data: {
        //interface: 'wxBondLogin',
        x: 'wx1',
        y: '2',
        z: '3'
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
        that.setData({
          requestBackDetail: "res.data.detail",
        })
      }
    })
    */
  },

//==============================================================================================================
  bindaddRecord: function () {
    //wx.cloud.init();
    //const db = wx.cloud.database();
    //const bond = db.collection('bond');
    const db = app.globalData.db;
    const bond = app.globalData.col;
    bond.add({
      // data 字段表示需新增的 JSON 数据
      /*
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        description: "learn cloud database",
        due: new Date("2018-09-01"),
        tags: [
          "cloud",
          "database"
        ],
        // 为待办事项添加一个地理位置（113°E，23°N）
        location: new db.Geo.Point(113, 23),
        done: false
      }
      */
      data: {
        Text: "目标二",
        DateStart: new Date(Date.now()),
        DateStop: new Date("2019-03-01"),
        LowLimit: 40,
        Bonds: 10.5,
        DatesChecked: []
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    })
  },

  // 切换是否带有登录态
  switchRequestMode: function (e) {
    this.setData({
      takeSession: e.detail.value
    })
    this.doRequest()
  },
  doRequest: function () {
    util.showBusy('请求中...')
    var that = this
    var options = {
      url: config.service.requestUrl,
      login: true,
      success(result) {
        util.showSuccess('请求成功完成')
        console.log('request success', result)
        that.setData({
          requestResult: JSON.stringify(result.data)
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    }
    if (this.data.takeSession) {  // 使用 qcloud.request 带登录态登录
      qcloud.request(options)
    } else {    // 使用 wx.request 则不带登录态
      wx.request(options)
    }
  },

  // 上传图片接口
  doUpload: function () {
    var that = this

    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        util.showBusy('正在上传')
        var filePath = res.tempFilePaths[0]

        // 上传图片
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: filePath,
          name: 'file',

          success: function (res) {
            util.showSuccess('上传图片成功')
            console.log(res)
            res = JSON.parse(res.data)
            console.log(res)
            that.setData({
              imgUrl: res.data.imgUrl
            })
          },

          fail: function (e) {
            util.showModel('上传图片失败')
          }
        })

      },
      fail: function (e) {
        console.error(e)
      }
    })
  },
  // 预览图片
  previewImg: function () {
    wx.previewImage({
      current: this.data.imgUrl,
      urls: [this.data.imgUrl]
    })
  },

  // 切换信道的按钮
  switchChange: function (e) {
    var checked = e.detail.value

    if (checked) {
      this.openTunnel()
    } else {
      this.closeTunnel()
    }
  },
  openTunnel: function () {
    util.showBusy('信道连接中...')
    // 创建信道，需要给定后台服务地址
    var tunnel = this.tunnel = new qcloud.Tunnel(config.service.tunnelUrl)

    // 监听信道内置消息，包括 connect/close/reconnecting/reconnect/error
    tunnel.on('connect', () => {
      util.showSuccess('信道已连接')
      console.log('WebSocket 信道已连接')
      this.setData({ tunnelStatus: 'connected' })
    })

    tunnel.on('close', () => {
      util.showSuccess('信道已断开')
      console.log('WebSocket 信道已断开')
      this.setData({ tunnelStatus: 'closed' })
    })

    tunnel.on('reconnecting', () => {
      console.log('WebSocket 信道正在重连...')
      util.showBusy('正在重连')
    })

    tunnel.on('reconnect', () => {
      console.log('WebSocket 信道重连成功')
      util.showSuccess('重连成功')
    })

    tunnel.on('error', error => {
      util.showModel('信道发生错误', error)
      console.error('信道发生错误：', error)
    })

    // 监听自定义消息（服务器进行推送）
    tunnel.on('speak', speak => {
      util.showModel('信道消息', speak)
      console.log('收到说话消息：', speak)
    })

    // 打开信道
    tunnel.open()

    this.setData({ tunnelStatus: 'connecting' })
  },

  /**
   * 点击「发送消息」按钮，测试使用信道发送消息
   */
  sendMessage() {
    if (!this.data.tunnelStatus || !this.data.tunnelStatus === 'connected') return
    // 使用 tunnel.isActive() 来检测当前信道是否处于可用状态
    if (this.tunnel && this.tunnel.isActive()) {
      // 使用信道给服务器推送「speak」消息
      this.tunnel.emit('speak', {
        'word': 'I say something at ' + new Date(),
      });
    }
  },

  /**
   * 点击「关闭信道」按钮，关闭已经打开的信道
   */
  closeTunnel() {
    if (this.tunnel) {
      this.tunnel.close();
    }
    util.showBusy('信道连接中...')
    this.setData({ tunnelStatus: 'closed' })
  },

  addRecord: function () {
    //wx.cloud.init();
    const db = wx.cloud.database();
    const bond = db.collection('bond');
    db.collection('bond').add({
      // data 字段表示需新增的 JSON 数据
      /*
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        description: "learn cloud database",
        due: new Date("2018-09-01"),
        tags: [
          "cloud",
          "database"
        ],
        // 为待办事项添加一个地理位置（113°E，23°N）
        location: new db.Geo.Point(113, 23),
        done: false
      }
      */
      data: {
        Name: "目标一",
        DateStart: new Date(Date.now()),
        DateStop: new Date("2019-09-01"),
        LowLomit: 360,
        DatesChecked: []
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    })
  },
  getRecord: function () {
    //wx.cloud.init();
    //const db = wx.cloud.database();
    //const bond = db.collection('bond');
    const db = app.globalData.db;
    const bond = app.globalData.col;

    bond.where({
      _openid: this.data.userInfo.openId
    }).get({
      success: function (res) {
        console.log("res.data._id:");
        console.log(res.data[0]);
        return res.data[0]._id;
      }
    })
  },
  updateRecord: function () {

    console.log("update")

    //wx.cloud.init();
    //const db = wx.cloud.database();
    //const bond = db.collection('bond');
    const db = app.globalData.db;
    const bond = app.globalData.col;

    const _ = db.command
    bond.doc("W_VgQ5SXoyWmaEi7").update({
      data: {
        DatesChecked: _.push(new Date(Date.now()))
      },
      success: function (res) {
        console.log("su");
        console.log(res)
      },
      fail: function (e) {
        console.log("fa");
        console.log(e);
      }
    })
  }

})

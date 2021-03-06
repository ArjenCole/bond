// client/pages/approve/approve.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    friendName: "",
    friendAvatarUrl:"",
    itemText:"",
    itemId:"",

    userInfo: {},
    logged: false,

    item: {},
    approved: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);
    this.setData({
      friendName: options.userName,
      friendAvatarUrl: options.AvatarUrl,
      itemId: options._id,
    })
    this.autoGetUserInfo();
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

  bindApproveTap: function () {
    //wx.cloud.init();
    //const db = wx.cloud.database();
    //const bond = db.collection('bond');
    const db = app.globalData.db;
    const bond = app.globalData.col;

    var that=this;
    var pushStr = util.formatDate(new Date()) + this.data.userInfo.openId;
    const _ = db.command
    bond.doc(this.data.itemId).update({
      data: {
        Approvals: _.push(pushStr)
      },
      success: function (res) {
        console.log(res);
        that.setData({
          approved: true
        })
      },
      fail: function (e) {
        console.log(e);
      }
    })
  },

  bindDenyTap: function () {
    var tName = this.data.friendName;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要否决 ' + tName + ' 的补卡申请么？',
      confirmColor: '#79899b',
      success: function (res) {
        if (res.confirm) {
          wx.showModal({
            title: '提示',
            content: '已否决 ' + tName + ' 的补卡申请，将跳转到你的bond首页',
            showCancel: false,
            confirmColor: '#79899b',
            success: function (res) {
              if (res.confirm) {
                that.toIndex();
              } 
            }
          })
        } else if (res.cancel) {
          
        }
      }
    })
  },

  bindStartTap: function () {
    this.toIndex();
  },
  
  toIndex: function () {
    wx.redirectTo({
      url: '/pages/index/index?logged=true'
    })
  },
  
  autoGetUserInfo: function () {
    if (this.data.logged) return

    util.showBusy('正在登录')

    const session = qcloud.Session.get()

    if (session) {
      qcloud.loginWithCode({
        success: res => {
          this.setData({ userInfo: res, logged: true })
          app.globalData.userInfo = this.data.userInfo
          this.getApprovals();
          util.showSuccess('登录成功')
        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    } else {
      qcloud.login({
        success: res => {
          this.setData({ userInfo: res, logged: true })
          app.globalData.userInfo = this.data.userInfo
          this.getApprovals();
          util.showSuccess('登录成功')
        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    }


  },

  getApprovals:function(){
    var that = this;

    //wx.cloud.init();
    //const db = wx.cloud.database();
    //const bond = db.collection('bond');
    const db = app.globalData.db;
    const bond = app.globalData.col;

    bond.where({
      _id: this.data.itemId
    }).get({
      success: function (res) {
        var tItem = res.data[0];
        that.setData({
          approved: that.contains(tItem.Approvals, util.formatDate(new Date()) + that.data.userInfo.openId),                
          itemText: tItem.Text,
        })
      }
    })
  },

  contains: function (arr, obj) {
    if (typeof (arr) == "undefined") return false;
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) {
        return true;
      }
    }
    return false;   
  }
})
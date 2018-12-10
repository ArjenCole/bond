// client/pages/items/items.js
const app = getApp()
var util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    color: "window",
    userInfo: {},
    dateToday: {},
    itemList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      //dateToday: util.formatDate(new Date())
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
    //wx.cloud.init();
    const db = wx.cloud.database();
    const db_bond = db.collection('bond');
    
    db_bond.where({
      _openid: app.globalData.userInfo.openId,
    }).get().then(res=>{
      app.globalData.itemList=res.data;
      this.setData({
        itemList: util.fullFillItemList(app.globalData.itemList),
      })
    })
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

  bindItemCheck: function (e) {
    var currentItem = e.currentTarget.dataset.item;
    this.updateRecord_check(currentItem._id,this);    
  },
  bindItemBalance: function (e) {
    var that = this;
    var currentItem = e.currentTarget.dataset.item;
    var ending = "";
    var doneTimes = currentItem.DatesChecked.length;
    if (doneTimes >= currentItem.LowLimit) {
      ending = "成功完成既定目标，能够获得全额保证金退还，共计退还" + util.refund(currentItem) + "元";
    }
    else {
      ending = "未能完成既定目标，根据打卡次数比例，共计退还保证金" + util.refund(currentItem) + "元";
    }

    wx.showModal({
      title: '结算提示',
      content: '此目标期内应完成' + currentItem.LowLimit + "次，" + ending,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.updateRecord_balance(currentItem._id, that);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  bindItemClick: function (e) {
    var currentItem = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../item/item?ID=' + currentItem._id
    })
  },
  bindNewItem: function (e) {
    wx.navigateTo({
      url: '../newItem/newItem'
    })
  },

  updateRecord_check: function (pID,thisPage) {
    //wx.cloud.init();
    const db = wx.cloud.database();
    const bond = db.collection('bond');

    const _ = db.command
    bond.doc(pID).update({
      data: {
        DatesChecked: _.push(new Date(Date.now()))
      },
      success: function (res) {
        thisPage.getRecord(pID, bond, thisPage);
      },
      fail: function (e) {
        console.log(e);
      }
    })
  },
  updateRecord_balance: function (pID, thisPage) {
    //wx.cloud.init();
    const db = wx.cloud.database();
    const bond = db.collection('bond');

    const _ = db.command
    bond.doc(pID).update({
      data: {
        Bonds:0,
      },
      success: function (res) {
        thisPage.getRecord(pID, bond, thisPage);
      },
      fail: function (e) {
        console.log(e);
      }
    })
  },
  getRecord: function (pID, pbond, thisPage){
    pbond.where({
      _openid: pID
    }).get({
      success: function (res) {
        app.globalData.itemList = res.data;
        thisPage.setData({
          itemList: util.fullFillItemList(app.globalData.itemList)
        })
      }
    })
  },
})
// pages/item/item.js
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.setData({
      item: util.fullFillItem(app.getItem(e.ID)),
    });
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

  bindItemCheck: function () {
    this.data.item.DatesChecked.push(new Date());
    var tItem = util.fullFillItem(this.data.item);
    this.updateRecord();
    this.setData({
      item: tItem,
    });
  },

  bindItemBalance: function () {
    var that = this;
    var currentItem = this.data.item;
    var doneTimes = currentItem.DatesChecked.length;
    var ending = "";
    if (doneTimes >= currentItem.LowLimit) {
      ending = "成功完成既定目标，能够获得全额保证金退还，共计退还" + currentItem.Bonds + "元";
    }
    else {
      ending = "未能完成既定目标，根据打卡次数比例，共计退还保证金" + currentItem.Bonds * doneTimes / currentItem.LowLimit + "元";
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

  updateRecord: function () {
    var pID = this.data.item._id;
    wx.cloud.init();
    const db = wx.cloud.database();
    const bond = db.collection('bond');

    const _ = db.command
    bond.doc(pID).update({
      data: {
        DatesChecked: _.push(new Date(Date.now()))
      },
      success: function (res) {
        //thisPage.getRecord(pID, bond, thisPage);
      },
      fail: function (e) {
        console.log(e);
      }
    })
  },
  updateRecord_balance: function (pID, thisPage) {
    wx.cloud.init();
    const db = wx.cloud.database();
    const bond = db.collection('bond');

    const _ = db.command
    bond.doc(pID).update({
      data: {
        Bonds: 0,
      },
      success: function (res) {
        wx.navigateBack()
      },
      fail: function (e) {
        console.log(e);
      }
    })
  },
})
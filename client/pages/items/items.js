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
    console.log("onShow")
    
    /*
    for (var i in app.globalData.itemList) {
      var item = app.globalData.itemList[i];
      var lastCheckedDate;
      if (item.DatesChecked.length>0){
        lastCheckedDate = item.DatesChecked[item.DatesChecked.length - 1];
      }else{
        lastCheckedDate = null;
      }
      
      item.isChecked = false;  
      console.log(util.formatDate(lastCheckedDate))
      console.log(util.formatDate(new Date()))
      
      if (lastCheckedDate !=null && util.formatDate(lastCheckedDate) == util.formatDate(new Date())) {
        item.isChecked = true;
      }
    }
    */


    this.setData({
      itemList: util.IsChecked(app.globalData.itemList)
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
    //this.setData({ msg: "Hello World" })
    console.log(e);
    var currentItem = e.currentTarget.dataset.item;
    var tID = currentItem._id;
    console.log(tID);

    
    this.updateRecord(tID,this);
    
  },

  updateRecord: function (pID,thisPage) {


    wx.cloud.init();
    const db = wx.cloud.database();
    const bond = db.collection('bond');

    const _ = db.command
    bond.doc(pID).update({
      data: {
        DatesChecked: _.push(new Date(Date.now()))
      },
      success: function (res) {
        console.log(res);
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
        console.log("getsu")
        app.globalData.itemList = res.data;
        thisPage.setData({
          itemList: app.globalData.itemList
        })
      }
    })
  }


})
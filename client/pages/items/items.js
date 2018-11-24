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
      dateToday: util.formatTime(new Date())
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
    for (var i in app.globalData.itemList) {
      var item = app.globalData.itemList[i];
      var lastCheckedDate;
      if (item.DatesChecked.length>0){
        lastCheckedDate = item.checkedDates[item.DatesChecked.length - 1];
      }else{
        lastCheckedDate = null;
      }
      
      item.isChecked = false;
      if (lastCheckedDate == this.data.dateToday) {
        item.isChecked = true;
        console.log(lastCheckedDate + " " + this.data.dateToday)
      }
    }

    this.setData({
      itemList: app.globalData.itemList
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

  itemCheck: function (e) {
    //this.setData({ msg: "Hello World" })
    console.log(e);
    var currentItem = e.currentTarget.dataset.item;
    var index = currentItem.index;

    app.globalData.itemList[index].checkedDates.push(this.data.dateToday);
    app.globalData.itemList[index].isChecked = true;
    this.setData({
      itemList: app.globalData.itemList
    });
  },
})
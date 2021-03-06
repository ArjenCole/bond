//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
  onLaunch: function () {
    qcloud.setLoginUrl(config.service.loginUrl)
    wx.cloud.init({ env: 'test181123'});
    this.globalData.db = wx.cloud.database();
    this.globalData.col = this.globalData.db.collection('bond');
  },
  onShow: function (options) {
    //console.log("app",options);
  },

  sumBonds: function(){
    var tBonds = 0;
    for (var i = 0; i < this.globalData.itemList.length; i++) {
      if (this.globalData.itemList[i].Bonds > 0){
        tBonds = tBonds + this.globalData.itemList[i].Bonds;       
      }
    }
    return tBonds;
  },
  getItem: function(id){
    for (var i in this.globalData.itemList) {
      var item = this.globalData.itemList[i];
      if (item._id == id) {
        return item;
      }
    }
  },


  globalData: {
    userInfo: null,
    openid: null,
    itemList:[],
    db: null,
    col: null,
  }
})
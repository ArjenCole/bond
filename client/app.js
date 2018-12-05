//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
  onLaunch: function () {
    qcloud.setLoginUrl(config.service.loginUrl)
  },
  onShow: function (options) {
    //console.log("app",options);
  },

  sumBonds: function(){
    var tBonds = 0;
    for (var i = 0; i < this.globalData.itemList.length; i++) {
      tBonds = tBonds + this.globalData.itemList[i].Bonds;       
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
    userInfo: {},
    itemList:[],
  }
})
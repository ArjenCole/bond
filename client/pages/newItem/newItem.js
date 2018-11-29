// client/pages/newItem/newItem.js

let app = getApp();
var util = require('../../utils/util.js');

Page({

  data: {
    isSubmit: false,
    warn: "",
    Text: "",
    LowLimit: "",
    DateEnd: util.formatDate(new Date()),
    Bonds:"",
    defaultDate: util.formatDate(new Date()),
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let { Text, LowLimit, Bonds } = e.detail.value;
    if (!Text || !LowLimit) {
      this.setData({
        warn: "手机号或密码为空！",
        isSubmit: true
      })
      return;
    }
    this.setData({
      warn: "",
      isSubmit: true,
      Text,
      LowLimit,
      Bonds
    })
  },

  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      DateEnd: e.detail.value
    })
  },

  formReset: function () {
    console.log('form发生了reset事件')
  }

})

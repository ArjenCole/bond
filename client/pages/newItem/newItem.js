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
    //console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let { Text, LowLimit, Bonds } = e.detail.value;
    if (!Text || !LowLimit || !Bonds) {
      this.setData({
        warn: "缺少必须的信息！",
        isSubmit: true
      })
      return;
    }
    if (!/\d/g.test(LowLimit)) {
      this.setData({
        warn: "目标次数必须输入数字！",
        isSubmit: true
      })
      return;
    } if (!/\d/g.test(Bonds)) {
      this.setData({
        warn: "保证金额必须输入数字！",
        isSubmit: true
      })
      return;
    }
    if (this.data.DateEnd==this.data.defaultDate) {
      this.setData({
        warn: "结束日期不能为今天！",
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
    });
    this.addRecord();
  },
  addRecord: function () {
    //wx.cloud.init();
    const db = wx.cloud.database();
    const bond = db.collection('bond');
    db.collection('bond').add({
      data: {
        Text: this.data.Text,
        DateStart: new Date(Date.now()),
        DateStop: new Date(this.data.DateEnd),
        LowLimit: parseInt(this.data.LowLimit),
        Bonds: parseInt(this.data.Bonds),
        DatesChecked: [],
        Approvals: []
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        //console.log(res)    
        wx.navigateBack()
      }
    })
  },

  formReset: function () {
    console.log('form发生了reset事件');
    this.setData({
      DateEnd: util.formatDate(new Date()),
    })
  },

  bindDateChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      DateEnd: e.detail.value
    })
  },



})

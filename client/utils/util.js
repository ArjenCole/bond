
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const fullFillItemList = itemList => {
  for (var i in itemList) {
    var item = itemList[i];
    itemList[i] = fullFillItem(itemList[i]);
    /*
    var item = itemList[i];
    var lastCheckedDate;
    if (item.DatesChecked.length > 0) {
      lastCheckedDate = item.DatesChecked[item.DatesChecked.length - 1];
    } else {
      lastCheckedDate = null;
    }
    item.isChecked = false;
    if (lastCheckedDate != null && formatDate(lastCheckedDate) == formatDate(new Date())) {
      item.isChecked = true;
    }*/
  }
  return itemList;
}

const fullFillItem = pItem =>{
  var tItem = deepClone(pItem);
  tItem.DateStart = new Date(tItem.DateStart);
  tItem.DateStop = new Date(tItem.DateStop);
  for (var i in tItem.DatesChecked){
    tItem.DatesChecked[i] = new Date(tItem.DatesChecked[i]);
  }

  var lastCheckedDate;
  if (tItem.DatesChecked.length > 0) {
    lastCheckedDate = tItem.DatesChecked[tItem.DatesChecked.length - 1];
  } else {
    lastCheckedDate = null;
  }
  tItem.isChecked = false;
  if (lastCheckedDate != null && formatDate(lastCheckedDate) == formatDate(new Date())) {
    tItem.isChecked = true;
  }

  tItem.isOverdue = false;
  if (tItem.DateStop < new Date()){
    tItem.isOverdue = true;
    tItem.isChecked = true;
  }

  tItem.isDone = false;
  if (pItem.Bonds < 0){
    tItem.isDone = true;
  }

  tItem.DateStart = formatDate(tItem.DateStart);
  tItem.DateStop = formatDate(tItem.DateStop);
  return tItem;
}

const refund = pItem =>{
  var doneTimes = pItem.DatesChecked.length + pItem.Approvals.length;
  var result;
  if(doneTimes >= pItem.LowLimit){
    return pItem.Bonds;
  }else{
    return (pItem.Bonds * (doneTimes) / pItem.LowLimit).toFixed(2);
  }  
}

// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

    wx.showModal({
        title,
        content: JSON.stringify(content),
        showCancel: false
    })
}

var deepClone = (a) => {
  var c = {};
  c = JSON.parse(JSON.stringify(a));
  return c;
}

module.exports = { formatDate, showBusy, showSuccess, showModel, fullFillItemList, fullFillItem, refund}

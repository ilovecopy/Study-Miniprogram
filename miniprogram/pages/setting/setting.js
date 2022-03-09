Page({
  data: {
    show: true,
    mode:"zuoti",
  },
  showPopup() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  zuoti(){
    this.setData({
      mode: "zuoti"
    })
  },
  dati(){
    this.setData({
      mode: "dati"
    })
  }
});
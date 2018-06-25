/**
 * Created by flyin on 2018/6/25.
 */
//进度条功能

//结合ajax全局事件实现进度条功能

//当第一个ajax请求发送时
$(document).ajaxStart(function () {
  NProgress.start();
})

$(document).ajaxStop(function () {
  //模拟网络延迟
  setInterval(function () {
    NProgress.done();
  },500)
})
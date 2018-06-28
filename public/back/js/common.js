/**
 * Created by flyin on 2018/6/25.
 */

//除了登录页面,其他每个页面在进入之前都要发送请求给后台验证用户登录状态

//判断地址栏的地址是否包含longin.html,如果不包含,说明不是登录页面,进行登录状态验证
if( location.href.indexOf('login.html') === -1 ) {
  $.ajax({
    type: 'get',
    url: '/employee/checkRootLogin',
    dataType: 'json',
    success: function (info) {
      //console.log(info);
      if (info.error === 400) {
        //未登录,跳转到登录页面去登录
        location.href = 'login.html';
      }
      if( info.success ) {
        //用户已登录,无需什么操作dx
      }
    }
  })
}

//进度条功能
//结合ajax全局事件实现进度条功能
// ajax 全局事件
// .ajaxComplete()  每个ajax完成时调用, (不管成功还是失败)
// .ajaxSuccess()   每个ajax成功时调用
// .ajaxError()     每个ajax失败时调用
// .ajaxSend()      每个ajax发送前调用

// .ajaxStart()     第一个ajax发送时调用
// .ajaxStop()      所有的ajax请求都完成时调用
//当第一个ajax请求发送时
$(document).ajaxStart(function () {
  NProgress.start();
})

//当所有的ajax请求结束时
$(document).ajaxStop(function () {
  //模拟网络延迟
  setInterval(function () {
    NProgress.done();
  },500)
})

//左侧导航栏功能
//1.点击分类管理,让分类导航出现
  $('.lt_aside .category').click(function () {
    $('.lt_aside .child').stop().slideToggle();
  })

//2.当点击右侧菜单按钮的时候,左侧导航栏的整体消失功能
$('.lt_main .icon_menu').click(function () {
  $('.lt_aside').toggleClass('hidemenu');
  $('.lt_main').toggleClass('hidemenu');
  $('.lt_topbar').toggleClass('hidemenu');
})

//3.点击右侧退出按钮,弹出模态框
$('.lt_main .icon_logOut').click(function () {
  $('#logoutModal').modal('toggle');
})

//模态框登出按钮功能:
//点击登出按钮时,通过ajax请求后台清除用户登录信息,并跳转到登录页
$('.modal .btn-logOut').click(function () {
  $.ajax({
    type: 'get',
    url: '/employee/employeeLogout',
    dataType: 'json',
    success: function (info) {
      //console.log(info);
      if( info.success ) {
        //跳转到登录页
        location.href = 'login.html';
      }
    }
  })
})



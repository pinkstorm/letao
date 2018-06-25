/**
 * Created by flyin on 2018/6/25.
 */

//除了登录页面,其他每个页面在进入之前都要发送请求给后台验证用户登录状态

if( location.href.indexOf('login.html') === -1 ) {
  $.ajax({
    type: 'get',
    url: '/employee/checkRootLogin',
    dataType: 'json',
    success: function (info) {
      console.log(info);
      if (info.error === 400) {
        //未登录,跳转到登录页面去登录
        location.href = 'login.html';
      }
      if( info.success ) {
        //用户已登录,无需什么操作
      }
    }
  })
}

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
  $('.modal').modal('toggle');
})

//模态框登出按钮功能:
//点击登出按钮时,通过ajax请求后台清除用户登录信息,并跳转到登录页
$('.modal .btn-logOut').click(function () {
  $.ajax({
    type: 'get',
    url: '/employee/employeeLogout',
    dataType: 'json',
    success: function (info) {
      console.log(info);
      if( info.success ) {
        //跳转到登录页
        location.href = 'login.html';
      }
    }
  })
})



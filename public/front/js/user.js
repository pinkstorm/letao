/**
 * Created by flyin on 2018/7/2.
 */

$(function () {

//1.页面一加载,请求用户信息
  $.ajax({
    type: 'get',
    url: '/user/queryUserMessage',
    dataType: 'json',
    success: function (info) {
      console.log(info);
      if( info.error === 400 ) {
        //用户未登录,跳转到登录页去登录
        location.href = "login.html";
        return;
      }

        //用户已登录,根据数据进行渲染
        $('#userinfo').html( template('userTmp',info) );


    }
  })


  //2.点击退出按钮,发送ajax清除用户登录,跳转到登录页
  $('.logoutBtn').click(function() {
    $.ajax({
      type: 'get',
      url: '/user/logout',
      dataType: 'json',
      success: function (info) {
        console.log(info);
        if ( info.success ) {
          location.href = "login.html";
        }
      }
    })
  })


})
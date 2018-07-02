/**
 * Created by flyin on 2018/7/2.
 */
$(function () {


  //点击登录按钮获取用户输入的用户名和密码,发送给后台登录
  $('.loginBtn').click(function () {
    var username = $('[name="username"]').val();
    var password = $('[name="password"]').val();

    //非空校验
    if( !username ) {
      mui.toast('请输入用户名');
      return;
    }

    if( !password ) {
      mui.toast('请输入密码');
      return;
    }

    $.ajax({
      type: 'post',
      url: '/user/login',
      data: {
        username: username,
        password: password
      },
      dataType: 'json',
      success: function (info) {
        console.log(info);
        if( info.error) {
          // 提示用户名或密码错误,
          mui.toast('用户名或密码错误');
        }

        if( info.success ) {
          //说明登录成功,跳转
          //1.如果携带了地址,跳转到对应的页面
          if( location.search.indexOf('retUrl') > -1 ) {
            //说明携带了地址
            var retUrl = location.search.replace('?retUrl=','');
            location.href = retUrl;
          }else {
            //2.如果没有携带地址,跳转到会员中心
            location.href = 'user.html';
          }



        }


      }
    })

  })




})
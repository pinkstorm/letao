/**
 * Created by flyin on 2018/7/2.
 */
$(function () {

  //页面一加载,获取地址栏中的产品id,传递给后台.ajax请求数据,并结合模板引擎渲染到页面中

var id = getLocation('proId');
  console.log(id);

  $.ajax({
    type:'get',
    url: '/product/queryProductDetail',
    data: {
      id: id
    },
    dataType: 'json',
    success: function (info) {
      console.log(info);
      $('.mui-scroll').html( template('proTmp',info) );
      //初始化轮播图
      //获得slider插件对象
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
      });

      //初始化数字框
      mui('.mui-numbox').numbox();
    }
  })

  //1.用户选择尺码功能
  //事件委托给所有的span注册点击事件
  $('.lt_main').on('click','.lt_size span',function () {
    //alert('hehe');
    $(this).addClass('current').siblings().removeClass('current');
  })

  //2.添加购物车功能,点击按钮,获取用户输入的信息,num和size
  $('#add_cart').click(function () {
    var num = $('.mui-numbox-input ').val();
    var size = $('.lt_size span.current').text();
    //判断用户是否输入size
    if (!size) {
      mui.toast('请选择尺码');
      return;
    }

    //发送ajax请求
    $.ajax({
      type: 'post',
      url: '/cart/addCart',
      data: {
        productId : id,
        num: num,
        size: size
      },
      dataType: 'json',
      success: function (info) {
        console.log(info);
        if ( info.error === 400) {
          //未登录.跳转到登录页登录,并将地址携带过去
          location.href = "login.html?retUrl=" + location.href;
        }

        if( info.success ) {
          //添加成功,提示用户已成功添加到购物车
          mui.confirm('添加成功','温馨提示',['去购物车','继续浏览'],function (e) {
            if( e.index === 0 ) {
              //前往购物车
              location.href = 'cart.html';
            }
          })
        }

      }
    })


  })








})
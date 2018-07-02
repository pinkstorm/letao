/**
 * Created by flyin on 2018/7/2.
 */

$(function () {

  //1.页面一加载,发送ajax请求,获取用户购物车信息,渲染到页面中
  function render() {
    //模拟网络延迟
    setTimeout(function() {
      $.ajax({
        type: "get",
        url: "/cart/queryCart",
        dataType: "json",
        success: function( info ) {
          console.log(info);//数组
          //组装并放到页面中
          $('.mui-table-view').html( template('cartTmp',{list:info}) );
          //刷新完毕,手动关闭下拉刷新
          mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();

        }
      })
    },500)
  }

  //1.配置下拉刷新
  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",
      down : {
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        callback :function () {
          render();
        }
      }
    }
  });

  //2.删除功能
  //点击删除按钮,获取商品id,发送ajax请求
  $('.mui-table-view').on('tap','.btn_delete',function() {
    var id = $(this).data('id');
    $.ajax({
      type: 'get',
      url: '/cart/deleteCart',
      data: {
        id: [id]
      },
      dataType: 'json',
      success: function (info) {
        console.log(info);
        if( info.success ) {
          //删除成功,重新渲染页面
          //重新调用一次下拉刷新
          mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();

        }
      }
    })
  })

  //3.编辑功能
  //点击编辑按钮,获取存储的商品信息,渲染并弹出确认框

$('.mui-table-view').on('tap','.btn_edit',function() {
  var obj = this.dataset;
  console.log(obj);//数据为obj
  var id = obj.id;
  var htmlStr = template('editTmp',obj);
  //console.log(htmlStr);
  //把换行替换成空字符串
  htmlStr = htmlStr.replace(/\n/g,'');

  mui.confirm(htmlStr,'编辑商品',['确认','取消'],function(e) {
    if( e.index === 0 ) {
      //点击了确认按钮
      //获取尺码和数量信息
      var size = $('.lt_size span.current').text();
      var num = $('.mui-numbox-input').val();

      $.ajax({
        type: 'post',
        url: '/cart/updateCart',
        data: {
          id: id,
          size: size,
          num: num
        },
        dataType: 'json',
        success: function(info) {
          console.log(info);
          if( info.success ) {
            //修改成功,重新渲染,调用一次下拉刷新
            mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
          }
        }
      })

    }
  })


  // 手动初始化数字框
  mui(".mui-numbox").numbox()


})

  //4.添加尺码选择功能
  $('body').on('click','.lt_size span',function() {
    $(this).addClass('current').siblings().removeClass('current');
  })

  //5.计价功能
  //(1).事件委托给所有的CheckBox添加点击事件
  //(2).获取所有被选中的checbox,获取里面存储的price和num
  //(3).计算总价并$('#totalText').text( 设置 );
$('.lt_main').on('click','.ck',function() {
  //获取所有被选中的checkbox
  var allck = $('.lt_main .ck:checked');
  //遍历
  var sum = 0;
  allck.each(function(index,ele) {
    var price = $(ele).data('price');
    var num = $(ele).data('num');
    sum += num * price;
  });

  //保留两位小数
  sum = sum.toFixed(2);


  //设置给相应的span
  $('#totalText').text( sum );


})


})
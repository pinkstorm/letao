/**
 * Created by flyin on 2018/6/29.
 */

$(function () {

  var currentPage;

  //对ajax进行封装(方法中已经获取了搜索框中的自定义属性值)
  function render(page,pageSize,callback) {
    //$('.lt_product').html('<div class="loading"></div>');
    //提取参数
    var params = {};
    params.proName = $('.search_input').attr('data-key');
    params.page = page || 1;
    params.pageSize = pageSize || 100;

    //1.判断是否需要排序(是否有current类),即是否需要传可选参数
    var current = $('.lt_sort .current');
    if( current.length > 0 ) {
      //有current类,说明需要进行排序(只会存在一个current)
      //1.获取参数
      var sortName = current.data('type');
      //2.获取参数的状态
      var sortValue = current.find('i').hasClass('fa-angle-down')?2:1;
      params[sortName] = sortValue;
    }

    //模拟网络延迟
    setTimeout(function () {
      $.ajax({
        type: 'get',
        url: '/product/queryProduct',
        data: params,
        dataType: 'json',
        success: function (info) {
          //如果callback存在,调用callback
          callback && callback(info);
        }
      })
    },1000)



  }

  mui.init({
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      //下拉刷新
      down : {
        auto: true,//可选,默认false.首次加载自动下拉刷新一次
        callback :function () {
          //发送ajax请求,请求第一页的数据,直接添加到页面中
          currentPage = 1;

          render(currentPage,2,function (info) {
            //直接覆盖页面内容
            $('.lt_product').html( template('proTmp',info) );
            //手动终止下拉刷新
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
            // 下拉刷新完成后, 重新渲染了第一页, 又有更多数据可以加载了
            // 需要重新启用 上拉加载
            mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();

          });
        }

    },
      //上拉加载
      up : {
        //auto:true,//可选,默认false.自动上拉加载一次
        callback :function () {
          //console.log('我是上拉加载');
          //发送ajax请求,请求下一页的数据,追加到页面中
          currentPage++;
          render(currentPage,2,function (info) {
            console.log(info);
            //判断没有数据的时候
            if( info.data.length === 0 ) {
              //说明没有数据了
              //手动终止上拉加载,显示没有更多数据,并且自动禁用上拉加载;
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
            }else {
              //说明有数据,进行渲染操作
              //请求的数据追加到页面中
              $('.lt_product').append( template('proTmp',info) );
              //手动终止上拉加载
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
            }

          })
        }
      }
    }
  });


  //功能:
  //1.一跳转到此页
  //(1)首先获取地址栏中的关键字,赋值给搜索框,以及搜索框的自定义属性
  var keywords = getLocation('value');
  $('.search_input').val(keywords);
  $('.search_input').attr('data-key',keywords);

  //(2)调用一次下拉刷新
  mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();


  //2.排序功能,给有自定义属性的a标签注册点击事件
  $('.lt_sort a[data-type]').on('tap',function () {
    //1.判断当前a标签有没有current类,有的话就对当前a标签进行切换箭头操作
    if( $(this).hasClass('current') ) {
      //改变对应i标签的箭头的类,切换箭头方向
      $(this).find('i').toggleClass('fa-angle-down').toggleClass('fa-angle-up');
    }else {
      //如果没有,给当前a标签添加current类,排他
      $(this).addClass('current').siblings().removeClass('current');
    }
    //2.重新渲染页面
    //render();
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
  })



  //3.点击搜索框获取输入框中的关键字,重新渲染页面,并将关键字存储到localStorage中,在搜索页实现搜索记录的同步
  $('.search_btn').on('tap',function () {

    //bug3:判断关键字是否为空
    var key = $('.search_input').val();
    if ( !key ) {
      mui.toast('请输入搜索关键字');
      return;
    }

    //把关键字赋值给输入框的自定义属性
    $('.search_input').attr('data-key',key);

    //2.根据输入的关键字重新渲染页面
    //render();
    ///2根据输入的关键字调用一次下拉刷新
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();

    //3.获取本地存储的json字符串
    var str = localStorage.getItem('history_list') || '[]';
    //2.将字符串转换成数组
    var arr = JSON.parse(str);

    //bug1:判断搜索字段是否重复
    if( arr.indexOf(key) > -1) {
      //有重复的,把数组中的对应项删除,在数组前面添加关键字
      arr.splice(arr.indexOf(key),1);
    }

    //bug2:判断数组是否大于等于10个元素
    if ( arr.length >= 10 ) {
      //删除数组中最后面一项
      arr.pop();
    }

    //4.在数组最前面添加关键字
    arr.unshift(key);
    //5.将数组转成json字符串存储到本地
    localStorage.setItem('history_list',JSON.stringify(arr));

    //6.清空搜索框
    //$('.search_input').val('');

  })


  //跳转
  //点击每一个包裹着商品的a标签,可以跳转到商品详情页(在本页面保存当前商品id,后根据id渲染此商品的详情)
  //在mui的下拉刷新上拉加载组件中,因为click事件有300ms的延迟,被禁用掉了,只有tap(轻触事件)有效,所以所有的click事件都要改成tap事件

  //事件委托
  $('.lt_product').on('tap','a',function () {
    var productId = $(this).data('id');
    location.href = "product.html?proId=" + productId;
  })





})
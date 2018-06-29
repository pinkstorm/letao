/**
 * Created by flyin on 2018/6/29.
 */

$(function () {
  //0.准备假数据
  //var arr = ['耐克','阿迪','李宁','鸿星尔克','特步'];
  //var jsonStr = JSON.stringify(arr);
  //localStorage.setItem('history_list',jsonStr);

  //1.从localStorage中获取数据,结合模板引擎渲染到页面中
  render();

  //2.点击清空按钮弹出模态框,删除本地存储的数据,并重新渲染页面
  $('.lt_history').on('click','.span_delete',function () {
    //1.弹出确认模态框
    mui.confirm('你是否要清空全部的历史记录?','温馨提示',['取消','确定'],function (e) {
      console.log(e);
      if( e.index === 1 ) {
        //说明点击了确认按钮
        //2.删除本地存储的整个数据
        localStorage.removeItem('history_list');
        //3.重新渲染页面
        render();
      }
    })


  })

  //3.点击单个删除的按钮,根据索引,删除数组对应项并重新渲染
  $('.lt_history').on('click','.icon_delete',function () {
    //1.获取本地存储的数组
    var arr = getLocalStorage();
    //2.删除对应项
    arr.splice($(this).data('index'),1);
    //3.把数组转成json字符串
    var str = JSON.stringify(arr);
    //4.把数组存储到localStorage中
    localStorage.setItem('history_list',str);
    //5.重新渲染
    render();

  })


//4.添加功能
  //点击搜索按钮:
  //bug:
  //bug1.如果用户输入的是空的字符串,即什么都没有输入,不做操作
  //bug2.判断用户输入的值与数组中的元素是否重复,如果重复,需要先删除数组中的对应项,再把当前项添加到数组的最前面
  //bug3.如果数组中的值大于等于10,删除数组最后一项,添加当前项到数组的最前面


  $('.search_btn').click(function () {
    //1.获取输入框的值
    var value = $('.search_input').val();

    //bug1.如果用户输入的是空的字符串,即什么都没有输入,不做操作
      if( !value ) {
        mui.toast('请输入搜索关键字');
        return;
      }

    //2.获取本地存储的数组
    var arr = getLocalStorage();

    //bug2.判断用户输入的值与数组中的元素是否重复,如果重复,需要先删除数组中的对应项,再把当前项添加到数组的最前面

    if( arr.indexOf(value) > -1 ) {
      //说明有重复,删除数组中的重复项
      arr.splice(arr.indexOf(value),1)
    }

    //bug3.如果数组中的值大于等于10,删除数组最后一项,添加当前项到数组的最前面
    if( arr.length >= 10 ) {
      arr.pop();
    }

    //3.将输入框的值添加到数组的最前面
    arr.unshift(value);
    //4.将数组转成json字符串再存储到localStrorage
    localStorage.setItem('history_list',JSON.stringify(arr));
    //5.重新渲染页面
    render();
    //6.清空输入框的值
    $('.search_input').val('');


  })







  //封装函数
  //1.封装从localStorage中获取数据的方法,返回一个数组
  function getLocalStorage() {
    var str = localStorage.getItem('history_list') || '[]';
    var arr = JSON.parse(str);
    return arr;
  }

  //2.封装根据本地存储的数据渲染页面的函数
  function render() {
    var arr =  getLocalStorage();
    $('.lt_history').html( template('hisTmp',{arr:arr}) );
  }
})
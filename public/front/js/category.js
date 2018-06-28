/**
 * Created by flyin on 2018/6/28.
 */

$(function () {

  //1.发送ajax请求,结合模板引擎,动态生成页面中的结构
  $.ajax({
    type: 'get',
    url: '/category/queryTopCategory',
    dataType: 'json',
    success: function (info) {
      //console.log(info);
      $('.lt_category_left ul').html( template('firstTmp',info) );

      //根据第一个一级分类的id先渲染第一屏的右边盒子的第一屏
      renderSecondById( info.rows[0].id );
    }
  })

  //2.封装函数,渲染二级分类的数据
  function renderSecondById(id) {
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategory',
      data: {
        id: id
      },
      dataType: 'json',
      success: function (info) {
        //console.log(info);
        $('.lt_category_right ul').html( template('secTmp',info) );
      }
    });
  }

  //3.事件委托给左边的a标签注册点击事件
  $('.lt_category_left ul').on('click','a',function () {
    //var id = $(this).data('id');
    //1.根据他的id,渲染右边的二级分类的数据
    renderSecondById($(this).data('id'));
    //2.让当前的a标签高亮(排他)
    $(this).addClass('current').parent().siblings().find('a').removeClass('current');

  })



})
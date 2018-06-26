/**
 * Created by flyin on 2018/6/26.
 */

$(function () {

//1.页面一加载,就渲染一次
  render();

function render(page,pageSize) {
  //通过ajax请求动态数据并通过模板引擎渲染到页面中
  $.ajax({
    type: 'get',
    url: '/user/queryUser',
    data: {
      page: page || 1,
      pageSize: pageSize || 5
    },
    dataType: 'json',
    success: function (info) {
      console.log(info);
      //组装数据和模板生成结构,并将结构放入页面中
      $('tbody').html( template('tmp',info) );

      //根据请求回来的总页数生成分页
      $(".paginator ul").bootstrapPaginator({
        bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
        currentPage: page,//当前页
        totalPages:Math.ceil( info.total / info.size ),//总页数
        onPageClicked:function(event, originalEvent, type,page){
          //为按钮绑定点击事件 page:当前点击的按钮值
          console.log(page);
          //如果点击了分页按钮,就根据当前的按钮值渲染当前页
          render(page);
        }
      });
    }
  })
}


//2.


})
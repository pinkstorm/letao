/**
 * Created by flyin on 2018/6/26.
 */

$(function () {
  //记录当前页
  var currentPage;

  //1.页面加载,发送ajax请求,结合模板引擎,渲染第一屏
  render();

  function render(page,pageSize) {
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: page || 1,
        pageSize: pageSize || 2
      },
      success: function (info) {
        //console.log(info);
        //组装数据和模板并渲染到页面中
        $('tbody').html( template('tmp', info) );

        //分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page,//当前页
          totalPages: Math.ceil( info.total / info.size ),//总页数
          size:"small",//设置控件的大小，mini, small, normal,large
          onPageClicked:function(event, originalEvent, type,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            //当按钮被点击的时候,渲染对应页数的数据
            render(currentPage);
          }
        });
      }
    })
  }


  //2.点击添加分类按钮,弹出模态框
  $('.btn-add').click(function () {
    $('#addFitst').modal('show');
  })
})
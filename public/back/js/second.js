/**
 * Created by flyin on 2018/6/26.
 */

$(function () {

  var currentPage;

  //1.一进入页面,渲染第一屏
  render();

  function render(page,pageSize) {
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: page || 1,
        pageSize: pageSize || 5
      },
      dataType: 'json',
      success: function (info) {
        console.log(info);
        $('tbody').html( template('tmp',info) )

        //分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page,//当前页
          totalPages: Math.ceil( info.total / info.size ),//总页数
          size:"small",//设置控件的大小，mini, small, normal,large
          onPageClicked:function(event, originalEvent, type,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            //渲染当前页
            render(currentPage);
          }
        });

      }

    })
  }

  //2.点击添加分类按钮,渲染
})
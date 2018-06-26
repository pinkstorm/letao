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

  //3.表单校验功能
  $('#form').bootstrapValidator({
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //3.指定校验字段
    fields: {
      categoryName: {
          validators: {
              notEmpty: {
                message: "请输入一级分类"
              }
          }
      }
    }

  });

  //4.注册表单校验成功事件
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    //获取表单数据,传递给后台修改数据库
    $.ajax({
      type: 'post',
      url: '/category/addTopCategory',
      data: $('#form').serialize(),
      dataType: 'json',
      success: function (info) {
        console.log(info);
        if( info.success ) {
          //1.关闭模态框
          $('#addFitst').modal('hide');
          //2.重新渲染第一屏
          currentPage = 1;
          render(currentPage);
          //3.清空模态框中表单的内容及校验状态(传true)
          $('#form').data('bootstrapValidator').resetForm(true);
        }
      }
    })


  });
})
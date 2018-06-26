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
        //console.log(info);
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

  //2.点击添加分类按钮
  $('.btn-add').click(function() {
    //1.显示模态框
    $('#addSecond').modal('show');
    //2.发送ajax请求,动态渲染添加一级分类的下拉菜单
    $.ajax({
      type: 'get',
      url: '/category/queryTopCategoryPaging',
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: 'json',
      success: function (info) {
        console.log(info);
      //  组装到对应的ul中去
        $('.dropdown-menu').html( template('cateTmp',info) );
      }

    })
  });


  //3.通过事件委托,给所有的a标签注册点击事件,获取值赋给button
  $('.dropdown-menu').on('click','a', function () {
    $('.btnTxt').text( $(this).text() );
    //当点击某一个a标签的时候,把他的id复制给name="categoryId"的隐藏域
    $('[name="categoryId"]').val( $(this).data('id') );

  })


  //4.文件上传
  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      console.log(data.result.picAddr);
      //把图片地址设置给img标签
      $('#img-box').attr('src',data.result.picAddr);
      //把图片地址保存在name="brandLogo"的隐藏域中
      $('[name="brandLogo"]').val(data.result.picAddr);
    }
  });


  //5.进行表单验证功能
  $('#form').bootstrapValidator({
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //3.指定校验字段
    fields: {
      brandName: {
        validators: {
          notEmpty: {
            message: '请输入二级分类'
          }
        }
      },
      categoryId: {
        validators: {
          notEmpty: {
            message: '请选择一级分类'
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: '请上传图片'
          }
        }
      },

    }
  })

  //当表单校验成功时,阻止默认提交行为,改成ajax提交
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    $.ajax({
      type: 'post',
      url: '/category/addSecondCategory',
      data: $('#form').serialize(),
      dataType: 'json',
      success: function (info) {
        //console.log(info);
        if( info.success ) {
          //1.关闭模态框
          $('#addSecond').modal('hide');

          //2.渲染第一屏
          currentPage = 1;
          render(currentPage);

          //3.清空表单域内容及校验状态
          $('#form').data('bootstrapValidator').resetForm(true);

          //4.恢复btnTxt和图片的默认状态
          $('.btnTxt').text('请选择一级分类');
          $('#img-box').attr('src','./images/none.png');
        }
      }
    })
  });
})
/**
 * Created by flyin on 2018/6/27.
 */

$(function () {
  var currentPage;
  var picArr = [];
  //通过ajax请求,结合模板引擎,渲染第一屏
  //1.页面一加载,渲染第一屏
  render();

  function render(page,pageSize) {
    $.ajax({
      type: 'get',
      url: '/product/queryProductDetailList',
      data: {
        page: page || 1,
        pageSize: pageSize || 2
      },
      dataType: 'json',
      success: function (info) {
        //console.log(info);
        //组装模板和数据到页面中去
        $('tbody').html( template('proTmp',info) );

        //分页(需要依据请求回来的数据总数)
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page,//当前页
          totalPages: Math.ceil( info.total / info.size ),//总页数
          size:"small",//设置控件的大小，mini, small, normal,large
          //是否使用bootstrap风格的提示工具
          useBootstrapTooltip: true,
          //每一个页码中的显示文本
          itemTexts: function (type,page,current) {
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return page;
            }
          },

          //设置提示框的文本
          tooltipTitles: function (type,page,current) {
            //console.log(type,page,current);
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return "前往第" + page + "页";

            }
          },


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


  //2. 点击添加商品按钮
  $('.btn-addPro').click(function (){
    //1.显示模态框
    $('#addProduct').modal('show');
    //2.通过ajax请求所有的二级分类,结合模板引擎渲染到页面中
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: 'json',
      success: function (info) {
        //console.log(info);
        $('.dropdown-menu').html( template('secTmp',info) );
      }
    })



  })


  //3.通过事件委托给dropdown下的a标签注册点击事件
  $('.dropdown-menu').on('click','a',function () {
    //1.将a标签的内容添加给btn-txt
    $('.btn-txt').text( $(this).text() );
    //2.获取a标签的data-id赋给name="brandId"的表单
    $('[name="brandId"]').val( $(this).data('id') );

    //3.当某一个a标签被点击的时候,手动更改brandID的校验状态为成功
    $('#form').data('bootstrapValidator').updateStatus('brandId','VALID');

  });



  //4.文件上传
  //服务器图片每存好一张,就会响应一张,即调用一次done方法

  $("#fileupload").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址,
    //做图片预览
    done:function (e, data) {
      //console.log(data.result.picAddr);
      //获取图片地址
      var picUrl = data.result.picAddr;
      //在数组中存储三张图片的信息
      picArr.unshift(data.result);
      //console.log(picArr);
      //在inmBox中动态生成图片标签
      $('#imgBox').prepend( '<img src="'+ picUrl +'" height="100" width="100">' );
      //判断上传多于三张图片
      if( picArr.length > 3 ) {
        //1.删除数组中最后一个元素
        picArr.pop();

        //2.删除页面中最后一张图片
        $('#imgBox img:last-of-type').remove();
      }

      //当上传了三张图片时,手动将校验状态改为通过
      if( picArr.length === 3 ) {
        $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID');
      }


    }
  });


  //5.表单验证功能
  $('#form').bootstrapValidator({
    //1.将隐藏域加入校验类型
    excluded: [],

    //2.指定校验时的图标显示
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //3.指定校验字段
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: '请选择二级分类'
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: '请输入商品名称'
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: '请输入商品描述'
          }
        }
      },
      num: {
        validators: {
          //非空校验
          notEmpty: {
            message: '请输入商品库存'
          },
          //正则校验
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存必须是非零开头的数字'
          }
        }
      },
      size: {
        validators: {
          //非空校验
          notEmpty: {
            message: '请输入商品尺码'
          },
          //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '商品尺码必须是xx-xx,如35-45'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: '请输入商品原价'
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: '请输入商品价格'
          }
        }
      },
      picStatus: {
        validators: {
          notEmpty: {
            message: '请上传三张图片'
          }
        }
      }

    }



  })

  //6.注册表单验证通过事件,并阻止表单的默认提交行为,改为ajax提交
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑

    //在表单序列化后面拼接数组中存储的三组picName1和picAddr1
    var formS = $('#form').serialize();
    formS += "&picName1=" + picArr[0].picName + "&picAddr1" + picArr[0].picAddr;
    formS += "&picName2=" + picArr[1].picName + "&picAddr2" + picArr[1].picAddr;
    formS += "&picName3=" + picArr[2].picName + "&picAddr3" + picArr[2].picAddr;
    //console.log(formS);

    //发送ajax请求
    $.ajax({
      type: 'post',
      url: '/product/addProduct',
      data: formS,
      dataType: 'json',
      success: function (info) {
        //console.log(info);
        if( info.success )  {
          //1.隐藏模态框
          $('#addProduct').modal('hide');

          //2.清空表单内容
          $('#form').data('bootstrapValidator').resetForm(true);

          //3.手动清空上下两个不属于表单的内容
          $('.btn-txt').text('请输入二级分类名称');
          //清除所有的img标签
          $('#imgBox img').remove();
        }
      }
    })





  });

})
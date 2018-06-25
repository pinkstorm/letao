/**
 * Created by flyin on 2018/6/25.
 */

$(function () {

  //1.初始化表单验证
  $('#form').bootstrapValidator({

    //指定校验成功时的图标提示
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', //校验成功
      invalid: 'glyphicon glyphicon-remove', //校验失败
      validating: 'glyphicon glyphicon-refresh' //校验中
    },

    //指定校验字段
    fields: {
      username: {
        //配置校验规则
        validators: {
          //配置非空校验
          notEmpty: {
            message: "用户名不能为空"
          },
          //配置长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: "用户名长度必须在 2-6位"
          },
          callback: {
            message: "用户名不存在"
          }
        }
      },
      password: {
        //配置校验规则
        validators: {
          // 配置非空校验
          notEmpty: {
            message: "密码不能为空"
          },
          // 配置长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度必须在 6-12位"
          },
          callback: {
            message: "密码错误"
          }
        }
      }
    }
  });

  //2.阻止表单自动提交,换成ajax请求
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $('#form').serialize(),
      dataType: 'json',
      success: function (info) {
        console.log(info);
        if(info.success) {
          //登录成功,跳转
          location.href = "./index.html";
        }

        if( info.error === 1000 ) {
          //用户名不存在,更新提示信息
          $('#form').data('bootstrapValidator').updateStatus('username','INVALID','callback');
        }

        if( info.error === 1001 ) {
          //密码错误
          $('#form').data('bootstrapValidator').updateStatus('password','INVALID','callback');
        }
      }
    })
  });

  //3.点击重置按钮,重置内容以及重置表单校验状态
  $('[type="reset"]').on('click',function () {
    $('#form').data('bootstrapValidator').resetForm();
  });

});
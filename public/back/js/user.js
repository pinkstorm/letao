/**
 * Created by flyin on 2018/6/26.
 */

$(function () {

  //声明一个变量记录当前页
  var currentPage;

  //变量声明,记录点击启用禁用按钮时需要传递给后台的数据
  var currentId;
  var isDelete;


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
      //console.log(info);
      //组装数据和模板生成结构,并将结构放入页面中
      $('tbody').html( template('tmp',info) );

      //根据请求回来的总页数生成分页
      $(".paginator ul").bootstrapPaginator({
        bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
        currentPage: page,//当前页
        totalPages:Math.ceil( info.total / info.size ),//总页数
        onPageClicked:function(event, originalEvent, type,page){
          //为按钮绑定点击事件 page:当前点击的按钮值
          //console.log(page);
          //存储当前页
          currentPage = page;
          console.log(currentPage);
          //如果点击了分页按钮,就根据当前的按钮值渲染当前页
          render(page);
        }
      });
    }
  })
}



//2.点击表格操作项下的按钮(事件委托),弹出模态框
  $('tbody').on('click','.btn',function() {
    //alert('hehe');
    $('#userModal').modal('show');
    //记录弹出模态框的按钮的id,将来根据id改数据
    currentId = $(this).parent().data('id');
    //记录按钮是否是禁用按钮,如是禁用按钮,说明状态正常,值为1,如果是禁用按钮,让状态改为0,如果是启用按钮,让状态改为1
    isDelete = $(this).hasClass('btn-danger')? 0 : 1;
  })

//3.点击模态框的确定按钮,请求后台,传递id和启用禁用的状态
// ,重新渲染当前页

  $('.btn-conform').click(function () {

    $.ajax({
      type: 'post',
      url: '/user/updateUser',
      data: {
        id: currentId,
        isDelete: isDelete
      },
      success: function (info) {
        console.log(info);
        if( info.success ) {
          //修改成功
          //1.让模态框消失
          $('#userModal').modal('hide');

          //2.重新渲染当前页(currentPage)
          render(currentPage);
        }
      }
    })

  });

})
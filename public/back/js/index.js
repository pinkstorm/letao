/**
 * Created by flyin on 2018/6/25.
 */

$(function () {
  //通过canvas绘制数据图形
  //图表一
  var echarts1 = echarts.init(document.querySelector(".echarts_1"));

  var option1 = {
    //大标题
    title: {
      text: '2017年注册人数'
    },
    //提示框组件
    tooltip: {},
    //图例
    legend: {
      //data必须和series中的name配合使用,且需要一一对应
      data: ['人数']
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '人数',
      data: [120, 200, 150, 80, 70, 110],
      type: 'bar'
    }]
  };
  //显示图表
  echarts1.setOption(option1);


  //图表二
  var echarts2 = echarts.init(document.querySelector(".echarts_2"));
  var option2 = {
    title : {
      text: '热门品牌销售',
      subtext: '2017年6月',
      x:'center'
    },
    tooltip : {
      //数据项触发
      trigger: 'item',
      //显示的数据格式
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    //图例
    legend: {
      //显示方向
      orient: 'vertical',
      //居左
      left: 'left',
      data: ['耐克','阿迪','李宁','新百伦','阿迪王']
    },
    series : [
      {
        name: '品牌',
        type: 'pie',
        //指定饼图的直径
        radius : '55%',
        //饼图圆心的位置
        center: ['50%', '60%'],
        data:[
          {value:335, name:'耐克'},
          {value:310, name:'阿迪'},
          {value:234, name:'李宁'},
          {value:135, name:'新百伦'},
          {value:1548, name:'阿迪王'}
        ],
        //设置阴影
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  //显示图表
  echarts2.setOption(option2);
})
/**
 * Created by flyin on 2018/6/28.
 */
$(function () {

  //初始化区域滚动
  mui('.mui-scroll-wrapper').scroll({
    indicators: false, //是否显示滚动条
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  });

  //轮播图自动播放
  //获得slider插件对象
  var gallery = mui('.mui-slider');
  gallery.slider({
    interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
  });

})


//传入需要的对象的键,通过函数获取并转化,最终返回此对象对应键的值
function getLocation(key) {
  var search = location.search;
  search = decodeURI(search);
  search = search.slice(1);
  //以&对search进行分割
  var arr = search.split('&');
  //遍历数组
  var obj = {};
  arr.forEach(function (v,i) {
    var index = v.split('=')[0];
    var value = v.split('=')[1];
    obj[index] = value;
  })
  return obj[key];
}
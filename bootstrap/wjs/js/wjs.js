// 桌面端的 电脑 是无法触发 touch事件的
$(function() {
     // 调用 banner方法
     banner();

     // 调用 产品 列表的 提示框 初始化逻辑
     product_tab();
})
function banner(){
       // 获取 轮播图盒子
        var $_banner = $("#carousel-example-generic");

        // 移动端 只支持 touch 事件
        /*
                    使用 下面的 三个 touch事件 封装 左右滑动事件
                    获取 手指 放上去的 坐标x

                    获取 手指 松开的时候 的坐标x
         */

        var startX = 0;
        // 在 touchend事件中 是拿不到 点
        var distanceX = 0;

        // 容错距离
        var delayDis = 30;

        // 原生的js 传入的是 默认的 事件参数
        // jq 通过on 绑定的 传入的是 经过 jq 包装的事件参数 
        // 原生的 事件参数 在originalEvent 属性中
        $_banner.on('touchstart', function(e) {
                console.log(e.originalEvent.touches[0].clientX);
                // 保存起来
                startX = e.originalEvent.touches[0].clientX;
        })
        $_banner.on('touchmove', function(e) {
                // console.log('move');
                // 做减法 计算出 distanceX
                distanceX = e.originalEvent.touches[0].clientX - startX;
        })
        $_banner.on('touchend', function(e) {
                if (Math.abs(distanceX) > delayDis) {
                        if (distanceX > 0) {
                                console.log('向右移动');
                                $('.carousel').carousel('prev');
                        } else {
                                console.log('向左移动');
                                // 找到轮播图盒子
                                $('.carousel').carousel('next');
                        }
                }
        })
}

function product_tab(){
     // 使用步骤2 使用js初始化该控件
        $('[data-toggle="tooltip"]').tooltip()
}
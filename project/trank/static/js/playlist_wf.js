/**
 * Created by wuqi on 12/13/16.
 */

var playlist = window.playlist || {};

$(window).on('load',function () {
    waterfall();
})
playlist.init = function (url, category, num) {
    var is_busy = false;
    var has_more = true;

    var start = 0;

    playlist.load_data = function (data) {
        is_busy = true;
        util.send_request(url,
            data||{},
            "GET",
            null,
            function () {
                is_busy = false;
            },
            function (val) {
                var html = $(val);
                $(html).appendTo($("#js-play-list"));
                //加载成功后,js方法改瀑布流
                waterfall();
                // TODO(wuqi): 不知道为啥是这个计算方法
                start += num;
                if ($(html).length + 1 < 2 * num) {
                    has_more = false;
                    $("#js-loading").remove();
                    //$(".loading-prompt").html("没有更多了...");
                    //$("#js-loading").removeAttr("id");
                }
            }
        )
    };

    $(window).on('scroll', function (e) {
        if (is_busy || !has_more) {
            return;
        }
        var winHeight = $(window).height();
        var scrollTop = window.pageYOffset;
        var bodyHeight = document.body.offsetHeight || document.documentElement.offsetHeight;
        var endHeight = bodyHeight - winHeight;
        if (scrollTop >= endHeight) {
            console.log("loading");
            playlist.load_data(playlist.load_data_param(category, start, num));
        }
    });

};

playlist.on_item_click = function (url) {
    location.href = url;
};

playlist.load_data_param = function (category, start, num) {
    return {
        c: category,
        start: start,
        limit: num
    }
};



/**
 * js实现瀑布流布局
 */
function  waterfall() {
    var $boxs = $(".play-item");//获取所有class为play-item的元素
    var dw= $boxs.eq(0).outerWidth();//每个div高度
    var hArr=[];//定义一个数组,存储高度
    var cols =2;//两列
    $boxs.each(function (index,value) {
        var h = $boxs.eq(index).outerHeight();//获取高度
        console.log(index);//
        if(index<cols){//存储前两个高度
            hArr[index]=h;
        }else{
            //获取数组中最短的高度
            var minH = Math.min.apply(null,hArr);
            //最小值的索引
            var minIndex = $.inArray(minH,hArr);
            $(value).css({
                'position':'absolute',
                'top':minH+'px',
                'left':minIndex*dw+'px'
            })
            hArr[minIndex]+=$boxs.eq(index).outerHeight();
        }
    })
    // console.log(hArr);
}

playlist.imgSize=function () {
    var $boxSize = $(".ratio1_1");
    var h = $boxSize.eq(0).height();//获取到宽度
    var $img = $(".ratio1_1>img");
    $img.height(h);//设置高度
}



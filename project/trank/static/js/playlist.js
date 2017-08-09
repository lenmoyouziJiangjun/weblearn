/**
 * Created by wuqi on 12/13/16.
 */

var playlist = window.playlist || {};


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
                // TODO(wuqi): 不知道为啥是这个计算方法
                start += num;
                if ($(html).length + 1 < 2 * num) {
                    has_more = false;
                    $("#js-loading").remove();
                    //$(".loading-prompt").zhtml("没有更多了...");
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

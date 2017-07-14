/**
 * Created by wuqi on 2/26/16.
 */

var util = window.util || {};

util.KEY = {
    user: "user"
};
util.rcode = '';
util.school = '';

util.is_wechat = function () {
    var ua = navigator.userAgent.toLowerCase();
    return ua.match(/MicroMessenger/i)=="micromessenger";
};

util.is_ios = function () {
    return /iPad|iPhone|iPod/i.test(navigator.userAgent) && !window.MSStream;
};

util.get_request = function (url){
    url = url || location.search;
    //获取url中"?"符后的字串
    var theRequest = {};
    var str = url.substr(url.indexOf("?")+1);
    var strs = str.split("&");
    for (var i = 0; i < strs.length; i++) {
        var kvpair = strs[i].split("=");
        theRequest[kvpair[0]] = decodeURIComponent(kvpair[1]);
    }
    return theRequest;
};

util.server_url = function (other) {
    other = other || "";
    if (other.indexOf("://") > 0){
        return other;
    }
    if (other.indexOf("/") === 0){
        return location.origin+other;
    }
    return location.origin+"/app/"+other;
};

util.is_valid = function (str, pattern) {
    return !pattern || pattern.test(str);
};

util.is_valid_cellphone = function (str) {
    return this.is_valid(str, /^1\d{10}$/);
};

util.format_string = function () {
    if (arguments.length == 0) {
        return "";
    }

    var formated = arguments[0];
    var args = arguments;
    return formated.replace(
        /\{(\d+)\}/g,
        function (m, i) {
            var index = parseInt(i);
            if (index < 0 || index >= args.length - 1) {
                return "";
            }
            return args[index + 1];
        }
    )
};

if ($ === window.jQuery){
    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader("X-CSRFToken", $("input[name='csrfmiddlewaretoken']").val());
        }
    });
}

util.send_request = function (url, data, method, dest_element, end_callback, success_callback) {
    var error_callback = null;
    var event_label = JSON.stringify({
        url: url,
        type: method || "GET",
        data: data
    });
    data = data || {};
    !data["uid"] && (data["uid"]=util.get_local(util.KEY.user)||"");
    var ajax_obj = {
        type: method || "GET",
        url: url,
        data: data,
        error: function (result) {
            error_callback && error_callback();
            window.cnzz && cnzz.track_event("send_request", "error", event_label);
        }
    };

    if (dest_element) {
        var dest_html = $(dest_element).html();
        $(dest_element).html("正在加载...");
        var callback = success_callback;
        success_callback = function (data) {
            $(dest_element).html(data);
            callback && callback(data);
        };
        error_callback = function () {
            $(dest_element).html(dest_html);
        };
    }

    ajax_obj.complete = function (result) {
        end_callback && end_callback(result.responseText);
    };
    ajax_obj.success = function (result) {
        success_callback && success_callback(result);
        window.cnzz && cnzz.track_event("send_request", "success", event_label);
    };

    $.ajax(ajax_obj);
};

util.set_local = function (key, val) {
    try{
        window.localStorage.setItem(key, JSON.stringify(val));
    }
    catch(e){
        console.error("Error set local key="+key);
    }
};

util.set_url = function (url) {
    window.location.href = url;
};

util.clear_history = function(){
    window.exec && exec(util.func_stub(), util.func_stub(), "CommonPlugin", "clearHistory", ['']);
};

util.get_local = function (key) {
    var val = window.localStorage.getItem(key);
    return JSON.parse(val)||"";
};

util.add_query_to_url = function (link, key, val) {
    if (!key || !val){
        return link;
    }
    link = link || location.href;
    if (util.get_request(link)[key]){
        return link;
    }
    var query = key+"="+val;
    if (link.indexOf("?") >= 0){
        link += "&"+query;
    }
    else{
        link += "?"+query;
    }
    return link;
};

util.ShareObject = function (propaganda, desc, link, img_url) {
    this.desc = desc || "";
    this.propaganda = propaganda || document.title;
    if (util.rcode){
        this.propaganda = "[我的推荐码"+util.rcode+"]"+this.propaganda;
    }
    this.link = util.add_query_to_url(util.add_query_to_url(link||location.href, "rcode", (util.rcode||"")), "school", util.school);
    if (!img_url){
        var img = $("img").filter(function (x) {
                return this.naturalWidth > 120;
            })[0];
        img_url = img && util.server_url($(img).attr("src"));
    }

    this.imgUrl = (img_url&&util.server_url(img_url)) || util.server_url("/static/app/img/app_icon.png");
};

util.prepare_wx = function (wx, share_obj, wx_server)  {
    var location = window.location.href.split('#')[0];
    util.send_request(wx_server, {url: location}, null, null, function (res) {
        var json = JSON.parse(res);
        if (json.error){
            alert("微信认证失败！");
            return;
        }
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: json.appid, // 必填，公众号的唯一标识
            timestamp: json.timestamp, // 必填，生成签名的时间戳
            nonceStr: json.noncestr, // 必填，生成签名的随机串
            signature: json.signature,// 必填，签名，见附录1
            jsApiList: [
                "onMenuShareTimeline",
                "onMenuShareAppMessage",
                "onMenuShareQQ",
                "onMenuShareWeibo",
                "onMenuShareQZone",
                "showOptionMenu"
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });

        wx.ready(function(){

            (typeof share_obj === 'function') && (share_obj = share_obj());

            wx.onMenuShareTimeline({
                title: share_obj.propaganda, // 分享标题
                link: share_obj.link, // 分享链接
                imgUrl: share_obj.imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

            wx.onMenuShareAppMessage({
                title: share_obj.propaganda, // 分享标题
                desc: share_obj.desc, // 分享描述
                link: share_obj.link, // 分享链接
                imgUrl: share_obj.imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareQQ({
                title: share_obj.propaganda, // 分享标题
                desc: share_obj.desc, // 分享描述
                link: share_obj.link, // 分享链接
                imgUrl: share_obj.imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            wx.onMenuShareWeibo({
                title: share_obj.propaganda, // 分享标题
                desc: share_obj.desc, // 分享描述
                link: share_obj.link, // 分享链接
                imgUrl: share_obj.imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });

            wx.onMenuShareQZone({
                title: share_obj.propaganda, // 分享标题
                desc: share_obj.desc, // 分享描述
                link: share_obj.link, // 分享链接
                imgUrl: share_obj.imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        });
        wx.error(function(res){

            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。

        });
    });
};

util.adjust_img = function (selector, scale) {
    var imgs = $(selector);
    for (var i = 0; imgs && i < imgs.length; i++){
        var img = imgs[i];
        var usemap = $(img).attr("usemap");
        if (!$(img).attr("usemap")) {
            continue;
        }
        var areas = $(util.format_string("map[name='{0}']", usemap.replace("#", ""))).children();
        for (var j = 0; areas && j < areas.length; j++){
            var vals = $(areas[j]).attr("coords").split(",").map(function (x) {
                return parseInt(x)*scale;
            });
            $(areas[j]).attr("coords", vals.join(","));
        }
    }
};
util.toggle_one = function (my_func, other_func) {
    other_func && other_func();
    my_func && my_func();
};

util.add_touch = function (selector, url_pattern, attr) {
        attr = attr || [];
        $(selector).click(function () {
            var self = this;
            location.href = util.format_string.apply(util, [url_pattern].concat(attr.map(function (x) {
                return $(self).data(x)
            })));
        });
};

util.func_stub = function (val) {
    return function () {
        return val;
    };
};

util.log = function (msg) {
    exec(util.func_stub(), util.func_stub(), "CommonPlugin", "log", [msg]);
};

util.open_url = function (url) {
    if (window.exec){
        exec(util.func_stub(), util.func_stub(), "CommonPlugin", "startCordovaWebView", [url]);
    }
    else{
        location.href = url;
    }
};

util.share = function (share_obj) {
    if (!util.get_request(share_obj.link)["school"] && util.school){
        share_obj.link = util.add_query_to_url(share_obj.link, "school", util.school);
    }
    var propaganda = share_obj.propaganda;
    //Math.random()>0.5 && (share_obj.propaganda = "我在学车，小伙伴们快来帮我加个油！请点击网页内右下角“加油”按钮");
    window.exec && exec(util.func_stub(), util.func_stub(), "UserPlugin", "share", [JSON.stringify(share_obj)]);
    window.cnzz && cnzz.track_event(share_obj.propaganda, "share", share_obj.link);
    share_obj.propaganda = propaganda;
};

util.prepare_share = function (share_obj) {

    if (!share_obj){
        share_obj = new util.ShareObject($(document).text().substring(0, 20), document.title, location.href, $("img").first().attr("src")[0]);
    }

    function show_share(){
        share_obj.link = util.add_query_to_url(share_obj.link, "school", util.school);
        window.exec && exec(util.func_stub(), util.func_stub(), "CommonPlugin", "showMenu", ["share", JSON.stringify(share_obj)]);
    }

    if (!util.school){
        setTimeout(function () {
            show_share();
        }, 1000);
        return;
    }

    show_share();
};

util.show_star = function (selector, star_url_positive, star_url_negative) {
    star_url_positive = star_url_positive || "/static/app/img/star-positive.png";
    star_url_negative = star_url_negative || "/static/app/img/star-negative.png";
    selector = selector || ".js-star";
    $(selector).each(function () {
        if ($(this).children().length > 0){
            return;
        }
        var star = parseInt($(this).data("star")||0);
        for (var i = 1; i <= 5; i++){
            $(util.format_string("<img src='{0}' width='15px;' class='jb-margin-5-r'/>", i <= star ? star_url_positive : star_url_negative)).appendTo(this);
        }
    });
};

util.if_not_in_app = function (not_callback) {
    if (util.get_local("is_not_in_app")){
        not_callback && not_callback();
        return;
    }
    var may_not_in = true;
    try{
        exec(function(){
            may_not_in = false;
            console.log("is in app");
        }, function(){
            util.set_local("is_not_in_app", 1);
            not_callback && not_callback();
        }, "CommonPlugin", "log", ['check if log exist']);
    }
    catch(e){
        util.set_local("is_not_in_app", 1);
        not_callback && not_callback();
    }

    setTimeout(function () {
        if (may_not_in){
            util.set_local("is_not_in_app", 1);
            not_callback && not_callback();
        }
    }, 500);
};

util.update_star = function (selector, star, star_url_positive, star_url_negative) {
    star_url_positive = star_url_positive || "/static/app/img/star-positive.png";
    star_url_negative = star_url_negative || "/static/app/img/star-negative.png";
    $(selector).each(function () {
        var children = $(this).children();
        for (var i = 0; i < children.length; i++){
            $(children[i]).attr("src", i < star ? star_url_positive : star_url_negative);
        }
    });
};

util.has_attr = function (obj, attr) {
    return obj.attr(attr) !== undefined;
};

util.add_next_to_url = function (attr, _next) {
    $(".js-add-next").each(function () {
        if (util.has_attr($(this), attr)){
            var next = _next || util.get_request()["next"];
            next && $(this).attr(attr, util.add_query_to_url($(this).attr(attr), "next", encodeURIComponent(next)));
        }
    })
};

util.UUID = null;


document.addEventListener("deviceready", function () {
    util.UUID = window.device && window.device.uuid;
}, false);

util.place_on_area = function (id, area, img_height, y_offset){
    var rect = $(area).attr("coords").split(",").map(function (x) {
        return parseFloat(x);
    });
    var center = [(rect[0]+rect[2])/2, (rect[1]+rect[3])/2];
    var width = $(id).width();
    var height = $(id).height();
    $(id).css("left", center[0]-width/2).css("top", center[1]-height/2+(y_offset||0)).css("display", "block");
};

util.try_to_get_val = function (key, val) {
    return val || util.get_request()[key] || util.get_local(key);
};

util.dir = {
    X: "x",
    Y: "y"
};

util.is_overlap = function (a, b, dir) {

    function findSmallestY(div0, div1){
        return (div0.offset().top < div1.offset().top)? div0 : div1;
    }
    function yInstersection(div0, div1){
        var divY0 = findSmallestY(div0, div1);
        var divY1 = (div0 != divY0)? div0 : div1;

        return (divY0.offset().top + divY0.height()) - divY1.offset().top > 0;
    }

    function findSmallestX(div0, div1){
        return (div0.offset().left < div1.offset().left)? div0 : div1;
    }

    function xInstersection(div0, div1){
        var divX0 = findSmallestX(div0, div1);
        var divX1 = (div0 != divX0)? div0 : div1;

        return (divX0.offset().left + divX0.width()) - divX1.offset().left > 0;
    }

    if (!a || !b){
        return false;
    }


    var div0 = $(a);
    var div1 = $(b);
    if (div0.length === 0  || div1.length === 0){
        return false;
    }
    if (dir === util.dir.X){
        return xInstersection(div0, div1);
    }
    else if (dir === util.dir.Y){
        return yInstersection(div0, div1);
    }
    else{
        return (yInstersection(div0, div1) && xInstersection(div0, div1));
    }
};
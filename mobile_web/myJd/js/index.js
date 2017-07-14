/**
 * Created by liaoxueyan on 17/4/18.
 */

/*加载完毕事件,在该事件中写js代码,去获取dom元素就不会出现问题*/
window.onload = function () {
    //顶部的通栏滚动效果
    headerScroll();

    //倒计时效果
    cutDownTime();

    //轮播效果图
    banner();

}

/**
 * 通栏方法
 *  滚动变色:实现思路,获取顶部高度,获取滚动距离 ;
 *    滚动距离/顶部高度
 */
function headerScroll() {
    var navDom = document.querySelector(".jd_nav");//获取导航栏
    var offHeight = navDom.offsetHeight;
    /*自己的高度*/
    var offTop = navDom.offsetTop;
    /*距离顶部的高度*/
    var maxDistance = offHeight + offTop;

    var headerDom = document.querySelector(".jd_header");
    /*获取顶部栏*/

    window.onscroll = function () {//滚动事件
        //1、获取滚动距离
        var scrollDistance = window.document.body.scrollTop;
        //2、计算比例
        var percent = scrollDistance / maxDistance;
        if (percent > 1) {//大于1就是设置为1
            percent = 1;
        }
        //3、修改透明度(修改css样式 使用js修改样式,会变成行内式)
        headerDom.style.backgroundColor = 'rgba(201,21,35,' + percent + ')';
    }
}

/**
 * 倒计时
 */
function cutDownTime() {
    var totalHour = 3;
    //获取倒计时秒
    var totalSecond = 3 * 60 * 60;

    //获取所有需要修改的li标签
    /*querySelector 高级选择器传递一串,替代之前的
     document.getElementsByClassName()
     document.getElementsByName()
     document.getElementById()
     */
    var liArray = document.querySelectorAll('.main_content:nth-child(1) .content_top li');
    console.log(liArray);

    //开启定时器,//1秒钟执行一次
    var timerId = setInterval(function () {
        totalSecond--;//秒递减
        //计算时分秒
        var hours = Math.floor(totalSecond / 3600);// Math.floor取整,var
        var minutes = Math.floor(totalSecond % 36000 / 60);
        var seconds = Math.floor(totalSecond % 60);

        liArray[0].innerHTML = Math.floor(hours / 10);
        liArray[1].innerHTML = hours % 10;

        liArray[3].innerHTML = Math.floor(minutes / 10);
        liArray[4].innerHTML = minutes % 10;

        liArray[6].innerHTML = Math.floor(seconds / 10);
        liArray[7].innerHTML = seconds % 10;
    }, 1000);
}
/**
 * 简单轮播,不带拖动效果
 */
function banner() {
    //1、获取屏幕宽度
    var screenWidth = document.body.offsetWidth;
    //2、获取轮播图的ul
    var ulDom = document.querySelector('.jd_banner .banner_images');
    //3、获取ul下面的li标签
    var liArray = document.querySelectorAll(' .jd_banner .banner_images li');
    //4、获取索引
    var pointerArray = document.querySelectorAll('.banner_pointer li');

    console.log(document.querySelectorAll('.jd_banner .banner_pointer li.current'))

    //定义index记录当前的索引值
    var index = 1;//默认为第一个
    //开启定时器
    var timerId = setInterval(function () {
        index++;
        if (index == 9) {//超过索引了
            index = 1;
        }
        //修改ul的位置
        //css 3可以通过transform移动元素
        var xtrans = index * screenWidth * -1;
        console.log("--------" + xtrans);
        ulDom.style.transform = 'translateX(' + xtrans + 'px)';

        //更改指示器
        for (var i = 0; i < pointerArray.length; i++) {
            pointerArray[i].className = " ";//清空样式
        }
        pointerArray[index - 1].className = "current";
    }, 2000);
}
/**
 * 增加拖动功能的banner
 */
function banner_enhance() {
    /*
     * 1.自动的滚动起来    （定时器，过渡）
     * 2.点随之滚动起来     （改变当前点元素的样式）
     * 3.图片滑动           （touch事件）
     * 4.当不超过一定的滑动距离的时候  吸附回去  定位回去     （一定的距离  1/3  屏幕宽度  过渡）
     * 5.当超过了一定的距离的时候    滚动  到上一张 或 下一张  （一定的距离  1/3  屏幕宽度  过渡）
     * */

    /*获取到dom对象*/
    /*banner*/
    var banner = document.querySelector('.jd_banner');
    /*屏幕的宽度*/
    var w = banner.offsetWidth;
    /*图片盒子*/
    var imageBox = banner.querySelector('ul:first-child');/*querySelector只支持有效的css选择器*/
    /*点盒子*/
    var pointBox = banner.querySelector('ul:last-child');
    /*所有的点*/
    var points = pointBox.querySelectorAll('li');


    /*添加过渡*/
    var addTransition = function () {
        imageBox.style.webkitTransition = "all .2s";/*兼容*/
        imageBox.style.transition = "all .2s";
    };
    /*删除过渡*/
    var removeTransition = function () {
        imageBox.style.webkitTransition = "none";/*兼容*/
        imageBox.style.transition = "none";
    };
    /*改变位子*/
    var setTranslateX = function(translateX){
        imageBox.style.webkitTransform = "translateX("+translateX+"px)";
        imageBox.style.transform = "translateX("+translateX+"px)";
    };


    /*1.自动的滚动起来    （定时器，过渡）*/
    var index = 1;
    var timer = setInterval(function(){
        /*箱子滚动*/
        index  ++ ;
        /*定位  过渡来做定位的  这样才有动画*/
        /*加过渡*/
        addTransition();
        /*改变位子*/
        setTranslateX(-index*w);

    },4000);

    /*绑定一个过渡结束事件*/
    itcast.transitionEnd(imageBox,function(){
        console.log('transitionEnd');
        if(index >= 9){
            index = 1;
            /*做定位*/
            /*加过渡*/
            removeTransition();
            /*改变位子*/
            setTranslateX(-index*w);
        }else if(index <= 0){
            index = 8;
            /*加过渡*/
            removeTransition();
            /*改变位子*/
            setTranslateX(-index*w);
        }
        /*index 1-8  索引范围*/
        /*point 0-7 */
        setPoint();
    });

    /*2.点随之滚动起来     （改变当前点元素的样式）*/
    var setPoint = function(){
        /*把所有点的样式清除*/
        for(var i = 0 ; i < points.length ; i ++){
            points[i].className = " ";
            /* points[i].classList.remove('now');*/
        }
        points[index-1].className = "current";
    }

    /*3.图片滑动 touch事件）*/
    var startX = 0;
    var moveX = 0;
    var distanceX = 0;
    var isMove = false;

    //touchs事件只能在移动端使用
    imageBox.addEventListener('touchstart',function(e){
        /*清除定时器*/
        clearInterval(timer);
        startX = e.touches[0].clientX;
    });
    imageBox.addEventListener('touchmove',function(e){
        isMove = true;
        moveX = e.touches[0].clientX;
        distanceX = moveX - startX;/*distanceX  值  正负*/

        /*算出当前图片盒子需要定位的位子*/
        console.log(distanceX);

        /*将要去做定位*/
        var currX = -index*w + distanceX;
        /*删除过渡*/
        removeTransition();
        /*改变位子*/
        setTranslateX(currX);



    });
    imageBox.addEventListener('touchend',function(e){

        /*当超过了一定的距离的时候 */
        if(isMove && (Math.abs(distanceX) > w/3)){
            /*5.当超过了一定的距离的时候    滚动  到上一张 或 下一张  （一定的距离  1/3  屏幕宽度  过渡）*/
            if(distanceX > 0){
                index --;/*向右滑  上一张*/
            }else{
                index ++;/*向左滑 下一张*/
            }
            addTransition();
            setTranslateX(-index * w);
        }
        /*当不超过一定的滑动距离的时候*/
        else {
            /*4.当不超过一定的滑动距离的时候  吸附回去  定位回去     （一定的距离  1/3  屏幕宽度  过渡）*/
            addTransition();
            setTranslateX(-index * w);
        }

        /*重置*/
        startX = 0;
        moveX = 0;
        distanceX = 0;
        isMove = false;

        /*添加定时器*/
        clearInterval(timer);
        timer = setInterval(function(){
            /*箱子滚动*/
            index  ++ ;
            /*定位  过渡来做定位的  这样才有动画*/
            /*加过渡*/
            addTransition();
            /*改变位子*/
            setTranslateX(-index*w);
        },4000);
    });
}
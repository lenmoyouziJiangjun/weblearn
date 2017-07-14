/**
 * Created by liaoxueyan on 17/4/24.
 */

/**/
window.onload = function () {
    left_scroll();
    navigationItemClick();
}

/**
 * 自定义滑动事件
 * 左边滑动
 *    1、获取一些必须知道的东西:
 *       移动的dom元素:移动的ul
 *          获取ul父盒子的高度
 *          获取ul的高度
 *          获取移动的最大值,最小值
 *    2、通过touch事件进行滑动
 *
 *    3、手指松开实现弹性效果
 *       touchend事件
 */
function left_scroll() {
    //1、获取必须的东西
    //获取移动的ul
    var moveUL = document.querySelector(".main_left ul");
    //ul的搞度
    var ulHeight = moveUL.offsetHeight;

    //ul 父盒子的高度
    var parent = document.querySelector(".main_left");
    var parentHeight = parent.offsetHeight;

    // header 的高度,
    var headerHeight = document.querySelector(".header").offsetHeight;

    //计算移动的范围
    var minDistance = parentHeight - ulHeight - headerHeight;//移动最小值
    var maxDistance = 0;
    var delayDistance = 150;

    console.log(ulHeight + "-----" + parentHeight + "最小值:" + minDistance);

    //通过touch事件,修改UL进行移动
    var startY = 0;
    var moveY = 0;
    var distanceY = 0;//移动总距离

    moveUL.addEventListener("touchstart", function (event) {
        startY = event.touches[0].clientY;
        console.log(event);
        console.log(event.touches)
    });

    moveUL.addEventListener("touchmove", function (event) {
        //计算当前移动距离
        moveY = event.touches[0].clientY - startY;
        //计算移动距离
        var currentMoveY = (moveY + distanceY);
        //判断移动距离是否有效
        if (currentMoveY > maxDistance + delayDistance) {//大于最大距离,
            moveY = 0;
            distanceY = maxDistance + delayDistance;
        } else if (currentMoveY <= minDistance - delayDistance) {
            moveY = 0;
            distanceY = minDistance - delayDistance;
        }
        console.log("translate y ===" + (moveY + distanceY));
        //关闭过渡效果
        endTransition()
        //移动控件
        transformDistance(moveY + distanceY);
    });

    moveUL.addEventListener("touchend", function (event) {
        //修改移动的总距离
        distanceY += moveY;
        if (distanceY > maxDistance) {
            distanceY = maxDistance;
        } else if (distanceY < minDistance) {
            distanceY = minDistance;
        }
        //吸附回去
        //移动
        startTransition();
        transformDistance(distanceY);
    });

    /**
     * 开始移动
     */
    var startTransition = function () {
        moveUL.style.transition = "all .5s";
    }

    /**
     * 结束移动
     */
    var endTransition = function () {
        moveUL.style.transition = "";
    }

    /**
     * 移动距离
     * @param distance
     */
    var transformDistance = function (distance) {
        moveUL.style.transform = "translateY(" + (distance) + "px)"
    }
}

function ulClick(ul,fun) {
    
}


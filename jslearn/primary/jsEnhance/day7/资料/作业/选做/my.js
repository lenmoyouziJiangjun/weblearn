/**
 * Created by andy on 2015/7/17.
 */
function scroll(){
    if(window.pageYOffset != null)
    // ie9+ 以上的浏览器  其他的浏览器
    {
        return{
            top:window.pageYOffset,
            left:window.pageXOffset
        }
    }
    //声明dtd 的浏览器
    if(document.compatMode == 'CSS1Compat')
    {
        return {
            top: document.documentElement.scrollTop,
            left: document.documentElement.scrollLeft
        }
    }
    // 怪异模式的浏览器
    return{
        top: document.body.scrollTop,
        left: document.body.scrollLeft
    }
}
function $(id){return document.getElementById(id)}
function getStyle(obj,attr)
{
    if(obj.currentStyle)
    {
        return obj.currentStyle[attr];
    }
    else
    {
        return getComputedStyle(obj,null)[attr];
    }
}
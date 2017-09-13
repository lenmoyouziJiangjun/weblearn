/**
 * Created by lll on 17/9/7.
 * Description: 冒泡排序
 * Version:
 * Copyright:generalray4239@gmail.com
 */

function test() {
    console.log(bubbleSort([2, 1, 5, 3, 6, 4]));
}
/**
 * 冒泡排序
 * @param arr
 */
function bubbleSort(arr) {
    if (arr.length != 0) {
        //如果比较完备提前结束比较。（判断，如果本次比较没有移动任何元素，那么说明已经比较完成）
        var m = 0;
        var n = 0;
        //1.双重for循环。(外循环控制轮数)
        for (var i = 0; i < arr.length - 1; i++) {
            //开闭原则。（写在第一个for循环里，是为了，每轮比较初始化bool变量变为true。）
            var bool = true;
            //2.指定轮数和次数（内循环控制次数）
            for (var j = 0; j < arr.length - 1 - i; j++) {
                //3.判断是否符合标准。如果符合标准交换位置。
                //从小到大排列顺滑，如果前面的比后面的大，那么交换位置。
                if (arr[j] > arr[j + 1]) {
                    var temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    bool = false;
                }
                m++;
            }
            n++;
            //bool这个变量默认值为true;如果本轮比较有一对元素相互交换位置，那么也不能跳出循环。
            //但是，如果本轮比较没有任何元素相互交换位置，那么说明已经比较完成，可以跳出循环。
            if (bool) {
                break;
            }
        }
    }
    return arr
}


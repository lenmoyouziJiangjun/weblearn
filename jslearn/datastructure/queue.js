/**
 * Created by lll on 17/7/14.
 * Description: 队列
 * Version:
 * Copyright:generalray4239@gmail.com
 */
function Queue () {
    collection = [];
    this.print = function() {
        console.log(collection);
    };
    this.enqueue = function(element) {
        collection.push(element); //向数组末尾添加一个元素
    };
    this.dequeue = function() {
        return collection.shift(); //删除,并返回数组的第一个元素
    };
    this.front = function() {
        return collection[0];
    };
    this.size = function() {
        return collection.length;
    };
    this.isEmpty = function() {
        return (collection.length === 0);
    };
}
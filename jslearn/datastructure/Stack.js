/**
 * Created by lll on 17/7/14.
 * Description: 栈学习
 * Version:
 * Copyright:generalray4239@gmail.com
 */


/**
 * 创建一个栈
 * @constructor
 */
function Stack() {
    this.count = 0;
    this.storage = {};//定义一个数组,用来存储数据

    //Adds a value onto the end of the stack
    this.push = function (value) {
        this.storage[this.count] = value;
        this.count++;
    }

    //Removes and returns the value at the end of the stack
    this.pop = function () {
        if(this.count==0){
            return undefined;//没有数据
        }
        this.count--;
        var result = this.storage[this.count];//取出最后的元素
        delete this.storage[this.count];
        return result;
    }

    this.size = function () {
        return this.count;
    }

    //Returns the value at the end of the stack。 not delete
    this.peek=function () {
       return this.storage[this.count-1];
    }

}
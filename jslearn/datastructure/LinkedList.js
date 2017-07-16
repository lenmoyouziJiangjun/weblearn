/**
 * Created by lll on 17/7/14.
 * Description: 链表。链表的有点在于快速增加,删除。遍历没有数组效率高
 * Version:
 * Copyright:generalray4239@gmail.com
 */

window.onload(function () {
    var linkedList = new LinkedList();
    linkedList.add('Kitten0');
    linkedList.add('Kitten2');
    linkedList.add('Kitten3');
    linkedList.add('Kitten4');
    linkedList.addAt(1,'Kitten1');

    var size = linkedList.size();
    for(var i=0;i<size;i++){
        console.log(linkedList.elementAt(i)+"\n");
    }
    console.log("size===="+size);
    console.log("size===="+linkedList.indexOf("Kitten4"));
    console.log("size===="+linkedList.removeAt(3));

});


/**
 * 链表对象
 * @constructor
 */
function LinkedList() {
    var length = 0;//链表长度
    var head = null;//头指针
    //链表节点
    var Node = function (element) {
        this.element = element;//节点数据
        this.next = null;//节点的后继
    }

    this.size = function () {
        return length;
    }

    this.head = function () {
        return head;
    }

    /**
     * 添加元素
     * @param element
     */
    this.add = function (element) {
        var node = new Node(element);
        if (head == null) {
            head = node;
        } else {
            var currentNode = head;
            while (currentNode.next) {
                currentNode = currentNode.next;
            }
            currentNode.next = node;
        }
        length++;
    }

    /**
     * 删除元素
     * @param element
     */
    this.remove = function (element) {
        var currentNode = head;
        var previousNode;//前驱节点
        if (currentNode.element == element) {
            head = currentNode.next;//移除连边
        } else {
            while (currentNode.element != element) {
                previousNode = currentNode;
                currentNode = currentNode.next;
            }
            previousNode.next = currentNode.next;//前驱的后继等于找到的后继。
        }
        length--;
    }

    this.isEmpty = function () {
        return length === 0;//恒等于
    }

    /**
     * 元素索引
     * @param element
     * @returns {number}
     */
    this.indexOf = function (element) {
        var currentNode = head;
        var index = -1;
        while (currentNode) {
            index++;
            if (currentNode.element == element) {
                return index;
            }
            currentNode = currentNode.next;
        }
        return -1;
    }

    /**
     * 获取第index个元素
     * @param index
     * @returns {*}
     */
    this.elementAt = function (index) {
        var currentNode = head;
        var count = 0;
        while (count < index) {
            count++;
            currentNode = currentNode.next;
        }
        return currentNode.element;
    }

    /**
     * 指定位置添加元素
     * @param index
     * @param element
     * @returns {boolean}
     */
    this.addAt = function (index, element) {
        var node = new Node(element);

        var currentNode = head;
        var previousNode;
        var currentIndex = 0;

        if (index > length) {
            return false;
        }

        if (index === 0) {
            node.next = currentNode;
        } else {
            while (currentIndex < index) {
                previousNode = currentNode;
                currentNode = currentIndex.next;
                currentIndex++;
            }
            node.next = currentNode;
            previousNode.next = node;
            length++;
        }
    }

    this.removeAt = function (index) {
        var currentNode = head;
        var previousNode;
        var currentIndex = 0;
        if (index < 0 || index > length) {
            return null;
        }
        if (index === 0) {
            head = currentNode.next;
        } else {
            while (currentIndex < index) {
                currentIndex++;
                previousNode = currentNode;
                currentNode = currentNode.next;
            }
            previousNode.next = currentNode.next
            length--;
            return currentNode.element;
        }
    }
}


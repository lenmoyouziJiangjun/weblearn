/**
 * Created by lll on 17/7/17.
 * Description: 堆
 *          一般都用数组来表示堆，i结点的父结点下标就为(i – 1) / 2。它的左右子结点下标分别为2 * i + 1和2 * i + 2。如第0个结点左右子结点下标分别为1和2
 * Version:
 * Copyright:generalray4239@gmail.com
 */
let MinHeap = function() {

    let heap = [null];

    this.insert = function(num) {
        heap.push(num);
        if (heap.length > 2) {
            let idx = heap.length - 1;
            while (heap[idx] < heap[Math.floor(idx/2)]) {
                if (idx >= 1) {
                    [heap[Math.floor(idx/2)], heap[idx]] = [heap[idx], heap[Math.floor(idx/2)]];
                    if (Math.floor(idx/2) > 1) {
                        idx = Math.floor(idx/2);
                    } else {
                        break;
                    };
                };
            };
        };
    };

    this.remove = function() {
        let smallest = heap[1];
        if (heap.length > 2) {
            heap[1] = heap[heap.length - 1];
            heap.splice(heap.length - 1);
            if (heap.length == 3) {
                if (heap[1] > heap[2]) {
                    [heap[1], heap[2]] = [heap[2], heap[1]];
                };
                return smallest;
            };
            let i = 1;
            let left = 2 * i;
            let right = 2 * i + 1;
            while (heap[i] >= heap[left] || heap[i] >= heap[right]) {
                if (heap[left] < heap[right]) {
                    [heap[i], heap[left]] = [heap[left], heap[i]];
                    i = 2 * i
                } else {
                    [heap[i], heap[right]] = [heap[right], heap[i]];
                    i = 2 * i + 1;
                };
                left = 2 * i;
                right = 2 * i + 1;
                if (heap[left] == undefined || heap[right] == undefined) {
                    break;
                };
            };
        } else if (heap.length == 2) {
            heap.splice(1, 1);
        } else {
            return null;
        };
        return smallest;
    };

    this.sort = function() {
        let result = new Array();
        while (heap.length > 1) {
            result.push(this.remove());
        };
        return result;
    };

};

let MaxHeap = function() {

    let heap = [null];

    this.print = () => heap;

    this.insert = function(num) {
        heap.push(num);
        if (heap.length > 2) {
            let idx = heap.length - 1;
            while (heap[idx] > heap[Math.floor(idx/2)]) {
                if (idx >= 1) {
                    [heap[Math.floor(idx/2)], heap[idx]] = [heap[idx], heap[Math.floor(idx/2)]];
                    if (Math.floor(idx/2) > 1) {
                        idx = Math.floor(idx/2);
                    } else {
                        break;
                    };
                };
            };
        };
    };

    this.remove = function() {
        let smallest = heap[1];
        if (heap.length > 2) {
            heap[1] = heap[heap.length - 1];
            heap.splice(heap.length - 1);
            if (heap.length == 3) {
                if (heap[1] < heap[2]) {
                    [heap[1], heap[2]] = [heap[2], heap[1]];
                };
                return smallest;
            };
            let i = 1;
            let left = 2 * i;
            let right = 2 * i + 1;
            while (heap[i] <= heap[left] || heap[i] <= heap[right]) {
                if (heap[left] > heap[right]) {
                    [heap[i], heap[left]] = [heap[left], heap[i]];
                    i = 2 * i
                } else {
                    [heap[i], heap[right]] = [heap[right], heap[i]];
                    i = 2 * i + 1;
                };
                left = 2 * i;
                right = 2 * i + 1;
                if (heap[left] == undefined || heap[right] == undefined) {
                    break;
                };
            };
        } else if (heap.length == 2) {
            heap.splice(1, 1);
        } else {
            return null;
        };
        return smallest;
    };
};
/**
 * Created by lll on 17/9/20.
 * Description:
 * Version:
 * Copyright:generalray4239@gmail.com
 */

/**
 *
 * @param id
 */
function getElement(id) {
   return document.getElementById(id);
}

/**
 *
 * @param ele
 * @returns {Element|*|Node}
 */
function getFirstChildNode(ele) {
    try {
        return ele.firstElementChild||ele.firstChild;
    }catch (e){
        return ele.firstChild;
    }

}

/**
 *
 * @param ele
 * @returns {Element|*|Node}
 */
function getLastChildNode(ele) {

    try {
        return ele.lastElementChild||ele.lastChild;//lastElementChild有兼容性问题
    }catch (e){
        return ele.lastChild;
    }
}


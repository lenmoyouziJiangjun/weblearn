/**
 * Created by wuqi on 12/14/16.
 */

$(function () {
    if (!window.Sortable) {
        return;
    }

    var tag = {
        sortable: "js-sortable",
        addable: "js-addable",
        my_channels: "js-my-channels",
        recommended_channels: "js-recommended-channels",
        removable: "js-removable",
        edit: "#js-edit"
    };

    function attach(is_attach) {
        if (is_attach){
            sort_obj = Sortable.create(document.getElementById(tag.my_channels), {
                ghostClass: "ghost",
                draggable: "."+tag.sortable
            });
        }
        else{
            sort_obj && sort_obj.destroy();
            sort_obj = undefined;
        }
    }

    function get_my_channels(){
        return $("#"+tag.my_channels+">*").map(function () {
            return {id: $(this).attr("data-id"), name: $(this).text().trim()};
        });
    }

    function edit() {
        var is_editing = !last_order;
        if (is_editing){
            last_order = get_my_channels();
        }
        else {
            var cur_order = get_my_channels();
            var has_change = cur_order.length !== last_order.length;
            for (var i = 0; !has_change && i < last_order.length; i++){
                if (cur_order[i].id !== last_order[i].id){
                    has_change = true;
                    break;
                }
            }
            if (has_change){
                var arr_str = JSON.stringify(cur_order.toArray());
                util.send_request("/channel",
                    {
                        "ordered": arr_str
                    },
                    "POST",
                    null,
                    null,
                    function () {
                        window.exec && exec(null, null, "CommonPlugin", "updateUserChannel", [arr_str]);
                    }
                );
            }
            last_order = undefined;
        }
        $(tag.edit).html(is_editing ? "完成" : "编辑");
        window.exec && exec(null, null, "CommonPlugin", "enableConfirmBack", [is_editing ? 1 : 0, "正在编辑中，是否放弃保存?"]);
        attach(is_editing);
    }

    var sort_obj = undefined;
    var last_order = undefined;

    $(tag.edit).click(edit);

    $("."+tag.removable).click(function () {
        if ($(this).hasClass(tag.addable)){
            if (!sort_obj){
                edit();
            }
            $(this).removeClass(tag.addable).addClass(tag.sortable).appendTo($("#"+tag.my_channels));
        }
        else if ($(this).hasClass(tag.sortable) && !!sort_obj){
            $(this).removeClass(tag.sortable).addClass(tag.addable).prependTo($("#"+tag.recommended_channels));
        }
    });
});

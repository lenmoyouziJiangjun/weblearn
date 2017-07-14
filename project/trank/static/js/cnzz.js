/**
 * Created by wuqi on 4/26/16.
 */

var cnzz = window.cnzz || {};

cnzz.track_event = function (category,action,label,value,nodeid) {
    console.log("track_event: "+[category||"",action||"",label||"",value||"",nodeid||""].join("+"));
    window._czc && _czc.push(["_trackEvent",category,action,label,value,nodeid]);
};

cnzz.set_var = function (name, value, time) {
    window._czc && _czc.push("_setCustomVar", name, value, time);
};

(function () {
    var event_map = {};
    cnzz.begin_event = function (key, category,action, label) {
        event_map[key] = [category||"", action||"", label||"", Date.now()];
    };
    cnzz.end_event = function (key, category,action, label) {
        if (!event_map[key]){
            return;
        }

        label = label || event_map[key][2];
        if (label.indexOf("duration") < 0){
            label += "-duration";
        }
        cnzz.track_event(category||event_map[key][0], action||event_map[key][1], label, (Date.now()-event_map[key][3])/1000);
    };
})();

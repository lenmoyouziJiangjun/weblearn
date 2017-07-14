/**
 * Created by wuqi on 12/19/16.
 */

var play_records = window.play_records || {};

play_records.init = function (action, num) {
    if (!window.exec){
        console.log("window.exec not defined");
        return;
    }

    exec(function (video_ids) {
        var ids = video_ids.split(",");
        playlist.load_data_param = function (category, start, num) {
            var sub = ids.slice(start, num);
            ids.shift(num);
            return {
                rooms: sub.join(",")
            }
        };
        playlist.load_data(playlist.load_data_param(null, 0, num));
    }, null, "CommonPlugin", action, []);
};
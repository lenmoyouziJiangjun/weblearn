/**
 * Created by wuqi on 12/13/16.
 */

$(function () {
   util.set_local(util.KEY.user, util.get_request()["uid"]||"");

   window.exec = (window.cordova && cordova.require("cordova/exec")) || function (success) {
        console.log("ERROR:不应该到这儿");
        success&&success("1232,124124,125135,1512");
   };

   window.play = function (url, video_id){
      window.exec && exec(null, null, "CommonPlugin", "play", [url, video_id]);
   };
});
const fs = require('fs');
const TS = require("unix-timestamp");
const schedule = require("node-schedule");

const cache_dir = __dirname+"/static_content/images/cache/";
const cache_retention_duration = 1296000; // 15 days ------ 30 days = 2592000

function clean(){
  let files = fs.readdirSync(cache_dir);
  var files_to_delete = files.filter(function(file){
    let file_path = cache_dir+file;
    let fileMtime = fs.statSync(file_path).mtime.getTime() / 1000;
    if ((TS.now() - fileMtime) >= cache_retention_duration) {
      return true;
    }
    return false;
  })
  //delete old images
  console.log("***Cleaning.. "+files_to_delete.length+" file(s) ***");
  console.log("start process: "+TS.now());
  for (var i = 0; i < files_to_delete.length; i++) {
    fs.unlink(cache_dir+files_to_delete[i],function(){});
  }
  files_to_delete = [];
  console.log("end process: "+TS.now());
  console.log("******");
  console.log("");
}

schedule.scheduleJob('0 0 * * *', function(){
  clean();
})

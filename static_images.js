const express = require('express');
const app = express();
const sharp = require('sharp');
const fs = require('fs');
const touch = require("touch");
//vars
const content_folder = __dirname+"/static_content/images/";
const cache_folder = __dirname+"/static_content/images/cache/";
//vars

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.get("/images/*/*/*",function(req, res){
  //let uurl = req.url.replace(req.url.substring(req.url.indexOf('?'), req.url.length),"");
  var clean_uri = req.originalUrl
  if (clean_uri.indexOf("?") > -1) {
    clean_uri = req.originalUrl.substring(0, req.originalUrl.indexOf("?"));
  }
  let components = clean_uri.replace("/images/","").split("/");
  let width = components[0];
  let height = components[1];
  let file_name = components[2];
  if (width == "" || height == "" || file_name == "" || !isNumeric(width) || !isNumeric(height) ) {
    res.send(""); // should return dummy image and maybe inform me
    return false;
  }
  let cached_file_name = width+"-"+height+"-"+file_name;
  let original_file = content_folder+file_name;
  let cached_file = cache_folder+cached_file_name;
  if (fs.existsSync(cached_file)) {
    res.sendFile(cached_file);
    touch(cached_file);
    return false;
  }
  if (fs.existsSync(original_file)) {
    sharp(original_file)
    .resize(parseInt(width), parseInt(height))
    .toFile(cached_file,function(err,info){
      if (!err) {
        res.sendFile(cached_file);
      }
    });
    return false;
  }
  res.send(""); // should return dummy image and maybe inform me
})
app.listen(3001);

function isNumeric(d){
  return /^\d+$/.test(d);
}

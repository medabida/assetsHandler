const express = require('express');
const formidable = require('formidable');
const app = express();
//helper
const path = require('path');
const randSTR = require("randomstring");
const isImage = require('is-image');
//helper
const main_upload_folder = __dirname+"/static_content/";

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/upload',function(req, res){
  var form = new formidable.IncomingForm();
  form.parse(req);
  var new_file_name = randSTR.generate(50);
  form.on('fileBegin', function (name, file){
    if (isImage(file.name)) {
      file.path = main_upload_folder + "images/" + new_file_name+path.extname(file.name);
    }
    //should investigate more on where formidable will store the image if no file.path is set.
  });
  form.on('file', function (name, file){
    if (isImage(file.name)) {
      res.send(JSON.stringify({status: "1", filename: new_file_name+path.extname(file.name)}));
    }else{
      res.send(JSON.stringify({status: "0", filename: ""}));
    }
  });

})

app.listen(3000);

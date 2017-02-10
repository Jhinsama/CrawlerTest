(function() {
  "use strict";
  const http = require("http");
  const fs = require("fs");
  const path = require("path");

  const urlList = JSON.parse(fs.readFileSync('imagesFile.json','utf8'));

  function getHttpReqCallback(imgSrc, dirName, index) {
    // var fileName = index + "-" + path.basename(imgSrc);
    var fileName = imgSrc.split('%20')[2] + '.' + imgSrc.split('.')[imgSrc.split('.').length-1]
    var callback = function(res) {
      console.log("request: " + imgSrc + " return status: " + res.statusCode);
      var contentLength = parseInt(res.headers['content-length']);
      var fileBuff = [];
      res.on('data', function (chunk) {
        var buffer = new Buffer(chunk);
        fileBuff.push(buffer);
      });
      res.on('end', function() {
        console.log("end downloading " + imgSrc);
        if (isNaN(contentLength)) {
          console.log(imgSrc + " content length error");
          return;
        }
        var totalBuff = Buffer.concat(fileBuff);
        console.log("totalBuff.length = " + totalBuff.length + " " + "contentLength = " + contentLength);
        if (totalBuff.length < contentLength) {
          console.log(imgSrc + " download error, try again");
          startDownloadTask(imgSrc, dirName, index);
          return;
        }
        fs.appendFile(dirName + "/" + fileName, totalBuff, function(err){});
      });
    };

    return callback;
  }

  var startDownloadTask = function(imgSrc, dirName, index) {
    console.log("start downloading " + imgSrc);
    var req = http.request(imgSrc, getHttpReqCallback(imgSrc, dirName, index));
    req.on('error', function(e){
      console.log("request " + imgSrc + " error, try again");
      startDownloadTask(imgSrc, dirName, index);
    });
    req.end();
  }

  urlList.forEach(function(item, index, array) {
    startDownloadTask(item, './getImages/', index);
  })
})();
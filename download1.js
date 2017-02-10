var fs = require("fs");
var path = require('path');
var async = require("async");
var request = require('request');

var index = 1;

var imageLinks = []
var data = fs.readFileSync('imagesFile.json','utf8')
imageLinks = JSON.parse(data)
//['http://konachan.net/image/9d02455ab66970f0c0128bb1a4362d09/Konachan.com%20-%20235907%203d%20building%20landscape%20nobody%20original%20scenic%20tree%20waisshu_%28sougyokyuu%29%20water.png','http://i1.umei.cc/uploads/tu/201701/28/tojckcrytxv.jpg']

var downloadImage = function(src, dest, callback) {
    request.head(src, function(err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
        console.dir(res.statusCode);
        if (src) {
            request(src).pipe(fs.createWriteStream(dest)).on('close', function() {
                callback(null, dest);
            });
        }
    });
};

async.mapSeries(imageLinks, function(item, callback) {
    setTimeout(function() {
        var destImage = path.resolve("./getImages/", index++ + '.' +item.split(".")[item.split(".").length -1]);
        downloadImage(item, destImage, function(err, data){
            console.log(data);
        });
        callback(null, item);
    }, 100);
}, function(err, results) {});
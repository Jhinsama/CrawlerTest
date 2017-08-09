var fs = require('fs') //引入文件系统模块
var Crawler = require('crawler') //引入数据抓取模块
var imagesListFile = []
var imagesFile = []
var errorFile = []
var index = 0

var data = fs.readFileSync("imagesListFile.json","utf8")
imagesListFile = JSON.parse(data)

// var errData = fs.readFileSync("errorFile.json","utf8")
// imagesListFile = JSON.parse(errData)

var c = new Crawler({
    maxConnections: 10
})

imagesListFile.forEach(url=>{
    getImagesFile(url,0)
})

function getImagesFile(url,getCount){
    c.queue([{
        uri: url,
        callback: function (error, res, done) {
            if(error){
                console.log(error);
            }else{
                var $ = res.$
                var imageFile = $('#image').attr('src')
                if(imageFile == undefined && getCount < 3){
                    getImagesFile(url,getCount+1)
                }else if(getCount >= 10){
                    errorFile.push(url)
                    console.log(index++ + ' error ' + url.split('/')[url.split('/').length-2]);
                }else{
                    imagesFile.push('http:' + imageFile)
                    console.log(index++ + ' ' + url.split('/')[url.split('/').length-2]);
                }
                if(imagesFile.length + errorFile.length == imagesListFile.length){
                    fs.writeFileSync('imagesFile.json',JSON.stringify(imagesFile))
                    if(errorFile.length > 0){
                        fs.writeFileSync('errorFile.json',JSON.stringify(errorFile))
                    }
                }
            }
            done();
        }
    }]);
}
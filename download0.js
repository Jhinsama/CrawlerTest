const fs = require('fs')
const download = require('download')


var index = 0 // 定义从第几个开始下载
var nowDownNum = 0 // 当前同时下载的文件数量
var doneDownNum = Number(fs.readFileSync('doneDownNum.txt','utf8')); // 下载完成的数量

// 判断是否从第一个图片开始下载
fs.exists('doneDownNum.txt', function(exists){
    if(exists){
        doneDownNum = Number(fs.readFileSync('doneDownNum.txt','utf8'));
        index = doneDownNum
    }
});

var imageLinks // 图片链接集合

// 查找图片路径列表,如果有就执行下载方法
fs.exists('imagesFile.json', function(exists){
    if(exists){
        imageLinks = JSON.parse(fs.readFileSync('imagesFile.json','utf8'));
        downloadImg(imageLinks[index],'开始下载: ')
    }else{
        console.log("未找到图片路径列表数据");
    }
});

// 定义图片下载方法
function downloadImg(URL,downStat){
    nowDownNum += 1 // 每次开始下载就加一
    var ImgName = URL.split('%20')[2] + '.' + URL.split('.')[URL.split('.').length-1] //定义下载的文件名
    console.log(downStat + ImgName);
    download(URL).pipe(fs.createWriteStream('getImages/'+ImgName)).on('close',function(){
        var imageSize = fs.statSync('getImages/'+ImgName).size
        if(imageSize < 2048){
            downloadImg(URL,'再次下载: ')
            return
        }
        console.log('完成下载' + ImgName)
        nowDownNum -= 1 // 每次完成下载就减一
        doneDownNum += 1 // 每次完成下载就加一
        index += 1
        if(index < imageLinks.length){
            downloadImg(imageLinks[index],'开始下载: ')
            fs.writeFileSync('doneDownNum.txt',doneDownNum)
        }else if(index = imageLinks.length){
            fs.unlink('doneDownNum.txt',function(){
                console.log("全部图片下载完成");
            })
        }
    })
    if(nowDownNum < 10){ //定义当前可同时下载的文件数量
        index += 1
        if(index < imageLinks.length){downloadImg(imageLinks[index],'开始下载: ')}
    }
}
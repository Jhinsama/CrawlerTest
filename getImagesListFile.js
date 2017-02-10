var fs = require('fs') //引入文件系统模块
var Crawler = require('crawler') //引入数据抓取模块
var imagesListFile = [] //图片地址的集合
var index = 1

var imgList = {
    url:'http://konachan.net',
    tags:'3d',
    pageCount:1
}
//获取每页图片列表中每张图片的地址
var c = new Crawler({
    maxConnections: 10
})
getImgFile(imgList.url,1,imgList.tags,imgList.pageCount)
function getImgFile(url,pag,tags,pageCount){
    c.queue([{
        uri: url + '/post?page=' + pag + '&tags=' + tags,
        callback:function(error, res, done){
            if(error){
                console.log(error);
            }else{
                var $ = res.$
                var PageCount = $('#paginator .pagination a:nth-last-child(2)').text()
                console.log(PageCount);
                pageCount = 0 ? PageCount : pageCount
                $('.thumb').each(function(){
                    var imgfile = $(this).attr('href')
                    imagesListFile.push(url + imgfile)
                    console.log(index++ + ' ' + imgfile.split('/')[imgfile.split('/').length-2]);
                })
                if(pag < pageCount){
                    getImgFile(url,pag+1,tags,pageCount)
                }else{
                    fs.writeFileSync('imagesListFile.json',JSON.stringify(imagesListFile))
                }
            }
            done();
        }
    }]);
}
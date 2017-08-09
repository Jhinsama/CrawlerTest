const fs = require('fs');
const http = require('http');
const https = require('https');
const cheerio = require('cheerio');

function getWebData(url,callback,encoding){
    if(url.indexOf('http://')!=0&&url.indexOf('https://')!=0){console.log("this URL is wrong");return;}
    var server=url.indexOf('https')==0?https:http;
    server.get(url,function(res){
        var arr = res.req.path.split('/');
        arr[arr.length-1]='';
        var req = {
            scheme:url.split('://')[0],
            host:res.socket._host,
            path:arr.join('/')
        }
        if(encoding)res.setEncoding(encoding);
        var data='';
        res.on('data',function(chunk){
            data+=chunk;
        });
        res.on('end',function(){
            callback(data,req);
        });
    }).on('error',function(){
        callback(false);
    })
}
function download(options){
    if(!options)return;
    if(typeof options=='string'){options={url:options}}
    if(!options.url){console.log("this URL is undefind");return;}
    if(options.url.indexOf('http')!=0){console.log("this URL is wrong");return;}
    var url=options.url,
        path=options.path?(options.path.split('/')[options.path.split('/').length-1]==''?options.path:(options.path+'/')):'',
        name=options.name?options.name:url.split('/')[url.split('/').length-1],
        encoding=options.encoding?options.encoding:"binary",
        callback=options.callback;
    var arr=path.split('/'),str='';
    for(var i=0;i<arr.length;i++){
        if(arr[i]!=''){
            if(i>0)str+='/';
            str+=arr[i];
            if(!fs.existsSync(str)){
                try{
                    fs.mkdirSync(str);
                }catch(err){
                    if(callback)callback(false);
                    return;
                }
            }
        }
    }
    getWebData(url,function(data){
        if(data){
            try{
                fs.writeFileSync(path+name,data,encoding);
                if(callback)callback(true);
            }catch(err){
                if(callback)callback(false);
            }
        }else{
            if(callback)callback(false);
        }
    },encoding);
}

getWebData('https://github.com/cheeriojs/cheerio',function(data,req){
    if(data){
        var $ = cheerio.load(data),arr = $('img'),count = arr.length,currentNum = 0,load = 0,done = 0;
        var loop = function(){
            currentNum+=1;
            load+=1;
            download({
                url:arr.eq(currentNum-1).attr('src'),
                path:'images',
                callback:function(res){
                    done++;
                    load--;
                    if(currentNum < count && load < 5)loop();
                    if(!res){
                        console.log(arr.eq(currentNum-1).attr('src'));
                    }
                }
            })
            if(currentNum < count && load < 5)loop();
        }
        loop();
    }else{
        console.log("error");
    }
})
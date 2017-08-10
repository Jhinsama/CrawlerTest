# 关于Crawler的小实验

## 小记

### 17.02.07 实现分两步获取K站相关标签的图片的链接
> 运行顺序为 getImagesListFile.js  getImagesFile.js

### 17.02.10 新增使用第三方模块"download"的下载方法
> 文件名为download0.js

### 17.08.09 试着使用cheerio抓取网站数据并实现下载方法
> getWebData(网址,回调函数[,编码格式])
> download({网址url,路径path,文件名name,编码格式encoding,回调函数callback})
> spliceURL({协议scheme,域名host,路径path,网址url})
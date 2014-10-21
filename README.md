# WebUI-for-UPYUN

部署在UPYUN空间的UPYUN管理器，支持桌面和移动平台

##Demo

http://upyun-manager.b0.upaiyun.com/index.html

![desktop](http://huangchaosuper.cn/images/upyun/2014-06-01_174606.png)

![desktop](http://huangchaosuper.cn/images/upyun/2014-06-01_174930.png)

![mobile](http://huangchaosuper.cn/images/upyun/2014-06-01_174848.png)

![mobile](http://huangchaosuper.cn/images/upyun/2014-06-01_174743.png)

##安装部署

下载最新代码到本地：

上传到UPYUN文件空间或任意静态空间

##基于PhoneGap封装的客户端

如果大家感兴趣，可以快速封装Android、iOS、Windows Phone、Amazon Fire OS、BlackBerry 10、Firefox OS、Ubuntu、Windows 8、Tizen的客户端。

具体方法参考http://docs.phonegap.com/en/edge/guide_platforms_index.md.html

安装phonegap:`npm intall -g phonegap`（可能要翻墙）

创建基本结构:`phonegap create phonegap-for-UPYUN`

将本程序的所有文件copy到www目录下`phonegap remote build android`即可

图标，跨域，本地访问权限配置参考[phonegap](http://docs.phonegap.com/en/edge/guide_platforms_index.md.html)官方文档，在这里恕不赘述。

![phonegap](http://huangchaosuper.cn/images/upyun/2014-06-08_142533.png)

##已经完成功能

支持上传、下载，目录创建，信息获取. 所有功能使用restful API跨域访问，取代原有form。

##还需要完善的功能

文件/目录删除，问题已经提交upyun工程师，将会在下一个版本支持。

对于上传功能，已经将测试用例提交给upyun工程师，下一个版本应该会完美支持或者有比较好的解决方案。

在Chrome测试通过，理论上支持Firefox和IE，但是未经过测试。

##另外为upyun做的简单服务器代理

详细信息请参考源代码proxy.js，非常简单，如果您的系统服务端不支持跨域，可以使用这个只有20行的代理转发，实现跨域。

##另外一个项目[node-for-upyun](https://gitcafe.com/huangchaosuper/node-for-UPYUN)，希望大家多多支持

https://gitcafe.com/huangchaosuper/node-for-UPYUN


更多资源，请关注：[http://blog.huangchaosuper.cn](http://blog.huangchaosuper.cn)
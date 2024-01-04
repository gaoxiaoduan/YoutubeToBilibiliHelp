<h2 align="center">win系统使用教程</h2>

> 以下是win系统用户教程，unix系统使用同理

## 所需依赖：

- [git](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git)

- [node](https://nodejs.org/en)

```bash
#安装pnpm
npm i pnpm -g 

# 下载项目代码
git clone https://github.com/gaoxiaoduan/YoutubeToBilibiliHelp.git

# 进入项目所在的文件夹中
cd YoutubeToBilibiliHelp
#安装需要的依赖
pnpm install

# 安装过程中可能会出现的报错
# ERROR: Failed to set up Chromium r782078! Set "PUPPETEER_SKIP_DOWNLOAD" env variable to skip download
# 解决方法，在终端跳过pptr的下载，如下
SET PUPPETEER_SKIP_DOWNLOAD='true' #win下使用
export PUPPETEER_SKIP_DOWNLOAD='true' #linux下使用
```

## 安装yt-dlp

> 油管视频下载工具
>
> 链接地址：[https://github.com/yt-dlp/yt-dlp#installation](https://github.com/yt-dlp/yt-dlp#installation)
>
> 有多种安装方式
>
> 这里选择win系统进行安装

![image.png](https://cdn.jsdelivr.net/gh/gaoxiaoduan/picGoImg@main/images/202305251129146.png)

- 点击下载
  ![image.png](https://cdn.jsdelivr.net/gh/gaoxiaoduan/picGoImg@main/images/202305251129461.png)

- 添加到环境变量
  ![image.png](https://cdn.jsdelivr.net/gh/gaoxiaoduan/picGoImg@main/images/202305251129370.png)

- 验证环境变量是否添加成功
  ![image.png](https://cdn.jsdelivr.net/gh/gaoxiaoduan/picGoImg@main/images/202305251130475.png)

## 安装ffmpeg

> 一个视频处理工具
>
> 链接地址：[https://github.com/yt-dlp/FFmpeg-Builds](https://github.com/yt-dlp/FFmpeg-Builds)

- 下载对应的环境安装包
  ![image.png](https://cdn.jsdelivr.net/gh/gaoxiaoduan/picGoImg@main/images/202305251130129.png)
- 添加到环境变量
  ![image.png](https://cdn.jsdelivr.net/gh/gaoxiaoduan/picGoImg@main/images/202305251130077.png)
- 测试是否生效
  ![image.png](https://cdn.jsdelivr.net/gh/gaoxiaoduan/picGoImg@main/images/202305251130083.png)

## 配置油管对应的监听频道

- 注意：.env.template和upload.config.template.json都是模版文件
- 注意：需要删除template后缀使用


1. `.dev`配置文件，主要是配置解决验证码平台的账号密码

```bash
# 平台链接：http://www.ttshitu.com/
# 用处：过平台的二次验证
TJ_USERNAME="xxx" #打码平台账号
TJ_PASSWORD="xxx" #打码平台密码
```

2. `upload.config.json`配置文件

- 主要功能：监听用户频道信息
- json文件有多个配置字段，具体可以查看`typing.d.ts`类型定义
- 但是只有几个字段是监听所必要的，下面用*号标记出来，也可以直接使用upload.config.template.json
- ⚠️注意：这个文件项目中是不存在的，需要自己创建

```json3
{
  // 支持上传的平台，目前仅支持B站
  "supported_target_platform": [
    "BZ"
  ],
  "uploads": [
    // 要监听的频道内容，支持多频道监测
    {
      // 要监听的用户名
      "user": "user1", 
      // *监听频道的地址,若要监听油管短视频，可把url最后的videos换成shorts
      "user_url": "https://www.youtube.com/@addyvisuals/videos",
      // *发布时候，标题党前缀，若不需要设置，可以设置为空字符串""
      "publish_prefix": "[xxx]",
      // *发布B站分区，默认是B站推荐分区，也就是[0,0]
      "blibli_classification": [
        0,
        0
      ],
      // *视频的自定义tag，最多支持10个tag
      "prefix_tags": [
        "科技",
        "技术"
      ],
      // 是否跳过下载字幕 true:跳过 false:下载 -> 默认下载:false
      skip_down_subs: false,
      // 是否跳过翻译标题 true:跳过 false:翻译 -> 默认翻译:false
      skip_translation_title: false,
      // 是否跳过上传缩略图 true:跳过 false:上传 -> 默认上传:false
      skip_upload_thumbnail: false,
      // 投稿分类 true:自制 false:转载 -> 默认转载:false
      submission_categories: false, 
      // 保存捕获到的视频信息
      "videos": []
    },
    // 多频道监测,直接在下面填写要监控的频道信息即可
    {
      // 要监听的用户名
      "user": "user2", 
      // *监听频道的地址,若要监听油管短视频，可把url最后的videos换成shorts
      "user_url": "https://www.youtube.com/@addyvisuals/shorts",
      ...
    },
  ]
}
```

## 根据自定义日期,进行搬运视频

- 在`upload.config.json` 配置文件中添加`custom_time_channel`对象信息
- 与`uploads`配置主要的区别是多了两个字段，`date_after`和`date_before`
- `date_after`：自定义日期，搬运该日期之后的视频
- `date_before`：自定义日期，搬运该日期之前的视频
- 日期格式：`YYYYMMDD`，例如：`20230226`
- 例如：要搬运2023年2月26日之后的视频，可以这样配置

> ⚠️注意：若配置了`custom_time_channel`，则`uploads`配置无效，不会进行监听
>
> 即自动监听频道功能和指定日期搬运功能，不能同时使用

```json3
{
  "custom_time_channel": {
    "user": "addyvisuals",
    "user_url": "https://www.youtube.com/@addyvisuals/videos",
    "date_after": "20230226",
    "date_before": "",
    "publish_prefix": "",
    "blibli_classification": [
      0,
      0
    ],
    "prefix_tags": [
      "科技",
      "技术"
    ],
    "videos": []
  }
}
```

## 启动项目

- 安装pm2

```bash
npm i pm2 -g # 安装pm2
```

- 启动项目

```bash
pnpm dev # 开发启动命令
# 注意，开发模式下，会自动打开桌面版本浏览器
# 若是在无desktop环境的linux服务器上调试,需要注释以下内容
# src/utils/upload.ts
# //headless: !isDev, // 默认为true，无头模式


# 挂机运行模式
pnpm build # build项目
pm2 start pm2.config.json # 启动项目
pm2 stop pm2.config.json # 停止项目
```

## 可能会遇到的问题：

- 若报下面的错误，可以将package.json中把puppeteer改为：^18，然后再次pnpm i

```bash
Error: Could not find Chromium (rev. 1108766).
```

- 若报下面的错误，可以跳过Chrome的安装
    - mac export PUPPETEER_SKIP_DOWNLOAD='true'
    - win SET PUPPETEER_SKIP_DOWNLOAD='true'

```bash
.../node_modules/puppeteer postinstall$ node install.js
│ ERROR: Failed to set up Chrome r113.0.5672.63! Set "PUPPETEER_SKIP_DOWNLOAD" env variable to skip download.
```

- 若提示下面的错，无法正常启动浏览器,可以指定Chromium/Chrome的路径
    - Error: Failed to Launch the browser process!

```ts
// src/utils/upload.ts
const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium",// 指定Chromium/Chrome的路径
});
```
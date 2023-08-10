<h2 align="center">从油管自动化搬运视频到X平台</h2>

> 目前仅支持B站：自动监听油管频道更新->自动加字幕->上传B站


<div align="center">
  <span>Docker教程 | </span>
  <a href="https://github.com/gaoxiaoduan/YoutubeToBilibiliHelp/blob/main/docs/document-win.md">
  Win系统教程
  </a>
</div>

---

## 开发计划

-[x] 使用docker内置依赖

-[ ] 拓展平台

## 下载项目代码

```bash
git clone https://github.com/gaoxiaoduan/YoutubeToBilibiliHelp.git

# 进入项目所在的文件夹中
cd YoutubeToBilibiliHelp
```

## 修改自己所对应的配置文件

- 可参考[Win系统教程](https://github.com/gaoxiaoduan/YoutubeToBilibiliHelp/blob/main/docs/document-win.md)中的配置信息进行修改
- 提前修改好对应的`PROXY`网络代理地址，否则网络会走不通

## 使用Docker运行

> 需要提前安装好Docker

1. 构建Image

```bash
docker build -t youtube_to_bilibili_help .
```

2. 运行容器

```bash
# 启动
docker run -d --name youtube --net=host -v <本机upload_log.json文件>:/usr/app/upload_log.json youtube_to_bilibili_help

# 停止
docker stop youtube
# 重新启动
docker restart youtube
```

3. 查看日志

```bash
docker logs youtube
```
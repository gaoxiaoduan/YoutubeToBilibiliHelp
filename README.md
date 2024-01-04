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

- [x] 使用docker内置依赖
- [ ] 拓展平台

## 下载项目代码

```bash
git clone https://github.com/gaoxiaoduan/YoutubeToBilibiliHelp.git

# 进入项目所在的文件夹中
cd YoutubeToBilibiliHelp
```

## 修改自己所对应的配置文件

- 可参考[Win系统教程](https://github.com/gaoxiaoduan/YoutubeToBilibiliHelp/blob/main/docs/document-win.md)(
  其他系统配置同win系统类似)中的配置信息进行修改
- ⚠️提前修改好对应的`PROXY`网络代理地址，否则网络会走不通

## 使用Docker运行

> 需要提前安装好Docker

1. 构建Image

```bash
docker build -t youtube_to_bilibili_help .
```

2. 运行容器

```bash
# 启动
docker run -d --name youtube --net=host -v <本机upload.config.json文件>:/usr/app/upload.config.json youtube_to_bilibili_help

# 停止
docker stop youtube
# 重新启动
docker restart youtube
```

3. 查看日志

```bash
docker logs youtube
```

## 个性化配置项

> 个性化配置项，需要在`src/constant/index.ts`中进行修改
>
> ⚠️修改配置项后，需要重新build构建Image

### ⚠️代理(PROXY)配置

> 下载油管视频时需要走代理，否则会被墙

```typescript
// src\constant\index.ts
// 代理->设置为"",则不走代理｜若直连，可能会被墙
// 建议给终端走代理，这里默认使用clash本地代理
// 可根据自己的实际情况进行修改
export const PROXY = "socks5://127.0.0.1:7890";
```

### 监听频率配置

> 多长时间执行一轮main函数

```typescript
// src\constant\index.ts
// 本地开发环境下，频率设置为1分支，线上环境下，频率设置为10分钟
export const TASK_INTERVAL = isDev ? (1000 * 60) : (1000 * 60 * 10);
```

### 获取频道信息频率配置

> 获取一个频道的最新信息后，多长时间再次检查下一个频道

```typescript
// src\constant\index.ts
// 本地开发环境下，频率设置为2s，线上环境下，频率设置为20s
export const CHECK_CHANGE_INTERVAL = isDev ? (1000 * 2) : (1000 * 20);
```

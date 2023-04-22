# 从油管自动化搬运视频到X平台

```json3
{
  // 支持的平台
  "supported_target_platform": [
    "BZ"
  ],
  "uploads": [
    // 要监听的频道
    {
      "user": "xxx", // 监听频道的用户名
      "user_url": "https://www.youtube.com/@xxx/videos", // 监听用户的地址
      "publish_prefix": "", // 视频上传前缀
      "videos": [
      // 已经获取到的视频信息
      // 一下内容不需要配置
        {
          "id": "xxx", // 视频id
          "title": "xxx", // 视频原名称
          "video_url": "xxx", // 视频url
          "uploader": "xxx", // 视频上传者
          "upload_date": "xxx", // 上传时间
          "published": ["BZ"] // 已经发布的平台
        }
      ]
    }
  ]
}
```
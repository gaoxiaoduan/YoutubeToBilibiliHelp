declare namespace uploadConfigType {
    interface VideoInfo {
        id: string;
        video_url: string;
        title: string;
        dirPath: string;
        filename: string;
        uploadTitle: string;
        tags: string[];
        platform: string[];
    }

    interface Channel {
        user: string; // 频道用户名
        user_url: string; // 频道地址
        publish_prefix?: string; // 发布前缀
        skip_down_subs?: boolean; // 是否跳过下载字幕 true:跳过 false:下载 -> 默认下载:false
        skip_translation_title?: boolean; // 是否跳过翻译标题 true:跳过 false:翻译 -> 默认翻译:false
        skip_upload_thumbnail?: boolean; // 是否跳过上传缩略图 true:跳过 false:上传 -> 默认上传:false
        blibli_classification?: number[]; // 投稿分区 -> 默认为[0,0]推荐分区
        submission_categories?: boolean; // 投稿分类 true:自制 false:转载 -> 默认转载:false
        prefix_tags: string[]; // 标签前缀
        videos: VideoInfo[]; // 已发布视频信息
    }

    interface customTimeChannel extends Channel {
        date_after: string;
        date_before: string;
    }

    interface Config {
        supported_target_platform: string[];
        // 自定义时间
        custom_time_channel?: customTimeChannel;
        uploads: Channel[];
    }
}
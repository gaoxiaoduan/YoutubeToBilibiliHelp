declare module "youtube-dl-wrap";

declare module "upload_log.json" {
    interface VideoInfo {
        id: string;
        title: string;
        video_url: string;
        uploader: string;
        upload_date: string;
        published: string[];
    }

    export interface Channel {
        user: string;
        user_url: string;
        publish_prefix?: string;
        skip_down_subs?: boolean;
        blibli_classification?: number[];
        submission_categories?: boolean; // 投稿分类 true:自制 false:转载
        prefix_tags: string[];
        videos: VideoInfo[];
    }

    interface Config {
        supported_target_platform: string[];
        uploads: Channel[];
    }

    const config: Config;
    export default config;
}
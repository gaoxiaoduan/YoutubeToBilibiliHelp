FROM node:18-alpine

RUN apk update

# 安装 pnpm
RUN npm install -g pnpm

# 安装 pm2
RUN npm install -g pm2

# 安装curl
RUN apk add --no-cache curl

RUN apk add --no-cache ffmpeg

RUN apk add --no-cache python3

# 安装yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp


# 设置工作目录
WORKDIR /usr/app

# 复制依赖到容器中
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .npmrc ./

# 安装依赖
RUN pnpm install

# 复制源码到容器
COPY ./ ./

RUN pnpm build
CMD ["pm2-runtime","start","pm2.config.json"]
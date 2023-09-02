FROM node:18

# 安装 chromium 及字体
RUN apt-get update \
 && apt-get install -y chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends

# 设置环境变量
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# 安装 pnpm
RUN npm install -g pnpm

# 安装 pm2
RUN npm install -g pm2

# 安装 ffmpeg
RUN apt-get install -y ffmpeg

# 安装python3
RUN apt-get install -y python3

# 安装yt-dlp
RUN apt-get install -y yt-dlp


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
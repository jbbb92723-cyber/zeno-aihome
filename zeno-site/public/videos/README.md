# public/videos — 视频目录说明

## 重要：不要把大视频文件放这里

这个目录仅用于极小的视频展示文件（如 < 2MB 的 GIF 转 webm 短片）。

**正式视频的正确做法：**

1. 上传到外部平台（B站、YouTube、视频号、腾讯云 COS 等）
2. 在 `data/videos.ts` 里保存视频链接、嵌入地址和封面图路径
3. 网站通过读取 `data/videos.ts` 展示视频卡片，点击跳转或嵌入播放

## 原因

- 大视频文件会让 Git 仓库体积爆炸（推送/克隆极慢）
- Vercel 等静态托管对带宽计费，视频流量成本高
- 直接托管没有 CDN 加速，播放体验差
- 外部平台提供播放数据统计，有助于内容运营

## 视频数据管理位置

```
zeno-site/data/videos.ts
```

## 示例视频数据结构

```typescript
{
  id: '01',
  title: '为什么我不想只做一个装修博主',
  platform: 'bilibili',
  url: 'https://www.bilibili.com/video/...',
  embedUrl: 'https://player.bilibili.com/player.html?...',
  coverImage: '/images/articles/01-cover.webp',
}
```

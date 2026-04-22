# Sitemap 规划
**网站**：zenoaihome.com  
**版本**：v1.0 | 2026-04-19

---

## 完整 URL 结构

```
https://zenoaihome.com/
├── /                          首页
├── /about                     关于我
├── /blog                      文章列表（当前路由）
│   ├── /blog/01-wo-wei-shenme-bu-xiang-zhi-zuo-jiaoren-zhuangxiu
│   ├── /blog/02-jia-bu-shi-yangban-jian
│   ├── /blog/03-cong-gongdi-kan-shijie
│   ├── /blog/04-wei-shenme-wo-kaishi-renzheng-xue-ai
│   ├── /blog/05-changqi-zhuyi-bushi-rennai
│   └── /blog/zhuangxiu-yusuan-weishenme-zongchao        ← 已发布
├── /topics                    专题首页
│   ├── #shi-zhu-pai-zhuangxiu          实住派装修
│   ├── #cong-gongdi-kan-shijie         从工地看世界
│   ├── #changqi-zhuyi-shenghuo         长期主义生活
│   └── #chuantong-hangyeren-zenme-yong-ai  传统行业人如何用AI升级
├── /resources                 资料库
├── /services                  服务页（待上线）
└── /contact                   联系我
```

---

## 静态文件

```
/llms.txt                      AI 系统说明文件
/sitemap.xml                   （待生成，V2 阶段做自动化）
/robots.txt                    （建议添加）
/favicon.ico
```

---

## 未来规划路由（V2+）

```
/articles                      文章路由别名（与 /blog 指向同一内容）
/articles/[slug]               文章详情别名
/topics/ju-zhu-yu-zhuangxiu   专题独立页面（居住与装修）
/topics/meixue-yu-shenghuo    专题独立页面（美学与生活）
/topics/renxing-yu-panduan    专题独立页面（人性与判断）
/topics/chengzhang-changqi    专题独立页面（成长与长期主义）
/topics/ai-geti-shengji        专题独立页面（AI与个体升级）
```

---

## SEO 优先级说明

| 页面 | 重要程度 | 关键词策略 |
|---|---|---|
| / | 极高 | 品牌词 + 定位词 |
| /about | 高 | 品牌词 + 人格标签 |
| /blog/zhuangxiu-yusuan-weishenme-zongchao | 极高 | 装修预算超支、报价审核 |
| /blog/02-jia-bu-shi-yangban-jian | 高 | 实住派装修、审美 |
| /services | 高 | 装修报价审核、装修预算咨询 |
| /resources | 中 | 装修模板、清单下载 |
| /topics | 中 | 专题聚合页 |
| /contact | 低（信任页） | - |

---

## robots.txt 建议内容

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: https://zenoaihome.com/sitemap.xml
```

---

## llms.txt 说明

参见同目录 `llms.txt` 文件。  
代码路径：`zeno-site/public/llms.txt`

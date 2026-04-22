# 部署到 Vercel 说明
**版本**：v1.0 | 2026-04-19  
**适合谁**：没有编程背景、第一次把网站发布上线的人  
**读完之后你应该能做到**：把网站从电脑上传到 Vercel，让任何人都能打开

---

## 一、部署前要确认什么

在开始之前，请确认：

- [ ] 本地运行 `npm run build` 能通过（没有红色报错）
- [ ] 网站已经放在 GitHub 仓库里（如果还没有，看第二步）
- [ ] 有一个 Vercel 账号（可以用 GitHub 账号直接登录，免费）
- [ ] 联系方式已填入网站（公众号、微信、邮箱）
- [ ] 打算用的域名已经购买（可以先用 Vercel 提供的临时域名）

---

## 二、如何把代码提交到 GitHub

如果你还没有把代码放到 GitHub：

**第一次提交（初始化）：**

1. 去 [github.com](https://github.com) 创建一个新仓库，名字比如 `zenoaihome`
2. 不要勾选「Add README」（因为本地已有）
3. GitHub 会给你一段命令，在 `zeno-site` 目录里打开终端，粘贴执行：
   ```
   git init
   git add .
   git commit -m "v1.0 initial"
   git branch -M main
   git remote add origin https://github.com/你的账号名/zenoaihome.git
   git push -u origin main
   ```

**之后每次修改内容后提交：**

```
git add .
git commit -m "更新了什么内容（用一句话描述）"
git push
```

> 提交之后，Vercel 会自动检测到代码更新，自动重新部署。

---

## 三、如何在 Vercel 导入 GitHub 仓库

1. 登录 [vercel.com](https://vercel.com)（用 GitHub 账号登录最方便）
2. 点击 **「Add New Project」**（或 New Project）
3. 选择 **「Import Git Repository」**
4. 找到你的 `zenoaihome` 仓库，点击 **「Import」**

---

## 四、Root Directory 应该如何选择

> ⚠️ 这一步很关键，不设置会导致部署失败

在 Vercel 导入页面，找到 **「Root Directory」** 设置：

- 点击 **「Edit」**MD2WECHAT_API_KEY=你的key
WECHAT_APPID=你的appid
WECHAT_APP_SECRET=你的secret
ARK_API_KEY=你的key
ARK_IMAGE_MODEL=doubao-seedream-3-0-t2i-250415
ADMIN_TOKEN=随便设一个密码
- 填入：`zeno-site`
- 确认

原因：你的 GitHub 仓库根目录不是网站代码，网站代码在 `zeno-site` 子目录里。

---

## 五、Build Command 是什么

Vercel 会自动检测到这是 Next.js 项目，自动填入以下设置：

| 设置项 | 值 |
|---|---|
| Framework Preset | Next.js（自动识别） |
| Build Command | `next build`（自动填入） |
| Output Directory | `out`（自动填入，因为 `output: 'export'`） |
| Install Command | `npm install`（自动填入） |

**通常不需要手动修改。** 如果 Vercel 没有自动识别，手动填入：
- Build Command: `next build`
- Output Directory: `out`

---

## 六、Output 设置是否需要改

不需要。网站已经在 `next.config.mjs` 里设置了 `output: 'export'`，会自动生成 `out/` 目录（静态文件）。Vercel 会直接部署这个目录。

---

## 七、环境变量第一版是否需要

**不需要。** 当前网站是纯静态网站，没有数据库、没有 API 密钥、没有第三方服务。环境变量留空即可。

---

## 八、部署成功后如何获得临时域名

部署成功后，Vercel 会自动给你一个临时域名，格式是：
```
https://zenoaihome-xxxxxx.vercel.app
```

打开这个链接，就能看到你的网站。把这个链接分享给自己手机确认一下手机端是否正常。

---

## 九、如何绑定正式域名

1. 在 Vercel 项目里，点击 **「Settings」→「Domains」**
2. 填入你的域名：`zenoaihome.com`
3. Vercel 会给你 DNS 配置信息，通常是：
   - 类型 `A`，指向 `76.76.21.21`
   - 或类型 `CNAME`，指向 `cname.vercel-dns.com`
4. 去你的域名注册商（阿里云、腾讯云等），找到 DNS 设置，添加上述记录
5. 等待 5-30 分钟，DNS 生效后域名绑定完成

> 如果你同时要绑定 `www.zenoaihome.com`，在 Vercel Domains 里再添加一次 `www.zenoaihome.com`，选择「Redirect to `zenoaihome.com`」。

---

## 十、部署后如何修改内容

**部署不是锁死网站。** 以后任何修改，流程都是：

1. 在本地修改文件（改文章、加图片、改联系方式等）
2. 运行 `npm run build` 确认没有报错
3. 执行 `git add . ; git commit -m "说明改了什么" ; git push`
4. Vercel 检测到推送，自动重新部署（约 1-2 分钟）
5. 刷新网站，看到更新

**常见修改场景：**

| 要做的事 | 改哪个文件 |
|---|---|
| 改文章内容 | `data/articles.ts` 对应文章的 `content` 字段 |
| 加新文章 | 在 `data/articles.ts` 数组末尾新增一个对象 |
| 改服务价格 | `data/services.ts` 对应服务的 `price` 字段 |
| 改联系方式 | `components/Footer.tsx` + `app/contact/page.tsx` |
| 加图片 | 把图片放入 `public/images/` 对应目录 |
| 改关于我内容 | `app/about/page.tsx` |

---

## 十一、Vercel 自动部署的逻辑

每次你 `git push` 到 GitHub 的 `main` 分支，Vercel 都会：

1. 检测到新提交
2. 自动拉取代码
3. 运行 `npm install` + `next build`
4. 把生成的静态文件部署到全球 CDN
5. 约 1-2 分钟后，网站更新

你不需要手动触发任何操作。整个过程全自动。

如果某次部署失败（比如代码有语法错误），Vercel 会保留上一次成功的版本，网站不会挂掉。失败记录在 Vercel 后台可以查看。

---

## 常见问题

**Q: 第一次用 GitHub，不会命令行怎么办？**  
A: 可以安装 [GitHub Desktop](https://desktop.github.com/)，有图形界面，点按钮就能提交和推送，不需要敲命令。

**Q: 部署后发现网站有问题，怎么回滚？**  
A: 在 Vercel 后台找到「Deployments」，选择一个之前成功的版本，点「Promote to Production」即可回滚。

**Q: 可以多人同时用一个 Vercel 账号吗？**  
A: 可以，Vercel 免费版支持添加团队成员。

**Q: 流量超了怎么办？**  
A: Vercel 免费版每月有 100GB 流量，对个人网站绰绰有余。超了会有提醒，按需升级。

**Q: `npm run build` 在本地通过了，Vercel 会失败吗？**  
A: 极少情况。Vercel 和本地用一样的命令，通常本地通过的在 Vercel 也能通过。如果失败，查看 Vercel 日志里的红色错误信息。

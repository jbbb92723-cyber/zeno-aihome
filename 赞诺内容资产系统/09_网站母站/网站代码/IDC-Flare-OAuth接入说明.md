# IDC Flare OAuth 接入说明

> 文档版本：v1.0 · 2026-04-20  
> 状态：【待补充 IDC Flare 官方 OAuth 端点信息】

---

## 一、IDC Flare 接入需要哪些信息

在 IDC Flare 开发者后台（如果有）创建 OAuth 应用后，你需要获取以下信息：

| 信息 | 说明 | 填写位置 |
|---|---|---|
| Client ID | 应用唯一标识符 | `.env.local` → `IDCFLARE_CLIENT_ID` |
| Client Secret | 应用密钥（绝对不能公开）| `.env.local` → `IDCFLARE_CLIENT_SECRET` |
| Authorization URL | 用户被重定向到登录页的地址 | `.env.local` → `IDCFLARE_AUTHORIZATION_URL` |
| Token URL | 服务端用 code 换取 token 的接口 | `.env.local` → `IDCFLARE_TOKEN_URL` |
| Userinfo URL | 用 token 获取用户信息的接口 | `.env.local` → `IDCFLARE_USERINFO_URL` |

> ⚠️ **当前所有端点均为【待补充】**  
> 需要查阅 IDC Flare 官方 OAuth2 文档，或向 IDC Flare 技术支持询问。

---

## 二、创建应用时怎么填写

### 应用名称

```
Zeno 内容母站
```

### 应用主页 URL

- **本地开发阶段：**
  ```
  http://localhost:3000
  ```
- **正式上线后：**
  ```
  https://zenoaihome.com
  ```

### 应用描述

```
赞诺的个人知识母站，用于内容资产沉淀、资料领取、会员权限和用户登录。
```

### OAuth 回调地址（Redirect URI）

这是最关键的配置，必须和代码中一致：

- **本地开发：**
  ```
  http://localhost:3000/api/auth/callback/idcflare
  ```
- **正式上线：**
  ```
  https://zenoaihome.com/api/auth/callback/idcflare
  ```

> **如果 IDC Flare 只支持填写一个回调地址：**  
> 先填正式上线地址。本地开发时如需测试，可以在 IDC Flare 后台临时改为 localhost 地址。  
> 或者询问 IDC Flare 是否支持多个回调地址。

---

## 三、本地环境配置

在 `zeno-site/.env.local` 文件中（如果没有就创建）填写以下内容：

```env
# Auth.js 密钥（随机生成，运行 openssl rand -base64 32 获取）
AUTH_SECRET=你生成的随机密钥

# 本地开发时
AUTH_URL=http://localhost:3000

# IDC Flare OAuth 配置
IDCFLARE_CLIENT_ID=从IDC Flare后台获取
IDCFLARE_CLIENT_SECRET=从IDC Flare后台获取

# 以下三项需要查阅 IDC Flare 官方 OAuth 文档
IDCFLARE_AUTHORIZATION_URL=【待补充】
IDCFLARE_TOKEN_URL=【待补充】
IDCFLARE_USERINFO_URL=【待补充】

# 数据库（Supabase）
DATABASE_URL=postgresql://postgres:[密码]@db.[项目ID].supabase.co:5432/postgres

# 站点 URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> ⚠️ `.env.local` 不要提交到 Git！已在 `.gitignore` 中排除。

---

## 四、Vercel 生产环境配置

1. 打开 [Vercel Dashboard](https://vercel.com) → 你的项目 → **Settings** → **Environment Variables**
2. 逐一添加以下变量（选择 **Production** 环境）：

| 变量名 | 值 |
|---|---|
| `AUTH_SECRET` | 用 `openssl rand -base64 32` 生成（与本地不同的值）|
| `AUTH_URL` | `https://zenoaihome.com` |
| `IDCFLARE_CLIENT_ID` | 从 IDC Flare 后台获取 |
| `IDCFLARE_CLIENT_SECRET` | 从 IDC Flare 后台获取 |
| `IDCFLARE_AUTHORIZATION_URL` | 【待补充】|
| `IDCFLARE_TOKEN_URL` | 【待补充】|
| `IDCFLARE_USERINFO_URL` | 【待补充】|
| `DATABASE_URL` | Supabase 连接字符串 |
| `NEXT_PUBLIC_SITE_URL` | `https://zenoaihome.com` |

3. 添加完毕后点击 **Redeploy** 重新部署。

---

## 五、为什么 Client Secret 不能写在前端代码里

1. **前端代码是公开的。** 浏览器可以查看所有 JS 文件，包括你的代码。
2. **泄露 Client Secret 意味着任何人都可以冒充你的应用。** 攻击者可以用你的 ID 以赞诺的名义发起 OAuth 授权，欺骗用户。
3. **环境变量只在服务端可见。** `IDCFLARE_CLIENT_SECRET` 只有服务器能读取，不会发送到浏览器。
4. 只有 `NEXT_PUBLIC_` 前缀的变量才会暴露给浏览器，因此 Secret 绝不能加这个前缀。

---

## 六、常见错误排查

### 错误 1：回调地址不一致

**现象：** OAuth 登录后报错，通常是 `redirect_uri_mismatch` 或类似错误。  
**原因：** 代码中使用的回调地址和 IDC Flare 后台填写的不一致。  
**解决：**
- 检查 IDC Flare 后台填写的回调地址是否完全匹配
- 注意：`http` vs `https`，结尾有无 `/`，都可能导致不匹配

### 错误 2：Client Secret 错误

**现象：** Token 请求失败，HTTP 401 或 400。  
**原因：** `IDCFLARE_CLIENT_SECRET` 填写错误，或者复制时有多余空格。  
**解决：** 重新从 IDC Flare 后台复制，注意不要有前后空格。

### 错误 3：Scope 不对

**现象：** 登录成功但获取不到邮箱或昵称。  
**原因：** IDC Flare 要求特定 scope 参数才能返回用户信息。  
**解决：** 查阅 IDC Flare 文档，确认需要哪些 scope（通常是 `openid profile email`）。

### 错误 4：Userinfo Endpoint 缺失

**现象：** Auth.js 无法获取用户信息，session 为空。  
**原因：** `IDCFLARE_USERINFO_URL` 没有填写，或填写错误。  
**解决：** 查阅 IDC Flare 文档，找到 userinfo endpoint。

### 错误 5：本地 localhost 不被支持

**现象：** IDC Flare 拒绝 `http://localhost:3000` 作为回调地址。  
**解决方案 A：** 在 IDC Flare 后台显式添加 localhost 地址（部分平台支持）。  
**解决方案 B：** 使用 [ngrok](https://ngrok.com) 将本地服务暴露为公网地址：
```bash
ngrok http 3000
# 得到类似 https://abc123.ngrok.io 的地址
# 将这个地址填入 IDC Flare 回调地址
```
**解决方案 C：** 本地只开发 UI，部署到 Vercel 后再测试 OAuth 流程。

### 错误 6：AUTH_SECRET 未设置

**现象：** 报错 `[AUTH_SECRET not set]` 或 session 无效。  
**解决：** 运行以下命令生成，填入 `.env.local`：
```bash
openssl rand -base64 32
```

---

## 七、需要我去 IDC Flare 后台补充的信息清单

以下信息需要你登录 IDC Flare 开发者后台完成：

- [ ] 创建 OAuth 应用（如果还没有）
- [ ] 填写应用名称：`Zeno 内容母站`
- [ ] 填写应用主页：`https://zenoaihome.com`
- [ ] 填写回调地址（Redirect URI）：
  - `https://zenoaihome.com/api/auth/callback/idcflare`
  - `http://localhost:3000/api/auth/callback/idcflare`（如果支持多个）
- [ ] 获取 `Client ID` 并填入 `.env.local` 的 `IDCFLARE_CLIENT_ID`
- [ ] 获取 `Client Secret` 并填入 `.env.local` 的 `IDCFLARE_CLIENT_SECRET`
- [ ] 查阅 IDC Flare OAuth 文档，找到并填写：
  - `IDCFLARE_AUTHORIZATION_URL` = 【OAuth 授权页面 URL】
  - `IDCFLARE_TOKEN_URL` = 【Token 获取接口 URL】
  - `IDCFLARE_USERINFO_URL` = 【用户信息接口 URL】
- [ ] 确认 IDC Flare 返回的用户信息字段名（email / name / avatar 等），
      如有差异，需要修改 `auth.ts` 中的 `profile()` 函数字段映射

---

## 八、如果 IDC Flare 没有标准 OAuth2 接口

如果 IDC Flare 不提供 OAuth2 接口，或者接入门槛过高，可以考虑：

1. **先不接 IDC Flare，改用 GitHub OAuth**（对中国用户不友好但技术上最简单）
2. **先用邮箱+密码登录**（需要额外安装 `@auth/prisma-adapter` 和邮件发送服务）
3. **先用手动开权限**（管理员直接修改 Supabase 中的用户 role）

---

*文档维护：获取到 IDC Flare 端点后，删除所有【待补充】并填入真实值。*

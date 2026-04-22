# IDC Flare 登录接入说明

## 1. 接入目的

不是让用户重新注册一套账号。  
而是让已经是 IF / IDC Flare 社区成员的用户，可以直接用社区账号进入 Zeno AI Home，无需重复填写信息。

登录后可以：
- 领取资料
- 发表评论
- 查看自己的领取记录
- 后续访问会员内容
- 连接社区身份

---

## 2. 用户体验流程

1. 用户在本站点击「使用 IDC Flare 登录」
2. 跳转到 IDC Flare 社区授权页
3. 如果用户在社区已登录，可能无需重新输入账号密码
4. 用户点击「授权」
5. 跳转回本站回调地址
6. 本站识别用户身份，显示账号信息

---

## 3. 需要配置的参数

请向 IDC Flare 申请 OAuth 应用，获取以下信息并填入 Vercel 环境变量：

| 参数 | 说明 | Vercel 环境变量名 |
|------|------|------------------|
| Client ID | OAuth 应用 ID | `IDCFLARE_CLIENT_ID` |
| Client Secret | OAuth 应用密钥（**不要写到前端**） | `IDCFLARE_CLIENT_SECRET` |
| Authorization URL | 授权页地址 | `IDCFLARE_AUTHORIZATION_URL` |
| Token URL | 获取 Token 的接口 | `IDCFLARE_TOKEN_URL` |
| Userinfo URL | 获取用户信息的接口 | `IDCFLARE_USERINFO_URL` |
| Scope | 权限范围（通常是 `openid email profile`） | 写在代码里 |

---

## 4. 回调地址（Callback URL）

申请 OAuth 应用时，需要在 IDC Flare 后台填写以下回调地址：

**本地开发：**
```
http://localhost:3000/api/auth/callback/idcflare
```

**正式线上：**
```
https://zenoaihome.com/api/auth/callback/idcflare
```

---

## 5. 当前状态

**待配置。** 所有参数尚未填入，登录按钮显示「待配置」，不会报错。

---

## 6. 注意事项

- `IDCFLARE_CLIENT_SECRET` 只能放在 Vercel 环境变量里，绝不能写到前端代码
- 登录是增强功能，不是访问网站的前提，所有公开页面无需登录
- 不要把登录入口做成强制弹窗或强制跳转
- 当前 `/account` 页面未登录时会显示说明，不再强制跳转

---

## 7. 配置完成后的验证步骤

1. 在 Vercel 环境变量里填入所有参数
2. 触发重新部署
3. 打开 `https://zenoaihome.com/login`
4. 点击「使用 IDC Flare 登录」，应该跳转到社区授权页
5. 授权后回到 `/account`，显示用户信息

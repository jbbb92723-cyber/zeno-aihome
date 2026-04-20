"use client";

import { useState } from "react";

type ApiResult = Record<string, unknown> | string | null;

export default function PublishPage() {
  const [adminToken, setAdminToken] = useState("");
  const [title, setTitle] = useState("装修预算为什么总超？");
  const [markdown, setMarkdown] = useState("# 装修预算为什么总超？\n\n这里粘贴公众号版 Markdown 内容。");
  const [coverPrompt, setCoverPrompt] = useState("真实室内装修工地，桌面上有报价单、卷尺和铅笔，低饱和、干净、可信、写实摄影风格");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [theme, setTheme] = useState("default");
  const [result, setResult] = useState<ApiResult>(null);
  const [loading, setLoading] = useState(false);

  async function callApi(path: string, body: Record<string, unknown>) {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify(body),
      });
      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
      setResult(data);
      if (path === "/api/image/generate" && data?.imageUrl) {
        setCoverImageUrl(data.imageUrl);
      }
    } catch (error) {
      setResult(error instanceof Error ? error.message : "请求失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <div className="kicker">内部工具 / 不要公开分享</div>
      <h1>公众号草稿发布台</h1>
      <p>
        用法：粘贴公众号版 Markdown，先用豆包生成封面图，再预览排版，最后创建微信公众号草稿。API Key 只放在 Vercel 环境变量里，不会出现在前端。
      </p>

      <div className="card">
        <label>后台口令 ADMIN_TOKEN</label>
        <input value={adminToken} onChange={(e) => setAdminToken(e.target.value)} placeholder="输入你在 Vercel 设置的 ADMIN_TOKEN" />

        <label>文章标题</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>豆包封面图提示词</label>
        <textarea value={coverPrompt} onChange={(e) => setCoverPrompt(e.target.value)} />

        <p>
          <button disabled={loading} onClick={() => callApi("/api/image/generate", { prompt: coverPrompt, size: "1024x1024" })}>
            生成封面图
          </button>
        </p>

        <label>封面图 URL</label>
        <input value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} placeholder="生成后会自动填入，也可以手动粘贴远程图片 URL" />
        {coverImageUrl ? <p><img src={coverImageUrl} alt="封面图预览" style={{ maxWidth: "320px", borderRadius: 16, border: "1px solid #e5e0d8" }} /></p> : null}

        <label>md2wechat 主题</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="default">default</option>
          <option value="bytedance">bytedance</option>
          <option value="apple">apple</option>
          <option value="chinese">chinese</option>
          <option value="sports">sports</option>
        </select>

        <label>Markdown 内容</label>
        <textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} />

        <p>
          <button disabled={loading} onClick={() => callApi("/api/wechat/convert", { markdown, theme, fontSize: "medium" })}>
            预览公众号排版
          </button>
          <button disabled={loading} onClick={() => callApi("/api/wechat/draft", { title, markdown, coverImageUrl, theme, fontSize: "medium" })}>
            创建公众号草稿
          </button>
        </p>
        <p className="small">注意：这里只创建草稿，不会自动发布。正式发布仍然要你进入微信公众号后台人工检查。</p>
      </div>

      <h2>返回结果</h2>
      <pre>{loading ? "处理中..." : result ? JSON.stringify(result, null, 2) : "暂无结果"}</pre>
    </main>
  );
}

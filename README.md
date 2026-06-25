# 工作周报（VitePress）

基于 Markdown 的每周工作汇报站点，按时间节点归档，支持 Mermaid 架构图与截图补充。

## 快速开始

```bash
cd work-report
npm install
npm run dev
```

浏览器访问 `http://localhost:5175`。

## 目录结构

```
work-report/
├── index.md                 # 首页与时间轴
├── reports/
│   ├── 2026-06-02/          # 上三周
│   │   ├── index.md
│   │   └── images/          # 截图目录
│   ├── 2026-06-09/          # 上两周
│   ├── 2026-06-16/          # 上一周
│   ├── 2026-06-23/          # 本周（待补充）
│   └── 2026-05-26/          # 上四周
└── .vitepress/config.mts    # 站点与侧边栏配置
```

## 新增一周周报

1. 复制 `reports/2026-06-23/` 为新的日期目录（周一日期，如 `2026-06-30`）
2. 编辑 `index.md` 填写内容
3. 在 `.vitepress/config.mts` 的 `weeks` 数组顶部追加新周配置
4. 将截图放入对应 `images/` 目录，并在 Markdown 中引用：`![说明](./images/xxx.png)`

## 截图说明

各周 Markdown 中已标注建议文件名，将截图放入对应 `images/` 文件夹即可；页面内使用相对路径引用。

## 构建

```bash
npm run build
npm run preview
```

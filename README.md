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
│   ├── 2026-06-01/          # 上三周
│   │   ├── index.md
│   │   └── images/          # 截图目录
│   ├── 2026-06-08/          # 上两周
│   ├── 2026-06-15/          # 上一周
│   ├── 2026-06-22/          # 本周
│   └── 2026-05-25/          # 上四周
└── .vitepress/config.mts    # 站点与侧边栏配置
```

## 新增一周周报

1. 复制 `reports/2026-06-22/` 为新的日期目录（当周周一日期，如 `2026-06-29`）
2. 编辑 `index.md` 填写内容
3. 在 `.vitepress/config.mts` 的 `weeks` 数组顶部追加新周配置
4. 将截图放入对应 `images/` 目录，并在 Markdown 中引用：`![说明](./images/xxx.png)`

## 编写规范

- **周报周期**：每周 **周一 ~ 周日**，目录名取当周周一日期（如 `2026-06-22`）
- **技术栈列**：概览表格的「技术栈」仅填写编程语言（如 TypeScript、Python、Markdown），不写项目或模块名
- **命名规范**：正文与架构图中统一使用「前端」「后端」「网关」，不使用具体仓库或项目名
- **数据来源**：涉及业务数据接入、字段表、外部数据链路时，须用 `::: warning 📌 数据来源` 标注 **数据由数据部门提供**
- **图片预览**：正文 `![说明](./images/xxx.png)` 支持点击放大（`vitepress-plugin-image-viewer`），同页多图可左右切换

## 截图说明

各周 Markdown 中已标注建议文件名，将截图放入对应 `images/` 文件夹即可；页面内使用相对路径引用。

## 构建

```bash
npm run build
npm run preview
```

# 家庭网页：我们的家

一个家庭门户站点，用来汇总家庭成员、时间线、相册、任务和食谱等信息。页面使用原生 HTML、CSS 与 JavaScript 构建，并通过 Node.js 与
SQLite 数据库提供动态数据服务。

## 功能概览

- **主页亮点卡片**：展示本周家庭活动亮点。
- **家庭时间线**：按时间顺序呈现近期事件，包含地点与标签。
- **成员卡片**：介绍家庭成员的角色、关注焦点和近期备注。
- **影像集相册**：以主题呈现照片，附带描述与日期。
- **家务与待办看板**：按照类别整理当前任务及负责人。
- **家庭食谱**：记录常用菜谱与标签，方便分类查找。
- **愿望表单与提示**：表单提交后将愿望保存到数据库，并通过浮层反馈结果。

## 快速开始

1. 将项目克隆或下载至本地。
2. 在项目目录执行依赖安装：
   ```bash
   npm install
   ```
3. 启动本地服务：
   ```bash
   npm start
   ```
   首次启动会自动创建并写入示例数据到 `server/family.db`。
4. 访问 `http://localhost:3000` 查看页面。前端与后端由同一进程托管，无需另启静态服务器。
5. 如需热更新开发，可使用 `npm run dev`（依赖 nodemon）。

## 在 VS Code 中查看与编辑

1. 打开 VS Code，使用“文件 → 打开文件夹…”（或按 `Ctrl+K` `Ctrl+O`）。
2. 选择本项目所在的目录，例如容器路径 `/workspace/my-home`。
3. 左侧资源管理器会列出 `index.html`、`assets/main.js`、`assets/style.css` 等文件，点击即可查看或编辑。
4. 如使用 Remote - Containers/Dev Containers 扩展，先连接到容器后再执行以上步骤。

## 数据库结构与自定义

页面数据存储在 SQLite 数据库 `server/family.db` 中，表结构如下：

| 表名 | 说明 |
| --- | --- |
| `highlights` | 本周亮点卡片 |
| `timeline_events` / `timeline_tags` | 家庭时间线及标签 |
| `members` / `member_focus` | 家庭成员与关注重点 |
| `gallery_items` | 影像集内容 |
| `task_columns` / `tasks` | 家务与待办看板 |
| `recipes` / `recipe_tags` | 家庭食谱及标签 |
| `wishes` | 愿望表单提交记录 |

首次运行会自动写入示例数据。若需自定义，可通过以下方式操作数据库：

- 使用 SQLite 客户端（如 [DB Browser for SQLite](https://sqlitebrowser.org/) 或 VS Code SQLite 扩展）打开 `server/family.db` 进行增删改查。
- 修改 `server/index.js` 中的种子数据，并删除现有数据库文件后重新启动服务生成新的示例内容。
- 在运行中的服务里，直接通过 REST 接口管理数据：
  - `GET /api/data`：读取页面展示的全部内容。
  - `POST /api/wishes`：提交愿望，写入 `wishes` 表。

更新数据后刷新页面即可看到最新内容。如需扩展字段，请同步修改数据库 schema、`server/index.js` 中的数据聚合逻辑以及前端渲染代码。

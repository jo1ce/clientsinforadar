# 客户信息雷达

客户公司信息动态收集与整理，并支持飞书推送，方便客户经理了解客户全貌与变动。

---

## 从零开始的完整步骤（按顺序做）

### 第一步：创建 Supabase 项目并建表

1. **注册 / 登录 Supabase**  
   打开 https://supabase.com ，用 GitHub 或邮箱注册并登录。

2. **新建项目**  
   - 点击 **New project**  
   - 选一个组织（没有就新建一个）  
   - 填 **Name**（如 `client-info-radar`）、**Database Password**（自己设一个并记住）  
   - 选区域（如 Singapore 或离你近的）  
   - 点 **Create new project**，等一两分钟创建完成。

3. **拿到三个密钥**  
   - 进入项目后，左侧点 **Project Settings**（齿轮图标）  
   - 左侧再点 **API**  
   - 记下这两项（后面填到 `.env.local`）：  
     - **Project URL** → 对应 `NEXT_PUBLIC_SUPABASE_URL`  
     - **anon public** 的 key → 对应 `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
     - **service_role** 的 key（点 “Reveal” 显示）→ 对应 `SUPABASE_SERVICE_ROLE_KEY`（不要泄露到前端或公开仓库）

4. **执行建表 SQL**  
   - 在 Supabase 左侧点 **SQL Editor**  
   - 点 **New query**  
   - 打开本项目里的 `supabase/migrations/20250310000000_initial_schema.sql`，**全选并复制**里面的全部内容  
   - 粘贴到 SQL Editor 的输入框里  
   - 点右下角 **Run**（或按 Ctrl+Enter）  
   - 看到 “Success” 即表示表已建好。

---

### 第二步：在本地运行项目

1. **打开终端**  
   在 Windows 上可以：在 VS Code / Cursor 里按 `` Ctrl+` `` 打开终端，或在本项目文件夹里按住 Shift 点右键选“在此处打开 PowerShell 窗口”。

2. **进入项目目录**（如果还没在项目根目录）：  
   ```bash
   cd "d:\Users\wangxy25\Desktop\王欣怡\projects\client_info_radar"
   ```

3. **安装依赖**：  
   ```bash
   npm install
   ```  
   如果报错依赖冲突，可以改用：  
   ```bash
   npm install --legacy-peer-deps
   ```

4. **复制环境变量文件**：  
   - Windows PowerShell：  
     ```bash
     copy .env.example .env.local
     ```  
   - 或手动：把项目里的 `.env.example` 复制一份，重命名为 `.env.local`。

5. **编辑 `.env.local`**  
   用记事本或编辑器打开 `.env.local`，把第一步里记下的 Supabase 信息填进去，例如：  
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   CRON_SECRET=随便写一串只有你知道的字符串
   ```  
   保存后关闭。

6. **启动开发服务器**：  
   ```bash
   npm run dev
   ```  
   看到 “Ready in ...” 后，在浏览器打开：  
   **http://localhost:3000**  
   能打开首页、点进「客户经理·信息页」和「管理员·配置」即表示本地运行成功。

---

### 第三步：部署到 GitHub 和 Vercel

1. **把代码推到 GitHub**  
   - 打开 https://github.com 并登录。  
   - 点右上角 **+** → **New repository**。  
   - Repository name 填 `client_info_radar`（或你喜欢的名字），选 **Public**，不勾选 “Add a README”（因为本地已有代码）。  
   - 点 **Create repository**。  
   - 在本地项目文件夹里打开终端，执行（把 `你的用户名` 换成你的 GitHub 用户名）：  
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/你的用户名/client_info_radar.git
     git push -u origin main
     ```  
     如果已经初始化过 git、只差远程仓库，可以只执行：  
     ```bash
     git remote add origin https://github.com/你的用户名/client_info_radar.git
     git push -u origin main
     ```

2. **用 Vercel 部署**  
   - 打开 https://vercel.com 并登录（建议选 “Continue with GitHub”）。  
   - 点 **Add New…** → **Project**。  
   - 在列表里选你刚推送的仓库 `client_info_radar`，点 **Import**。  
   - 在 **Configure Project** 页面：  
     - Framework Preset 保持 **Next.js** 即可。  
     - 点 **Environment Variables**，把下面三个（或四个）变量逐个添加（Name 和 Value 都填上，和 `.env.local` 里一致）：  
       - `NEXT_PUBLIC_SUPABASE_URL`  
       - `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
       - `SUPABASE_SERVICE_ROLE_KEY`  
       - `CRON_SECRET`（可选，用于保护定时任务接口）  
   - 点 **Deploy**，等一两分钟。  
   - 部署完成后会给你一个地址，例如 `https://client-info-radar-xxx.vercel.app`，用浏览器打开即可访问线上版本。

3. **（可选）定时推送**  
   Vercel 已按项目里的 `vercel.json` 配置了每 6 小时调用一次 `/api/cron/push`。只有在「管理员·配置」里添加了推送规则、且数据库里有对应类型的 `info_items` 时，才会往飞书群发消息。

---

## 功能

- **信息页**（`/dashboard`）：按客户经理展示其负责公司的动态信息流。
- **配置页**（`/admin`）：管理客户经理、公司、经理-公司关联、推送规则（哪些类型信息推送到哪些飞书群/经理）。

## 技术栈

- Next.js 15（App Router）+ TypeScript + Tailwind CSS
- Supabase（PostgreSQL + RLS）
- 飞书群机器人 Webhook 推送
- 部署：Vercel + GitHub

## 本地开发

1. 克隆仓库，安装依赖：

   ```bash
   npm install
   ```

2. 复制环境变量并填写 Supabase 与可选飞书/定时任务密钥：

   ```bash
   cp .env.example .env.local
   ```

3. 在 Supabase 控制台执行 `supabase/migrations/20250310000000_initial_schema.sql` 创建表结构。

4. 启动开发服务器：

   ```bash
   npm run dev
   ```

   访问 http://localhost:3000 。

## 环境变量

| 变量 | 说明 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名 key（前端可读） |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务端 key（API 写库用，勿暴露前端） |
| `CRON_SECRET` | 定时任务鉴权（如外部 cron 调用 `/api/cron/push` 时 `Authorization: Bearer <CRON_SECRET>`） |

## 部署到 Vercel

1. 将项目推送到 GitHub。
2. 在 Vercel 中导入该仓库，配置上述环境变量。
3. Vercel 会按 `vercel.json` 中的 `crons` 每 6 小时调用 `/api/cron/push` 执行推送（需在配置页添加推送规则且信息类型与 `info_items.type` 一致）。

## 数据与推送说明

- 信息条目（`info_items`）可由外部爬虫或数据源通过 `POST /api/info` 写入。
- 推送规则在配置页添加：信息类型（如 `news`）、目标类型（飞书群 / 客户经理）、目标 ID（飞书群为 Webhook URL 中 `hook/` 后的 token）。
- 当前 cron 仅实现「飞书群」推送；向客户经理发私信需接飞书开放平台发消息 API。

## 后续迭代

- 接入企查查/天眼查等 API 或新闻 RSS，定时写入 `info_items`。
- 接入 Supabase Auth，信息页按登录用户身份过滤负责公司。
- 推送记录表，避免重复推送。

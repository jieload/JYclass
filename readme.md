# 建邺智课

> **面向课堂的 AI 教学智能体**——教师本地部署、局域网内使用，学生无需外网，所有数据落地在本机，让 AI 走进日常课堂而不把数据带出校园。

---

## 一、项目简介

建邺智课是一款面向 K12 全学段、强调「**教师设计、AI 执行、学生受益**」的课堂教学辅助平台。教师在自己的电脑上启动服务，学生通过局域网 IP 访问，在课堂内完成对话、作业、探究、作品提交四类学习活动；AI 负责个性化引导、自动批改与学情分析，把教师从重复劳动中解放出来。

核心理念的四个转变：

| 传统 | 建邺智课 |
|---|---|
| 经验驱动教学 | 数据驱动教学 |
| 一对多讲授 | 一人一案引导 |
| 结果评价 | 过程行为分析 |
| AI 替代教师 | AI 赋能教师 |

**关键设计**：本地私有化部署（SQLite 存储、局域网访问、无需云服务器）、模板驱动的可控 AI 分析、教材级知识库全量注入（规避 RAG 检索式幻觉）。

**隐私与网络**：本系统**仅在本地网络运行，不向任何外部服务器发送数据**——登录、注册均在本地完成，版本检查只读取本机信息，不再自动拉取远程更新。

> 本项目维护于 `jieload/JYclass`，由开源项目 [`makerguan/quickclass-release`](https://github.com/makerguan/quickclass-release)（作者：管雪沨，常州）改造而来。

---

## 二、功能特性

### 1. 课堂四类学生活动

| 活动类型 | 说明 | 数据留痕 |
|---|---|---|
| **对话活动** | 学生与 AI 一对一主题对话，AI「以问代答」循循善诱 | 完整对话记录 |
| **课堂作业** | 在线答题（单选 / 多选 / 判断），AI 自动批改、即时反馈 | 答题明细与得分 |
| **互动探究** | HTML 交互式学习活动（拖拽 / 点击 / 输入），支持 AI 评分 | 操作行为全程日志 |
| **项目提交** | 学生提交作品（文本 / 图片 / 音视频），互看互评、点赞、置顶与下架 | 作品与点赞记录 |

### 2. 学情分析矩阵

「**三类活动 × 两层视角**」的交叉分析：从对话、作业、探究三类数据，分别生成**学生个人**与**全班整体**两个维度的分析。

- **双报告输出**：精简文字版 + HTML 数据大屏（ECharts 可视化，雷达图 / 柱状图 / 散点图 / 热力图），支持多版本留存与对比。
- **模板驱动**：内置六类分析提示词模板，教师可自定义分析维度与输出格式，把分析逻辑的控制权交还给教师。
- **行为分析**：不仅看答题结果，还分析点击、拖拽、输入频次、停留时长等过程行为。

### 3. 教学研究（AI 论文 / 方案生成）

基于课堂真实数据（对话、作业、学情报告）一键生成研究论文或项目方案，采用**数据快照冻结机制**保证结果可复现，支持导出 `.docx` 与 Markdown。

> 注：研究模块的「引用校验」会在教师主动点击时访问 Crossref 查证文献，属按需触发，非后台静默上报。

### 4. 教材级知识库

上传 `.md` / `.txt` 教材资料（单课堂上限 5 万字），AI 回答与学情分析严格基于注入内容，从源头压制幻觉；支持分块、BM25 检索与向量化。

### 5. 其他

- 教师 / 学生双端分离，学生凭「邀请码 + 姓名」加入，无需注册账号
- 课堂导入导出（JSON，自动标注出处），一键重建整门课
- 系统配置可视化、AI 服务连通性测试、并发控制
- 一键启动 / 停止脚本，跨平台（Windows / macOS / Linux）

---

## 三、技术栈

| 层级 | 技术 |
|---|---|
| 框架 | Next.js 14.2（App Router）+ React 18 + TypeScript 5 |
| UI | TDesign React + Tailwind CSS 3.4 |
| 客户端状态 | Zustand |
| 拖拽排序 | @dnd-kit |
| ORM / 数据库 | Prisma 5.22 + SQLite |
| 认证 | NextAuth 4（凭据登录）+ JWT（jose）+ bcryptjs |
| AI 接入 | Vercel AI SDK v6（`ai`、`@ai-sdk/openai`、`@ai-sdk/react`），兼容所有 OpenAI 格式接口 |
| Markdown / 公式 | react-markdown + remark-gfm + remark-math + rehype-katex + KaTeX |
| 图表 | Recharts |
| 文档处理 | docx、mammoth、xlsx、adm-zip |
| 图像 | sharp |
| 并发控制 | p-queue |
| 测试 | Playwright |

---

## 四、目录结构

```
jianye-class/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # 100+ 个 REST 路由（见下方分类）
│   │   ├── login/ forgot-password/ RegisterForm
│   │   ├── student/              # 学生端页面（chat / exercise / insights / join…）
│   │   └── teacher/              # 教师端页面（tasks / classes / students /
│   │                             #   insights / knowledge-base / research / settings…）
│   ├── components/               # layout / Markdown / prompt-preview
│   └── lib/                      # 核心逻辑
│       ├── ai.ts                 # AI 调用（Vercel AI SDK 封装）
│       ├── ai-grading.ts         # 自动批改
│       ├── ai-queue.ts           # 并发队列（p-queue）
│       ├── auth.ts               # 认证（NextAuth / JWT）
│       ├── prisma.ts             # Prisma 客户端
│       ├── chunker.ts / bm25.ts  # 知识库分块与检索
│       ├── prompts/              # 各类 AI 提示词（chat / insight / quiz…）
│       └── research/             # 教学研究（数据收集 / 引用校验 / docx 生成…）
├── prisma/
│   ├── schema.prisma             # 数据模型（约 30 个实体）
│   ├── migrations/               # 迁移
│   └── seed*.ts                  # 种子数据 / 模板导入
├── 模板/                          # 六类分析提示词模板（Markdown）
├── scripts/                      # 打包 / 升级 / 测试脚本
├── public/                       # 静态资源（含 latest.json 版本信息）
├── package.json / next.config.mjs / tailwind.config.ts / tsconfig.json
├── start.sh / start.bat / stop.sh  # 一键启停
└── upgrade.sh / upgrade.bat / upgrade.ps1  # 一键升级（手动）
```

### API 路由分类（`src/app/api/`）

- **auth**：登录、注册、学生登录、找回密码、账号导入（全部本地完成）
- **classes**：班级管理、邀请码加入
- **tasks / sub-projects**：课堂与学习活动
- **preset-conversations / conversations / chat**：对话活动
- **quiz-activities / questions / attempts**：课堂作业
- **exploration-activities**：互动探究（含 AI 伴学、操作日志）
- **project-submissions / student-projects**：项目提交（点赞 / 置顶 / 附件）
- **insights / ai-analysis / analysis-templates**：学情分析
- **research/projects**：教学研究（论文生成 / 引用校验 / 下载）
- **knowledge-base / materials**：知识库与材料
- **system-config / version / upgrade**：系统配置、版本、升级

---

## 五、安装与运行

### 环境要求

| 项目 | 要求 |
|---|---|
| Node.js | 18.17 或更高（推荐 LTS） |
| npm | 9.x 或更高 |
| 操作系统 | Windows / macOS / Linux |

### 方式一：一键启动（推荐）

```bash
# macOS / Linux
./start.sh

# Windows（双击）
start.bat
```

脚本会自动完成环境检查、依赖安装、数据库初始化与构建，等待约 1–2 分钟后浏览器自动打开 `http://localhost:3000`。

### 方式二：手动安装

```bash
npm install                 # 安装依赖
cp .env.example .env        # 准备环境变量（见「配置说明」）
npm run db:push             # 同步数据库结构
npm run dev                 # 开发模式启动
```

生产模式：

```bash
npm run build
npm start                   # 以 0.0.0.0 启动，供局域网访问
```

### 数据库初始化 / 示例数据

```bash
npm run db:seed             # 填充示例数据（含模板）
npx prisma db push --force-reset && npm run db:seed   # 彻底重置
```

学生通过 `http://<教师电脑IP>:3000` 访问，用教师提供的邀请码加入（学生端无需外网）。

---

## 六、配置说明

### 1. 环境变量（`.env`）

| 变量 | 说明 | 默认值 |
|---|---|---|
| `DATABASE_URL` | SQLite 数据库路径 | `file:./prisma/dev.db` |
| `NEXTAUTH_SECRET` | 会话签名密钥（`openssl rand -base64 32` 生成） | 示例值，**生产务必修改** |
| `NEXTAUTH_URL` | 站点地址 | `http://localhost:3000` |

> 已移除原 `NEXT_PUBLIC_ANALYTICS_URL`：本系统不再向外部服务器上报任何数据。

### 2. AI 服务配置（登录后在「系统设置」中配置，存于数据库 `SystemConfig`）

| 配置项 | 说明 |
|---|---|
| AI Base URL | OpenAI 兼容接口地址（通义千问 / DeepSeek / 智谱等） |
| API Key | AI 服务密钥，仅存本机数据库，不上传第三方 |
| AI 模型 | 如 `qwen-turbo`、`deepseek-chat` |
| 推理思考模式 | 仅 DeepSeek V4 系列，返回思考过程 |
| AI 并发限制 | 建议小班 10–20、中班 20–40、大班 40–100 |
| 学情洞察 | 星级评分开关、个人 / 班级分析字数上限 |

### 3. 版本与升级（本地化）

- 版本信息以 `public/latest.json` 的 `version` 字段为准，`/api/version` 读取本机信息。
- **版本检查已本地化**：`/api/version/check` 仅返回本机版本，`hasUpdate` 恒为 false，**不再访问 Gitee 等外部源**。
- 升级通过手动运行 `upgrade.sh` / `upgrade.bat` / `upgrade.ps1` 完成。

---

## 七、使用示例

### 教师端（5 步走通）

1. **注册登录** → 访问 `http://localhost:3000`，注册教师账号（本地完成，不校验外部账号）。
2. **配置 AI** → 「系统设置」填入 AI Base URL、Key、模型，「测试连接」确认。
3. **建班级** → 「班级管理」创建班级，获得邀请码。
4. **建课堂** → 「课堂管理」创建课堂，添加对话活动 / 作业 / 探究 / 项目四类活动，分配给班级并「启用」。
5. **看学情** → 课堂旁的「分析」生成个人 / 全班报告。

### 学生端

1. 访问 `http://<教师IP>:3000`，点「学生入口」。
2. 输入姓名 + 邀请码加入班级。
3. 按课堂顺序完成对话、作业、探究、项目提交，查看自己的学情分析。

---

## 八、核心架构

- **分层**：Next.js App Router 同时承载页面与 API；`src/lib` 收敛业务逻辑（AI 调用、认证、检索、研究生成）；Prisma 作为唯一数据访问层。
- **AI 并发**：`ai-queue.ts` 基于 p-queue 限流，避免并发请求触发上游 API 限流。
- **知识库检索**：`chunker.ts` 分块 + `bm25.ts` 关键词检索（另含可选的向量化 `vectorize`），整块注入 Prompt。
- **研究生成**：`research/` 模块以「数据快照 → 生成 → 引用校验 → docx 导出」流水线工作，保证结果可复现。
- **主要数据实体**：`User`、`Class`、`LearningTask`、`SubProject`、`PresetConversation`、`QuizActivity`、`ExplorationActivity`、`ProjectSubmission`、`AIInsight`、`AnalysisTemplate`、`ResearchProject`、`KnowledgeBase`、`SystemConfig`。

---

## 九、许可证与致谢

- **上游原作者**：管雪沨（常州）
- **上游仓库**：https://github.com/makerguan/quickclass-release
- **许可证**：上游仓库当前**未声明 LICENSE**，授权状态不明确；二次分发或商用前请先与作者确认。
- 本项目（建邺智课）由 `jieload` 维护，作为内部教学工具使用。

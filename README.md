# PRIX

> A distraction-free, high-density workstation for tracking deadlines, technical specs, and copyright transparency across creative competitions.  
> 专为创作者打造的无干扰高密度赛事看板：截止倒计时、提报规格自查、版权避坑与备赛日历。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Vite](https://img.shields.io/badge/Vite-React%2019-646CFF.svg)](https://vite.dev/)

**EN:** Open-call & submission workstation for global design, photography, illustration, and creative tech awards. Fast, offline-first, and zero API cost.  
**CN:** 全球设计、摄影、插画与创意编程赛事工作台。极速本地运行、规格自查与备赛追踪。

> GitHub About tip / 仓库简介建议：  
> `PRIX — Open-call & submission workstation for global design, photography, illustration, and creative tech awards.`

---

## English

### Quick start (no coding background needed)

#### 1. Install Node.js
Download and install the **LTS** build from [nodejs.org](https://nodejs.org/). Accept the defaults.

#### 2. Get the project
- Click the green **Code** button on this repo → **Download ZIP**, then unzip; **or**
- `git clone https://github.com/Xiling13/Prix.git`

#### 3. Launch
Open a terminal in the project folder:

```bash
# Mac: Terminal → type `cd ` (with a trailing space), drag the folder in, press Enter
# Windows: open the folder → Shift + right-click → “Open PowerShell window here”

npm install   # first time only
npm run dev
```

Open the local URL shown in the terminal (default **http://localhost:5181/**).

### How to use

Work in this order the first time:

1. **Find a call**  
   Stay on **Open Calls**. Use the category tabs, or press `⌘K` / `Ctrl+K` and search by name, country, or tags (`TDC`, `Poster`, `Free`…).

2. **Check specs & rights**  
   Click a row. The side panel shows deadlines (local deadline and organizer deadline), fees, DPI, color space, file limits, statement length, and **Official Site**.  
   Color dots = rights radar — always re-read the official rules before paying:
   - Green — creator retains all rights  
   - Yellow — promotional license only  
   - Red — rights-grab warning

3. **Track it**  
   Click **Track** on the row, or **Add to tracker** in the panel. Switch the top toggle to **Tracker** to manage status: Interested → Preparing → Submitted → Shortlisted → Won. Drag cards between columns, or remove them when done. Filter by category tabs (resets to **All** when you open Tracker) or search with the same bar / `⌘K` / `Ctrl+K`. Use **Export** / **Import** on Tracker to back up progress and custom awards.

4. **Export helpers**  
   In the panel: **Add to calendar** downloads an `.ics` file (open it in Apple / Google Calendar). **Submission pack** downloads a zip checklist and folder scaffold for that award.

5. **Add a missing award (optional)**  
   Click **Add award**, fill the form, and save locally — it is added to your tracker automatically. **Copy JSON** or **Open GitHub issue** if you want it in the shared list.

Tips: EN / 汉 switches language in the header. Search works on both **Open Calls** and **Tracker**. Progress and custom awards live only in your browser (`localStorage`) — clearing site data wipes them. Closed calls may show a next-cycle hint under archived sections.

### Contribute a competition

1. Prefer **Add award** in the UI → copy JSON / open a GitHub issue; **or** edit `src/data/competitions.json` directly.
2. Run `npm run validate:data` (and optionally `npm run refresh:hints` for closed calls).
3. Open a Pull Request.

Issue shortcut: [new competition issue](https://github.com/Xiling13/Prix/issues/new).

### Scripts

```bash
npm run dev             # local workstation
npm run build           # production build
npm run lint            # oxlint
npm run validate:data   # schema / timezone / deadline checks
npm run refresh:hints   # fill nextCycleHint on closed calls
```

### Disclaimer

PRIX is an **unofficial community tool**. Deadlines, fees, eligibility, technical specs, and rights notes are curated summaries and may be incomplete or outdated. **Always confirm against the organizer’s official website before entering or paying.** PRIX is not affiliated with, endorsed by, or partnered with any award body listed here. Use at your own risk.

---

## 中文

### 快速开始（无需编程基础）

#### 1. 准备运行环境
前往 [Node.js 官网](https://nodejs.org/) 下载并安装 **LTS（长期支持版）**，一路下一步即可。

#### 2. 下载项目
- 点击本页右上角绿色 **Code** → **Download ZIP**，解压；或
- `git clone https://github.com/Xiling13/Prix.git`

#### 3. 一键启动
在项目文件夹中打开终端：

```bash
# Mac：打开「终端」，输入 `cd `（末尾有空格），把 prix 文件夹拖进窗口，回车
# Windows：打开解压后的文件夹，空白处 Shift + 右键 →「在此处打开 PowerShell 窗口」

npm install   # 仅首次需要
npm run dev
```

终端会显示本地地址（默认 **http://localhost:5181/**），用浏览器打开即可。

### 使用说明

建议按下面顺序上手：

1. **找赛事**  
   保持在 **征稿中**。用上方分类标签筛选，或按 `⌘K` / `Ctrl+K` 搜索名称、国家、标签（如 `TDC`、海报、`Free`）。

2. **看规格与版权**  
   点击任意一行，右侧面板会显示截稿时间（本地截稿时间 + 主办方截稿时间）、费用、DPI、色彩空间、文件上限、阐述字数，以及 **官网** 链接。  
   色点是版权预警——缴费/投稿前请再核对官方规则：
   - 绿 — 创作者完全保留版权  
   - 黄 — 仅宣传展示许可  
   - 红 — 存在版权风险，谨慎投递

3. **加入备赛**  
   在行上点 **加入备赛**，或在面板里点 **加入备赛**。顶部切换到 **我的备赛**，把状态从 感兴趣 → 备稿中 → 已提交 → 入围 → 获奖 往后推。卡片可拖到其他列，不需要时可以移除。可用分类标签筛选（进入备赛页时自动回到 **全部**），搜索栏 / `⌘K` / `Ctrl+K` 同样适用于备赛列表。备赛页支持 **导出** / **导入** 备份进度与自定义赛事。

4. **导出辅助**  
   面板里：**加入日历** 下载 `.ics`（用 Apple / Google 日历打开即可）；**提报资产包** 下载该赛事的清单与文件夹结构。

5. **补充未收录赛事（可选）**  
   点 **添加赛事**，填表保存后会自动加入备赛列表；若希望进入公共库，再 **复制 JSON** 或 **打开 GitHub Issue**。

提示：右上角 EN / 汉 可切换语言。搜索在 **征稿中** 和 **我的备赛** 均可用。进度与自定义赛事只存在本机浏览器（`localStorage`），清除网站数据会丢失。已截止赛事可能出现在归档区，并带有下一届周期提示。

### 如何贡献新赛事

1. 应用内 **添加赛事** → 复制 JSON / 打开 GitHub Issue；或直接编辑 `src/data/competitions.json`。
2. 运行 `npm run validate:data`（已截止赛事可再跑 `npm run refresh:hints`）。
3. 提交 Pull Request。

快捷入口：[新建赛事 Issue](https://github.com/Xiling13/Prix/issues/new)。

### 免责声明

PRIX 为**非官方社区工具**。截止日期、费用、报名资格、技术规格与版权说明均为整理摘要，可能不完整或已过时。**参赛或缴费前请务必以主办方官网为准。** 本项目与所列任何奖项主办方无隶属、背书或合作关系。使用风险自负。

---

## Fonts / 字体

**EN:** PRIX loads three open-source web fonts via [Google Fonts](https://fonts.google.com/):

| Font | Role | License |
|------|------|---------|
| [Geist](https://github.com/vercel/geist-font) | Latin sans-serif | [SIL Open Font License 1.1](https://scripts.sil.org/OFL) |
| [Noto Sans SC](https://fonts.google.com/noto/specimen/Noto+Sans+SC) | Simplified Chinese sans-serif | SIL Open Font License 1.1 |
| [JetBrains Mono](https://www.jetbrains.com/lp/mono/) | Monospace (dates, labels) | SIL Open Font License 1.1 |

CSS also lists generic system font families (`system-ui`, `ui-sans-serif`, `ui-monospace`) as **fallbacks** only when web fonts fail to load. PRIX does not bundle or redistribute operating-system fonts; the browser uses whatever is already installed on the user's device. This is standard web practice and is not font redistribution or infringement by this project.

**CN:** PRIX 通过 [Google Fonts](https://fonts.google.com/) 加载以下三款开源 Web 字体：

| 字体 | 用途 | 授权 |
|------|------|------|
| [Geist](https://github.com/vercel/geist-font) | 英文无衬线 | [SIL Open Font License 1.1](https://scripts.sil.org/OFL) |
| [Noto Sans SC](https://fonts.google.com/noto/specimen/Noto+Sans+SC) | 简体中文无衬线 | SIL Open Font License 1.1 |
| [JetBrains Mono](https://www.jetbrains.com/lp/mono/) | 等宽（日期、标签等） | SIL Open Font License 1.1 |

CSS 中的 `system-ui`、`ui-sans-serif`、`ui-monospace` 等仅为 **备用字体**：仅在 Web 字体加载失败时，由浏览器调用用户操作系统已安装的字体。本项目不打包、不分发任何系统字体，属于常规 Web 做法，不构成字体侵权。

---

## License

[MIT](./LICENSE) © 2026 Xiling

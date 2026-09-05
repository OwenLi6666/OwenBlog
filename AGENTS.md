# AGENTS.md — OwenBlog / dragonll.com

> 跨 AI 工具的单一真源。Cursor / Codex / Gemini CLI 原生读本文件；
> Claude Code 通过同目录 `CLAUDE.md` 的 `@AGENTS.md` 导入。**改规则只改这里。**

## 这是什么

[NotionNext](https://github.com/tangly1024/NotionNext) 的 fork —— Notion 当 CMS、Next.js 渲染。
部署在 Vercel、前面套 Cloudflare，域名 <https://dragonll.com>。
- `origin` = `git@github.com:OwenLi6666/OwenBlog.git`
- `upstream` = `https://github.com/tangly1024/NotionNext.git`

## 1. Node 版本 —— 别动全局那份

上游 `engines` 要求 **node `>=22 <25`**，本机全局是 Homebrew **node 25**（`/opt/homebrew/bin/node`）。

**不要 `brew uninstall node`、不要 `brew link` 切换全局版本。** 有 9 个全局 npm 包挂在那份 node 上
（`appium` / `@larksuite/cli` / `@botim/botim-cli` / 3 个 MCP server 等），换掉会全部孤立。

正确做法 —— `node@22` 是 keg-only，装了不会 symlink 进 `/opt/homebrew/bin`，全局 25 的**二进制**原封不动：

```bash
brew install node@22
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"   # 只在当前 shell 生效
```

Long 的 `~/.zshrc` 里有个 `owenblog` 函数替他做了这两步（幂等 + 未装时报错）。
已安装（2026-09-05）：node@22 = 22.23.2，全局 node = 25.1.0，两者共存可用。

### ⚠️ keg-only ≠ 零副作用（2026-09-05 真实踩坑）

`brew install node@22` 会**顺手升级共享依赖**。这次它把 `simdjson` 从 4.1.0 升到 4.6.10
（soname 从 `.28` 变成 `.33`），而全局 node 25 是对着 4.1.0 编译的，装完立刻 dyld 崩溃：

```
dyld: Library not loaded: /opt/homebrew/opt/simdjson/lib/libsimdjson.28.dylib
```

连带 `appium` / `@botim/botim-cli` / `@larksuite/cli` 全部不可用。

**已做的修复**（旧 keg 没被删，软链回去即可，全局包一个都不用重装）：

```bash
ln -s /opt/homebrew/Cellar/simdjson/4.1.0/lib/libsimdjson.28.0.0.dylib \
      /opt/homebrew/Cellar/simdjson/4.6.10/lib/libsimdjson.28.dylib
```

这是权宜之计 —— **下次 `brew upgrade simdjson` 或 `brew cleanup` 删掉 4.1.0 时会再次失效**。
届时的正规解是 `brew upgrade node`（升到 26.x）。注意 Homebrew **没有 `node@25` formula**，
回不去 25；且带原生模块的全局包（appium 等）因 ABI 变化可能要重装。

教训：装任何 keg-only 版本 formula 之前，先 `brew deps --tree <formula>` 看它会不会碰共享依赖。

**本机没有 nvm / fnm / volta / asdf**（2026-09-05 核实）。不要建议 `nvm use`，会 command not found。

## 2. 包管理器：跟上游走用 yarn，不要用 npm

上游是 `yarn@1.22.22` + `yarn.lock`（`package.json#packageManager` 已声明）。
本仓库历史上被切成过 npm，2026-09-05 已切回 yarn 并删除 `package-lock.json`。

本机没有全局 yarn，用 node@22 自带的 corepack 提供：

```bash
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
corepack enable   # shim 只落在 node@22 的 bin 里，不影响全局 node 25
```

### ⚠️ yarn.lock 的下载地址指向国内镜像

上游作者在国内生成锁文件，`yarn.lock` 里有 700 条 `resolved` 指向
`registry.npmmirror.com`，**从阿布扎比拉 tarball 会反复 `ESOCKETTIMEDOUT`**
（元数据请求能通，所以看起来像网络好的，其实卡在下载）。
已全部改写成 `registry.yarnpkg.com`（版本号与 integrity 不变，只换下载主机）。

**每次同步上游后都要重做这一步**，否则 `yarn install` 会挂十几分钟然后失败。

## 3. 本地开发

```bash
yarn install
yarn dev        # 不配 NOTION_PAGE_ID 时会回退到 NotionNext 官方 demo 数据库
```

**这个 fallback 是特性不是 bug** —— 它让你能在拿不到真实 Notion 数据的情况下验证框架本身。
真实的 Notion 根页面 ID **不在本仓库任何地方**，只存在于 Vercel 的环境变量里
（`.env.local` 只有 BIO / 邮箱 / Twitter；`blog.config.js` 里那个是上游 demo 的 ID）。

## 4. ⚠️ 已知问题：线上是空站（2026-09-05 确认，未修）

dragonll.com 服务正常，但**每个页面都渲染 0 篇文章**：`posts=0`、`siteInfo=null`、
网页标题是 `undefined | undefined`、动态 sitemap 里零篇文章。`/rss/feed.xml` 里还有 6 篇，
但那是 2025-12-31 构建时写死的静态文件。

**Notion 侧已排除** —— 直接打 Notion 公开 API 验过，数据库 `LongLi`（id `191326a0-88b7-4a02-ace1-1547433a967a`）
和文章都能正常读出，分享权限没丢。

**代码版本也已排除**（2026-09-05）—— 升到 v4.10.10 后本地 `yarn build` 用官方 demo 数据
成功预渲染出文章页，说明 Next 15 + notion-client 7.12.1 这条取数链路本身是通的。

所以问题在 Vercel 那一侧，候选：`NOTION_PAGE_ID` 环境变量、Redis 缓存后端失效、Notion 限流。
NotionNext 抓取失败会静默返回空，从外部看不出区别，**必须看 Vercel Runtime Logs 才能定位**，
或者拿真实 `NOTION_PAGE_ID` 在本地 `yarn dev` 复现一次。

顺带：旧配置里 `NEXT_REVALIDATE_SECOND` 是 5 秒（上游默认 60），
意味着页面每 5 秒就可能回源打一次 Notion —— 这是限流假说的一个可疑点。合并后已跟随上游改为 60。

## 5. 上游同步（2026-09-05 已完成一次）

分支 `sync-upstream-20260905` 已把上游 **v4.10.10** 合进来：落后的 690 个提交清零，
Next 14.2 → **15.5.24**、notion-client 7.7.1 → **7.12.1**，解决 32 个冲突文件。
备份在 tag `backup-before-upgrade-20260905` 和分支 `backup/main-20260905`。

取数层被上游整体重写：`lib/db/getSiteData.js` **已删除**，拆成 `lib/db/SiteDataApi.js`
+ `lib/db/notion/*` + `lib/cache/*`，新增 `RateLimiter.ts`。
函数改名 `getGlobalData()` → `fetchGlobalAllData()`（参数不变），
`pages/arabic-player.js` 的 import 已同步修正。

### 必须保留的自定义（同步时逐项确认）

| 内容 | 位置 |
| --- | --- |
| 阿拉伯字母播放器（1080 行原创） | `pages/arabic-player.js` |
| 菜单入口 | `themes/next/components/MenuList.js` |
| `/arabic-player` 的 meta | `components/SEO.js` |
| owenpower.com → dragonll.com 301 | `vercel.json` |
| AI 爬虫策略 | `lib/utils/robots.txt.js`（**不是** `public/robots.txt`，见下） |
| 12 个站点配置值 | `blog.config.js` |

`blog.config.js` 的 12 个值**全部能用 `NEXT_PUBLIC_*` 环境变量覆盖**
（关键词那个变量名是 `NEXT_PUBLIC_KEYWORD`，不带 s）。
上游 v4.10 起把 `TITLE` / `DESCRIPTION` 移出了配置，但 `components/SEO.js` 等 8 处仍在
调 `siteConfig('TITLE')` —— 已手工补回这两个键作兜底，否则 Notion 挂掉时标题会渲染成
`undefined | undefined`。

### 可安全丢弃的（每次同步的冲突大头）

14 个**未使用主题**的 Footer / config 里的品牌替换。那些改动本身就是坏的：
只换了链接没换文字，且指向已废弃的 `owenpower.com`。2026-09-05 已全部采纳上游。
页脚品牌统一为 `DragonLL`（此前 `owen` / `dragon` / `DragonLL` 三个名字并存）。

## 5b. 同步时会咬人的三个坑（都已踩过）

1. **`public/robots.txt` 会被构建覆盖。** 上游的 `lib/utils/robots.txt.js` 在构建时
   无条件写这个文件，绕过 `next-sitemap` 的 `generateRobotsTxt: false`。
   自定义规则必须写进**生成器模板**，改静态文件没用。
2. **`@waline/client` 3.x 的 CSS 路径。** `'./dist/waline.css'` 不再被 exports 导出，
   正确写法是 `'@waline/client/style'`。这个坑 2024 年踩过一次，merge 会把旧写法带回来。
3. **`.github/workflows/sync.yaml` 的 `upstream_sync_repo`。** 曾被全局替换成自己的仓库
   （等于从自己同步到自己）。正确值是 `notionnext-org/NotionNext`。

## 5c. 上游遗留的警告（不阻塞构建，早晚要处理）

- `next.config.js` 里的 `swcMinify` 在 Next 15 已不是合法配置项
- `publicRuntimeConfig` 会在 Next 16 被移除

## 6. 禁止 / 注意

- ❌ 不要动全局 node（见 §1）
- ❌ 不要把 `export PATH=.../node@22/...` 写进 `~/.zshrc` 的全局作用域 —— 那会影响所有项目
- ❌ 不要直接推 `main` 部署 —— 先推分支拿 Vercel preview 验收
- ⚠️ `devtang` 分支 ahead 31 / behind 279，是僵尸分支
- ⚠️ `.nvmrc` 与 `DEVELOPMENT.md` 的 node 版本已于 2026-09-05 修正过；若同步上游后又变回旧值，以 §1 为准

<!-- 2026-09-05 首次创建。起因: 上一个 AI 会话因为没有项目级规则文件, 建议了机器上并不存在的 nvm。 -->

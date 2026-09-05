import fs from 'fs'
import BLOG from '@/blog.config'

/**
 * 构建期生成 public/robots.txt
 *
 * 本文件相对上游有改动：上游模板只有 `User-agent: * / Allow: /` 三行，
 * 这里并入了 dragonll.com 自己的 AI 爬虫策略与屏蔽名单。
 * Host / Sitemap 仍然从 siteInfo.link 动态取，不写死域名。
 *
 * 注意：这个函数会**无条件覆盖** public/robots.txt，
 * 所以不要直接手改那个文件，改这里。
 */
export function generateRobotsTxt(props) {
  const { siteInfo } = props
  // Notion 抓取失败时 siteInfo 为空，回落到配置里的站点地址，
  // 避免生成 "Host: undefined" 这种会误导爬虫的 robots.txt
  const LINK = siteInfo?.link || BLOG.LINK
  const content = `# Default: Allow all bots
User-agent: *
Allow: /
Crawl-delay: 10

# OpenAI GPT (ChatGPT)
User-agent: GPTBot
Allow: /
Crawl-delay: 10

# Google AI (Bard/Gemini)
User-agent: Google-Extended
Allow: /

# Anthropic Claude
User-agent: Claude-Web
Allow: /
Crawl-delay: 10

# Common Crawl (研究用途)
User-agent: CCBot
Allow: /
Crawl-delay: 20

# Block aggressive scrapers
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

# Protect admin/private areas
User-agent: *
Disallow: /admin/
Disallow: /api/private/
Disallow: /*.json$

# Host
Host: ${LINK}

# Sitemaps
Sitemap: ${LINK}/sitemap.xml
`
  try {
    fs.mkdirSync('./public', { recursive: true })
    fs.writeFileSync('./public/robots.txt', content)
  } catch (error) {
    // 在vercel运行环境是只读的，这里会报错；
    // 但在vercel编译阶段、或VPS等其他平台这行代码会成功执行
  }
}

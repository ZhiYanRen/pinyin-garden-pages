# GitHub Pages 单公开仓库发布

## 实际配置

- 唯一公开仓库：https://github.com/ZhiYanRen/pinyin-garden-pages 。包含完整源码与开发历史，主干 main。
- 正式网址：https://zhiyanren.github.io/pinyin-garden-pages/ 。迁移保持原仓库名和网站路径。
- Pages 来源为 GitHub Actions；工作流 `.github/workflows/pages.yml`。
- Node.js 22.16+；本机预览 `npm start`；验证 `npm test`；正式构建 `npm run build:release`，产物为 dist/。
- 生产只有静态资源，个人记录保存在设备浏览器；不依赖数据库或生产 Node 服务。

## 自动更新

在 main 修改 → 运行验证与正式构建 → 只提交本任务变更 → 推送 origin/main → 检查对应 Actions 和 Pages 部署 → 验证正式网站。

main push 自动测试构建，通过后使用 configure-pages、upload-pages-artifact、deploy-pages 发布 dist/。PR 只验证；workflow_dispatch 可手动重试。部署使用 github-pages 环境和内置 GITHUB_TOKEN，权限 contents: read、pages: write、id-token: write。

不再使用第二个私有源码仓库、跨仓库发布、PAGES_DEPLOY_REPOSITORY 或 PAGES_DEPLOY_KEY。旧 gh-pages 分支仅是历史发布记录，不作为当前 Pages 来源，不手工更新。

## 凭据与限制

源码已公开，不得提交个人数据、学习备份或凭据；浏览器运行资源同样公开。无需把个人 GitHub 登录令牌复制到 CI。

本机存储不代表多设备同步，静态 JSON 不支持网页写回；需求必须服从 AGENTS.md 的静态运行边界。

## 导航同步

本项目入口维护在相邻 app-island/public/projects.json。名称、Logo、正式网址变更时，同步导航项目、测试并在其 main 提交推送。网址必须经实际发布和访问核验，入口使用新窗口打开。

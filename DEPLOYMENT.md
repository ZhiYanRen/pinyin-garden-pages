# GitHub Pages 发布约定

生产运行内容均在 dist/，使用 GitHub Pages 支持的静态资源。浏览器学习记录使用 localStorage，音频使用 Cache Storage；不依赖后端数据库或生产 Node 服务。

## 免费账户与私有源码

GitHub Free 的 Pages 发布来源必须是公开仓库。保留私有源码的免费方案是：私有源码仓库负责开发和 CI，另一个公开发布仓库仅接收 dist/ 生成文件。网页中的 JavaScript 和公共题库本来就会发送到浏览器，因此不能被视为机密。

两仓库方案需要：

- 源码仓库变量 `PAGES_DEPLOY_REPOSITORY`：公开发布仓库的 `owner/repo`。
- 源码仓库 Secret `PAGES_DEPLOY_KEY`：专用于该发布仓库的 SSH 私钥。
- 发布仓库 Deploy Key：对应公钥，允许写入。这个密钥不授权其他仓库。
- 发布仓库 Pages 来源：`gh-pages` 分支、根目录。

密钥只应存入 GitHub Actions Secrets，不能写进 Git、前端、文档或聊天。无需将本机 GitHub CLI 的个人令牌复制到 CI。

## 日常工作

在源码目录修改 → `npm test` → `npm run build:release` → 提交本任务变更 → `git push`。

推送 main 自动触发 `.github/workflows/pages.yml`。先验证，再发布；测试失败时不会发布。PR 运行验证但不会接触部署密钥。公开发布仓库由 CI 管理，不能直接编辑；修改会在下次发布被替换。

`PAGES_DEPLOY_REPOSITORY` 尚未设置时，CI 只验证，不发布。首次发布需等待部署分支生成，再启用 Pages。仓库与正式网址在 GitHub 授权及可见性方案确认后记录。

## 后续数据能力

静态 JSON 只能作为版本化的公共题库，不能在运行时由网页改写。儿童记录留在设备，提供文件导入导出。若用户要云同步或共享可写数据，需要先重新讨论架构；不能在当前“仅 GitHub Pages”约定下擅自引入数据库、服务器或暴露 GitHub token。

## 当前工程配置

- GitHub 账号：ZhiYanRen。
- 私有源码仓库：ZhiYanRen/pinyin-garden。
- 公开静态发布仓库：ZhiYanRen/pinyin-garden-pages。
- 网站地址：https://zhiyanren.github.io/pinyin-garden-pages/ 。
- 部署密钥只拥有公开发布仓库的写入权限，不使用个人 OAuth token 执行 CI。

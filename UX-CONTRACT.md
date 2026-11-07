# UX contract
Source: PRODUCT.md / 用户 2026-11-06 的直接成品需求。
## Canonical UI Map
| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | Native select in app.js | DESIGN.md | settings rate, mode | browser settings |
| Form | app.js form handlers | PRODUCT.md | pinyin input, import | unit + browser |
| Scrollbar | styles.css | DESIGN.md | native forced colors | browser |
| Toast | app.js notify | UX contract | status, error | browser |
| CRUD | core.js + storage.js | PRODUCT.md | results, mistakes, export/import | core tests |
| Dialog | app.js dialog | DESIGN.md | settings, instructions | keyboard browser |

练习始终显式点击播放；重播取消前一声音。提交后不能重复计分。自动评分为选项/拼音输入；手写需用户自评。退出保留当前题及已计分结果，重新开始先确认替换。

导航保持选择的教材与单元在本机；不在URL暴露孩子的答案。导入只允许受限结构及已知题目，合并错题与历史，不执行导入代码。数据存储失败持久显示提示并允许导出。多标签页存储事件提醒刷新防止覆盖；不会静默合并活动练习。

录音只在用户手势请求权限，最长30秒，停止后关麦；切页/隐藏立即释放。正常听音无需麦克风。不可用时说明可直接跟读。

离线包显式下载并报告进度；只有校验完成才显示可离线。只缓存本应用静态资源，不缓存登录/个人账户响应。

## iPad 优先布局（2026-11-07）
来源：AGENTS.md 的 iPad 优先、响应式和触控规范。共享 shell 在1000px切换侧栏与底部导航；practice-listen / practice-answer 负责宽屏分栏。弹窗使用原生 dialog，视觉视口仅控制高度与位置，不接管输入和缩放。下拉选择沿用系统原生控件。旋转、暂停和恢复不得重置答案或笔迹；不重新加入安装说明。

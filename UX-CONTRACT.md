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

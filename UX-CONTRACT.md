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

## 慢听、独立拼写与教材范围（2026-11-09）
来源：用户确认2024年审核封面，并要求改善听音、声调和语速。默认0.75、更慢0.6，旧设置一次迁移且保留记录；四声单字与对比为教学预览，可显示答案，正式练习提交前隐藏答案。只有音频成功结束才能记为heard，中断、失败及离开页面不能放行。每日题目按项指定听辨或输入方式，统计保存实际作答方式；选择答对不计间隔复习巩固，立即重练也不计。教材范围默认textbook，原题标识不变，supplement显式选入。

## 语文积累（2026-11-09）
来源：用户要求新增日常古诗词、默写、看图写话、部首偏旁。`literacy-ui.js`管理栏目、输入、反馈，复用主应用导航、按钮、保存提示和备份。`literacy-core.js`校验和合并本机记录，`literacy-data.js`为公开题目唯一来源；图片位于`dist/literacy/`。熟读由用户确认；汉字默写只核对文字，纸写自评；作文只给提示与参考，不评分。原文在默写核对前隐藏，输入修改即撤销旧核对结果；偏旁题每题只记一次。草稿与标记导入时保留较新版本，未知题目/超长草稿拒绝导入。临时自查勾选不作为学习成绩持久保存。

## 六册教材积累（2026-11-13）
`literacy-curriculum.js`持有官方册次与编排，`literacy-data.js`持有合并后的学习条目和唯一筛选函数。`literacy-ui.js`沿用原生select，积累与默写共用同一筛选；切详情、返回、换栏目均不重置。选择单独保存在本机`pinyin-literacy-filter`，无儿童答案，不纳入学习备份；读取失败回到二上全册。切年级/册次重置单元，保留内容类型。空范围解释并提供查看全册操作。课外作品不混入教材分母。参考入口条目只提供官方课本与纸写，不渲染空题目或自动核对。旧ID不变，备份数量限制依据已知条目实际上限。

## 品牌与果橙主题（2026-11-14）
名称改为锦铭语文小助手，页面、浏览器标题、manifest、主屏幕标题、备份文件名及应用岛目录统一。运行存储键、备份版本、教材和题目ID保持兼容。果橙科技视觉沿用共享按钮、导航、原生选择和反馈，网格与轨道仅为非交互装饰，不表达虚构状态。

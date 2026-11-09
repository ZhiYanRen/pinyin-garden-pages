---
version: alpha
name: "拼音小花园"
description: "像一本有声音的儿童练习册，让易混拼音慢慢长成小花。"
colors:
  primary: "#28614F"
  ink: "#243E36"
  muted: "#61756C"
  background: "#F5F8F3"
  surface: "#FFFFFF"
  mint: "#E4F0D9"
  peach: "#F9E4D8"
  lavender: "#EDE9FA"
  sky: "#E2EDF7"
  line: "#DDE5DA"
  danger: "#994D3C"
  yellow: "#F7D96D"
typography:
  sans:
    fontFamily: '"PingFang SC", "Microsoft YaHei", system-ui, sans-serif'
  display:
    fontFamily: '"Avenir Next", "Trebuchet MS", "PingFang SC", sans-serif'
rounded:
  DEFAULT: "1.25rem"
  sm: "0.75rem"
  lg: "2rem"
spacing:
  section-gap: "2rem"
  page-max: "76rem"
components:
  button: { minHeight: "48px" }
  card: { padding: "24px" }
  dialog: { maxWidth: "640px" }
---

## Overview
中文版儿童学习工具，服务已会拼读但听写易错的孩子。iPad 横竖屏及手指/Apple Pencil 操作优先。主视觉来自四线三格练习本与植物观察本：明亮纸张、大字、低密度，绿色主操作。标志是由声调小山和叶片构成的嫩芽；进步以真正的答题数量显示，绝不预置假成绩。不采用排行榜、倒计时催促、失败红叉大屏。

## Colors
上列颜色为规范值。主绿表示可操作与成功，浅色仅区分练习类别；错误使用文字与柔和陶色，不仅依赖颜色。统一通过 dist/tokens.css 的同名 CSS 变量消费。DESIGN.md 为源，scripts/generate-tokens.mjs 生成色值，禁止在组件复制颜色。

## Typography
正文采用系统中文字体；拼音和关键数字采用 display，确保完整显示声调与 ü。正文16px、辅助14px、标题28–38px、拼音36–64px；正文行高1.65，不用长段居中。

## Layout
宽度达到1000px时使用侧栏导航，练习页左侧听音、右侧作答；窄于1000px采用底部四栏导航，竖屏优先把宽度留给学习内容。首页为紧凑练习工作台，不使用宣传首屏。页面自然滚动并预留底部导航和安全区，不锁整个页面。手写区至少240px，随可用高度扩展；横竖屏变化保留笔迹。间距以8px为主；问题每屏一个。弹窗头部固定、正文独立滚动，尺寸随 visualViewport 变化适应屏幕键盘。手机保持单列，PC沿用宽屏分栏。

## Elevation & Depth
以白色块、线条、柔和色面建立层级。弹窗原生 dialog 管理焦点与背景隔离；不使用装饰性大阴影。所有可操作卡片为按钮。

## Shapes
圆角20px卡片，12px输入，32px重点面板。线性SVG图标是装饰，旁边保留中文标签。

## Components
按钮最小48px，按下轻微缩小，focus-visible明显外框。选择态兼有文字/图标与边框；禁用态保留几何。共享 render / button / status / dialog / audio 控件。声音加载通过固定位置文字反馈；不以无限动画掩盖错误。移动导航、安全区与滚动条统一定义。降低动态效果设置关闭转场。录音和离线进度使用 aria-live。

## Do's and Don'ts
- 每个听写答案在孩子提交前隐藏；纠错后再给例字和拼音。
- 复习统计来自真实作答；空白状态有开始入口。
- 不显示虚构的连续学习天数，不把录音说成自动发音评测。

## 慢听与声调交互
复用现有绿、白与浅绿面板；四声卡使用平、升、转折、降的文字路径提示，与完整单字合成音配合，不冒充专业音高测量。四张卡等宽，触控反馈仅短暂缩放和背景变化；减少动态效果时关闭过渡。两声示范有700ms停顿，快速切换、导航和普通播放均取消前一示范。状态文字保留固定高度。听音成功后才允许作答，不在播放失败时制造完成反馈。

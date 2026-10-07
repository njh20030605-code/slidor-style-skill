<div align="center">

# Slidor Style · 品牌大片级 PPT 与网页设计技能

**一个 Claude skill：让 Claude 做出来的 PPT 和 HTML 页面，像巴黎顶级演示设计工作室出品，而不是模板。**

中文 | [English](README.en.md)

![Claude](https://img.shields.io/badge/Claude-Code%20%7C%20claude.ai-D97757?logo=anthropic&logoColor=white)
![Presets](https://img.shields.io/badge/presets-10-black)
![Layouts](https://img.shields.io/badge/layouts-24-black)
![Output](https://img.shields.io/badge/output-PPTX%20%7C%20HTML%20%7C%20PDF-B0121B)
![License: MIT](https://img.shields.io/badge/license-MIT-green)

<img src="docs/highlights.jpg" alt="Slidor Style 样张：9 页不同预设" width="100%">

</div>

## 这是什么

把两位顶级演示设计师的方法拆解成一套可执行的设计系统，装进 Claude：

- **[Slidor](https://www.slidor.agency/)**：巴黎演示设计工作室，客户有 Chanel、Cartier、LVMH、Nespresso、Lacoste、Tencent。逐页研究了官网公开的 25 个案例（395 页）、Dribbble 上全部 122 个作品和博客里 54 篇方法论文章。
- **Lucile Mennessier**：法国奢侈品 / 美妆 PPT 设计师，客户有 L'Oréal、Guerlain、Shiseido、Dom Pérignon。研究了 13 个项目和两本作品集。

研究结论写成了 Claude 能直接照做的规则、版式和代码。重点不是组件，而是让一份稿子看起来高级的那几个决定：**品牌世界先于模板、每页只有一个主角、一页一个结论、字体决定高级感、强调色只是点缀**。

## 里面有什么

| | 内容 |
|---|---|
| **方法** | 品牌世界 → 行动标题 → 版式 → 图像 → 渲染自检，8 步工作流；14 条「精髓」规则（多数来自真实客户稿被打回的教训） |
| **10 套视觉预设** | atelier 暖调生活方式 · maison 奢侈品编辑 · lumiere 美妆极简 · editorial 时尚大片 · stage 暗场发布会 · sport 运动 · grid 瑞士网格 · corporate 企业 · gradient 产品 · studio Slidor 官网本色 |
| **24 种版式** | 电影感封面、巨型章节数字、产品穿过大字（interlock）、只高亮一根柱子的图表、三联图、瑞士模块……每种带 1920×1080 下的具体尺寸 |
| **HTML 幻灯片引擎** | 单文件、自适应缩放、方向键翻页、G 总览、N 备注、P 切预设、View Transitions 平滑转场、打印成 PDF |
| **滚动网页模板** | 同一套 token 与组件的响应式落地页 / 报告页 |
| **PPTX 工具链** | pptxgenjs 套件（与 HTML 同一坐标系和预设）+ Morph 转场 + 图片预处理（裁切、圆角、拱形、遮罩、interlock 切分） |
| **矢量文字导出** | `html_to_pptx_vector.py`：HTML 稿导出成 PPTX，背景是 4K 图、文字是矢量 SVG 层，放多大都不糊 |
| **渲染自检** | 每页渲染成图 + 联系表，交付前逐页看，自动查空白页 |

### 同一页，10 套预设

<img src="docs/presets-rules.jpg" alt="同一页在 10 套预设下" width="100%">

<img src="docs/presets-cards.jpg" alt="四卡片页在 10 套预设下" width="100%">

### 可编辑 PPTX（pptxgenjs 套件生成，lumiere 预设）

<img src="docs/pptx-example.jpg" alt="PPTX 示例" width="100%">

## 安装

```bash
git clone https://github.com/njh20030605-code/slidor-style-skill.git
cp -R slidor-style-skill/slidor-style ~/.claude/skills/
```

Claude Code 会自动发现 `~/.claude/skills/slidor-style/SKILL.md`。在 claude.ai 上，把 `slidor-style` 文件夹打包成 zip 上传为自定义 skill。

之后正常说话就行，例如：

- 「把这份周报做成一份 PPT」
- 「给这个产品做个落地页」
- 「这份稿子太丑了，重新设计一下」

### 依赖

| 用途 | 需要 |
|---|---|
| HTML 渲染 / 截图 / PDF | Google Chrome（脚本默认 macOS 路径，其他系统改 `CHROME` 变量） |
| PPTX 生成 | Node.js + `npm i -g pptxgenjs` |
| 图片预处理、联系表 | Python 3 + Pillow |
| 矢量文字导出 | poppler（`pdftocairo`） |
| PPTX 预览自检（可选） | LibreOffice（`soffice`）+ poppler（`pdftoppm`） |

## 目录

```
slidor-style/
├── SKILL.md                     入口：工作流、精髓规则、硬性数字、反模式、QA 清单
├── references/
│   ├── case-library.md          Slidor 25 个案例逐个拆解：可以学什么、别学什么
│   ├── lucile-mennessier.md     奢侈品 / 美妆的克制层：12 个招牌动作 + 15 条规则
│   ├── slidor-methodology.md    博客规则、动画语法、爆款规律、官网 token
│   ├── presets.md               10 套视觉世界 + 自定义品牌配方
│   ├── layouts.md               24 种版式（带尺寸）
│   ├── html-engine.md           HTML 引擎与网页模板用法、导出
│   └── pptx-kit.md              pptxgenjs 套件 API、字体、渲染差异
├── assets/
│   ├── deck-template.html       HTML 幻灯片引擎 + 10 套预设 + 13 页样张
│   ├── page-template.html       响应式滚动网页模板
│   ├── slidor_pptx_kit.js       pptxgenjs 套件
│   └── pptx_example.js          10 页 PPTX 完整示例
└── scripts/
    ├── html_to_pptx_vector.py   HTML → PPTX（4K 背景 + 矢量文字层）
    ├── html_to_pptx.sh          HTML → PPTX（整页图片，备用）
    ├── pptx_finish.py           Morph/Fade 转场、描边字、中文字体修正
    ├── prep_images.py           图片裁切 / 圆角 / 拱形 / 遮罩 / 纸纹 / 光晕 / 网格渐变
    ├── render_html.sh           HTML 每页截图 + 联系表
    └── render_pptx.sh           PPTX 每页渲染 + 联系表
```

## 声明

- 这是独立的学习与研究项目，**与 Slidor、Lucile Mennessier 及文中提到的任何品牌都没有关联**，也未获其背书。品牌名称归各自所有者。
- 仓库里**没有**任何 Slidor、Lucile Mennessier 或其客户的图片、文件或文案；`references/` 里是我对公开页面的观察和归纳。
- 样张与模板里的照片来自 [Lorem Picsum](https://picsum.photos)（图片来自 Unsplash，按 [Unsplash License](https://unsplash.com/license) 使用）。

## License

[MIT](LICENSE) © 2026 Jasper Yang

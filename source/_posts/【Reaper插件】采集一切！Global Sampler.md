---
title: 【Reaper插件】实时采集一切！Global Sampler
comments: true
categories: Reaper插件
aubot: DocX
aubot_link: 'https://space.bilibili.com/5292339?spm_id_from=333.1391.0.0'
tags:
  - 音效插件
  - Reaper
excerpt: 一个对于音效设计者非常实用的免费小插件
toc: true
date: 2026-8-12 17:58:49
cover: 'https://cdn.docxaudioblog.top/2026/08/20260831-16-05-12-【封面】采集一切！Global Sampler2.0.png'
---

## 一、概述

Global Sampler 是开发者 BirdBird 为 REAPER 开发的一款回溯录音（Retrospective Recording）脚本。无论 REAPER 在做什么，它都在后台循环录制监听信号。默认保留最近 60 秒的音频，录制的内容可以随时框选并拖回工程，作为媒体项继续处理。在音效设计中可以节省大量时间。

![框选并拖回工程](https://cdn.prod.website-files.com/63338d3b3b3392110cfbe05d/637588af45ca5e48e7f0c54f_gif%20demo.gif)

---

## 二、使用场景

### ① 快速渲染

这应该是最常用的场景。给一句语音挂上效果链，只要播放一遍，框一下拖出来就是渲染后成品，可以快速导出。或当音效制作了很多分层时，可以直接拖拽渲染后的音频，很方便地方便配置到后续视频中，无需一个一个渲染。

### ② 记录灵感

在合成器或者效果器上拧旋钮时，或者用midi键盘演奏了一段即兴旋律。开着 Global Sampler 的话，直接框选拖进工程即可使用。

### ③ Scrubbing

Scrubbing 是拖动播放头、以任意速度回放音频的操作，类似搓唱片。这种变速回放会产生时间拉伸、颗粒化的特殊质感，是 glitch、过渡类音效的常用做法。它属于实时交互产生的声音，正常渲染流程录不到。不过，把 JSFX 挂在 Monitor FX 链上，就能一并记录下来。


---

## 三、安装

Global Sampler 依赖以下扩展，请先确认均已安装：

1. **[SWS 扩展](https://www.sws-extension.org/)**：REAPER 的功能扩展集合
2. **[ReaPack](https://reapack.com/)**：脚本与扩展的包管理工具
3. **[js_ReaScriptAPI](https://forum.cockos.com/showthread.php?t=212174)**：ReaScript 的扩展 API 接口

随后执行：

```
Extensions → ReaPack → Import Repositories...
```

导入以下仓库地址：

```
https://raw.githubusercontent.com/Bird-Bird/ReaScript_Testing/main/index.xml
```

在 ReaPack 包浏览器中搜索 `Global Sampler`，安装 `BirdBird_Global Sampler.lua`。配套的 JSFX 插件（`JS: Global Sampler`）将随仓库同步安装至 JS 效果器分类下。

---

## 四、使用流程

### 步骤一：插入 JSFX 插件

在 FX 浏览器的 **JS** 分类下定位 `Global Sampler`，插入至目标节点。建议置于 **Monitor FX 链**，使其对全部监听场景生效，且随 REAPER 会话常驻，无需为每个工程重复配置。

### 步骤二：启动脚本

通过 Actions 列表运行 `BirdBird_Global Sampler.lua`。GUI 打开后，JSFX 后端即开始采集；波形显示将随监听信号实时更新。

另外还有两个辅助脚本，可以绑快捷键快速导出：

- **BirdBird_Sample Last Playthrough.lua**：导出上一次播放期间的全部音频。
- **BirdBird_Sample Last X Seconds.lua**：导出最近 X 秒（最多 60 秒）到编辑光标处。

---

## 交互说明

![Ctrl+Click Pause/Play](https://i.imgur.com/5JhaOZu.gif)

| 操作 | 功能 |
| --- | --- |
| Ctrl/Cmd + 点击 | 暂停 / 恢复采集 |
| Alt + 点击 | 经 sampler 预览音频（含淡入淡出防爆音处理） |
| 鼠标中键拖拽 | 平移波形显示区域 |
| Ctrl/Cmd + Shift + 点击 | 缩放波形显示 |
| 数字键 1–5 | 切换内置配色主题 |
| 右键菜单 | 停靠窗口 / 切换主题 |

### 音频预览

![Alt+Click Preview](https://i.imgur.com/Xbquvxk.gif)

### 显示区域平移

![Middle Drag](https://i.imgur.com/B2hco2K.gif)

### 波形缩放

![Zoom Waveform](https://i.imgur.com/eZamSgU.gif)

### 内置配色主题

![Themes](https://i.imgur.com/Jp2kGK3.png)

### 窗口停靠

![Dock](https://i.imgur.com/S73Uh8x.png)

停靠位置、主题选择与缩放级别会被自动记忆；主题的进一步定制可通过 `BirdBird_Global Sampler Theme Editor.lua` 完成。

Ps：一般可以停靠到Reaper顶部，方便快速访问。

---

## 注意事项

- 单个会话中仅允许存在一个 JSFX 实例，重复插入可能导致不可预期的行为。
- 切换项目标签页（Project Tab）时，脚本具备基本的实例冲突容错，通常可正常工作。
- 若需突破 60 秒采集上限，可修改 JSFX 源码中的 `len_in_secs` 参数。但需注意，该参数受 JSFX 内存上限约束（`maxmem`），且采样率越高，可采集时长越短；超限后 GUI 选区与缓冲区实际区间的映射将产生偏差。

---

## 免费脚本版与付费插件版的对比

作者另推出了独立的插件版本 **[Rolling Sampler](https://www.birdsthings.com)**，二者定位如下：

| 维度 | Global Sampler（脚本） | Rolling Sampler（插件） |
| --- | --- | --- |
| 授权方式 | 免费，持续维护 | 售价 $19 |
| 采集时长 | 60 秒 | 最长 10 分钟 |
| 多实例支持 | 不支持 | 支持 |
| 窗口停靠 | 支持 | 不支持 |
| 宿主兼容 | 仅 REAPER | 跨 DAW |

脚本版可满足常规的回溯采集需求；若需多实例或更长采集窗口，可选择付费插件版。

---

## 附：技术原理

Global Sampler 由两个协同工作的组件构成：

1. **JSFX 后端**（`BirdBird_Global Sampler.jsfx`）：负责实际的音频采集。JSFX 是 REAPER 内置的脚本化效果器格式，可直接运行于原生音频线程中。该后端在内部维护一个长度可配置的循环缓冲区（默认 60 秒），持续覆写，并通过 gmem（REAPER 的全局共享内存机制）与脚本层交换录制数据、预览状态与导出指令。

2. **ReaScript 前端**（`BirdBird_Global Sampler.lua`）：负责波形可视化、选区交互与导出控制。前端通过 gmem 读取缓冲区内容并实时渲染波形，用户在 GUI 中框选的区间会被换算为缓冲区偏移量，回传给 JSFX 后端执行导出。

这一"前端可视化 + 后端采集"的架构将音频处理与 UI 逻辑分离，音频采集过程不受 GUI 刷新与交互的干扰，因此即便在复杂的监听场景下也能保证录制的连续性。

JSFX 插件可置于以下任一节点，以决定采集的信号范围：

| 插入位置 | 采集内容 | 说明 |
| --- | --- | --- |
| Monitor FX 链 | 全部监听输出，含 scrubbing 与 Media Explorer 预览 | 全局监听，推荐 |
| Master 轨道 | 工程混合后的主输出 | 仅限工程回放 |
| 任意轨道 | 该轨道路由的信号 | 按需定向采集 |

---

## 相关链接

- [原作者 Cockos 论坛发布帖](https://forum.cockos.com/showthread.php?p=2506514)
- [GitHub 仓库（Bird-Bird/ReaScript_Testing）](https://github.com/Bird-Bird/ReaScript_Testing)
- [Rolling Sampler 插件版](https://www.birdsthings.com)
- [Reapertips 相关介绍](http://reapertips.com/post/capture-anything-in-reaper-with-global-sampler)

---

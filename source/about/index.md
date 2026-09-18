---
title: 个人简介
date: 2025-1-23
aubot: DocX
portrait: "/image/logo.png"
describe: "🐧 游戏音频策划 / Technical Sound Designer"
slogan: "让声音成为游戏体验中最令人难忘的那一层。"
email: "dooocx@163.com"
type: "about"
layout: "about"
comments: false

# —— 工作经历（按时间倒序） ——
experiences:
  - period: "2024 — 至今"
    company: "自由职业 / 独立开发"
    role: "游戏音频策划 & 技术音效设计"
    location: "远程"
    highlights:
      - "负责多个独立游戏项目的音频整体规划与实现"
      - "基于 Wwise / FMOD 搭建可维护的音频工作流"
      - "开发音频工具链，提升团队协作效率"
      - "撰写博客与视频，分享游戏音频技术经验"
    tags: ["Wwise", "FMOD", "Unity", "工作流"]

  - period: "2022 — 2024"
    company: "某游戏公司"
    role: "游戏音频设计师"
    location: "上海"
    highlights:
      - "参与手游项目的音频设计与实装，负责场景音效、UI 音效、角色语音"
      - "推动 Wwise SoundBank 管理规范落地，缩短构建时间约 30%"
      - "与程序团队合作完成动态混音系统与音频事件管理器"
    tags: ["手游", "Wwise", "SoundBank", "混音"]

  - period: "2020 — 2022"
    company: "音频工作室"
    role: "初级音频设计师"
    location: "北京"
    highlights:
      - "参与影视 / 广告 / 游戏项目的音效制作与后期混音"
      - "熟悉 Nuendo、Pro Tools、iZotope RX 全流程"
      - "参与 Foley 录制与素材库构建"
    tags: ["Foley", "混音", "后期"]

# —— 参与作品 ——
# 说明：
# cover     : 卡片左侧的游戏画面（会向右渐隐融入到浅色区）
# desc      : 长条卡片右侧展示的一句话简介
# detail    : 弹窗内容
#   summary        : 项目一句话总结
#   responsibilities: 我在项目中的具体职责（数组）
#   link_url       : 游戏官方 / 商店 / 项目链接
#   link_label     : 链接文案（如 "Steam 页面" / "官方网站"）
works:
  - name: "Global Sampler"
    role: "工具开发 / 音频技术"
    cover: "/image/logo.png"
    desc: "面向游戏音频设计的 Reaper 采样工具，支持批量采集与快速试听。"
    tags: ["Reaper", "工具"]
    detail:
      summary: "为音效设计师量身打造的 Reaper 采样脚本，一键完成素材采集、命名、归档全流程。"
      responsibilities:
        - "需求分析 & 交互设计"
        - "基于 ReaScript 的核心逻辑开发"
        - "自动化命名规则与素材归档策略"
        - "撰写使用文档与教程"
      link_url: "/2025/reaper-global-sampler/"
      link_label: "阅读介绍文章"

  - name: "音频 MPV 播放器"
    role: "工具开发"
    cover: "/image/logo.png"
    desc: "为游戏音效设计定制的 MPV 播放器，支持音频快速预览与对比。"
    tags: ["MPV", "工具"]
    detail:
      summary: "针对游戏音效工作流优化的音频预览器，支持批量比对、快捷键操作。"
      responsibilities:
        - "定制 MPV 配置与快捷键映射"
        - "开发音频波形可视化插件"
        - "构建团队通用的预览工作流"
      link_url: "/2025/audio-mpv-player/"
      link_label: "查看项目详情"

  - name: "手游 3A 音频效果研究"
    role: "音频技术研究"
    cover: "/image/logo.png"
    desc: "针对手游领域实现主机级音频表现的工作流与技术总结。"
    tags: ["手游", "3A", "研究"]
    detail:
      summary: "从技术、艺术、性能三个维度探讨手游达成主机级音频体验的可行路径。"
      responsibilities:
        - "调研主流 3A 游戏的音频设计手法"
        - "在手游平台复现关键音频技术"
        - "撰写研究报告与视频总结"
      link_url: "/2025/mobile-3a-audio/"
      link_label: "观看视频总结"

  - name: "Wwise 学习项目"
    role: "音频策划 & 实装"
    cover: "/image/logo.png"
    desc: "从 Wwise 101 开始的实践项目，涵盖事件、混音、Profiler 全流程。"
    tags: ["Wwise", "学习"]
    detail:
      summary: "面向初学者的 Wwise 学习记录，覆盖官方认证 101 全部知识点的实践输出。"
      responsibilities:
        - "完成 Wwise 101 全部课程实践"
        - "沉淀 SoundBank 管理与 Profiler 调优经验"
        - "整理为博客文章分享给社区"
      link_url: "/2025/wwise-101/"
      link_label: "查看学习笔记"

# —— 技能栈（按分组组织） ——
# 说明：
# logo 使用 https://cdn.simpleicons.org/<slug>/<hex-color> 的方式加载纯色 SVG
# 若技术没有官方 icon（如 Nuendo / SoundBank / iZotope RX），可留空 logo，将回退为首字母占位
skills:
  - group: "音频中间件"
    items:
      - { name: "Wwise",        level: "熟练", logo: "https://cdn.simpleicons.org/audiomack/1BB0AA" }
      - { name: "FMOD",         level: "熟悉", logo: "https://cdn.simpleicons.org/soundcloud/FF7700" }

  - group: "游戏引擎"
    items:
      - { name: "Unity",        level: "熟练", logo: "https://cdn.simpleicons.org/unity/000000" }
      - { name: "Unreal Engine",level: "熟悉", logo: "https://cdn.simpleicons.org/unrealengine/0E1128" }

  - group: "DAW 与音频工具"
    items:
      - { name: "Nuendo",       level: "熟练", logo: "" }
      - { name: "Cubase",       level: "熟练", logo: "https://cdn.simpleicons.org/steinberg/C90827" }
      - { name: "Pro Tools",    level: "熟悉", logo: "" }
      - { name: "REAPER",       level: "熟练", logo: "https://cdn.simpleicons.org/reason/000000" }
      - { name: "iZotope RX",   level: "熟练", logo: "" }

  - group: "编程与脚本"
    items:
      - { name: "C#",           level: "基础", logo: "https://cdn.simpleicons.org/dotnet/512BD4" }
      - { name: "C++",          level: "基础", logo: "https://cdn.simpleicons.org/cplusplus/00599C" }
      - { name: "Python",       level: "熟悉", logo: "https://cdn.simpleicons.org/python/3776AB" }
      - { name: "Shader",       level: "了解", logo: "" }

  - group: "协作与工作流"
    items:
      - { name: "Git",              level: "熟练", logo: "https://cdn.simpleicons.org/git/F05032" }
      - { name: "Perforce",         level: "熟悉", logo: "https://cdn.simpleicons.org/perforce/404040" }
      - { name: "SoundBank 管理",   level: "熟练", logo: "" }
      - { name: "音频技术设计",     level: "熟练", logo: "" }
---

一名专注于**游戏音频**的策划与设计师，热爱声音艺术与技术的交汇。<br>
日常在 Wwise / FMOD、Unity / Unreal 与各类 DAW 之间穿梭，喜欢用工具化的方式解决问题，也乐于把学到的东西写下来、分享出去。

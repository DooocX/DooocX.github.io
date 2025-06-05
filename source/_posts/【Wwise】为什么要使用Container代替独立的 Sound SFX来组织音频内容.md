---
title: 【Wwise】为什么要使用Container代替独立的 Sound SFX来组织音频内容？
comments: false
categories: 音频策划
aubot: DocX
aubot_link: 'https://space.bilibili.com/5292339?spm_id_from=333.1391.0.0'
tags:
  - 音效设计
  - 视频总结
excerpt: 该文章总结于WwiseTour
toc: false
date: 20205-3-6 17:53:36
cover: 'https://cdn.jsdelivr.net/gh/DooocX/DocX_Images/test/%E9%AD%94%E6%B3%95%E8%A7%89%E9%86%92.jpg'
---

# 使用Container代替独立Sound SFX

>这样的操作可以显著减少SoundBank文件的更改频率，如果是大型项目的话，将提升开发效率！

### 一、逻辑聚合 vs 分散引用

Wwsie官方建议将下列文件纳入版本控制，这样任何人拉项目时Wwise会用这些文件生成工程所需的其他文件。

.wproj Wwise的工程文件

.wwu Wwise中的Work Unit，每一个Unit可以独立管理避免了同时协作时的冲突

Originals folder 所有导入到Wwise项目中的原始音频文件（如 .wav、.mp3、.aiff 等）都会被自动复制到 Originals 文件夹中，如果需要迁移项目，必须同时复制 Originals 文件夹和 .wproj 文件，保持相对路径一致。

**以下文件可以不用放到版本控制中，因为Wwise会用上方的文件自动生成：**

.backup 文件夹 – 在使用新的 Wwise 大版本打开工程时，会对工程进行升级并生成 .backup 文件夹。这样是为了在需要时将工程恢复为升级之前的状态。若将工程添加到了版本控制系统，则可藉此恢复为升级之前的状态。为此，可将 .backup 文件夹放在版本控制系统之外。

.cache 文件夹 – 工程目录下的 .cache 文件夹是 Wwise 的本地工作文件夹。**.cache 文件夹的内容不得添加到版本控制系统**，因为这可能造成 Wwise 中发生异常行为。

.prof – 这些文件在每次捕获时生成，其并非工程数据的一部分

.validationcache – 这些文件由 .wwu 文件生成，可放在版本控制系统之外。

.wsettings – 此文件特定于本地用户和电脑。

IncrementalSoundBankData.xml – 此文件用于根据 Wwise 工程的本地内容和本地 SoundBank 生成记录来追踪 SoundBank 的状态。

**.gitignore and .p4ignore  Wwise在生成新项目时，会自动创建**，我们可以将其添加至版本管理软件中，打开可以看到Wwise官方已经帮我们写好了忽略的项目，我们可以随时进行修改，非常方便

``` bash
# Wwise
.backup*
.cache*
*.akd
*.prof
*.validationcache
*.wsettings
IncrementalSoundBankData.xml
```

### 二、如何在Wwise中快捷查看工程同步状态？

[官方文档](https://www.audiokinetic.com/zh/public-library/2024.1.5_8803/?source=Help&id=managing_project_files_using_workgroup_plug_in)
>值得注意的是SVN插件在2023.1版本后就停止更新了

为了帮助用户快速入门，Wwise 针对 Perforce® 和 Subversion 软件配置管理系统配套提供了两个功能完备的示例版本控制插件，如果在使用别的版本控制管理系统，可为 Wwise 创建自己的版本控制插件，请参阅 SDK 文档中的[如何创建版本控制插件 DLL ](https://www.audiokinetic.com/zh/public-library/2024.1.5_8803/?source=SDK&id=source_control_dll.html)章节。




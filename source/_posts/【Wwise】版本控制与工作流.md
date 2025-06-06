---
title: 【Wwise】版本控制与工作流
comments: false
categories: Wwise
aubot: DocX
aubot_link: 'https://space.bilibili.com/5292339?spm_id_from=333.1391.0.0'
tags:
  - 音频策划
  - 版本控制
  - Wwise
excerpt: 该文章总结于Wwise官方文档，加入了个人理解，欢迎讨论~
toc: false
date: 20205-6-5 18:15:36
cover: 'https://cdn.jsdelivr.net/gh/DooocX/DocX_Images/test/%E9%AD%94%E6%B3%95%E8%A7%89%E9%86%92.jpg'
---

# [在Wwise中进行版本控制](https://www.audiokinetic.com/zh/public-library/2024.1.5_8803/?source=Help&id=using_wwise_with_source_control_system)


所有 Wwise 工程文件（包括各个 Work Unit）都基于 XML。所以，用户可使用版本控制系统轻松管理这些文件。
>XML（eXtensible Markup Language，可扩展标记语言）是一种用于存储和传输数据的标记语言，具有结构化、可读性强和跨平台的特点。

### 一、哪些文件要进行版本控制？

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



### 三、版本管理Tips

1. Wwise在保存.wwu/.bnk/.wproj文件时候，默认使用L换行，如果希望用CRLF保存这些文件，可以在项目设置General选项卡找到“Line Ending”选项进行修改（如果你的团队混合使用 Windows、macOS 或 Linux，换行符风格可能导致版本控制（Git）显示不必要的差异（尽管内容相同，如果某些工具或脚本依赖特定换行符（如 Bash 脚本需要 LF），需确保 Wwise 生成的文件兼容）
**在 Git 中设置 core.autocrlf=input（Mac/Linux）或 true（Windows），以自动处理换行符。**
>LF（\n） 是 Unix/Linux/macOS 系统的标准换行符，而 CRLF（\r\n） 是 Windows 的传统换行符。

2. 详细划分工作单元避免冲突，并且为全局默认工作单元指定负责人

3. **定义全局工作元素相当重要**当您重命名或删除某个全局工程元素（例如状态或游戏参数）时，注意，您可能修改了工程中的许多其他对象，包括使用这些元素的所有声音对象和容器。当保存和登入这些更改时，您可能会影响其他人正在处理的众多工程文件。为限制此类更改的影响，应该尽早定义全局工程元素，此后再尽力避免更改这些元素。如果在初始设置后需要更改，则应执行以下操作：

* 警告团队成员全局元素已被更改。
* 要求团队全体成员登入他们的更改。
* check-in 您的文件
* 要求团队全体成员更新他们的工程文件。
* 通过执行此流程，团队成员只需更新就可以获得新文件，无需合并。

4. 定期备份本地文件，在登入特定工作单元前生成完好度报告

5. 在合并文件前，花一点时间熟悉 Wwise 工程文件的 XML 结构。在一些情况下，您可能必须更新 XML 代码。如果您没有正确理解它，可能会毁坏您的工程。如果您的确要修改 XML，请确保在 Wwise 中打开工程，然后将文件重新登入到版本控制系统中。这将确保您对 XML 的更改是有效的，并且是您所需的。

6. 在 Wwise 中，使用 Container（容器）代替独立的 Sound SFX（单个音效对象）来组织音频内容，可以显著减少 SoundBank 文件的更改频率，因为Bank的生成机制依赖于对象ID，当修改了音频文件内容但命名和路径没有改变时，无需重新打包。


### 四、理解工作流


* 不需要下载Wwise Authoring的策划或者程序，只需要将GeneratedSoundBanks文件夹添加到版本控制即可，具体涉及到了*.json/*.bnk/*.wem文件格式，例如：一个策划想要听到声音，ta只需要安装好Wwise插件并且在引擎中修改Soundbank路径

* 音频策划在集成音频时，可以在确保Ue和Wwise同时打开的状态在Ue中创建或更改资源。同时，相关的虚幻引擎和Wwise资源可以有不同的名称。两者之间的关联由GUID、ShortID和资源名称属性决定。因此，你可以重命名虚幻引擎资源，而不会影响它们所引用的Wwise对象。 

* 第三方音频设计师可以只用Wwise，但是测试只能在Soundcaster中进行
* 对于大型项目，拥有一个专门用于SoundBanks的服务器可能会很有用。[SoundBank生成命令行工具](https://www.audiokinetic.com/zh/public-library/2024.1.5_8803/?source=UE4&id=using_features_generatecommandlet.html)可以按计划在该服务器上运行，例如每晚运行一次，并将生成的SoundBanks推送到版本控制下的某个位置。然后，其他开发人员可以在虚幻引擎中使用最新的SoundBanks，而无需自己生成SoundBanks。在大型项目中，SoundBank生成可能很耗时，并且可能有多个贡献者致力于游戏音频的不同部分（音乐、语音、音效等），因此自动化可以使该过程比手动生成SoundBanks更高效。
然而，一些用户可能需要在开发过程中自行生成SoundBanks以进行实验或测试。在这种情况下，您可以维持基于服务器的设置，但使用[用户覆盖来在本地生成SoundBanks。](https://www.audiokinetic.com/zh/public-library/2024.1.5_8803/?source=UE4&id=using_soundbanks_override.html)
---
title: 【Wwise】101笔记
comments: false
categories: Wwise
aubot: DocX
aubot_link: 'https://space.bilibili.com/5292339?spm_id_from=333.1391.0.0'
tags:
  - Wwise笔记
  - Wwise
excerpt: Wwise101笔记
toc: false
date: 20205-1-24 14:26:36
cover: 'https://cdn.jsdelivr.net/gh/DooocX/DocX_Images/test/%E5%B9%BD%E7%81%B5%E7%BA%BF.jpg'
---

![](https://cdn.jsdelivr.net/gh/DooocX/DocX_Images/test/101.png)

# [Wwise101](https://www.audiokinetic.com/zh/courses/wwise101/?source=wwise101&id=quick_start_from_silence_to_sound#read)笔记

### 基础知识记忆

音高这个值以音分（cent）为单位。音乐上每个半音程为 100 音分，一个八度音程为 1200 音分。

虽然你只想用这个 Switch Group 中设置的Material（材质）属性不光可以用于脚步声，还可以用于其他碰撞，所以提前规定一个游戏内常见的材质类型集合在设计前期是非常重要的

RTPC（Real Time Parameter Control，实时参数控制）。

在加号和减号间的图标用来将 Graph View 重置为显示整条曲线。
除此之外，还可使用 Z+单击-拖动来放大；
或者，使用 Ctrl+鼠标滚轮来垂直缩放，并使用 Ctrl+Shift+鼠标滚轮来水平缩放。
如需了解更多详细信息，请转到 Wwise 的 Project 菜单并选择 Keyboard Shortcuts and Commands。

这里有一篇深入探讨 Low-pass Filter 值的文章：
https://www.audiokinetic.com/en/library/2021.1.12_7973/?source=Help&id=associating_low_pass_filter_values_with_their_corresponding_cutoff_frequencies

现在，每次启动游戏或加载新的关卡时，都会先停止播放心跳声，然后再重新播放。
这样可以避免在游戏当中听到多个心跳声。

### 3D声音设置

Attenuation衰减
声音在空气中传播的过程中最重要的变化之一是高频分量会随距离增大而减弱。

为了反映声源方位的变化，Wwise 提供了 Cone Attenuation 功能。声锥衰减

即便游戏中并没有与声音对应的游戏对象也无妨。为此，可通过 3D Position Automation 来加以实现。

在 Position Editor 中可以完成声源动态移位的设计，方法是使用 path（路径），
也即用户定义的运动轨迹，声音对象会沿着这些轨迹运动。

你还是能采用一种相比 3D 定位更传统的方法来控制声音的来路，即用扬声器声像偏移的方式来实现。
例如，你可能想让旁白从 Listener 背后传来，方法是把这个声音摆位到左右环绕音箱上去，
或者你可能想让音乐只从左右前置音箱中传过来。
这种以此传统方式来定位声音并忽略发声体在 3D 空间中的位置的做法称为 Speaker Panning。

Actor-Mixer 对象可以作为组织工程用的文件夹，
而它还有个好处就是能为它装有的所有对象快速应用同样的属性设置。

将 Speaker Panning（扬声器声像摆位）属性设为 Balance-Fade（平衡-淡变）

### 混音方面
比如，许多游戏让玩家能单独控制音乐的音量而不影响游戏中的其它声音。
通过将所有音乐输出到音乐总线，可将用户输入映射到 Music Bus Volume 属性。

有一点很重要：每个声音都应该有所贡献，同时做到不让听者分散注意力。
这便是混音技艺施展威力的时候。

### 内存管理方面
因为 Map Voices 这个 Actor-Mixer 中的所有对象都只会在游戏中一个特定的关卡里才会用到，
所以这给了你机会来更好地管理内存，方法是把这些声音放到一个专门的 SoundBank 中去，
这个 SoundBank 只会在到达 dcp_the_core 这个关卡的时候加载。

你现在的任务是想出办法来减小 SoundBank 的体积。我们可以采用各种方式来解决此问题，
其中最有效的一种是将刚才导入到工程中的 .wav 音频文件转码为其他占用空间较少的格式。
为此，可降低采样率、减少声道数（比如下混为单声道）或全部转码为另一文件类型。

例如，对话声的频率范围是有限的，于是就有机会对这些声音使用低一点的采样率而不容易听出负面效果。
有时，可能还要对音乐元素进行不同的处理。因为其涵盖的频段范围比较广，而且音质的好坏很容易听出来。

虽然 Wwise 没有 MP3 压缩选项，但其提供了 Vorbis 压缩方案，可获得几乎相同的效果。
甚至很多人觉得 Vorbis 的音质更好一些，而且其已经成为了游戏音频整合的标准。

将这个值设为 4 是一个比较好的起点，因为采用这个设定可以大幅缩小文件体积，
同时又能令转码后的音质满足大部分情况下的需求。

不过，在 Random Container 中用到了多个音频文件的情况下，
从这些声音中去掉几个或许根本听不出有何差异，而且还有助于将预算控制在要求范围内。



### 关于Streaming
**streaming播放不会影响声音品质**
另一个减小内存占用的方法是不要将整个音频文件一次性加载到游戏系统的 RAM 中来。为此，可通过流播放形式来直接从存储介质（如光盘或硬盘）播放音频。

Streaming 的缺点是从游戏引擎发起播放声音的调用时算起，到声音切实开始播放之前可能会有个空隙，这是因为要花费一定的时间才能定位到这个文件并启动流播放。这种方式不适合 Ice Gem（冰晶宝石）投掷声，但对持续播放的环境声或音乐来说还是不错的。流播放还有一个缺点，就是在一次性读取的数据总量上存在一定的技术限制，并且游戏的其他方面（如视频）可能会跟音频争用同一播放流的带宽。

### 处理器优化

> 远处的脚步声需要使用与近处魔法音效一样的处理资源，所以去渲染不太可能听到的脚步声其实是一种浪费。
Offset priority（偏置优先级）这个复选框和设置指定了一个值，当对象移动到了 Attenuation Editor 中指定的 Max Distance（最大距离）值时，可以用这个 Offset 值来升高或降低对象的优先级。这样方便设定对象（如脚步声）的优先级。这类对象在距离听者很近时比较重要，而在距离其较远时会变得没那么重要。

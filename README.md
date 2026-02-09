# SpeakQuest 🎮

> 沉浸式英语口语学习小程序

SpeakQuest 是一款基于 AIGC 的英语口语学习微信小程序。通过场景化的角色扮演对话，帮助用户在真实情境中练习英语口语。

## 📱 功能特点

- **场景化学习** - 公司、学校、餐厅等真实场景
- **AI 对话** - 与 AI NPC 进行实时英语对话
- **语音交互** - 支持语音输入，练习口语发音
- **任务目标** - 每个挑战都有明确的沟通目标
- **即时反馈** - 提供提示和翻译辅助功能
- **知识背包** - 收集学习过程中的实用短语

## 🎯 挑战场景

| 场景 | 挑战示例 |
|------|---------|
| 🏢 公司 | 向经理申请项目延期、应对裁员谈话 |
| 🏫 学校 | 催促组员完成作业、向同学借笔记 |
| 🍽️ 餐厅 | 退换不合格菜品 |

## 🛠️ 技术栈

- 微信小程序原生开发
- WXML + WXSS + JavaScript

## 📁 项目结构

```
speakquest/
├── app.js                 # 小程序入口
├── app.json               # 全局配置
├── app.wxss               # 全局样式
├── pages/
│   ├── login/             # 登录页
│   ├── home/              # 地图首页
│   ├── challenge/         # 挑战列表
│   ├── conversation/      # 对话页
│   ├── profile/           # 个人中心
│   ├── backpack/          # 知识背包
│   └── backpack-detail/   # 短语卡片
├── utils/
│   └── api.js             # API 接口封装
└── images/                # 图片资源
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone git@github.com:amatric/speakquest_frontend.git
```

### 2. 打开微信开发者工具

- 下载 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 选择「导入项目」
- 选择项目文件夹
- 填入 AppID（或使用测试号）

### 3. 配置后端地址

在 `app.js` 中修改 `baseUrl`：

```javascript
globalData: {
  baseUrl: 'https://your-backend-api.com/api'
}
```

## 📝 API 文档

后端接口定义见 `utils/api.js`，主要接口：

| 接口 | 方法 | 说明 |
|------|------|------|
| `/auth/wx-login` | POST | 微信登录 |
| `/scenes` | GET | 获取场景列表 |
| `/challenges` | GET | 获取挑战列表 |
| `/missions/:id/message` | POST | 发送对话消息 |
| `/missions/:id/hint` | GET | 获取提示 |
| `/translate` | POST | 翻译文本 |

## 📄 License

MIT

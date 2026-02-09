// utils/api.js
// API 接口封装 - 后端开发者请参考此文件了解需要提供的接口

const app = getApp()

// 通用请求方法
const request = (url, method, data) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.baseUrl}${url}`,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${wx.getStorageSync('token') || ''}`
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          // token 过期，跳转登录
          wx.redirectTo({ url: '/pages/login/login' })
          reject(new Error('登录已过期'))
        } else {
          reject(new Error(res.data.message || '请求失败'))
        }
      },
      fail: reject
    })
  })
}

// ============ 用户相关接口 ============

// 微信登录
// POST /auth/wx-login
// 请求: { code: string }
// 响应: { token: string, user: { id, nickname, avatar, level, xp, maxXp } }
export const wxLogin = (code) => {
  return request('/auth/wx-login', 'POST', { code })
}

// 获取用户信息
// GET /user/profile
// 响应: { id, nickname, avatar, level, xp, maxXp, settings: { music, soundEffects } }
export const getUserProfile = () => {
  return request('/user/profile', 'GET')
}

// 更新用户设置
// PUT /user/settings
// 请求: { music?: boolean, soundEffects?: boolean }
export const updateSettings = (settings) => {
  return request('/user/settings', 'PUT', settings)
}

// ============ 关卡/挑战相关接口 ============

// 获取所有场景（地图）
// GET /scenes
// 响应: [{ id, name, icon, isUnlocked, challenges: number }]
export const getScenes = () => {
  return request('/scenes', 'GET')
}

// 获取挑战列表
// GET /challenges?sceneId=xxx
// 响应: [{ id, sceneId, title, description, difficulty, npcName, npcAvatar, npcRole, isCompleted }]
export const getChallenges = (sceneId) => {
  const query = sceneId ? `?sceneId=${sceneId}` : ''
  return request(`/challenges${query}`, 'GET')
}

// 获取挑战详情
// GET /challenges/:id
// 响应: { id, title, difficulty, npcAvatar, playerRole, opponentRole, objectives: [{ id, description }] }
export const getChallengeDetail = (id) => {
  return request(`/challenges/${id}`, 'GET')
}

// ============ 任务/对话相关接口 ============

// 开始任务
// POST /missions/start
// 请求: { challengeId: string }
// 响应: { missionId, initialMessage: string }
export const startMission = (challengeId) => {
  return request('/missions/start', 'POST', { challengeId })
}

// 发送语音消息
// POST /missions/:id/message
// 请求: { audioUrl: string } 或 { text: string }
// 响应: { npcReply: string, audioUrl: string, progress: number, objectives: [{ id, completed }], isCompleted: boolean }
export const sendMessage = (missionId, data) => {
  return request(`/missions/${missionId}/message`, 'POST', data)
}

// 获取提示
// GET /missions/:id/hint
// 响应: { hint: string }
export const getHint = (missionId) => {
  return request(`/missions/${missionId}/hint`, 'GET')
}

// 翻译文本
// POST /translate
// 请求: { text: string, from: 'en', to: 'zh' }
// 响应: { translation: string }
export const translate = (text) => {
  return request('/translate', 'POST', { text, from: 'en', to: 'zh' })
}

// 结束任务
// POST /missions/:id/end
// 响应: { xpEarned, newPhrases: [{ phrase, translation }] }
export const endMission = (missionId) => {
  return request(`/missions/${missionId}/end`, 'POST')
}

// ============ 知识背包相关接口 ============

// 获取知识背包分类
// GET /backpack/categories
// 响应: [{ id, name, icon, count, color }]
export const getBackpackCategories = () => {
  return request('/backpack/categories', 'GET')
}

// 获取某分类下的知识卡片
// GET /backpack/:categoryId/cards
// 响应: [{ id, type, phrase, translation, audioUrl, tag }]
export const getBackpackCards = (categoryId) => {
  return request(`/backpack/${categoryId}/cards`, 'GET')
}

// ============ 工具方法 ============

// 上传语音文件
export const uploadAudio = (filePath) => {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: `${app.globalData.baseUrl}/upload/audio`,
      filePath: filePath,
      name: 'audio',
      header: {
        'Authorization': `Bearer ${wx.getStorageSync('token') || ''}`
      },
      success: (res) => {
        const data = JSON.parse(res.data)
        resolve(data.url)
      },
      fail: reject
    })
  })
}

export default {
  wxLogin,
  getUserProfile,
  updateSettings,
  getScenes,
  getChallenges,
  getChallengeDetail,
  startMission,
  sendMessage,
  getHint,
  translate,
  endMission,
  getBackpackCategories,
  getBackpackCards,
  uploadAudio
}

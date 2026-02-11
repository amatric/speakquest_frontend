// pages/profile/profile.js
import api from '../../utils/api'

const app = getApp()

Page({
  data: {
    userInfo: {},
    settings: {
      music: true,
      soundEffects: true
    },
    progressPercent: 0
  },

  onLoad() {
    this.loadUserData()
  },

  onShow() {
    this.loadUserData()
  },

  // 加载用户数据
  async loadUserData() {
    try {
      const userInfo = await api.getUserProfile()
      const progressPercent = (userInfo.xp / userInfo.maxXp) * 100
      
      this.setData({
        userInfo,
        settings: userInfo.settings || { music: true, soundEffects: true },
        progressPercent
      })
    } catch (error) {
      console.error('加载用户数据失败:', error)
      
      // 使用本地缓存或默认数据
      const cachedUser = app.globalData.userInfo || {}
      this.setData({
        userInfo: {
          nickName: cachedUser.nickName || 'Alex Learner',
          avatarUrl: cachedUser.avatarUrl || '/images/default-avatar.png',
          id: '8849201',
          level: 12,
          xp: 2450,
          maxXp: 3000
        },
        progressPercent: (2450 / 3000) * 100
      })
    }
  },

  // 跳转知识背包
  goToBackpack() {
    wx.navigateTo({
      url: '/pages/backpack/backpack'
    })
  },

  // 跳转个人信息页
  goToPersonalInfo() {
    wx.navigateTo({
      url: '/pages/personal-info/personal-info'
    })
  },

  // 音乐开关
  async onMusicChange(e) {
    const music = e.detail.value
    this.setData({ 'settings.music': music })
    
    try {
      await api.updateSettings({ music })
    } catch (error) {
      console.error('更新设置失败:', error)
    }
  },

  // 音效开关
  async onSoundChange(e) {
    const soundEffects = e.detail.value
    this.setData({ 'settings.soundEffects': soundEffects })
    
    try {
      await api.updateSettings({ soundEffects })
    } catch (error) {
      console.error('更新设置失败:', error)
    }
  },

  // 退出登录
  onLogout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.logout()
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      }
    })
  }
})

// pages/home/home.js
import api from '../../utils/api'

Page({
  data: {
    scenes: [
      { id: 'school', name: 'SCHOOL', isUnlocked: true },
      { id: 'company', name: 'COMPANY', isUnlocked: true },
      { id: 'restaurant', name: 'RESTAURANT', isUnlocked: true }
    ],
    showWelcome: false
  },

  onLoad() {
    this.loadScenes()
    this.checkNewUser()
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadScenes()
  },

  // 检查是否新用户，显示引导
  checkNewUser() {
    const isNewUser = wx.getStorageSync('isNewUser')
    if (isNewUser) {
      this.setData({ showWelcome: true })
    }
  },

  // 关闭引导弹窗
  dismissWelcome() {
    this.setData({ showWelcome: false })
    wx.setStorageSync('isNewUser', false)
  },

  // 加载场景数据
  loadScenes() {
    // 直接使用本地数据，全部解锁
    this.setData({
      scenes: [
        { id: 'school', name: 'SCHOOL', isUnlocked: true },
        { id: 'company', name: 'COMPANY', isUnlocked: true },
        { id: 'restaurant', name: 'RESTAURANT', isUnlocked: true }
      ]
    })
  },

  // 点击节点
  onNodeTap(e) {
    const scene = e.currentTarget.dataset.scene
    
    if (!scene || !scene.isUnlocked) {
      wx.showToast({
        title: '关卡尚未解锁',
        icon: 'none'
      })
      return
    }

    // 保存选中的场景ID到全局
    getApp().globalData.selectedSceneId = scene.id

    // 跳转到挑战列表
    wx.switchTab({
      url: '/pages/challenge/challenge'
    })
  }
})
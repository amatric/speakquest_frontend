// pages/home/home.js
import api from '../../utils/api'

Page({
  data: {
    scenes: [
      { id: 'school', name: 'SCHOOL', isUnlocked: false },
      { id: 'company', name: 'COMPANY', isUnlocked: true },
      { id: 'restaurant', name: 'RESTAURANT', isUnlocked: false }
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
  async loadScenes() {
    try {
      const scenes = await api.getScenes()
      this.setData({ scenes })
    } catch (error) {
      console.error('加载场景失败:', error)
      // 使用默认数据
    }
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

    // 跳转到挑战列表，带上场景筛选参数
    wx.switchTab({
      url: '/pages/challenge/challenge',
      success: () => {
        // 通过事件通知 challenge 页面筛选
        const pages = getCurrentPages()
        const challengePage = pages.find(p => p.route === 'pages/challenge/challenge')
        if (challengePage && challengePage.filterByScene) {
          challengePage.filterByScene(scene.id)
        }
      }
    })

    // 备选方案：使用全局数据传递筛选条件
    getApp().globalData.selectedSceneId = scene.id
  }
})

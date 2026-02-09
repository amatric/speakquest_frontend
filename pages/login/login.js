// pages/login/login.js
const app = getApp()

Page({
  data: {
    isLoading: false
  },

  onLoad() {
    // 如果已登录，直接跳转首页
    if (app.globalData.isLoggedIn) {
      wx.switchTab({ url: '/pages/home/home' })
    }
  },

  // 处理微信登录
  async handleLogin() {
    if (this.data.isLoading) return

    this.setData({ isLoading: true })

    try {
      // 开发阶段：直接使用模拟数据登录
      const mockUserInfo = {
        nickName: 'Alex Learner',
        avatarUrl: '/images/default-avatar.png',
        id: '8849201',
        level: 12,
        xp: 2450,
        maxXp: 3000
      }

      // 保存登录状态
      app.setLoginState('mock-token-12345', mockUserInfo)

      // 标记为新用户，显示引导
      wx.setStorageSync('isNewUser', true)

      // 跳转到首页
      wx.switchTab({ url: '/pages/home/home' })

    } catch (error) {
      console.error('登录失败:', error)
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    } finally {
      this.setData({ isLoading: false })
    }
  }
})

// pages/backpack/backpack.js
import api from '../../utils/api'

Page({
  data: {
    categories: [
      { id: 'school', name: 'SCHOOL', count: 1, color: '#FFD700' },
      { id: 'company', name: 'COMPANY', count: 3, color: '#A0D2F5' },
      { id: 'restaurant', name: 'RESTAURANT', count: 1, color: '#F5A0A0' }
    ]
  },

  onLoad() {
    this.loadCategories()
  },

  // 加载分类数据
  async loadCategories() {
    try {
      const categories = await api.getBackpackCategories()
      this.setData({ categories })
    } catch (error) {
      console.error('加载分类失败:', error)
      // 使用默认数据
    }
  },

  // 跳转到分类详情
  goToCategory(e) {
    const category = e.currentTarget.dataset.category
    wx.navigateTo({
      url: `/pages/backpack-detail/backpack-detail?id=${category.id}&name=${category.name}`
    })
  }
})

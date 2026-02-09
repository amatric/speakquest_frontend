// pages/backpack-detail/backpack-detail.js
import api from '../../utils/api'

const innerAudioContext = wx.createInnerAudioContext()

Page({
  data: {
    categoryId: '',
    categoryName: '',
    cards: [],
    currentIndex: 0,
    currentCard: {}
  },

  onLoad(options) {
    const { id, name } = options
    this.setData({
      categoryId: id,
      categoryName: name
    })
    this.loadCards(id)
  },

  onUnload() {
    innerAudioContext.destroy()
  },

  // 加载卡片数据
  async loadCards(categoryId) {
    try {
      const cards = await api.getBackpackCards(categoryId)
      this.setData({
        cards,
        currentCard: cards[0] || {}
      })
    } catch (error) {
      console.error('加载卡片失败:', error)
      // 使用模拟数据
      const mockCards = this.getMockCards(categoryId)
      this.setData({
        cards: mockCards,
        currentCard: mockCards[0] || {}
      })
    }
  },

  // 上一张
  prevCard() {
    if (this.data.currentIndex <= 0) return
    
    const newIndex = this.data.currentIndex - 1
    this.setData({
      currentIndex: newIndex,
      currentCard: this.data.cards[newIndex]
    })
  },

  // 下一张
  nextCard() {
    if (this.data.currentIndex >= this.data.cards.length - 1) return
    
    const newIndex = this.data.currentIndex + 1
    this.setData({
      currentIndex: newIndex,
      currentCard: this.data.cards[newIndex]
    })
  },

  // 播放音频
  playAudio() {
    const { currentCard } = this.data
    
    if (currentCard.audioUrl) {
      innerAudioContext.src = currentCard.audioUrl
      innerAudioContext.play()
    } else {
      // 如果没有音频URL，可以使用微信的语音合成或提示
      wx.showToast({
        title: '播放中...',
        icon: 'none',
        duration: 1000
      })
    }
  },

  // 返回上一页
  goBack() {
    wx.navigateBack()
  },

  // 返回个人中心
  goBackToProfile() {
    wx.navigateBack({ delta: 2 })
  },

  // 模拟数据
  getMockCards(categoryId) {
    const mockData = {
      school: [
        {
          id: '1',
          type: 'PHRASE',
          phrase: 'Could you elaborate on that?',
          translation: '你能详细说明一下吗？',
          tag: '课堂提问',
          audioUrl: ''
        }
      ],
      company: [
        {
          id: '1',
          type: 'PHRASE',
          phrase: "I'd like to discuss the timeline.",
          translation: '我想讨论一下时间安排。',
          tag: '项目沟通',
          audioUrl: ''
        },
        {
          id: '2',
          type: 'PHRASE',
          phrase: 'We need an extension on the deadline.',
          translation: '我们需要延长截止日期。',
          tag: '项目延期',
          audioUrl: ''
        },
        {
          id: '3',
          type: 'PHRASE',
          phrase: "I've made significant contributions to the team.",
          translation: '我为团队做出了重要贡献。',
          tag: '裁员应对',
          audioUrl: ''
        }
      ],
      restaurant: [
        {
          id: '1',
          type: 'PHRASE',
          phrase: "I'm afraid this dish isn't quite right.",
          translation: '恐怕这道菜有点问题。',
          tag: '餐厅投诉',
          audioUrl: ''
        }
      ]
    }

    return mockData[categoryId] || []
  }
})

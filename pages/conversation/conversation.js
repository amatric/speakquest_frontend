// pages/conversation/conversation.js
import api from '../../utils/api'

const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()

Page({
  data: {
    missionId: '',
    challengeId: '',
    npcAvatar: '/images/npcs/manager.png',
    objectives: [],
    completedCount: 0,
    totalCount: 3,
    currentObjective: '',
    messages: [],
    scrollToId: '',
    isRecording: false,
    showHint: false,
    hintText: '',
    showTranslate: false,
    translateOriginal: '',
    translateResult: '',
    showComplete: false,
    xpEarned: 0
  },

  onLoad(options) {
    const { missionId, challengeId } = options
    this.setData({ missionId, challengeId })
    this.initRecorder()
    this.loadMissionData(challengeId)
  },

  onUnload() {
    innerAudioContext.destroy()
  },

  initRecorder() {
    recorderManager.onStart(() => console.log('开始录音'))
    recorderManager.onStop((res) => {
      console.log('录音结束', res)
      this.handleRecordComplete(res.tempFilePath)
    })
    recorderManager.onError((err) => {
      console.error('录音错误', err)
      wx.showToast({ title: '录音失败', icon: 'none' })
      this.setData({ isRecording: false })
    })
  },

  async loadMissionData(challengeId) {
    // 根据 challengeId 获取对应的 NPC 数据
    const missionData = this.getMissionDataById(challengeId)
    
    const initialMessage = {
      id: '0',
      content: missionData.initialMessage,
      isUser: false
    }
    this.setData({
      npcAvatar: missionData.npcAvatar,
      objectives: missionData.objectives,
      totalCount: missionData.objectives.length,
      currentObjective: missionData.objectives[0].description,
      messages: [initialMessage]
    })
  },

  getMissionDataById(id) {
    const data = {
      '1': {
        npcAvatar: '/images/npcs/manager.png',
        initialMessage: "The project is supposed to launch tomorrow. What are you coming to me for now? This better be good news.",
        objectives: [
          { id: '1', description: '解释延期的原因', completed: false },
          { id: '2', description: '展示当前进度', completed: false },
          { id: '3', description: '提出新的截止日期', completed: false }
        ]
      },
      '2': {
        npcAvatar: '/images/npcs/hr.png',
        initialMessage: "Please have a seat. We need to discuss some changes in the company structure.",
        objectives: [
          { id: '1', description: '了解裁员原因', completed: false },
          { id: '2', description: '展示你的价值', completed: false },
          { id: '3', description: '争取留任机会', completed: false }
        ]
      },
      '3': {
        npcAvatar: '/images/npcs/classmate.png',
        initialMessage: "Hey, what's up? I've been pretty busy lately.",
        objectives: [
          { id: '1', description: '询问进度情况', completed: false },
          { id: '2', description: '说明截止日期紧迫', completed: false },
          { id: '3', description: '达成完成时间共识', completed: false }
        ]
      },
      '4': {
        npcAvatar: '/images/npcs/student.png',
        initialMessage: "Oh hi! I was just reviewing my notes. What can I help you with?",
        objectives: [
          { id: '1', description: '礼貌地打招呼', completed: false },
          { id: '2', description: '说明借笔记的原因', completed: false },
          { id: '3', description: '约定归还时间', completed: false }
        ]
      },
      '5': {
        npcAvatar: '/images/npcs/waiter.png',
        initialMessage: "Good evening! How is everything with your meal tonight?",
        objectives: [
          { id: '1', description: '说明菜品问题', completed: false },
          { id: '2', description: '提出退换要求', completed: false },
          { id: '3', description: '达成解决方案', completed: false }
        ]
      }
    }
    return data[id] || data['1']
  },

  onBack() {
    wx.showModal({
      title: '确认退出',
      content: '退出后本次任务进度将不会保存',
      success: (res) => { if (res.confirm) wx.navigateBack() }
    })
  },

  onRecordStart() {
    this.setData({ isRecording: true })
    recorderManager.start({
      duration: 60000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 48000,
      format: 'mp3'
    })
  },

  onRecordEnd() {
    if (this.data.isRecording) {
      this.setData({ isRecording: false })
      recorderManager.stop()
    }
  },

  async handleRecordComplete(filePath) {
    wx.showLoading({ title: '处理中...' })
    try {
      const audioUrl = await api.uploadAudio(filePath)
      const response = await api.sendMessage(this.data.missionId, { audioUrl })
      const userMsg = { id: `user-${Date.now()}`, content: response.userText || "I need to discuss something.", isUser: true }
      const npcMsg = { id: `npc-${Date.now()}`, content: response.npcReply, isUser: false }
      const messages = [...this.data.messages, userMsg, npcMsg]
      const completedCount = response.objectives.filter(o => o.completed).length
      const currentObj = response.objectives.find(o => !o.completed)
      this.setData({ messages, scrollToId: `msg-${npcMsg.id}`, completedCount, currentObjective: currentObj?.description || '任务完成', objectives: response.objectives })
      if (response.audioUrl) { innerAudioContext.src = response.audioUrl; innerAudioContext.play() }
      if (response.isCompleted) this.handleMissionComplete()
    } catch (error) {
      console.error('发送消息失败:', error)
      this.simulateResponse()
    } finally {
      wx.hideLoading()
    }
  },

  simulateResponse() {
    const mockResponses = ["I see. How much time do you need?", "That's quite a setback.", "Let's figure this out."]
    const userMsg = { id: `user-${Date.now()}`, content: "I need to discuss the timeline.", isUser: true }
    const npcMsg = { id: `npc-${Date.now()}`, content: mockResponses[Math.floor(Math.random() * mockResponses.length)], isUser: false }
    const messages = [...this.data.messages, userMsg, npcMsg]
    const newCompleted = Math.min(this.data.completedCount + 1, this.data.totalCount)
    this.setData({ messages, scrollToId: `msg-${npcMsg.id}`, completedCount: newCompleted })
    if (newCompleted >= this.data.totalCount) setTimeout(() => this.handleMissionComplete(), 1000)
  },

  handleMissionComplete() {
    this.setData({ showComplete: true, xpEarned: 150 })
  },

  onCompleteConfirm() {
    this.setData({ showComplete: false })
    wx.navigateBack()
  },

  async onHint() {
    try {
      const res = await api.getHint(this.data.missionId)
      this.setData({ showHint: true, hintText: res.hint })
    } catch (e) {
      this.setData({ showHint: true, hintText: "Try explaining the reasons for the delay clearly." })
    }
  },

  closeHint() { this.setData({ showHint: false }) },

  async onTranslate() {
    const lastNpcMsg = [...this.data.messages].reverse().find(m => !m.isUser)
    if (!lastNpcMsg) return
    try {
      const res = await api.translate(lastNpcMsg.content)
      this.setData({ showTranslate: true, translateOriginal: lastNpcMsg.content, translateResult: res.translation })
    } catch (e) {
      this.setData({ showTranslate: true, translateOriginal: lastNpcMsg.content, translateResult: "项目预计明天上线。你现在来找我干什么？最好是好消息。" })
    }
  },

  closeTranslate() { this.setData({ showTranslate: false }) }
})

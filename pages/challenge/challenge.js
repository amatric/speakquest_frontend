// pages/challenge/challenge.js

const bgColors = ['#A0D2F5', '#D4B0E8', '#F5B0B0', '#F5E6A0', '#A0F5D4']

Page({
  data: {
    challenges: [],
    showModal: false,
    selectedChallenge: {}
  },

  onLoad() {
    this.loadChallenges()
  },

  onShow() {
    const app = getApp()
    if (app.globalData.selectedSceneId) {
      this.filterByScene(app.globalData.selectedSceneId)
      app.globalData.selectedSceneId = null
    }
  },

  loadChallenges() {
    // 使用模拟数据
    const challenges = this.getMockChallenges()
    this.setData({ challenges })
  },

  filterByScene(sceneId) {
    const allChallenges = this.getMockChallenges()
    if (!sceneId) {
      this.setData({ challenges: allChallenges })
      return
    }
    const filtered = allChallenges.filter(c => c.sceneId === sceneId)
    this.setData({ challenges: filtered })
  },

  // 点击卡片，显示弹窗
  onCardTap(e) {
    const challenge = e.currentTarget.dataset.challenge
    
    // 获取完整的挑战数据（包含objectives等）
    const fullChallenge = this.getFullChallengeData(challenge.id)
    
    this.setData({
      showModal: true,
      selectedChallenge: fullChallenge
    })
  },

  // 关闭弹窗
  closeModal() {
    this.setData({ showModal: false })
  },

  // 阻止点击弹窗内容时关闭
  preventClose() {
    // 空函数，阻止事件冒泡
  },

  // 开始任务
  onStartMission() {
    const { selectedChallenge } = this.data
    this.setData({ showModal: false })
    
    wx.navigateTo({
      url: `/pages/conversation/conversation?challengeId=${selectedChallenge.id}`
    })
  },

  // 获取完整的挑战数据
  getFullChallengeData(id) {
    const data = {
      '1': {
        id: '1',
        sceneId: 'company',
        title: '争取项目延期汇报',
        description: '项目进度受阻，你需要向经理申请延期，但经理以严厉著称。',
        difficulty: 'hard',
        difficultyText: 'HARD',
        npcName: '经理',
        npcRole: '经理',
        npcAvatar: '/images/npcs/manager.png',
        bgColor: '#A0D2F5',
        playerRole: 'Team Lead',
        opponentRole: '经理',
        objectives: [
          { id: '1', description: '解释延期的原因' },
          { id: '2', description: '展示当前进度' },
          { id: '3', description: '提出新的截止日期' }
        ]
      },
      '2': {
        id: '2',
        sceneId: 'company',
        title: '机智应对裁员危机',
        description: 'HR突然找你谈话，你需要用英语为自己争取留下的机会。',
        difficulty: 'hard',
        difficultyText: 'HARD',
        npcName: 'HR',
        npcRole: 'HR (人力资源)',
        npcAvatar: '/images/npcs/hr.png',
        bgColor: '#D4B0E8',
        playerRole: 'Employee',
        opponentRole: 'HR',
        objectives: [
          { id: '1', description: '了解裁员原因' },
          { id: '2', description: '展示你的价值' },
          { id: '3', description: '争取留任机会' }
        ]
      },
      '3': {
        id: '3',
        sceneId: 'school',
        title: '催促组员完成ddl',
        description: '小组作业截止日期将近，但组员迟迟不交，你需要催促他们。',
        difficulty: 'medium',
        difficultyText: 'MEDIUM',
        npcName: '组员',
        npcRole: '同学',
        npcAvatar: '/images/npcs/classmate.png',
        bgColor: '#F5E6A0',
        playerRole: 'Group Leader',
        opponentRole: '组员',
        objectives: [
          { id: '1', description: '询问进度情况' },
          { id: '2', description: '说明截止日期紧迫' },
          { id: '3', description: '达成完成时间共识' }
        ]
      },
      '4': {
        id: '4',
        sceneId: 'school',
        title: '向卷王同学借笔记',
        description: '考试将近，你想向班里的学霸借笔记复习。',
        difficulty: 'easy',
        difficultyText: 'EASY',
        npcName: '学霸',
        npcRole: '同学',
        npcAvatar: '/images/npcs/student.png',
        bgColor: '#A0F5D4',
        playerRole: 'Student',
        opponentRole: '学霸',
        objectives: [
          { id: '1', description: '礼貌地打招呼' },
          { id: '2', description: '说明借笔记的原因' },
          { id: '3', description: '约定归还时间' }
        ]
      },
      '5': {
        id: '5',
        sceneId: 'restaurant',
        title: '要求退掉不合格菜品',
        description: '餐厅上的菜品有问题，你需要用英语与服务员沟通退换。',
        difficulty: 'medium',
        difficultyText: 'MEDIUM',
        npcName: '服务员',
        npcRole: '服务员',
        npcAvatar: '/images/npcs/waiter.png',
        bgColor: '#F5B0B0',
        playerRole: 'Customer',
        opponentRole: '服务员',
        objectives: [
          { id: '1', description: '说明菜品问题' },
          { id: '2', description: '提出退换要求' },
          { id: '3', description: '达成解决方案' }
        ]
      }
    }
    return data[id] || data['1']
  },

  getMockChallenges() {
    return [
      {
        id: '1',
        sceneId: 'company',
        title: '争取项目延期汇报',
        description: '项目进度受阻，你需要向经理申请延期，但经理以严厉著称。',
        difficulty: 'hard',
        difficultyText: 'HARD',
        npcName: '经理',
        npcRole: '经理',
        npcAvatar: '/images/npcs/manager.png',
        bgColor: '#A0D2F5'
      },
      {
        id: '2',
        sceneId: 'company',
        title: '机智应对裁员危机',
        description: 'HR突然找你谈话，你需要用英语为自己争取留下的机会。',
        difficulty: 'hard',
        difficultyText: 'HARD',
        npcName: 'HR',
        npcRole: 'HR (人力资源)',
        npcAvatar: '/images/npcs/hr.png',
        bgColor: '#D4B0E8'
      },
      {
        id: '3',
        sceneId: 'school',
        title: '催促组员完成ddl',
        description: '小组作业截止日期将近，但组员迟迟不交，你需要催促他们。',
        difficulty: 'medium',
        difficultyText: 'MEDIUM',
        npcName: '组员',
        npcRole: '同学',
        npcAvatar: '/images/npcs/classmate.png',
        bgColor: '#F5E6A0'
      },
      {
        id: '4',
        sceneId: 'school',
        title: '向卷王同学借笔记',
        description: '考试将近，你想向班里的学霸借笔记复习。',
        difficulty: 'easy',
        difficultyText: 'EASY',
        npcName: '学霸',
        npcRole: '同学',
        npcAvatar: '/images/npcs/student.png',
        bgColor: '#A0F5D4'
      },
      {
        id: '5',
        sceneId: 'restaurant',
        title: '要求退掉不合格菜品',
        description: '餐厅上的菜品有问题，你需要用英语与服务员沟通退换。',
        difficulty: 'medium',
        difficultyText: 'MEDIUM',
        npcName: '服务员',
        npcRole: '服务员',
        npcAvatar: '/images/npcs/waiter.png',
        bgColor: '#F5B0B0'
      }
    ]
  }
})

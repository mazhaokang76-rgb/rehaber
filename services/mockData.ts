import { User, Video, NewsItem, Event } from '../types';

// Simulating the "Green/Fresh" theme and content
export const currentUser: User = {
  id: 'u1',
  name: '运动达人阿强',
  avatar: 'https://picsum.photos/seed/user_alex/200/200',
  phone: '138****8888',
  loginCount: 42,
  subscriptions: ['复健', '核心'],
  createdAt: '2023-01-15',
  stats: {
    trainingMinutes: 320,
    daysStreak: 12,
    caloriesBurned: 4500
  }
};

export const videos: Video[] = [
  {
    id: 'v1',
    title: '清晨脊柱唤醒训练',
    category: 'Rehab',
    thumbnail: 'https://picsum.photos/seed/v1/600/400',
    duration: '15:00',
    views: 1205,
    author: '陈医生',
    authorAvatar: 'https://picsum.photos/seed/doc1/100/100'
  },
  {
    id: 'v2',
    title: '核心稳定性 Lv.1',
    category: 'Core',
    thumbnail: 'https://picsum.photos/seed/v2/600/400',
    duration: '22:30',
    views: 890,
    author: '麦克教练',
    authorAvatar: 'https://picsum.photos/seed/coach1/100/100'
  },
  {
    id: 'v3',
    title: '膝关节术后恢复基础',
    category: 'Rehab',
    thumbnail: 'https://picsum.photos/seed/v3/600/400',
    duration: '18:45',
    views: 2300,
    author: '锐汗步官方',
    authorAvatar: 'https://picsum.photos/seed/logo/100/100'
  },
  {
    id: 'v4',
    title: '低强度有氧复健',
    category: 'Cardio',
    thumbnail: 'https://picsum.photos/seed/v4/600/400',
    duration: '30:00',
    views: 560,
    author: '莎拉健康',
    authorAvatar: 'https://picsum.photos/seed/sarah/100/100'
  }
];

export const news: NewsItem[] = [
  {
    id: 'n1',
    title: '了解肌肉记忆：身体如何记忆动作',
    category: '科普',
    summary: '受伤后身体如何通过肌肉记忆快速恢复运动能力。',
    coverImage: 'https://picsum.photos/seed/n1/400/600',
    date: '2023-10-25',
    readTime: '5分钟',
    type: 'article'
  },
  {
    id: 'n2',
    title: '关节健康的十大最佳食物',
    category: '营养',
    summary: '为了更好的康复效果，建议在日常饮食中加入这些食材。',
    coverImage: 'https://picsum.photos/seed/n2/400/500',
    date: '2023-10-24',
    readTime: '3分钟',
    type: 'article'
  },
  {
    id: 'n3',
    title: '专访：奥运选手的恢复秘诀',
    category: '励志',
    summary: '专业运动员如何在进行高强度训练后快速恢复。',
    coverImage: 'https://picsum.photos/seed/n3/400/400',
    date: '2023-10-23',
    readTime: '8分钟',
    type: 'video'
  },
  {
    id: 'n4',
    title: '睡眠与自愈力',
    category: '健康',
    summary: '为什么对于康复人群来说，8小时睡眠是不可妥协的。',
    coverImage: 'https://picsum.photos/seed/n4/400/550',
    date: '2023-10-22',
    readTime: '4分钟',
    type: 'article'
  },
  {
    id: 'n5',
    title: '正确的拉伸技巧',
    category: '训练',
    summary: '避免受伤，这几个拉伸动作你必须掌握。',
    coverImage: 'https://picsum.photos/seed/n5/400/450',
    date: '2023-10-20',
    readTime: '6分钟',
    type: 'video'
  }
];

export const events: Event[] = [
  {
    id: 'e1',
    title: '周日晨间瑜伽',
    location: '朝阳公园·绿地区',
    time: '周日, 8:00 AM',
    image: 'https://picsum.photos/seed/yoga/500/300',
    likes: 45,
    joined: false,
    organizer: '艾德琳瑜伽',
    tags: ['瑜伽', '户外']
  },
  {
    id: 'e2',
    title: '5公里恢复跑',
    location: '滨江跑道',
    time: '周六, 9:00 AM',
    image: 'https://picsum.photos/seed/run/500/300',
    likes: 128,
    joined: true,
    organizer: '城市跑团',
    tags: ['跑步', '社交']
  },
  {
    id: 'e3',
    title: '体态矫正工作坊',
    location: '社区活动中心',
    time: '周五, 6:00 PM',
    image: 'https://picsum.photos/seed/posture/500/300',
    likes: 89,
    joined: false,
    organizer: '史密斯医生',
    tags: ['健康', '讲座']
  }
];

export const weeklyActivityData = [
  { name: '周一', mins: 30 },
  { name: '周二', mins: 45 },
  { name: '周三', mins: 20 },
  { name: '周四', mins: 60 },
  { name: '周五', mins: 0 },
  { name: '周六', mins: 90 },
  { name: '周日', mins: 30 },
];
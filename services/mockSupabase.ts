import { Category, CommunityEvent, HealthNews, TrainingVideo, User } from '../types';

// Simulating a Supabase Backend with local data

const MOCK_USER: User = {
  id: 'u1',
  name: 'Rehaber_Fan',
  phone: '13800138000',
  avatar: 'https://picsum.photos/100/100?random=99',
  loginCount: 42,
  subscriptions: [Category.REHAB, Category.CORE],
};

const VIDEOS: TrainingVideo[] = [
  { id: 'v1', title: '膝关节术后康复入门', category: Category.REHAB, thumbnail: 'https://picsum.photos/400/225?random=1', duration: '15:20', views: 1204 },
  { id: 'v2', title: '十分钟核心燃脂', category: Category.CORE, thumbnail: 'https://picsum.photos/400/225?random=2', duration: '10:00', views: 3400 },
  { id: 'v3', title: '居家心肺增强操', category: Category.CARDIO, thumbnail: 'https://picsum.photos/400/225?random=3', duration: '22:15', views: 890 },
  { id: 'v4', title: '办公室肩颈放松', category: Category.REHAB, thumbnail: 'https://picsum.photos/400/225?random=4', duration: '08:45', views: 5600 },
  { id: 'v5', title: '瑜伽拉伸基础', category: Category.OTHER, thumbnail: 'https://picsum.photos/400/225?random=5', duration: '30:00', views: 2100 },
];

const NEWS: HealthNews[] = [
  { id: 'n1', title: '运动后为什么需要冷敷？专家解读', category: Category.REHAB, summary: '深入了解冷敷在急性损伤处理中的作用机制...', coverImage: 'https://picsum.photos/200/200?random=11', date: '2023-10-24' },
  { id: 'n2', title: '提升心肺功能的五种科学方法', category: Category.CARDIO, summary: '除了跑步，还有这些方式可以有效提升你的VO2 Max...', coverImage: 'https://picsum.photos/200/200?random=12', date: '2023-10-22' },
  { id: 'n3', title: '核心力量对腰椎保护的重要性', category: Category.CORE, summary: '长期久坐人群必看，核心不仅是腹肌...', coverImage: 'https://picsum.photos/200/200?random=13', date: '2023-10-20' },
];

const EVENTS: CommunityEvent[] = [
  { id: 'e1', title: '周末公园晨跑团', location: '朝阳公园', time: '周六 07:00', image: 'https://picsum.photos/300/400?random=21', likes: 45, userAvatar: 'https://picsum.photos/50/50?random=31', userName: 'RunningMan' },
  { id: 'e2', title: '线上康复讲座：半月板损伤', location: '腾讯会议', time: '周五 20:00', image: 'https://picsum.photos/300/350?random=22', likes: 128, userAvatar: 'https://picsum.photos/50/50?random=32', userName: 'Dr. Li' },
  { id: 'e3', title: '核心训练挑战赛', location: 'Rehaber 健身馆', time: '周日 14:00', image: 'https://picsum.photos/300/500?random=23', likes: 89, userAvatar: 'https://picsum.photos/50/50?random=33', userName: 'Coach Wang' },
  { id: 'e4', title: '户外瑜伽体验', location: '西湖边', time: '周六 09:00', image: 'https://picsum.photos/300/300?random=24', likes: 230, userAvatar: 'https://picsum.photos/50/50?random=34', userName: 'YogaLife' },
  { id: 'e5', title: '夜骑活动', location: '滨江大道', time: '周三 19:30', image: 'https://picsum.photos/300/450?random=25', likes: 67, userAvatar: 'https://picsum.photos/50/50?random=35', userName: 'BikeLover' },
];

export const mockService = {
  login: async (phone: string): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return { ...MOCK_USER, phone, loginCount: MOCK_USER.loginCount + 1 };
  },
  
  getVideos: async (subscriptions: Category[]): Promise<TrainingVideo[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    // If no subscriptions, show all, otherwise filter
    if (subscriptions.length === 0) return VIDEOS;
    return VIDEOS.filter(v => subscriptions.includes(v.category));
  },

  getNews: async (subscriptions: Category[]): Promise<HealthNews[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    if (subscriptions.length === 0) return NEWS;
    return NEWS.filter(n => subscriptions.includes(n.category));
  },

  getEvents: async (): Promise<CommunityEvent[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return EVENTS;
  },

  updateSubscriptions: async (newSubs: Category[]): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    MOCK_USER.subscriptions = newSubs;
    return { ...MOCK_USER };
  }
};
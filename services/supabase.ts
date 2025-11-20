import { createClient } from '@supabase/supabase-js';
import { Category, CommunityEvent, HealthNews, TrainingVideo, User } from '../types';

// Configuration
const SUPABASE_URL = 'https://qddkookrbyvjjnqjngtv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_n_GKmtktxCDUEy8wNDDaew_2d9GfNXB';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Fallback Mock Data ---
// These are used if the Supabase tables are not yet created or connection fails.
const MOCK_VIDEOS: TrainingVideo[] = [
  { id: 'v1', title: '膝关节术后康复入门', category: Category.REHAB, thumbnail: 'https://picsum.photos/400/225?random=1', duration: '15:20', views: 1204 },
  { id: 'v2', title: '十分钟核心燃脂', category: Category.CORE, thumbnail: 'https://picsum.photos/400/225?random=2', duration: '10:00', views: 3400 },
  { id: 'v3', title: '居家心肺增强操', category: Category.CARDIO, thumbnail: 'https://picsum.photos/400/225?random=3', duration: '22:15', views: 890 },
  { id: 'v4', title: '办公室肩颈放松', category: Category.REHAB, thumbnail: 'https://picsum.photos/400/225?random=4', duration: '08:45', views: 5600 },
  { id: 'v5', title: '瑜伽拉伸基础', category: Category.OTHER, thumbnail: 'https://picsum.photos/400/225?random=5', duration: '30:00', views: 2100 },
];

const MOCK_NEWS: HealthNews[] = [
  { id: 'n1', title: '运动后为什么需要冷敷？专家解读', category: Category.REHAB, summary: '深入了解冷敷在急性损伤处理中的作用机制...', coverImage: 'https://picsum.photos/200/200?random=11', date: '2023-10-24' },
  { id: 'n2', title: '提升心肺功能的五种科学方法', category: Category.CARDIO, summary: '除了跑步，还有这些方式可以有效提升你的VO2 Max...', coverImage: 'https://picsum.photos/200/200?random=12', date: '2023-10-22' },
  { id: 'n3', title: '核心力量对腰椎保护的重要性', category: Category.CORE, summary: '长期久坐人群必看，核心不仅是腹肌...', coverImage: 'https://picsum.photos/200/200?random=13', date: '2023-10-20' },
];

const MOCK_EVENTS: CommunityEvent[] = [
  { id: 'e1', title: '周末公园晨跑团', location: '朝阳公园', time: '周六 07:00', image: 'https://picsum.photos/300/400?random=21', likes: 45, userAvatar: 'https://picsum.photos/50/50?random=31', userName: 'RunningMan' },
  { id: 'e2', title: '线上康复讲座：半月板损伤', location: '腾讯会议', time: '周五 20:00', image: 'https://picsum.photos/300/350?random=22', likes: 128, userAvatar: 'https://picsum.photos/50/50?random=32', userName: 'Dr. Li' },
  { id: 'e3', title: '核心训练挑战赛', location: 'Rehaber 健身馆', time: '周日 14:00', image: 'https://picsum.photos/300/500?random=23', likes: 89, userAvatar: 'https://picsum.photos/50/50?random=33', userName: 'Coach Wang' },
];

// --- Data Mappers (Snake_case DB -> CamelCase App) ---

const mapUser = (data: any): User => ({
  id: data.id,
  name: data.name || 'Rehaber User',
  phone: data.phone,
  avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.phone}`,
  loginCount: data.login_count || 0,
  subscriptions: Array.isArray(data.subscriptions) ? data.subscriptions : [],
});

const mapVideo = (data: any): TrainingVideo => ({
  id: data.id,
  title: data.title,
  category: data.category,
  thumbnail: data.thumbnail,
  duration: data.duration,
  views: data.views || 0,
});

const mapNews = (data: any): HealthNews => ({
  id: data.id,
  title: data.title,
  category: data.category,
  summary: data.summary,
  coverImage: data.cover_image,
  date: data.date,
});

const mapEvent = (data: any): CommunityEvent => ({
  id: data.id,
  title: data.title,
  location: data.location,
  time: data.time,
  image: data.image,
  likes: data.likes || 0,
  userAvatar: data.user_avatar || 'https://picsum.photos/50/50',
  userName: data.user_name || 'Organizer',
});

// --- Service Methods ---

export const supabaseService = {
  /**
   * Login or Register a user by phone number.
   */
  login: async (phone: string, name?: string): Promise<User> => {
    try {
      // 1. Check if user exists
      const { data: existingUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .maybeSingle();

      if (findError) {
        throw findError;
      }

      if (existingUser) {
        // 2. Update login count
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ login_count: (existingUser.login_count || 0) + 1 })
          .eq('id', existingUser.id)
          .select()
          .single();

        if (updateError) throw updateError;
        return mapUser(updatedUser);
      } else {
        // 3. Create new user
        const newUserPayload = {
          phone,
          name: name || `User_${phone.slice(-4)}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${phone}`,
          login_count: 1,
          subscriptions: [Category.REHAB, Category.CORE], // Default subs
        };

        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert(newUserPayload)
          .select()
          .single();

        if (createError) throw createError;
        return mapUser(newUser);
      }
    } catch (error) {
      console.warn('Supabase Login Error (Falling back to Mock Data):', JSON.stringify(error, null, 2));
      // Fallback: Return a mock user so the app is usable
      return {
        id: 'mock-user-id',
        name: name || '访客用户',
        phone: phone,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${phone}`,
        loginCount: 1,
        subscriptions: [Category.REHAB, Category.CORE],
      };
    }
  },

  /**
   * Fetch videos, optionally filtered by user subscriptions.
   */
  getVideos: async (subscriptions: Category[]): Promise<TrainingVideo[]> => {
    try {
      let query = supabase.from('videos').select('*');
      if (subscriptions && subscriptions.length > 0) {
        query = query.in('category', subscriptions);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(mapVideo);
    } catch (error) {
      console.warn('Supabase getVideos Error (Using Mock Data):', error);
      if (subscriptions.length === 0) return MOCK_VIDEOS;
      return MOCK_VIDEOS.filter(v => subscriptions.includes(v.category));
    }
  },

  /**
   * Fetch news, optionally filtered.
   */
  getNews: async (subscriptions: Category[]): Promise<HealthNews[]> => {
    try {
      let query = supabase.from('news').select('*');
      if (subscriptions && subscriptions.length > 0) {
        query = query.in('category', subscriptions);
      }
      const { data, error } = await query.order('date', { ascending: false });
      if (error) throw error;
      return (data || []).map(mapNews);
    } catch (error) {
      console.warn('Supabase getNews Error (Using Mock Data):', error);
      if (subscriptions.length === 0) return MOCK_NEWS;
      return MOCK_NEWS.filter(n => subscriptions.includes(n.category));
    }
  },

  /**
   * Fetch community events.
   */
  getEvents: async (): Promise<CommunityEvent[]> => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      return (data || []).map(mapEvent);
    } catch (error) {
      console.warn('Supabase getEvents Error (Using Mock Data):', error);
      return MOCK_EVENTS;
    }
  },

  /**
   * Update user subscriptions.
   */
  updateSubscriptions: async (userId: string, newSubs: Category[]): Promise<User> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ subscriptions: newSubs })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return mapUser(data);
    } catch (error) {
      console.warn('Supabase updateSubscriptions Error:', error);
      // Return updated object for UI optimism
      return {
        id: userId,
        name: '访客用户',
        phone: '13800000000',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=fallback`,
        loginCount: 1,
        subscriptions: newSubs,
      };
    }
  }
};
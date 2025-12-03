// services/supabase.ts - 完整版，支持头像上传和详情获取
import { createClient } from '@supabase/supabase-js';

// Supabase 配置
const SUPABASE_URL = 'https://bohwsyaozlnscmgylzub.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvaHdzeWFvemxuc2NtZ3lsenViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMTQ3NDgsImV4cCI6MjA3OTg5MDc0OH0.F9OfedYqlt3cxmbpuokawfbNolHkkFTxgOiDBkgJCgM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Type definitions
export interface User {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  loginCount: number;
  subscriptions: string[];
  createdAt: string;
  stats: {
    trainingMinutes: number;
    daysStreak: number;
    caloriesBurned: number;
  };
}

export interface Video {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  videoUrl?: string;
  duration: string;
  views: number;
  author: string;
  authorAvatar: string;
  publishedAt?: string;
  description?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  content?: string;
  coverImage: string;
  date: string;
  readTime: string;
  type: 'article' | 'video';
  author?: string;
  authorAvatar?: string;
}

export interface Event {
  id: string;
  title: string;
  location: string;
  time: string;
  image: string;
  description?: string;
  likes: number;
  joined: boolean;
  organizer: string;
  tags: string[];
}

// 数据映射函数
const mapUser = (data: any): User => ({
  id: data.id,
  name: data.name,
  phone: data.phone,
  avatar: data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.phone}`,
  loginCount: data.login_count || 0,
  subscriptions: data.subscriptions || [],
  createdAt: data.created_at,
  stats: data.stats || { trainingMinutes: 0, daysStreak: 0, caloriesBurned: 0 }
});

const mapVideo = (data: any): Video => ({
  id: data.id,
  title: data.title,
  category: data.category,
  thumbnail: data.thumbnail,
  videoUrl: data.video_url,
  duration: data.duration,
  views: data.views || 0,
  author: data.publishers?.name || '未知作者',
  authorAvatar: data.publishers?.avatar || 'https://picsum.photos/seed/default/100/100',
  publishedAt: data.published_at,
  description: data.description
});

const mapNews = (data: any): NewsItem => ({
  id: data.id,
  title: data.title,
  category: data.category,
  summary: data.summary,
  content: data.content,
  coverImage: data.cover_image,
  date: new Date(data.published_at || data.created_at).toLocaleDateString('zh-CN'),
  readTime: data.read_time || '5分钟',
  type: data.type || 'article',
  author: data.publishers?.name,
  authorAvatar: data.publishers?.avatar
});

const mapEvent = (data: any): Event => ({
  id: data.id,
  title: data.title,
  location: data.location,
  time: data.time,
  image: data.image,
  description: data.description,
  likes: data.likes || 0,
  joined: false,
  organizer: data.publishers?.name || '未知组织者',
  tags: data.tags || []
});

// Supabase Service
export const supabaseService = {
  /**
   * 登录或注册用户
   */
  login: async (phone: string, name?: string): Promise<User> => {
    console.log('🔐 开始登录...', { phone, name });
    try {
      const { data: existingUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .maybeSingle();

      if (findError && findError.code !== 'PGRST116') {
        throw findError;
      }

      if (existingUser) {
        console.log('✅ 用户已存在，更新登录次数');
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ login_count: existingUser.login_count + 1 })
          .eq('id', existingUser.id)
          .select()
          .single();

        if (updateError) throw updateError;
        return mapUser(updatedUser);
      } else {
        console.log('📝 创建新用户');
        const newUser = {
          phone,
          name: name || `用户${phone.slice(-4)}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${phone}`,
          login_count: 1,
          subscriptions: ['Rehab', 'Core'],
          stats: { trainingMinutes: 0, daysStreak: 0, caloriesBurned: 0 }
        };

        const { data: createdUser, error: createError } = await supabase
          .from('users')
          .insert(newUser)
          .select()
          .single();

        if (createError) throw createError;
        console.log('✅ 创建成功');
        return mapUser(createdUser);
      }
    } catch (error) {
      console.error('❌ 登录失败:', error);
      throw error;
    }
  },

  /**
   * 获取视频列表
   */
  getVideos: async (subscriptions?: string[]): Promise<Video[]> => {
    console.log('📹 获取视频列表...');
    try {
      let query = supabase
        .from('videos')
        .select(`
          *,
          publishers (
            name,
            avatar
          )
        `)
        .order('published_at', { ascending: false });

      if (subscriptions && subscriptions.length > 0) {
        query = query.in('category', subscriptions);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      console.log(`✅ 获取到 ${data?.length || 0} 个视频`);
      return (data || []).map(mapVideo);
    } catch (error) {
      console.error('❌ 获取视频失败:', error);
      return [];
    }
  },

  /**
   * 获取单个视频详情
   */
  getVideoById: async (id: string): Promise<Video | null> => {
    console.log('📹 获取视频详情:', id);
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          publishers (
            name,
            avatar,
            bio
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      console.log('✅ 获取视频详情成功');
      return mapVideo(data);
    } catch (error) {
      console.error('❌ 获取视频详情失败:', error);
      return null;
    }
  },

  /**
   * 获取新闻列表
   */
  getNews: async (subscriptions?: string[]): Promise<NewsItem[]> => {
    console.log('📰 获取新闻列表...');
    try {
      let query = supabase
        .from('news')
        .select(`
          *,
          publishers (
            name,
            avatar
          )
        `)
        .order('published_at', { ascending: false });

      if (subscriptions && subscriptions.length > 0) {
        query = query.in('category', subscriptions);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      console.log(`✅ 获取到 ${data?.length || 0} 篇文章`);
      return (data || []).map(mapNews);
    } catch (error) {
      console.error('❌ 获取新闻失败:', error);
      return [];
    }
  },

  /**
   * 获取单篇文章详情
   */
  getNewsById: async (id: string): Promise<NewsItem | null> => {
    console.log('📰 获取文章详情:', id);
    try {
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          publishers (
            name,
            avatar,
            bio
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      console.log('✅ 获取文章详情成功');
      return mapNews(data);
    } catch (error) {
      console.error('❌ 获取文章详情失败:', error);
      return null;
    }
  },

  /**
   * 获取活动列表
   */
  getEvents: async (): Promise<Event[]> => {
    console.log('🎉 获取活动列表...');
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          publishers (
            name,
            avatar
          )
        `)
        .order('published_at', { ascending: false });

      if (error) throw error;
      
      console.log(`✅ 获取到 ${data?.length || 0} 个活动`);
      return (data || []).map(mapEvent);
    } catch (error) {
      console.error('❌ 获取活动失败:', error);
      return [];
    }
  },

  /**
   * 获取单个活动详情
   */
  getEventById: async (id: string): Promise<Event | null> => {
    console.log('🎉 获取活动详情:', id);
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          publishers (
            name,
            avatar,
            bio
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      console.log('✅ 获取活动详情成功');
      return mapEvent(data);
    } catch (error) {
      console.error('❌ 获取活动详情失败:', error);
      return null;
    }
  },

  /**
   * 上传头像到 Supabase Storage
   */
  uploadAvatar: async (file: File, userId: string): Promise<string | null> => {
    console.log('📤 上传头像...', file.name);
    try {
      // 生成唯一文件名
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // 上传到 Supabase Storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // 获取公开 URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('✅ 头像上传成功:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('❌ 头像上传失败:', error);
      return null;
    }
  },

  /**
   * 更新用户信息（包括头像）
   */
  updateUser: async (userId: string, updates: Partial<{ name: string; avatar: string }>): Promise<User | null> => {
    console.log('🔄 更新用户信息:', userId, updates);
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      console.log('✅ 更新成功');
      return mapUser(data);
    } catch (error) {
      console.error('❌ 更新失败:', error);
      return null;
    }
  },

  /**
   * 更新用户订阅
   */
  updateSubscriptions: async (userId: string, subscriptions: string[]): Promise<User> => {
    console.log('🔄 更新订阅...', subscriptions);
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ subscriptions })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      console.log('✅ 订阅更新成功');
      return mapUser(data);
    } catch (error) {
      console.error('❌ 更新订阅失败:', error);
      throw error;
    }
  }
};

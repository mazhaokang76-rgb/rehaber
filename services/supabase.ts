// services/supabase.ts - 增强版，包含所有新功能
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bohwsyaozlnscmgylzub.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvaHdzeWFvemxuc2NtZ3lsenViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMTQ3NDgsImV4cCI6MjA3OTg5MDc0OH0.F9OfedYqlt3cxmbpuokawfbNolHkkFTxgOiDBkgJCgM';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// Type Definitions
// ============================================

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
  isFavorited?: boolean;
  isLiked?: boolean;
  likesCount?: number;
  commentsCount?: number;
  progress?: number;
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
  isFavorited?: boolean;
  isLiked?: boolean;
  likesCount?: number;
  commentsCount?: number;
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
  isFavorited?: boolean;
  isLiked?: boolean;
  commentsCount?: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
  replies?: Comment[];
}

export interface VideoProgress {
  videoId: string;
  progressSeconds: number;
  durationSeconds: number;
  completed: boolean;
  lastWatched: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'event' | 'comment' | 'like' | 'system';
  relatedId?: string;
  read: boolean;
  createdAt: string;
}

export interface SearchFilters {
  categories?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'recent' | 'popular' | 'relevant';
}

// ============================================
// Helper Functions
// ============================================

const getCurrentUserId = (): string | null => {
  try {
    const userStr = localStorage.getItem('rehaber_user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id;
    }
  } catch (error) {
    console.error('获取用户ID失败:', error);
  }
  return null;
};

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
  description: data.description,
  isFavorited: data.is_favorited || false,
  isLiked: data.is_liked || false,
  likesCount: data.likes_count || 0,
  commentsCount: data.comments_count || 0,
  progress: data.progress || 0
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
  authorAvatar: data.publishers?.avatar,
  isFavorited: data.is_favorited || false,
  isLiked: data.is_liked || false,
  likesCount: data.likes_count || 0,
  commentsCount: data.comments_count || 0
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
  tags: data.tags || [],
  isFavorited: data.is_favorited || false,
  isLiked: data.is_liked || false,
  commentsCount: data.comments_count || 0
});

const mapComment = (data: any): Comment => ({
  id: data.id,
  userId: data.user_id,
  userName: data.users?.name || '匿名用户',
  userAvatar: data.users?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=anonymous',
  content: data.content,
  createdAt: data.created_at,
  likesCount: data.likes_count || 0,
  isLiked: data.is_liked || false,
  replies: data.replies?.map(mapComment) || []
});

// ============================================
// Supabase Service
// ============================================

export const supabaseService = {
  // ==================== 用户相关 ====================
  
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
  },

  uploadAvatar: async (file: File, userId: string): Promise<string | null> => {
    console.log('📤 上传头像...', file.name);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

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

  // ==================== 视频相关 ====================
  
  getVideos: async (subscriptions?: string[], filters?: SearchFilters): Promise<Video[]> => {
    console.log('📹 获取视频列表...');
    try {
      const userId = getCurrentUserId();
      let query = supabase
        .from('videos')
        .select(`
          *,
          publishers (name, avatar)
        `)
        .order('published_at', { ascending: false });

      if (subscriptions && subscriptions.length > 0) {
        query = query.in('category', subscriptions);
      }

      if (filters?.categories && filters.categories.length > 0) {
        query = query.in('category', filters.categories);
      }

      const { data, error } = await query;
      if (error) throw error;

      const videos = data || [];
      
      if (userId && videos.length > 0) {
        const videoIds = videos.map(v => v.id);
        
        const [favoritesData, likesData, progressData] = await Promise.all([
          supabase.from('favorites').select('content_id').eq('user_id', userId).eq('content_type', 'video').in('content_id', videoIds),
          supabase.from('likes').select('content_id').eq('user_id', userId).eq('content_type', 'video').in('content_id', videoIds),
          supabase.from('video_progress').select('video_id, progress_seconds, duration_seconds').eq('user_id', userId).in('video_id', videoIds)
        ]);

        const favoriteIds = new Set(favoritesData.data?.map(f => f.content_id) || []);
        const likeIds = new Set(likesData.data?.map(l => l.content_id) || []);
        const progressMap = new Map(progressData.data?.map(p => [p.video_id, (p.progress_seconds / p.duration_seconds) * 100]) || []);

        return videos.map(v => ({
          ...mapVideo(v),
          isFavorited: favoriteIds.has(v.id),
          isLiked: likeIds.has(v.id),
          progress: progressMap.get(v.id) || 0
        }));
      }
      
      console.log(`✅ 获取到 ${videos.length} 个视频`);
      return videos.map(mapVideo);
    } catch (error) {
      console.error('❌ 获取视频失败:', error);
      return [];
    }
  },

  getVideoById: async (id: string): Promise<Video | null> => {
    console.log('📹 获取视频详情:', id);
    try {
      const userId = getCurrentUserId();
      const { data, error } = await supabase
        .from('videos')
        .select(`*, publishers (name, avatar, bio)`)
        .eq('id', id)
        .single();

      if (error) throw error;

      const video = mapVideo(data);

      if (userId) {
        const [favData, likeData, progressData] = await Promise.all([
          supabase.from('favorites').select('id').eq('user_id', userId).eq('content_id', id).eq('content_type', 'video').maybeSingle(),
          supabase.from('likes').select('id').eq('user_id', userId).eq('content_id', id).eq('content_type', 'video').maybeSingle(),
          supabase.from('video_progress').select('progress_seconds, duration_seconds').eq('user_id', userId).eq('video_id', id).maybeSingle()
        ]);

        video.isFavorited = !!favData.data;
        video.isLiked = !!likeData.data;
        if (progressData.data) {
          video.progress = (progressData.data.progress_seconds / progressData.data.duration_seconds) * 100;
        }
      }

      console.log('✅ 获取视频详情成功');
      return video;
    } catch (error) {
      console.error('❌ 获取视频详情失败:', error);
      return null;
    }
  },

  // ==================== 新闻相关 ====================
  
  getNews: async (subscriptions?: string[], filters?: SearchFilters): Promise<NewsItem[]> => {
    console.log('📰 获取新闻列表...');
    try {
      const userId = getCurrentUserId();
      let query = supabase
        .from('news')
        .select(`*, publishers (name, avatar)`)
        .order('published_at', { ascending: false });

      if (subscriptions && subscriptions.length > 0) {
        query = query.in('category', subscriptions);
      }

      if (filters?.categories && filters.categories.length > 0) {
        query = query.in('category', filters.categories);
      }

      const { data, error } = await query;
      if (error) throw error;

      const newsItems = data || [];
      
      if (userId && newsItems.length > 0) {
        const newsIds = newsItems.map(n => n.id);
        
        const [favoritesData, likesData] = await Promise.all([
          supabase.from('favorites').select('content_id').eq('user_id', userId).eq('content_type', 'news').in('content_id', newsIds),
          supabase.from('likes').select('content_id').eq('user_id', userId).eq('content_type', 'news').in('content_id', newsIds)
        ]);

        const favoriteIds = new Set(favoritesData.data?.map(f => f.content_id) || []);
        const likeIds = new Set(likesData.data?.map(l => l.content_id) || []);

        return newsItems.map(n => ({
          ...mapNews(n),
          isFavorited: favoriteIds.has(n.id),
          isLiked: likeIds.has(n.id)
        }));
      }
      
      console.log(`✅ 获取到 ${newsItems.length} 篇文章`);
      return newsItems.map(mapNews);
    } catch (error) {
      console.error('❌ 获取新闻失败:', error);
      return [];
    }
  },

  getNewsById: async (id: string): Promise<NewsItem | null> => {
    console.log('📰 获取文章详情:', id);
    try {
      const userId = getCurrentUserId();
      const { data, error } = await supabase
        .from('news')
        .select(`*, publishers (name, avatar, bio)`)
        .eq('id', id)
        .single();

      if (error) throw error;

      const news = mapNews(data);

      if (userId) {
        const [favData, likeData] = await Promise.all([
          supabase.from('favorites').select('id').eq('user_id', userId).eq('content_id', id).eq('content_type', 'news').maybeSingle(),
          supabase.from('likes').select('id').eq('user_id', userId).eq('content_id', id).eq('content_type', 'news').maybeSingle()
        ]);

        news.isFavorited = !!favData.data;
        news.isLiked = !!likeData.data;
      }

      console.log('✅ 获取文章详情成功');
      return news;
    } catch (error) {
      console.error('❌ 获取文章详情失败:', error);
      return null;
    }
  },

  // ==================== 活动相关 ====================
  
  getEvents: async (): Promise<Event[]> => {
    console.log('🎉 获取活动列表...');
    try {
      const userId = getCurrentUserId();
      const { data, error } = await supabase
        .from('events')
        .select(`*, publishers (name, avatar)`)
        .order('published_at', { ascending: false });

      if (error) throw error;

      const events = data || [];
      
      if (userId && events.length > 0) {
        const eventIds = events.map(e => e.id);
        
        const [favoritesData, likesData] = await Promise.all([
          supabase.from('favorites').select('content_id').eq('user_id', userId).eq('content_type', 'event').in('content_id', eventIds),
          supabase.from('likes').select('content_id').eq('user_id', userId).eq('content_type', 'event').in('content_id', eventIds)
        ]);

        const favoriteIds = new Set(favoritesData.data?.map(f => f.content_id) || []);
        const likeIds = new Set(likesData.data?.map(l => l.content_id) || []);

        return events.map(e => ({
          ...mapEvent(e),
          isFavorited: favoriteIds.has(e.id),
          isLiked: likeIds.has(e.id)
        }));
      }
      
      console.log(`✅ 获取到 ${events.length} 个活动`);
      return events.map(mapEvent);
    } catch (error) {
      console.error('❌ 获取活动失败:', error);
      return [];
    }
  },

  getEventById: async (id: string): Promise<Event | null> => {
    console.log('🎉 获取活动详情:', id);
    try {
      const userId = getCurrentUserId();
      const { data, error } = await supabase
        .from('events')
        .select(`*, publishers (name, avatar, bio)`)
        .eq('id', id)
        .single();

      if (error) throw error;

      const event = mapEvent(data);

      if (userId) {
        const [favData, likeData] = await Promise.all([
          supabase.from('favorites').select('id').eq('user_id', userId).eq('content_id', id).eq('content_type', 'event').maybeSingle(),
          supabase.from('likes').select('id').eq('user_id', userId).eq('content_id', id).eq('content_type', 'event').maybeSingle()
        ]);

        event.isFavorited = !!favData.data;
        event.isLiked = !!likeData.data;
      }

      console.log('✅ 获取活动详情成功');
      return event;
    } catch (error) {
      console.error('❌ 获取活动详情失败:', error);
      return null;
    }
  },

  // ==================== 收藏功能 ====================
  
  toggleFavorite: async (contentId: string, contentType: 'video' | 'news' | 'event'): Promise<boolean> => {
    console.log('⭐ 切换收藏状态...', contentId, contentType);
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        console.error('用户未登录');
        throw new Error('用户未登录');
      }

      console.log('当前用户ID:', userId);

      const { data: existing, error: queryError } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .maybeSingle();

      if (queryError) {
        console.error('查询收藏失败:', queryError);
        throw queryError;
      }

      if (existing) {
        console.log('已收藏，准备取消...', existing.id);
        const { error: deleteError } = await supabase
          .from('favorites')
          .delete()
          .eq('id', existing.id);
        
        if (deleteError) {
          console.error('取消收藏失败:', deleteError);
          throw deleteError;
        }
        console.log('✅ 已取消收藏');
        return false;
      } else {
        console.log('未收藏，准备添加...');
        const { data: inserted, error: insertError } = await supabase
          .from('favorites')
          .insert({
            user_id: userId,
            content_id: contentId,
            content_type: contentType
          })
          .select()
          .single();

        if (insertError) {
          console.error('添加收藏失败:', insertError);
          throw insertError;
        }
        console.log('✅ 已添加收藏', inserted);
        return true;
      }
    } catch (error) {
      console.error('❌ 收藏操作失败:', error);
      throw error;
    }
  },

  getFavorites: async (contentType?: 'video' | 'news' | 'event'): Promise<any[]> => {
    console.log('⭐ 获取收藏列表...', contentType);
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        console.log('用户未登录');
        return [];
      }

      let query = supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (contentType) {
        query = query.eq('content_type', contentType);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('查询收藏失败:', error);
        throw error;
      }

      console.log(`✅ 获取到 ${data?.length || 0} 个收藏`);
      return data || [];
    } catch (error) {
      console.error('❌ 获取收藏失败:', error);
      return [];
    }
  },

  // ==================== 点赞功能 ====================
  
  toggleLike: async (contentId: string, contentType: 'video' | 'news' | 'event' | 'comment'): Promise<boolean> => {
    console.log('👍 切换点赞状态...', contentId, contentType);
    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error('用户未登录');

      const { data: existing } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', userId)
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .maybeSingle();

      if (existing) {
        await supabase.from('likes').delete().eq('id', existing.id);
        console.log('✅ 已取消点赞');
        return false;
      } else {
        await supabase.from('likes').insert({
          user_id: userId,
          content_id: contentId,
          content_type: contentType
        });
        console.log('✅ 已点赞');
        return true;
      }
    } catch (error) {
      console.error('❌ 点赞操作失败:', error);
      throw error;
    }
  },

  // ==================== 评论功能 ====================
  
  getComments: async (contentId: string, contentType: 'video' | 'news' | 'event'): Promise<Comment[]> => {
    console.log('💬 获取评论列表...', contentId, contentType);
    try {
      const userId = getCurrentUserId();
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          users (name, avatar)
        `)
        .eq('content_id', contentId)
        .eq('content_type', contentType)
        .is('parent_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const comments = data || [];
      
      for (const comment of comments) {
        const { data: replies } = await supabase
          .from('comments')
          .select(`*, users (name, avatar)`)
          .eq('parent_id', comment.id)
          .order('created_at', { ascending: true });
        
        comment.replies = replies || [];
      }

      if (userId && comments.length > 0) {
        const commentIds = comments.flatMap(c => [c.id, ...(c.replies?.map((r: any) => r.id) || [])]);
        const { data: likesData } = await supabase
          .from('likes')
          .select('content_id')
          .eq('user_id', userId)
          .eq('content_type', 'comment')
          .in('content_id', commentIds);

        const likeIds = new Set(likesData?.map(l => l.content_id) || []);
        
        comments.forEach(c => {
          c.is_liked = likeIds.has(c.id);
          c.replies?.forEach((r: any) => {
            r.is_liked = likeIds.has(r.id);
          });
        });
      }

      console.log(`✅ 获取到 ${comments.length} 条评论`);
      return comments.map(mapComment);
    } catch (error) {
      console.error('❌ 获取评论失败:', error);
      return [];
    }
  },

  addComment: async (contentId: string, contentType: 'video' | 'news' | 'event', content: string, parentId?: string): Promise<Comment | null> => {
    console.log('💬 添加评论...', contentId, contentType);
    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error('用户未登录');

      const { data, error } = await supabase
        .from('comments')
        .insert({
          user_id: userId,
          content_id: contentId,
          content_type: contentType,
          content,
          parent_id: parentId || null
        })
        .select(`*, users (name, avatar)`)
        .single();

      if (error) throw error;

      console.log('✅ 评论成功');
      return mapComment(data);
    } catch (error) {
      console.error('❌ 评论失败:', error);
      return null;
    }
  },

  deleteComment: async (commentId: string): Promise<boolean> => {
    console.log('🗑️ 删除评论...', commentId);
    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error('用户未登录');

      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', userId);

      if (error) throw error;

      console.log('✅ 删除成功');
      return true;
    } catch (error) {
      console.error('❌ 删除失败:', error);
      return false;
    }
  },

  // ==================== 视频进度 ====================
  
  saveVideoProgress: async (videoId: string, progressSeconds: number, durationSeconds: number): Promise<boolean> => {
    console.log('💾 保存视频进度...', videoId, progressSeconds);
    try {
      const userId = getCurrentUserId();
      if (!userId) return false;

      const completed = progressSeconds >= durationSeconds * 0.9;

      const { error } = await supabase
        .from('video_progress')
        .upsert({
          user_id: userId,
          video_id: videoId,
          progress_seconds: progressSeconds,
          duration_seconds: durationSeconds,
          completed,
          last_watched: new Date().toISOString()
        }, {
          onConflict: 'user_id,video_id'
        });

      if (error) throw error;

      console.log('✅ 进度保存成功');
      return true;
    } catch (error) {
      console.error('❌ 进度保存失败:', error);
      return false;
    }
  },

  getVideoProgress: async (videoId: string): Promise<VideoProgress | null> => {
    console.log('📊 获取视频进度...', videoId);
    try {
      const userId = getCurrentUserId();
      if (!userId) return null;

      const { data, error } = await supabase
        .from('video_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('video_id', videoId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      console.log('✅ 获取进度成功');
      return {
        videoId: data.video_id,
        progressSeconds: data.progress_seconds,
        durationSeconds: data.duration_seconds,
        completed: data.completed,
        lastWatched: data.last_watched
      };
    } catch (error) {
      console.error('❌ 获取进度失败:', error);
      return null;
    }
  },

  // ==================== 通知功能 ====================
  
  getNotifications: async (): Promise<Notification[]> => {
    console.log('🔔 获取通知列表...');
    try {
      const userId = getCurrentUserId();
      if (!userId) return [];

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      console.log(`✅ 获取到 ${data?.length || 0} 条通知`);
      return data?.map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        relatedId: n.related_id,
        read: n.read,
        createdAt: n.created_at
      })) || [];
    } catch (error) {
      console.error('❌ 获取通知失败:', error);
      return [];
    }
  },

  markNotificationAsRead: async (notificationId: string): Promise<boolean> => {
    console.log('✅ 标记通知已读...', notificationId);
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      console.log('✅ 标记成功');
      return true;
    } catch (error) {
      console.error('❌ 标记失败:', error);
      return false;
    }
  },

  markAllNotificationsAsRead: async (): Promise<boolean> => {
    console.log('✅ 标记所有通知已读...');
    try {
      const userId = getCurrentUserId();
      if (!userId) return false;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      console.log('✅ 标记成功');
      return true;
    } catch (error) {
      console.error('❌ 标记失败:', error);
      return false;
    }
  },

  getUnreadNotificationCount: async (): Promise<number> => {
    try {
      const userId = getCurrentUserId();
      if (!userId) return 0;

      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('❌ 获取未读数量失败:', error);
      return 0;
    }
  },

  // ==================== 搜索功能 ====================
  
  searchContent: async (query: string, contentType?: 'video' | 'news' | 'event', filters?: SearchFilters): Promise<any[]> => {
    console.log('🔍 搜索内容...', query, contentType);
    try {
      if (!query.trim()) return [];

      const results: any[] = [];

      // 搜索视频
      if (!contentType || contentType === 'video') {
        let videoQuery = supabase
          .from('videos')
          .select(`*, publishers (name, avatar)`)
          .textSearch('search_vector', query)
          .limit(20);

        if (filters?.categories && filters.categories.length > 0) {
          videoQuery = videoQuery.in('category', filters.categories);
        }

        const { data: videos } = await videoQuery;
        if (videos) {
          results.push(...videos.map(v => ({ ...mapVideo(v), _type: 'video' })));
        }
      }

      // 搜索新闻
      if (!contentType || contentType === 'news') {
        let newsQuery = supabase
          .from('news')
          .select(`*, publishers (name, avatar)`)
          .textSearch('search_vector', query)
          .limit(20);

        if (filters?.categories && filters.categories.length > 0) {
          newsQuery = newsQuery.in('category', filters.categories);
        }

        const { data: news } = await newsQuery;
        if (news) {
          results.push(...news.map(n => ({ ...mapNews(n), _type: 'news' })));
        }
      }

      // 搜索活动
      if (!contentType || contentType === 'event') {
        const { data: events } = await supabase
          .from('events')
          .select(`*, publishers (name, avatar)`)
          .textSearch('search_vector', query)
          .limit(20);

        if (events) {
          results.push(...events.map(e => ({ ...mapEvent(e), _type: 'event' })));
        }
      }

      console.log(`✅ 搜索到 ${results.length} 条结果`);
      return results;
    } catch (error) {
      console.error('❌ 搜索失败:', error);
      return [];
    }
  },

  // ==================== 分类筛选 ====================
  
  getCategories: async (): Promise<string[]> => {
    console.log('📁 获取分类列表...');
    try {
      const { data: videos } = await supabase
        .from('videos')
        .select('category')
        .not('category', 'is', null);

      const { data: news } = await supabase
        .from('news')
        .select('category')
        .not('category', 'is', null);

      const categories = new Set<string>();
      videos?.forEach(v => categories.add(v.category));
      news?.forEach(n => categories.add(n.category));

      const result = Array.from(categories).sort();
      console.log(`✅ 获取到 ${result.length} 个分类`);
      return result;
    } catch (error) {
      console.error('❌ 获取分类失败:', error);
      return [];
    }
  },

  // ==================== 活动报名功能 ====================
  
  /**
   * 报名/取消报名活动
   */
  registerEvent: async (eventId: string): Promise<boolean> => {
    console.log('📝 切换报名状态...', eventId);
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        console.error('用户未登录');
        throw new Error('请先登录');
      }

      console.log('当前用户ID:', userId);

      // 检查是否已报名
      const { data: existing, error: queryError } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .maybeSingle();

      if (queryError) {
        console.error('查询报名状态失败:', queryError);
        throw queryError;
      }

      if (existing) {
        // 已报名，取消报名
        console.log('已报名，准备取消...', existing.id);
        const { error: deleteError } = await supabase
          .from('event_registrations')
          .delete()
          .eq('id', existing.id);
        
        if (deleteError) {
          console.error('取消报名失败:', deleteError);
          throw deleteError;
        }
        console.log('✅ 已取消报名');
        return false;
      } else {
        // 未报名，添加报名
        console.log('未报名，准备添加...');
        const { data: inserted, error: insertError } = await supabase
          .from('event_registrations')
          .insert({
            user_id: userId,
            event_id: eventId,
            reminded_24h: false,
            reminded_1h: false
          })
          .select()
          .single();

        if (insertError) {
          console.error('报名失败:', insertError);
          throw insertError;
        }

        console.log('✅ 报名成功', inserted);

        // 创建报名成功通知
        try {
          await supabase
            .from('notifications')
            .insert({
              user_id: userId,
              title: '报名成功',
              message: '您已成功报名活动，我们会在活动开始前提醒您',
              type: 'event',
              related_id: eventId,
              read: false
            });
          console.log('✅ 已创建报名通知');
        } catch (notifError) {
          console.error('创建通知失败:', notifError);
          // 通知失败不影响报名
        }

        return true;
      }
    } catch (error) {
      console.error('❌ 报名操作失败:', error);
      throw error;
    }
  },

  /**
   * 检查是否已报名
   */
  checkEventRegistration: async (eventId: string): Promise<boolean> => {
    try {
      const userId = getCurrentUserId();
      if (!userId) return false;

      const { data, error } = await supabase
        .from('event_registrations')
        .select('id')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .maybeSingle();

      if (error) {
        console.error('检查报名状态失败:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('检查报名状态失败:', error);
      return false;
    }
  },

  /**
   * 获取用户的活动报名列表
   */
  getMyEventRegistrations: async (): Promise<any[]> => {
    console.log('📅 获取我的活动报名...');
    try {
      const userId = getCurrentUserId();
      if (!userId) return [];

      const { data, error } = await supabase
        .from('event_registrations')
        .select(`
          *,
          events (
            *,
            publishers (name, avatar)
          )
        `)
        .eq('user_id', userId)
        .order('registered_at', { ascending: false });

      if (error) throw error;

      console.log(`✅ 获取到 ${data?.length || 0} 个报名`);
      return data || [];
    } catch (error) {
      console.error('❌ 获取报名列表失败:', error);
      return [];
    }
  }
};

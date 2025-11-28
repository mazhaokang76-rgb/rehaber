// services/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Your Supabase Configuration
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
  duration: string;
  views: number;
  author: string;
  authorAvatar: string;
  publishedAt?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  category: string;
  summary: string;
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
  likes: number;
  joined: boolean;
  organizer: string;
  tags: string[];
}

// Data mapping functions
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
  duration: data.duration,
  views: data.views || 0,
  author: data.publishers?.name || '未知作者',
  authorAvatar: data.publishers?.avatar || 'https://picsum.photos/seed/default/100/100',
  publishedAt: data.published_at
});

const mapNews = (data: any): NewsItem => ({
  id: data.id,
  title: data.title,
  category: data.category,
  summary: data.summary,
  coverImage: data.cover_image,
  date: new Date(data.published_at).toLocaleDateString('zh-CN'),
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
  likes: data.likes || 0,
  joined: false, // This would need user-specific logic
  organizer: data.publishers?.name || '未知组织者',
  tags: data.tags || []
});

// Supabase Service
export const supabaseService = {
  /**
   * Login or register a user
   */
  login: async (phone: string, name?: string): Promise<User> => {
    try {
      // Check if user exists
      const { data: existingUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .maybeSingle();

      if (findError && findError.code !== 'PGRST116') {
        throw findError;
      }

      if (existingUser) {
        // Update login count
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({ login_count: existingUser.login_count + 1 })
          .eq('id', existingUser.id)
          .select()
          .single();

        if (updateError) throw updateError;
        return mapUser(updatedUser);
      } else {
        // Create new user
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
        return mapUser(createdUser);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Get videos, optionally filtered by subscriptions
   */
  getVideos: async (subscriptions?: string[]): Promise<Video[]> => {
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
      return (data || []).map(mapVideo);
    } catch (error) {
      console.error('Get videos error:', error);
      return [];
    }
  },

  /**
   * Get news articles, optionally filtered by subscriptions
   */
  getNews: async (subscriptions?: string[]): Promise<NewsItem[]> => {
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
      return (data || []).map(mapNews);
    } catch (error) {
      console.error('Get news error:', error);
      return [];
    }
  },

  /**
   * Get community events
   */
  getEvents: async (): Promise<Event[]> => {
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
      return (data || []).map(mapEvent);
    } catch (error) {
      console.error('Get events error:', error);
      return [];
    }
  },

  /**
   * Update user subscriptions
   */
  updateSubscriptions: async (userId: string, subscriptions: string[]): Promise<User> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ subscriptions })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return mapUser(data);
    } catch (error) {
      console.error('Update subscriptions error:', error);
      throw error;
    }
  },

  /**
   * Update user stats
   */
  updateUserStats: async (userId: string, stats: { trainingMinutes: number; daysStreak: number; caloriesBurned: number }): Promise<User> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ stats })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return mapUser(data);
    } catch (error) {
      console.error('Update stats error:', error);
      throw error;
    }
  },

  /**
   * Increment video views
   */
  incrementVideoViews: async (videoId: string): Promise<void> => {
    try {
      const { error } = await supabase.rpc('increment_video_views', { video_id: videoId });
      if (error) throw error;
    } catch (error) {
      console.error('Increment views error:', error);
    }
  },

  /**
   * Increment event likes
   */
  incrementEventLikes: async (eventId: string): Promise<void> => {
    try {
      const { error } = await supabase.rpc('increment_event_likes', { event_id: eventId });
      if (error) throw error;
    } catch (error) {
      console.error('Increment likes error:', error);
    }
  }
};

export interface User {
  id: string;
  name: string;
  phone?: string;
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
  category: 'Rehab' | 'Core' | 'Cardio' | 'Other';
  thumbnail: string;
  duration: string;
  views: number;
  author: string;
  authorAvatar: string;
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

export enum NavTab {
  HOME = 'HOME',
  INFO = 'INFO',
  COMMUNITY = 'COMMUNITY',
  TOOLS = 'TOOLS',
  PROFILE = 'PROFILE'
}
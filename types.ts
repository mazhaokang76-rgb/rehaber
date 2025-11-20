export enum Category {
  REHAB = '运动复健',
  CORE = '核心训练',
  CARDIO = '心肺功能',
  OTHER = '其他训练',
}

export interface User {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  loginCount: number;
  subscriptions: Category[];
}

export interface TrainingVideo {
  id: string;
  title: string;
  category: Category;
  thumbnail: string;
  duration: string;
  views: number;
}

export interface HealthNews {
  id: string;
  title: string;
  category: Category;
  summary: string;
  coverImage: string;
  date: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  location: string;
  time: string;
  image: string;
  likes: number;
  userAvatar: string;
  userName: string;
}
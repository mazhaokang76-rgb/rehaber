import React, { useState, useEffect } from 'react';
import { ArrowLeft, Share2, Heart, Clock } from 'lucide-react';
import { supabaseService } from '../services/supabase';
import type { NewsItem } from '../services/supabase';

interface NewsDetailProps {
  newsId: string;
  onBack: () => void;
}

export const NewsDetail: React.FC<NewsDetailProps> = ({ newsId, onBack }) => {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNewsDetail();
  }, [newsId]);

  const loadNewsDetail = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getNewsById(newsId);
      setNews(data);
    } catch (error) {
      console.error('加载文章失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: news?.title || '锐汗步',
      text: news?.summary || '',
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('链接已复制到剪贴板！');
      }
    } catch (error) {
      console.error('分享失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-gray-400 mb-4">文章不存在</div>
        <button onClick={onBack} className="text-brand-600 font-bold">返回</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLiked(!liked)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart
                size={24}
                className={liked ? 'text-red-500 fill-red-500' : 'text-gray-700'}
              />
            </button>
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Share2 size={24} className="text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative w-full h-64 bg-gray-200">
        <img
          src={news.coverImage}
          alt={news.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          {news.category}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10">
        <div className="px-6 py-6">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-4">
            {news.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {news.authorAvatar && (
                <img
                  src={news.authorAvatar}
                  alt={news.author}
                  className="w-10 h-10 rounded-full border-2 border-brand-100"
                />
              )}
              <div>
                <div className="font-medium text-gray-900">{news.author || '未知作者'}</div>
                <div className="text-xs text-gray-500">{news.date}</div>
              </div>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock size={16} className="mr-1" />
              {news.readTime}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-brand-50 border-l-4 border-brand-600 p-4 rounded-r-lg mb-6">
            <p className="text-sm text-gray-700 leading-relaxed">
              {news.summary}
            </p>
          </div>

          {/* Main Content */}
          <div className="prose prose-sm max-w-none">
            {news.content ? (
              <div 
                className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            ) : (
              <div className="text-gray-700 leading-relaxed space-y-4">
                <p>文章内容正在加载中...</p>
                <p className="text-sm text-gray-500">
                  提示：请在数据库的 news 表中添加 content 字段来存储完整的文章内容。
                </p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-8">
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              #{news.category}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              #康复训练
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// components/SearchResults.tsx - 搜索结果页面
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Clock, Play, Calendar, MapPin, Bookmark, Heart } from 'lucide-react';
import { supabaseService } from '../services/supabase';

interface SearchResultsProps {
  initialQuery?: string;
  onBack: () => void;
  onSelectVideo?: (id: string) => void;
  onSelectNews?: (id: string) => void;
  onSelectEvent?: (id: string) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ 
  initialQuery = '', 
  onBack,
  onSelectVideo,
  onSelectNews,
  onSelectEvent
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'video' | 'news' | 'event'>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
    loadCategories();
  }, [initialQuery]);

  const loadCategories = async () => {
    const cats = await supabaseService.getCategories();
    setCategories(cats);
  };

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    try {
      setLoading(true);
      const contentType = filter === 'all' ? undefined : filter as any;
      const filters = selectedCategories.length > 0 
        ? { categories: selectedCategories } 
        : undefined;
      
      const searchResults = await supabaseService.searchContent(q, contentType, filters);
      setResults(searchResults);
    } catch (error) {
      console.error('搜索失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setFilter('all');
  };

  const filteredResults = results.filter(r => {
    if (filter === 'all') return true;
    return r._type === filter;
  });

  const getTypeLabel = (type: string) => {
    const labels = { video: '视频', news: '文章', event: '活动' };
    return labels[type as keyof typeof labels] || type;
  };

  const handleResultClick = (result: any) => {
    if (result._type === 'video' && onSelectVideo) {
      onSelectVideo(result.id);
    } else if (result._type === 'news' && onSelectNews) {
      onSelectNews(result.id);
    } else if (result._type === 'event' && onSelectEvent) {
      onSelectEvent(result.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3 mb-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            
            {/* Search Input */}
            <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Search size={20} className="text-gray-400 mr-2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="搜索视频、文章、活动..."
                className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-full transition-colors ${
                showFilters ? 'bg-brand-50 text-brand-600' : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Filter size={24} />
            </button>
          </div>

          {/* Search Button */}
          <button
            onClick={() => handleSearch()}
            disabled={!query.trim() || loading}
            className="w-full bg-brand-600 text-white font-bold py-2.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-700 transition-colors"
          >
            {loading ? '搜索中...' : '搜索'}
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="px-4 pb-4 border-t border-gray-100 pt-4 bg-gray-50">
            {/* Type Filter */}
            <div className="mb-4">
              <h4 className="text-sm font-bold text-gray-700 mb-2">内容类型</h4>
              <div className="flex space-x-2">
                {[
                  { value: 'all', label: '全部', icon: '🔍' },
                  { value: 'video', label: '视频', icon: '🎥' },
                  { value: 'news', label: '文章', icon: '📰' },
                  { value: 'event', label: '活动', icon: '🎉' }
                ].map(type => (
                  <button
                    key={type.value}
                    onClick={() => setFilter(type.value as any)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      filter === type.value
                        ? 'bg-brand-600 text-white'
                        : 'bg-white text-gray-600 border border-gray-200'
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-gray-700">分类筛选</h4>
                {selectedCategories.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-brand-600 font-medium"
                  >
                    清除
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 8).map(category => {
                  const isSelected = selectedCategories.includes(category);
                  return (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-brand-600 text-white'
                          : 'bg-white text-gray-600 border border-gray-200'
                      }`}
                    >
                      {category} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="text-center py-20">
            <Search size={64} className="mx-auto text-gray-300 mb-4" />
            <div className="text-gray-400 font-medium mb-2">
              {query ? '未找到相关结果' : '输入关键词开始搜索'}
            </div>
            <div className="text-gray-300 text-sm">
              {query ? '试试其他关键词或调整筛选条件' : '试试搜索"康复训练"或"拉伸"'}
            </div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-500">
              找到 <span className="font-bold text-brand-600">{filteredResults.length}</span> 个结果
            </div>

            {/* Results List */}
            <div className="space-y-3">
              {filteredResults.map((result, index) => (
                <ResultCard
                  key={`${result._type}-${result.id}-${index}`}
                  result={result}
                  onClick={() => handleResultClick(result)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Result Card Component
interface ResultCardProps {
  result: any;
  onClick: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onClick }) => {
  const getTypeColor = (type: string) => {
    const colors = {
      video: 'bg-purple-100 text-purple-700',
      news: 'bg-blue-100 text-blue-700',
      event: 'bg-green-100 text-green-700'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getTypeLabel = (type: string) => {
    const labels = { video: '视频', news: '文章', event: '活动' };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all active:scale-[0.99]"
    >
      <div className="flex">
        {/* Thumbnail */}
        <div className="w-32 h-32 flex-shrink-0 relative">
          <img
            src={result.thumbnail || result.coverImage || result.image || 'https://picsum.photos/200/200'}
            alt={result.title}
            className="w-full h-full object-cover"
          />
          {result._type === 'video' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full">
                <Play size={20} className="text-brand-600 fill-brand-600" />
              </div>
            </div>
          )}
          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold ${getTypeColor(result._type)}`}>
            {getTypeLabel(result._type)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 flex flex-col justify-between">
          <div>
            {/* Category */}
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs px-2 py-0.5 bg-brand-50 text-brand-600 rounded-full font-medium">
                {result.category}
              </span>
              {result.duration && (
                <span className="text-xs text-gray-400 flex items-center">
                  <Clock size={10} className="mr-1" />
                  {result.duration}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug mb-1">
              {result.title}
            </h3>

            {/* Description/Summary */}
            {(result.description || result.summary) && (
              <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                {result.description || result.summary}
              </p>
            )}
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between mt-2">
            {result._type === 'video' && (
              <div className="flex items-center space-x-3 text-xs text-gray-400">
                <span>{result.views} 观看</span>
                <span>•</span>
                <span>{result.author}</span>
              </div>
            )}
            {result._type === 'news' && (
              <div className="flex items-center space-x-3 text-xs text-gray-400">
                <span>{result.date}</span>
                <span>•</span>
                <span>{result.readTime}</span>
              </div>
            )}
            {result._type === 'event' && (
              <div className="flex items-center text-xs text-gray-400">
                <Calendar size={12} className="mr-1" />
                <span>{result.time}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {result.isFavorited && (
                <Bookmark size={14} className="text-yellow-500 fill-yellow-500" />
              )}
              {result.isLiked && (
                <Heart size={14} className="text-red-500 fill-red-500" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// components/SearchFilter.tsx - 搜索和高级筛选组件
import React, { useState, useEffect } from 'react';
import { Search, X, Filter, Check } from 'lucide-react';
import { supabaseService } from '../services/supabase';

interface SearchFilterProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onClose: () => void;
}

interface SearchFilters {
  categories: string[];
  contentTypes: ('video' | 'news' | 'event')[];
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch, onClose }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    contentTypes: ['video', 'news', 'event']
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const cats = await supabaseService.getCategories();
    setCategories(cats);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query, filters);
    }
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleContentType = (type: 'video' | 'news' | 'event') => {
    setFilters(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(type)
        ? prev.contentTypes.filter(t => t !== type)
        : [...prev.contentTypes, type]
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      contentTypes: ['video', 'news', 'event']
    });
  };

  const activeFilterCount = filters.categories.length + 
    (filters.contentTypes.length < 3 ? 1 : 0);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-700" />
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
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            )}
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`relative p-2 rounded-full transition-colors ${
              showFilters ? 'bg-brand-50 text-brand-600' : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <Filter size={24} />
            {activeFilterCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-brand-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {activeFilterCount}
              </div>
            )}
          </button>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={!query.trim()}
          className="w-full mt-3 bg-brand-600 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-700 transition-colors"
        >
          搜索
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {/* Content Type Filter */}
          <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">内容类型</h3>
              {filters.contentTypes.length < 3 && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, contentTypes: ['video', 'news', 'event'] }))}
                  className="text-xs text-brand-600 font-medium"
                >
                  全选
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'video', label: '视频', icon: '🎥' },
                { value: 'news', label: '文章', icon: '📰' },
                { value: 'event', label: '活动', icon: '🎉' }
              ].map(type => {
                const isSelected = filters.contentTypes.includes(type.value as any);
                return (
                  <button
                    key={type.value}
                    onClick={() => toggleContentType(type.value as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span className="text-sm font-medium">{type.label}</span>
                    {isSelected && <Check size={16} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900">分类筛选</h3>
              {filters.categories.length > 0 && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, categories: [] }))}
                  className="text-xs text-gray-500 font-medium"
                >
                  清除
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => {
                const isSelected = filters.categories.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {category}
                    {isSelected && ' ✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clear All Button */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="w-full mt-4 bg-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-300 transition-colors"
            >
              清除所有筛选
            </button>
          )}
        </div>
      )}

      {/* Recent Searches or Suggestions */}
      {!showFilters && !query && (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">热门搜索</h3>
            <div className="flex flex-wrap gap-2">
              {['康复训练', '肩颈放松', '核心力量', '瑜伽', '拉伸'].map(term => (
                <button
                  key={term}
                  onClick={() => setQuery(term)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">推荐标签</h3>
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 10).map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium hover:border-brand-300 hover:bg-brand-50 transition-colors"
                >
                  #{category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

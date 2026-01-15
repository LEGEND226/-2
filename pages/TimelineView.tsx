import React, { useMemo } from 'react';
import { Moment, UserStats } from '../types';
import { IconSparkles, IconShare, IconPen, IconTrash, IconSunOutline, IconCheck } from '../components/Icons';
import { deleteMoment, updateMoment, getMoments } from '../utils/storage';

interface TimelineViewProps {
  moments: Moment[];
  stats: UserStats;
  onOpenRecord: () => void;
  onRefresh: () => void; // Callback to refresh data in parent
}

export const TimelineView: React.FC<TimelineViewProps> = ({ moments, stats, onOpenRecord, onRefresh }) => {
  
  // Group moments by date
  const groupedMoments = useMemo(() => {
    const groups: Record<string, Moment[]> = {};
    moments.forEach(m => {
      if (!groups[m.dayStr]) {
        groups[m.dayStr] = [];
      }
      groups[m.dayStr].push(m);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  }, [moments]);

  const handleShare = () => {
    alert("已生成回顾海报！(模拟微信分享API调用)");
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('确定要删除这条美好的记录吗？')) {
      deleteMoment(id);
      onRefresh();
    }
  };

  const handleTogglePublic = (moment: Moment, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = !moment.isPublic;
    updateMoment(moment.id, { isPublic: newStatus });
    onRefresh();
  };

  if (moments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center p-8 relative">
        <div className="w-32 h-32 bg-brand-100 rounded-full flex items-center justify-center mb-6 animate-float">
          <IconSparkles size={48} className="text-brand-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-700 mb-2">暂无记录</h3>
        <p className="text-gray-500 mb-8">
          生活不缺少美，<br/>只是缺少发现美的眼睛。<br/>去记录你的第一束微光吧！
        </p>
        
        {/* FAB for Empty State */}
        <button 
          onClick={onOpenRecord}
          className="bg-brand-500 hover:bg-brand-600 text-white rounded-full w-16 h-16 shadow-lg shadow-brand-200 flex items-center justify-center transition-transform active:scale-95 animate-bounce"
        >
          <IconPen size={28} />
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-4 px-4 relative min-h-screen">
      {/* Header Stats Card */}
      <div className="bg-gradient-to-r from-brand-400 to-brand-500 rounded-2xl p-6 text-white shadow-lg mb-8 flex justify-between items-center transform transition-transform hover:scale-[1.01]">
        <div>
          <p className="text-brand-100 text-sm font-medium mb-1">已连续记录</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">{stats.streakDays}</span>
            <span className="text-sm">天</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-brand-100 text-sm font-medium mb-1">美好瞬间</p>
          <div className="flex items-baseline gap-2 justify-end">
            <span className="text-3xl font-bold">{stats.totalMoments}</span>
            <span className="text-sm">个</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6 px-2">
        <h2 className="text-lg font-bold text-gray-800">时光轴</h2>
        <button onClick={handleShare} className="text-brand-600 text-sm font-medium flex items-center gap-1 bg-brand-50 px-3 py-1 rounded-full">
          <IconShare size={14} /> 生成海报
        </button>
      </div>

      {/* Timeline List */}
      <div className="space-y-8">
        {groupedMoments.map(([date, dayMoments]) => (
          <div key={date} className="relative pl-4 border-l-2 border-brand-100">
            {/* Date Header */}
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-brand-400 border-2 border-white shadow-sm"></div>
            <h3 className="text-sm font-bold text-gray-400 mb-4 pl-2">
              {new Date(date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'short' })}
            </h3>
            
            <div className="space-y-4 pl-2">
              {dayMoments.map(moment => (
                <div key={moment.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                  {moment.content && <p className="text-gray-800 leading-relaxed whitespace-pre-wrap mb-2">{moment.content}</p>}
                  
                  {/* Image Grid */}
                  {moment.images && moment.images.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {moment.images.map((img, idx) => (
                        <img key={idx} src={img} alt="moment" className="w-20 h-20 object-cover rounded-lg border border-gray-100" />
                      ))}
                    </div>
                  )}

                  {/* Footer: Tags, Time, Actions */}
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                    <div className="flex gap-2 items-center overflow-x-auto no-scrollbar max-w-[50%]">
                      {moment.tags.map(tag => (
                        <span key={tag} className="text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md whitespace-nowrap">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-3">
                       {/* Sync Toggle */}
                      <button 
                        onClick={(e) => handleTogglePublic(moment, e)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors text-xs font-medium ${
                          moment.isPublic 
                            ? 'bg-orange-50 text-orange-500' 
                            : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        <IconSunOutline size={12} />
                        {moment.isPublic ? '已同步' : '同步'}
                      </button>

                      {/* Delete Action */}
                      <button 
                        onClick={(e) => handleDelete(moment.id, e)}
                        className="text-gray-300 hover:text-red-400 p-1 transition-colors"
                      >
                        <IconTrash size={14} />
                      </button>

                      <span className="text-xs text-gray-300">
                        {new Date(moment.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button (FAB) */}
      <button 
        onClick={onOpenRecord}
        className="fixed bottom-24 right-6 bg-brand-500 hover:bg-brand-600 text-white rounded-full w-14 h-14 shadow-xl shadow-brand-200 flex items-center justify-center transition-all active:scale-95 z-40 group"
      >
        <IconPen size={24} className="group-hover:rotate-12 transition-transform" />
      </button>
    </div>
  );
};
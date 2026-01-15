import React, { useState, useEffect, useRef } from 'react';
import { PRESET_TAGS } from '../types';
import { IconClose, IconSparkles, IconSunOutline, IconImage, IconTrash } from '../components/Icons';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string, tags: string[], isPublic: boolean, images: string[]) => void;
  initialContent?: string;
}

export const RecordModal: React.FC<RecordModalProps> = ({ isOpen, onClose, onSave, initialContent = '' }) => {
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);
  const [images, setImages] = useState<string[]>([]); // Stores Data URLs
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setContent(initialContent);
    }
  }, [isOpen, initialContent]);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Simulate wx.chooseMedia
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (images.length + e.target.files.length > 3) {
        alert("最多只能上传 3 张图片哦");
        return;
      }

      Array.from(e.target.files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!content.trim() && images.length === 0) return;
    onSave(content, selectedTags, isPublic, images);
    // Reset state
    setContent('');
    setSelectedTags([]);
    setIsPublic(false);
    setImages([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-[slideUp_0.3s_ease-out] max-h-[90vh] overflow-y-auto">
        <style>{`
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        `}</style>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <IconSparkles className="text-brand-500" />
            记录今日微光
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
            <IconClose />
          </button>
        </div>

        <textarea
          className="w-full h-32 p-4 bg-brand-50 rounded-xl border-none focus:ring-2 focus:ring-brand-300 resize-none text-gray-700 placeholder-gray-400 text-lg mb-4"
          placeholder="今天发生了什么美好的事情？"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          autoFocus
        />

        {/* Image Preview Area */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative w-20 h-20 flex-shrink-0">
              <img src={img} alt="preview" className="w-full h-full object-cover rounded-lg border border-gray-200" />
              <button 
                onClick={() => removeImage(idx)}
                className="absolute -top-1 -right-1 bg-gray-800 text-white rounded-full p-0.5 shadow-md"
              >
                <IconClose />
              </button>
            </div>
          ))}
          
          {images.length < 3 && (
            <>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                multiple 
                onChange={handleImageSelect}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-brand-400 hover:text-brand-500 transition-colors bg-gray-50"
              >
                <IconImage />
                <span className="text-[10px] mt-1">添加图片</span>
              </button>
            </>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">标签</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-brand-400 text-white shadow-md transform scale-105'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button 
              onClick={() => setIsPublic(!isPublic)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                isPublic 
                  ? 'bg-orange-50 border-orange-200 text-orange-600' 
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
            >
              <IconSunOutline />
              <span className="text-sm font-medium">
                {isPublic ? '已同步到温暖星球' : '私密记录'}
              </span>
              <div className={`w-4 h-4 rounded-full border ml-1 flex items-center justify-center ${
                isPublic ? 'bg-orange-500 border-orange-500' : 'border-gray-300'
              }`}>
                {isPublic && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
            </button>
            <span className="text-xs text-gray-400">
              {isPublic ? '匿名展示，传递温暖' : '仅自己可见'}
            </span>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={!content.trim() && images.length === 0}
          className="w-full mt-8 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transform transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          保存美好
        </button>
      </div>
    </div>
  );
};
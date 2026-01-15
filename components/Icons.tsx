import React from 'react';
import { Plus, Calendar, User, Heart, Share2, Sparkles, X, Globe, Sun, RefreshCw, Send, Image as ImageIcon, Settings, Trash2, Camera, ChevronRight, LogOut, Shield, PenTool, Check } from 'lucide-react';

interface IconProps {
  size?: number;
  className?: string;
  fill?: string;
}

export const IconPlus = ({ size = 24, className }: IconProps) => <Plus size={size} className={className} />;
export const IconCalendar = ({ size = 24, className }: IconProps) => <Calendar size={size} className={className} />;
export const IconUser = ({ size = 24, className }: IconProps) => <User size={size} className={className} />;
export const IconHeart = ({ size = 20, className = "text-red-400", fill = "currentColor" }: IconProps) => <Heart size={size} className={className} fill={fill} />;
export const IconShare = ({ size = 20, className }: IconProps) => <Share2 size={size} className={className} />;
export const IconSparkles = ({ size = 20, className }: IconProps) => <Sparkles size={size} className={className} />;
export const IconClose = ({ size = 24, className }: IconProps) => <X size={size} className={className} />;
export const IconPlanet = ({ size = 24, className }: IconProps) => <Globe size={size} className={className} />;
export const IconSun = ({ filled, size = 18, className }: { filled?: boolean } & IconProps) => (
  <Sun size={size} className={`${filled ? "text-brand-500 fill-brand-500" : "text-gray-400"} ${className || ''}`} />
);
export const IconSunOutline = ({ size = 24, className }: IconProps) => <Sun size={size} className={className} />;
export const IconRefresh = ({ size = 14, className }: IconProps) => <RefreshCw size={size} className={className} />;
export const IconSend = ({ size = 16, className }: IconProps) => <Send size={size} className={className} />;
export const IconImage = ({ size = 20, className }: IconProps) => <ImageIcon size={size} className={className} />;
export const IconCamera = ({ size = 20, className }: IconProps) => <Camera size={size} className={className} />;
export const IconSettings = ({ size = 20, className }: IconProps) => <Settings size={size} className={className} />;
export const IconTrash = ({ size = 16, className }: IconProps) => <Trash2 size={size} className={className} />;
export const IconChevronRight = ({ size = 20, className }: IconProps) => <ChevronRight size={size} className={className} />;
export const IconLogOut = ({ size = 20, className }: IconProps) => <LogOut size={size} className={className} />;
export const IconShield = ({ size = 20, className }: IconProps) => <Shield size={size} className={className} />;
export const IconPen = ({ size = 24, className }: IconProps) => <PenTool size={size} className={className} />;
export const IconCheck = ({ size = 20, className }: IconProps) => <Check size={size} className={className} />;
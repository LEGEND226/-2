import React, { useState, useEffect, useCallback } from 'react';
import { Tab, Moment } from './types';
import { getMoments, getStats, saveMoment } from './utils/storage';
import { TabBar } from './components/TabBar';
import { RecordModal } from './pages/RecordModal';
import { TimelineView } from './pages/TimelineView';
import { HomeView } from './pages/HomeView';
import { PlanetView } from './pages/PlanetView';
import { ProfileView } from './pages/ProfileView'; // Import
import { Celebration } from './components/Celebration';

// Layout container to simulate mobile screen
const MobileContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-gray-50 flex justify-center">
    <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col overflow-hidden">
      {children}
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.RECORD);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordInitialText, setRecordInitialText] = useState('');
  
  const [moments, setMoments] = useState<Moment[]>([]);
  const [stats, setStats] = useState(getStats());
  const [showCelebration, setShowCelebration] = useState(false);

  // Initial Data Load
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = useCallback(() => {
    setMoments(getMoments());
    setStats(getStats());
  }, []);

  const openRecordModal = (initialText: string = '') => {
    setRecordInitialText(initialText);
    setIsRecordModalOpen(true);
  };

  const handleSaveMoment = (content: string, tags: string[], isPublic: boolean, images: string[]) => {
    const newMoment: Moment = {
      id: Date.now().toString(),
      content,
      tags,
      images, // Save images
      createdAt: Date.now(),
      dayStr: new Date().toISOString().split('T')[0],
      isPublic,
      authorAlias: '我', 
      sunshineCount: 0
    };

    saveMoment(newMoment);
    refreshData();
    
    setIsRecordModalOpen(false);
    setShowCelebration(true);
    
    setTimeout(() => {
      setActiveTab(Tab.TIMELINE);
    }, 2000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.RECORD:
        return <HomeView onOpenRecord={openRecordModal} streak={stats.streakDays} />;
      case Tab.TIMELINE:
        return <TimelineView moments={moments} stats={stats} onOpenRecord={() => openRecordModal()} onRefresh={refreshData} />;
      case Tab.PLANET:
        return <PlanetView />;
      case Tab.PROFILE:
        return <ProfileView onRefreshNeeded={refreshData} />;
      default:
        return null;
    }
  };

  return (
    <MobileContainer>
      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto no-scrollbar scroll-smooth h-full">
        {renderContent()}
      </main>

      {/* Overlays */}
      {showCelebration && (
        <Celebration onComplete={() => setShowCelebration(false)} />
      )}
      
      <RecordModal 
        isOpen={isRecordModalOpen} 
        onClose={() => setIsRecordModalOpen(false)}
        onSave={handleSaveMoment}
        initialContent={recordInitialText}
      />

      {/* Navigation - Note: onQuickAdd removed from here since it's on Timeline now */}
      <TabBar 
        currentTab={activeTab} 
        onTabChange={setActiveTab}
      />
    </MobileContainer>
  );
}
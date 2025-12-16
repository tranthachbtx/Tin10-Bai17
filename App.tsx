import React, { useState, useMemo } from 'react';
import { ViewState, Theme, UserProgress, DesktopViewMode, MobileTab } from './types';
import { Layout } from './components/Layout';
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';
import { IDE } from './components/IDE';
import { PYTHON_COURSE } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [theme, setTheme] = useState<Theme>('neon');
  
  // --- Lifted IDE States for Layout Header Control ---
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [desktopViewMode, setDesktopViewMode] = useState<DesktopViewMode>('split');
  const [mobileTab, setMobileTab] = useState<MobileTab>('theory'); // New lifted state
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  const currentLessonTitle = useMemo(() => 
    PYTHON_COURSE.segments[currentStepIndex]?.title || "Bài học", 
  [currentStepIndex]);

  // Lifted Guide State
  const [showGuide, setShowGuide] = useState(() => {
    try {
        const hasSeen = localStorage.getItem('hasSeenGuide_v5');
        return !hasSeen;
    } catch {
        return false;
    }
  });

  const handleCloseGuide = () => {
    setShowGuide(false);
    localStorage.setItem('hasSeenGuide_v5', 'true');
  };

  const [userProgress, setUserProgress] = useState<UserProgress>({
    xp: 0,
    level: 1,
    streak: 0,
    currentLessonId: 'seg-1',
    badges: [],
    completedSegments: []
  });

  const handleCompleteSegment = (id: string, xpReward: number) => {
    if (userProgress.completedSegments.includes(id)) return;

    setUserProgress(prev => {
        const newXP = prev.xp + xpReward;
        const newCompleted = [...prev.completedSegments, id];
        const newBadges = [...prev.badges];

        if (newCompleted.length === 1 && !newBadges.includes('first_steps')) {
            newBadges.push('first_steps');
        }
        if (newCompleted.length >= 6 && !newBadges.includes('python_pioneer')) {
            newBadges.push('python_pioneer');
        }
        
        return {
            ...prev,
            xp: newXP,
            completedSegments: newCompleted,
            badges: newBadges,
            level: Math.floor(newXP / 100) + 1
        };
    });
  };

  return (
    <Layout 
      view={view} 
      setView={setView} 
      currentTheme={theme} 
      setTheme={setTheme}
      onShowGuide={() => setShowGuide(true)}
      // IDE Props passed to Layout for Header
      currentLessonTitle={currentLessonTitle}
      desktopViewMode={desktopViewMode}
      setDesktopViewMode={setDesktopViewMode}
      mobileTab={mobileTab}
      setMobileTab={setMobileTab}
      isNavOpen={isNavOpen}
      setIsNavOpen={setIsNavOpen}
    >
      {view === ViewState.LANDING && (
        <Landing onStart={() => setView(ViewState.DASHBOARD)} />
      )}
      {view === ViewState.DASHBOARD && (
        <Dashboard 
            onContinue={() => setView(ViewState.IDE)} 
            userProgress={userProgress}
        />
      )}
      {view === ViewState.IDE && (
        <IDE 
            onCompleteSegment={handleCompleteSegment} 
            onExit={() => setView(ViewState.DASHBOARD)}
            showGuide={showGuide}
            onCloseGuide={handleCloseGuide}
            // Controlled Props
            currentStepIndex={currentStepIndex}
            setCurrentStepIndex={setCurrentStepIndex}
            desktopViewMode={desktopViewMode}
            mobileTab={mobileTab}
            isNavOpen={isNavOpen}
            setIsNavOpen={setIsNavOpen}
        />
      )}
    </Layout>
  );
};

export default App;
import React, { useState, useMemo } from 'react';
import { ViewState, Theme, UserProgress } from './types';
import { Layout } from './components/Layout';
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';
import { IDE } from './components/IDE';
import { PYTHON_COURSE } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LANDING);
  const [theme, setTheme] = useState<Theme>('pastel');
  
  // --- Lifted IDE States for Layout Header Control ---
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  const currentLesson = useMemo(() => PYTHON_COURSE.segments[currentStepIndex], [currentStepIndex]);
  const currentLessonTitle = currentLesson?.title || "Bài học";
  
  // Generate Trinket URL for the Header Button
  const currentTrinketUrl = useMemo(() => 
    `https://trinket.io/python3/${currentLesson?.trinketId || 'a24811fa054e'}`, 
  [currentLesson]);

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
      // IDE Props passed to Layout for Header
      currentLessonTitle={currentLessonTitle}
      trinketUrl={currentTrinketUrl}
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
            // Controlled Props
            currentStepIndex={currentStepIndex}
            setCurrentStepIndex={setCurrentStepIndex}
            isNavOpen={isNavOpen}
            setIsNavOpen={setIsNavOpen}
        />
      )}
    </Layout>
  );
};

export default App;
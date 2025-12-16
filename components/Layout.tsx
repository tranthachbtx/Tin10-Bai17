import React, { useEffect, useState, useRef } from 'react';
import { ViewState, Theme, DesktopViewMode, MobileTab } from '../types';
import { Sun, Moon, HelpCircle, List, BookOpen, Columns, Code as CodeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  view: ViewState;
  setView: (v: ViewState) => void;
  currentTheme: Theme;
  setTheme: (t: Theme) => void;
  onShowGuide: () => void;
  
  // New props for IDE Header Controls
  currentLessonTitle?: string;
  desktopViewMode?: DesktopViewMode;
  setDesktopViewMode?: (mode: DesktopViewMode) => void;
  mobileTab?: MobileTab;
  setMobileTab?: (tab: MobileTab) => void;
  isNavOpen?: boolean;
  setIsNavOpen?: (open: boolean) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, view, setView, currentTheme, setTheme, onShowGuide,
  currentLessonTitle, desktopViewMode, setDesktopViewMode, mobileTab, setMobileTab, setIsNavOpen 
}) => {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastY = useRef(0);

  // Auto-Hiding Navbar Logic (Mobile Touch & Desktop Wheel)
  useEffect(() => {
    const handleScrollIntent = (currentY: number) => {
      const diff = currentY - lastY.current;
      
      // Finger moves UP (diff < 0) -> Scrolling DOWN -> HIDE Navbar
      if (diff < -10 && isNavVisible) setIsNavVisible(false);
      
      // Finger moves DOWN (diff > 0) -> Scrolling UP -> SHOW Navbar
      else if (diff > 10 && !isNavVisible) setIsNavVisible(true);
      
      lastY.current = currentY;
    };

    const handleTouchMove = (e: TouchEvent) => handleScrollIntent(e.touches[0].clientY);
    
    // Desktop Wheel Logic
    const handleWheel = (e: WheelEvent) => {
      // DeltaY > 0 is scrolling down -> Hide
      if (e.deltaY > 0 && isNavVisible) setIsNavVisible(false); 
      // DeltaY < 0 is scrolling up -> Show
      if (e.deltaY < 0 && !isNavVisible) setIsNavVisible(true);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isNavVisible]);

  // Apply Theme Variables
  useEffect(() => {
    const root = document.documentElement;
    if (currentTheme === 'neon') {
      document.body.classList.add('dark');
      root.style.setProperty('--bg-main', '#212121');
      root.style.setProperty('--color-panel', 'rgba(35, 35, 35, 0.8)');
      root.style.setProperty('--color-primary', '#8B80F9');
      root.style.setProperty('--color-accent', '#00E676');
      root.style.setProperty('--color-danger', '#FF5252');
      root.style.setProperty('--color-info', '#40C4FF');
      root.style.setProperty('--text-primary', '#E0E0E0');
      root.style.setProperty('--text-secondary', '#9E9E9E');
      root.style.setProperty('--shadow-out', '5px 5px 10px #1a1a1a, -5px -5px 10px #282828');
      root.style.setProperty('--shadow-in', 'inset 5px 5px 10px #1a1a1a, inset -5px -5px 10px #282828');
      root.style.setProperty('--bg-mesh', 'radial-gradient(circle at 50% 50%, #2a2a2a 0%, #212121 100%)');
    } else {
      document.body.classList.remove('dark');
      root.style.setProperty('--bg-main', '#F0F4F8'); 
      root.style.setProperty('--color-panel', 'rgba(255, 255, 255, 0.7)');
      root.style.setProperty('--color-primary', '#6C63FF');
      root.style.setProperty('--color-accent', '#00C853');
      root.style.setProperty('--color-danger', '#FF1744');
      root.style.setProperty('--color-info', '#00B0FF');
      root.style.setProperty('--text-primary', '#2D3748');
      root.style.setProperty('--text-secondary', '#718096');
      root.style.setProperty('--shadow-out', '9px 9px 16px rgb(163,177,198,0.5), -9px -9px 16px rgba(255,255,255, 0.6)');
      root.style.setProperty('--shadow-in', 'inset 6px 6px 10px 0 rgba(163,177,198, 0.6), inset -6px -6px 10px 0 rgba(255,255,255, 0.7)');
      root.style.setProperty('--bg-mesh', 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)');
    }
  }, [currentTheme]);

  const toggleTheme = () => setTheme(currentTheme === 'neon' ? 'pastel' : 'neon');

  return (
    <div className="min-h-screen relative font-soft text-text-primary transition-colors duration-300" style={{ background: 'var(--bg-main)' }}>
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay"></div>

      {/* Navbar */}
      <motion.nav 
        initial={{ y: 0 }}
        animate={{ y: isNavVisible ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        className="fixed top-0 w-full z-50 px-4 py-2 flex justify-between items-center glass-panel shadow-neu-out rounded-b-3xl mx-auto max-w-7xl left-0 right-0 border-b border-white/20"
      >
        {/* Left: Logo or Lesson Controls */}
        <div className="flex items-center gap-3 truncate max-w-[60%]">
          {view === ViewState.IDE ? (
            // IDE MODE: Show Lesson Controls + Title
            <>
               <button 
                  onClick={() => setIsNavOpen && setIsNavOpen(true)} 
                  className="neu-btn p-2 rounded-xl text-text-secondary hover:text-electric-indigo active:neu-inset transition-all shrink-0"
                  title="Mục lục"
               >
                  <List size={20} />
               </button>
               <span className="text-electric-indigo font-soft text-lg font-bold truncate border-l border-text-secondary/20 pl-3">
                  {currentLessonTitle}
               </span>
            </>
          ) : (
            // NORMAL MODE: Show School Name
            <div 
              className="font-display font-bold tracking-tight cursor-pointer text-electric-indigo truncate text-lg"
              onClick={() => setView(ViewState.LANDING)}
            >
              THTP BÙI THỊ XUÂN
            </div>
          )}
        </div>
        
        {/* Right: Controls */}
        <div className="flex gap-2 items-center shrink-0">
          
          {/* View Mode Switcher (Only in IDE) */}
          {view === ViewState.IDE && (
            <>
                {/* Desktop Switcher */}
                {setDesktopViewMode && (
                  <div className="hidden md:flex gap-2 mr-2">
                    <button 
                        onClick={() => setDesktopViewMode('theory')} 
                        className={`p-2 rounded-xl transition-all ${desktopViewMode === 'theory' ? 'neu-inset text-electric-indigo shadow-inner' : 'neu-btn text-text-secondary'}`}
                        title="Chỉ đọc"
                    >
                        <BookOpen size={18} />
                    </button>
                    <button 
                        onClick={() => setDesktopViewMode('split')} 
                        className={`p-2 rounded-xl transition-all ${desktopViewMode === 'split' ? 'neu-inset text-electric-indigo shadow-inner' : 'neu-btn text-text-secondary'}`}
                        title="Song song"
                    >
                        <Columns size={18} />
                    </button>
                  </div>
                )}

                {/* Mobile Tab Switcher (Replaces Guide on Mobile) */}
                {setMobileTab && (
                    <button 
                        onClick={() => setMobileTab(mobileTab === 'theory' ? 'code' : 'theory')} 
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-electric-indigo neu-btn active:neu-inset transition-colors active:scale-95 border border-electric-indigo/20"
                        title="Chuyển đổi Bài/Code"
                    >
                        {mobileTab === 'theory' ? <CodeIcon size={20} className="text-text-secondary" /> : <BookOpen size={20} className="text-electric-indigo" />}
                    </button>
                )}
            </>
          )}

          {/* Guide Button (Hidden on Mobile in IDE to save space for toggle, visible on Desktop) */}
          <button
            onClick={onShowGuide}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-text-secondary hover:text-electric-indigo neu-btn active:neu-inset transition-colors active:scale-95 ${view === ViewState.IDE ? 'hidden md:flex' : 'flex'}`}
            title="Hướng dẫn"
          >
            <HelpCircle size={20} />
          </button>
          
          <button 
            onClick={toggleTheme}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all neu-btn active:neu-inset active:scale-95 ${currentTheme === 'neon' ? 'text-yellow-400' : 'text-electric-indigo'}`}
          >
            {currentTheme === 'neon' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </motion.nav>

      <main className="pt-[64px] min-h-screen">
        {children}
      </main>
    </div>
  );
};
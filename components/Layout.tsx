import React, { useEffect, useState, useRef } from 'react';
import { ViewState, Theme } from '../types';
import { Sun, Moon, List, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  view: ViewState;
  setView: (v: ViewState) => void;
  currentTheme: Theme;
  setTheme: (t: Theme) => void;
  
  // New props for IDE Header Controls
  currentLessonTitle?: string;
  trinketUrl?: string;
  isNavOpen?: boolean;
  setIsNavOpen?: (open: boolean) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, view, setView, currentTheme, setTheme,
  currentLessonTitle, trinketUrl, setIsNavOpen 
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

    // Only add listeners if content is scrollable (not applicable in fixed IDE layout, but good for Dashboard)
    // For fixed layout, we rely on inner scroll, so global listeners might need tweaking.
    // However, keeping them simply doesn't hurt.
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
    // FIXED: h-screen and overflow-hidden ensures the body never scrolls, only inner content
    <div className="h-screen w-screen overflow-hidden relative font-soft text-text-primary transition-colors duration-300 flex flex-col" style={{ background: 'var(--bg-main)' }}>
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay"></div>

      {/* Navbar */}
      <motion.nav 
        initial={{ y: 0 }}
        animate={{ y: isNavVisible ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 25 }}
        className="fixed top-0 w-full z-50 px-4 py-2 flex justify-between items-center glass-panel shadow-neu-out rounded-b-3xl mx-auto max-w-7xl left-0 right-0 border-b border-white/20 h-[64px]"
      >
        {/* Left: Logo or Lesson Controls */}
        <div className="flex items-center gap-3 truncate max-w-[50%] md:max-w-[40%]">
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
        
        {/* Right: Controls & Actions */}
        <div className="flex gap-2 items-center shrink-0">
          
          {/* TRINKET BUTTON - Only in IDE Mode */}
          {view === ViewState.IDE && trinketUrl && (
            <motion.a 
                href={trinketUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ scale: 0.9 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                whileHover={{ scale: 1.1, backgroundColor: 'var(--color-accent)', color: '#fff' }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:flex neu-btn px-4 py-2 rounded-xl text-white font-bold text-sm items-center gap-2 shadow-glow bg-electric-indigo border border-white/20"
            >
                <ExternalLink size={16} />
                <span>Thực hành (Trinket)</span>
            </motion.a>
          )}

          {/* Mobile Icon Only Trinket Button */}
          {view === ViewState.IDE && trinketUrl && (
            <motion.a 
                href={trinketUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={{ scale: 0.9 }}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-electric-indigo text-white shadow-glow border border-white/20"
            >
                <ExternalLink size={20} />
            </motion.a>
          )}

          <button 
            onClick={toggleTheme}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all neu-btn active:neu-inset active:scale-95 ${currentTheme === 'neon' ? 'text-yellow-400' : 'text-electric-indigo'}`}
          >
            {currentTheme === 'neon' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Main Content Area */}
      {/* pt-[64px] accounts for fixed navbar. overflow-hidden prevents body scroll. h-full fills screen. */}
      <main className="pt-[64px] h-full w-full flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
};
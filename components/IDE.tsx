import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MessageCircle, CheckCircle, ChevronRight, ChevronLeft, Send, X, Lightbulb, Terminal, Loader2, BookOpen, Code as CodeIcon, Eye, EyeOff, LayoutTemplate, Columns, AlertCircle, Check, Info, MousePointerClick, Sparkles, Rocket, Play, List, Map, Heart, Star, Cloud } from 'lucide-react';
import { PYTHON_COURSE } from '../constants';
import { createAiMentor } from '../services/gemini';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Chat, GenerateContentResponse } from "@google/genai";
import { DesktopViewMode, MobileTab } from '../types';

interface IDEProps {
  onCompleteSegment: (id: string, xp: number) => void;
  onExit: () => void;
  showGuide: boolean;
  onCloseGuide: () => void;
  
  // Controlled Props from App
  currentStepIndex: number;
  setCurrentStepIndex: React.Dispatch<React.SetStateAction<number>>;
  desktopViewMode: DesktopViewMode;
  mobileTab: MobileTab;
  setMobileTab?: (tab: MobileTab) => void;
  isNavOpen: boolean;
  setIsNavOpen: (open: boolean) => void;
}

// Cute Compact Guide
const LearningGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const slides = [
    { 
      title: "Lớp Tương Lai", 
      icon: <Rocket size={48} className="text-electric-indigo drop-shadow-md" />, 
      content: "Chào mừng đến với Cyber-IDE! 🚀" 
    },
    { 
      title: "Giao diện", 
      icon: <LayoutTemplate size={48} className="text-cyber-cyan drop-shadow-md" />, 
      content: "📱 Mobile: Dùng nút trên thanh tiêu đề để đổi Bài/Code.\n💻 Desktop: Tỷ lệ 70% Bài - 30% Code." 
    },
    { 
      title: "Thực hành", 
      icon: <Terminal size={48} className="text-neon-serpent drop-shadow-md" />, 
      content: "Gõ code -> Run ▶ -> Hoàn thành ✅" 
    },
    { 
      title: "Trợ lý AI", 
      icon: <Sparkles size={48} className="text-hot-coral drop-shadow-md" />, 
      content: "Bí bài? Hỏi thầy Trần Thạch AI ở góc dưới nhé! 🤖" 
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div 
        key={slideIndex} 
        initial={{ scale: 0.8, opacity: 0, y: 30 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="glass-panel shadow-neu-out rounded-[32px] p-6 w-full max-w-[300px] relative flex flex-col items-center bg-bg-main border-4 border-white/40"
      >
        <button onClick={onClose} className="absolute top-3 right-3 p-2 rounded-full text-text-secondary hover:text-danger hover:bg-black/5 transition-colors z-10">
            <X size={20} />
        </button>
        
        <div className="flex-1 flex flex-col items-center justify-center w-full text-center mt-2">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
              className="mb-4 neu-inset p-5 rounded-full bg-bg-main relative group"
            >
               {slides[slideIndex].icon}
            </motion.div>
            
            <h2 className="text-xl font-soft font-bold text-electric-indigo mb-2">
                {slides[slideIndex].title}
            </h2>
            <p className="text-sm text-text-primary whitespace-pre-line leading-relaxed font-medium px-1">
                {slides[slideIndex].content}
            </p>
        </div>

        <div className="w-full flex items-center justify-between mt-6 pt-4 border-t border-text-secondary/10">
            <div className="flex gap-1.5">
                {slides.map((_, idx) => (
                    <motion.div 
                        key={idx} 
                        animate={{ width: idx === slideIndex ? 24 : 8, backgroundColor: idx === slideIndex ? 'var(--color-primary)' : 'var(--text-secondary)' }}
                        className={`h-2 rounded-full transition-colors opacity-50`} 
                    />
                ))}
            </div>
            <button 
                onClick={() => slideIndex < slides.length - 1 ? setSlideIndex(p => p + 1) : onClose()} 
                className="neu-btn px-5 py-2 rounded-xl text-sm font-bold bg-electric-indigo text-white shadow-glow active:scale-95 transition-all flex items-center gap-1.5"
            >
                {slideIndex < slides.length - 1 ? 'Tiếp' : 'Bắt đầu'}
            </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const IDE: React.FC<IDEProps> = ({ 
    onCompleteSegment, onExit, showGuide, onCloseGuide, 
    currentStepIndex, setCurrentStepIndex, desktopViewMode, mobileTab, setMobileTab, isNavOpen, setIsNavOpen 
}) => {
  const currentLesson = useMemo(() => PYTHON_COURSE.segments[currentStepIndex], [currentStepIndex]);
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [shouldLoadIframe, setShouldLoadIframe] = useState(false);
  const [showCodeSuggestion, setShowCodeSuggestion] = useState(false);
  const [quizState, setQuizState] = useState<{ [key: string]: string }>({});
  const [quizResults, setQuizResults] = useState<{ [key: string]: boolean }>({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'model', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  const chatSession = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const theoryScrollRef = useRef<HTMLDivElement>(null);

  // Lazy Loading Logic
  useEffect(() => {
    if (shouldLoadIframe) return;
    const checkVisibility = () => {
       const isDesktop = window.matchMedia('(min-width: 768px)').matches;
       // Load if in split mode (default) or mobile code tab
       if ((isDesktop && desktopViewMode !== 'theory') || (!isDesktop && mobileTab === 'code')) {
           setShouldLoadIframe(true);
           return true;
       }
       return false;
    };
    if (checkVisibility()) return;
    const win = window as any;
    const idleId = win.requestIdleCallback ? win.requestIdleCallback(() => setShouldLoadIframe(true), { timeout: 5000 }) : setTimeout(() => setShouldLoadIframe(true), 3000);
    const resizeListener = () => checkVisibility();
    window.addEventListener('resize', resizeListener);
    return () => { window.removeEventListener('resize', resizeListener); if (win.cancelIdleCallback) win.cancelIdleCallback(idleId); else clearTimeout(idleId); };
  }, [desktopViewMode, mobileTab, shouldLoadIframe]);

  useEffect(() => {
    setShowConfetti(false); setShowHint(false); setShowCodeSuggestion(false); setQuizState({}); setQuizResults({});
    if (theoryScrollRef.current) {
        theoryScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    chatSession.current = createAiMentor(currentLesson.content);
    setChatMessages([{role: 'model', text: `Chào em! Thầy là trợ lý AI ảo. Bài học hiện tại là "${currentLesson.title}".`}]);
  }, [currentLesson]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages, isChatOpen]);

  const handleManualCompletion = () => {
    setShowConfetti(true);
    onCompleteSegment(currentLesson.id, currentLesson.xpReward);
    if (currentStepIndex < PYTHON_COURSE.segments.length - 1) setTimeout(() => { setCurrentStepIndex(p => p + 1); setShowConfetti(false); }, 2000);
    else setTimeout(onExit, 2500);
  };

  const handleQuizSelect = (qId: string, oId: string, isCorrect: boolean) => {
    setQuizState(p => ({ ...p, [qId]: oId }));
    setQuizResults(p => ({ ...p, [qId]: isCorrect }));
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !chatSession.current) return;
    const userMsg = chatInput;
    setChatMessages(p => [...p, {role: 'user', text: userMsg}]);
    setChatInput(''); setIsAiLoading(true);
    try {
        const response = await chatSession.current.sendMessage({ message: userMsg });
        setChatMessages(p => [...p, {role: 'model', text: response.text || "..."}]);
    } catch { setChatMessages(p => [...p, {role: 'model', text: "Lỗi kết nối AI."}]); } 
    finally { setIsAiLoading(false); }
  };

  // 1.2em font size for mobile readability in trinket
  const trinketUrl = useMemo(() => `https://trinket.io/embed/python3/${currentLesson.trinketId || 'a24811fa054e'}?font=1.2em`, [currentLesson]);

  // Updated typoClass with optimized colors for dark mode neon/glass
  const typoClass = `
    prose max-w-none mx-auto font-soft
    text-text-primary dark:text-gray-200
    prose-headings:font-display prose-headings:font-bold prose-headings:text-electric-indigo
    prose-h3:text-xl md:prose-h3:text-4xl prose-h3:mb-6 prose-h3:leading-tight prose-h3:bg-gradient-to-r prose-h3:from-electric-indigo prose-h3:to-cyber-cyan prose-h3:bg-clip-text prose-h3:text-transparent
    prose-p:text-[18px] md:prose-p:text-[28px] prose-p:leading-normal prose-p:mb-8 prose-p:text-text-primary dark:prose-p:text-white/90
    prose-li:text-[18px] md:prose-li:text-[28px] prose-li:marker:text-neon-serpent prose-li:mb-4 prose-li:leading-normal prose-li:text-text-primary dark:prose-li:text-white/90
    prose-code:text-[16px] md:prose-code:text-[24px] prose-code:font-mono prose-code:text-hot-coral prose-code:bg-white/10 dark:prose-code:bg-black/20 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-lg prose-code:border prose-code:border-white/5
    prose-strong:font-bold prose-strong:text-electric-indigo
  `;

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] md:h-[calc(100vh-64px)] bg-bg-main text-text-primary overflow-hidden transition-colors duration-300 relative select-none md:select-auto font-soft">
      <AnimatePresence>{showGuide && <LearningGuide onClose={onCloseGuide} />}</AnimatePresence>

      <AnimatePresence>
        {isNavOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex justify-start" onClick={() => setIsNavOpen(false)}>
             <motion.div 
               initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
               onClick={(e) => e.stopPropagation()}
               className="w-[80%] max-w-[300px] h-full bg-bg-main glass-panel border-r border-white/10 shadow-2xl flex flex-col rounded-r-[32px]"
             >
                <div className="p-5 border-b border-text-secondary/10 flex justify-between items-center">
                    <h3 className="font-soft font-bold text-electric-indigo flex items-center gap-2 text-lg"><Map size={20}/> Mục lục</h3>
                    <button onClick={() => setIsNavOpen(false)} className="neu-btn p-2 text-text-secondary active:neu-inset rounded-full"><X size={18}/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar bg-bg-main/50">
                    {PYTHON_COURSE.segments.map((seg, idx) => (
                        <button 
                          key={seg.id} 
                          onClick={() => { setCurrentStepIndex(idx); setIsNavOpen(false); }}
                          className={`w-full text-left p-3 rounded-2xl transition-all flex items-center gap-3 text-sm font-medium
                            ${idx === currentStepIndex 
                                ? 'neu-inset text-electric-indigo border border-electric-indigo/20 font-bold bg-bg-main shadow-inner' 
                                : 'neu-btn text-text-secondary hover:text-text-primary bg-bg-main active:scale-98'
                            }`}
                        >
                            <span className={`shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-bold ${idx === currentStepIndex ? 'bg-electric-indigo text-white' : 'bg-text-secondary/10'}`}>{idx + 1}</span>
                            <span className="truncate">{seg.title}</span>
                        </button>
                    ))}
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theory Column - 70% Width on Desktop */}
      <div className={`flex-col z-20 h-full transition-all duration-300 
          ${mobileTab === 'theory' ? 'flex w-full pt-[0px] md:pt-0' : 'hidden'} 
          ${desktopViewMode === 'theory' ? 'md:flex md:w-full md:justify-center' : 'md:flex md:w-[70%]'} 
          bg-bg-main`}
          onTouchStart={(e) => {
              // Simple Swipe Logic (Left to go Code)
              const touch = e.targetTouches[0];
              const startX = touch.clientX;
              const handleTouchEnd = (e2: TouchEvent) => {
                  const endX = e2.changedTouches[0].clientX;
                  if (startX - endX > 50 && setMobileTab) {
                       setMobileTab('code'); // Swipe Left
                  }
                  window.removeEventListener('touchend', handleTouchEnd);
              };
              window.addEventListener('touchend', handleTouchEnd);
          }}
      >
        <div 
            ref={theoryScrollRef} 
            className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar pb-32 md:pb-8"
        >
           <div className={`glass-panel p-5 md:p-8 rounded-[28px] md:shadow-neu-out border-none md:border-solid border-white/20 ${desktopViewMode === 'theory' ? 'max-w-4xl mx-auto' : ''}`}>
               {/* Mobile Title REMOVED to fix layout issue */}
               
               {/* Content */}
               <div className={typoClass} dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
               
               {/* Quiz */}
               {currentLesson.type === 'quiz' && currentLesson.quizData && (
                 <div className="mt-8 space-y-6 md:space-y-10">
                   <LayoutGroup>
                   {currentLesson.quizData.map((q, idx) => (
                     <motion.div 
                        layout 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        key={q.id} 
                        className="neu-out p-6 md:p-8 rounded-[32px] bg-bg-main/60 border border-white/20 relative overflow-hidden dark:bg-black/30"
                     >
                       <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <Cloud size={100} className="text-electric-indigo" />
                       </div>
                       
                       <h4 className="font-bold text-text-primary dark:text-white mb-6 text-lg md:text-[26px] leading-relaxed relative z-10">
                           <span className="text-electric-indigo bg-electric-indigo/10 px-3 py-1 rounded-xl mr-3 border border-electric-indigo/20">Câu {idx + 1}</span> 
                           {q.question}
                       </h4>
                       
                       <div className="space-y-4 relative z-10">
                         {q.options.map(opt => {
                           const isSel = quizState[q.id] === opt.id;
                           const isAns = !!quizState[q.id];
                           
                           return (
                             <motion.button 
                                layout
                                key={opt.id} 
                                onClick={() => handleQuizSelect(q.id, opt.id, opt.isCorrect)} 
                                disabled={isAns} 
                                whileHover={!isAns ? { scale: 1.02, y: -2, backgroundColor: "rgba(255,255,255,0.05)" } : {}}
                                whileTap={!isAns ? { scale: 0.95 } : {}}
                                animate={isSel ? { scale: 1.02 } : { scale: 1 }}
                                className={`w-full text-left p-4 md:p-6 rounded-3xl transition-all flex items-center justify-between shadow-sm border
                                    ${isAns 
                                        ? (isSel 
                                            ? (opt.isCorrect 
                                                ? "bg-gradient-to-r from-green-400/20 to-emerald-500/20 border-green-500 text-green-700 dark:text-green-200 shadow-[0_0_20px_rgba(74,222,128,0.3)]" 
                                                : "bg-gradient-to-r from-red-400/20 to-pink-500/20 border-red-500 text-red-700 dark:text-red-200") 
                                            : "opacity-40 grayscale bg-bg-main border-transparent") 
                                        : "bg-bg-main dark:bg-white/5 hover:bg-white/50 dark:hover:bg-white/10 border-transparent hover:border-electric-indigo/30 text-text-primary dark:text-white/90 neu-out hover:shadow-lg"}
                                `}
                             >
                                <span className="text-[16px] md:text-[22px] font-medium font-soft">{opt.text}</span>
                                {isSel && (
                                    <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring" }}>
                                        {opt.isCorrect 
                                            ? <CheckCircle size={28} className="text-green-500 fill-green-500/20"/> 
                                            : <AlertCircle size={28} className="text-red-500 fill-red-500/20"/>}
                                    </motion.div>
                                )}
                             </motion.button>
                           )
                         })}
                       </div>
                       
                       <AnimatePresence>
                       {quizState[q.id] && (
                           <motion.div 
                                initial={{ opacity: 0, height: 0, scale: 0.9 }} 
                                animate={{ opacity: 1, height: 'auto', scale: 1 }} 
                                exit={{ opacity: 0, height: 0 }} 
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className={`mt-6 text-[16px] md:text-[20px] p-6 rounded-3xl flex gap-4 items-start border-l-8 shadow-inner ${quizResults[q.id] ? 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200'}`}
                            >
                                <div className="p-2 bg-white/20 rounded-full shrink-0">
                                    {quizResults[q.id] ? <Star size={24} className="fill-current"/> : <Info size={24}/>} 
                                </div>
                                <div className="leading-relaxed pt-1">
                                    <strong className="block mb-2 uppercase tracking-wider text-xs md:text-sm opacity-70">
                                        {quizResults[q.id] ? 'Giải thích đúng' : 'Giải thích sai'}
                                    </strong>
                                    {q.explanation}
                                </div>
                           </motion.div>
                       )}
                       </AnimatePresence>
                     </motion.div>
                   ))}
                   </LayoutGroup>
                 </div>
               )}

               {/* Code Snippet */}
               {currentLesson.codeSnippet && (
                 <div className="mt-8 neu-out rounded-2xl overflow-hidden border border-text-secondary/10 bg-bg-main dark:bg-black/30">
                    <div className="flex justify-between items-center px-4 py-3 bg-text-primary/5 border-b border-white/5">
                        <span className="text-sm font-mono font-bold text-text-secondary flex gap-2 items-center uppercase"><Terminal size={14} className="text-neon-serpent"/> Gợi ý</span>
                        <button onClick={() => setShowCodeSuggestion(!showCodeSuggestion)} className="text-sm font-bold text-electric-indigo flex gap-1 items-center bg-electric-indigo/10 px-2 py-1 rounded-lg">
                            {showCodeSuggestion ? <><EyeOff size={14}/> Ẩn</> : <><Eye size={14}/> Xem Code</>}
                        </button>
                    </div>
                    <AnimatePresence>
                        {showCodeSuggestion ? (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                              <div className="p-4 md:p-6 bg-[#1E1E1E] text-[#A9B7C6] font-mono text-[15px] md:text-base overflow-x-auto whitespace-pre leading-relaxed">
                                  {currentLesson.codeSnippet}
                              </div>
                          </motion.div>
                        ) : (
                          <div className="py-8 text-center text-xs text-text-secondary bg-black/5 flex flex-col items-center gap-1">
                              <span>❓</span>
                              <span>Hãy thử sức trước khi xem đáp án nhé!</span>
                          </div>
                        )}
                    </AnimatePresence>
                 </div>
               )}
           </div>
        </div>

        {/* Compact Desktop Navigation Footer */}
        <div className="hidden md:flex p-2 items-center justify-between bg-bg-main border-t border-text-secondary/10 shrink-0">
           <button disabled={currentStepIndex === 0} onClick={() => setCurrentStepIndex(p => p - 1)} className="neu-btn px-4 py-2 rounded-lg text-text-primary font-bold flex gap-2 active:neu-inset disabled:opacity-50 transition-all hover:-translate-y-0.5 text-xs">
             <ChevronLeft size={16}/> Trước
           </button>
           <button onClick={() => setShowHint(!showHint)} className="neu-btn px-4 py-2 rounded-lg text-electric-indigo font-bold flex gap-2 active:neu-inset transition-all text-xs">
                <Lightbulb size={16}/> Gợi ý
           </button>
           <button onClick={currentStepIndex === PYTHON_COURSE.segments.length - 1 ? handleManualCompletion : () => setCurrentStepIndex(p => p + 1)} className="neu-btn px-5 py-2 rounded-lg bg-electric-indigo text-white font-bold flex gap-2 active:shadow-inner hover:brightness-110 transition-all shadow-glow hover:-translate-y-1 text-xs">
             {currentStepIndex === PYTHON_COURSE.segments.length - 1 ? 'Hoàn thành' : 'Tiếp theo'} <ChevronRight size={16}/>
           </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-6 right-5 z-40 flex flex-col gap-4">
             {/* Hint Button */}
             <motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }} onClick={() => setShowHint(!showHint)} className="w-12 h-12 rounded-2xl neu-btn bg-bg-main text-electric-indigo flex items-center justify-center active:neu-inset shadow-lg border border-white/20"><Lightbulb size={24} /></motion.button>
             
             {/* Next Button */}
             <motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }} onClick={currentStepIndex === PYTHON_COURSE.segments.length - 1 ? handleManualCompletion : () => setCurrentStepIndex(p => p + 1)} className="w-14 h-14 rounded-2xl bg-electric-indigo text-white flex items-center justify-center shadow-glow border border-white/20"><ChevronRight size={30} /></motion.button>
        </div>

        <AnimatePresence>
            {showHint && currentLesson.hint && (
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="absolute bottom-24 md:bottom-24 left-4 right-4 md:left-auto md:right-auto md:w-96 p-5 rounded-2xl glass-panel shadow-neu-out z-50 bg-bg-main border-l-4 border-electric-indigo">
                    <div className="flex justify-between items-start mb-2"><h4 className="font-bold text-electric-indigo text-sm uppercase flex items-center gap-2"><Lightbulb size={16}/> Mách nhỏ</h4><button onClick={() => setShowHint(false)} className="text-text-secondary"><X size={18}/></button></div>
                    <p className="text-sm md:text-base text-text-primary leading-relaxed font-medium">{currentLesson.hint}</p>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {/* Code Column - 30% Width on Desktop (Split) */}
      <div className={`flex-col relative bg-bg-main p-0 md:p-2 justify-center items-center h-full ${mobileTab === 'code' ? 'flex w-full pt-[0px] md:pt-0' : 'hidden'} ${desktopViewMode === 'split' ? 'md:flex md:w-[30%]' : 'md:hidden'}`}>
        <div className="w-full h-full flex flex-col md:rounded-2xl neu-out overflow-hidden bg-[#1a1a2e] border border-white/5">
            <div className="h-10 bg-[#212121] flex items-center justify-between px-3 select-none shrink-0 border-b border-white/5">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div><div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div></div>
                <button onClick={handleManualCompletion} disabled={showConfetti} className="text-xs md:text-[10px] font-bold px-6 py-2.5 md:px-4 md:py-1 bg-green-600 text-white rounded-full hover:bg-green-500 transition-colors shadow-lg active:scale-95 flex items-center gap-2">{showConfetti ? <><CheckCircle size={16}/> XONG</> : 'HOÀN THÀNH'}</button>
            </div>
            <div className="relative w-full flex-1 bg-[#1a1a2e]">
                {iframeLoading && <div className="absolute inset-0 flex flex-col items-center justify-center text-electric-indigo gap-3"><Loader2 className="animate-spin" size={24}/><span className="text-xs font-mono animate-pulse">Loading...</span></div>}
                <iframe src={shouldLoadIframe ? trinketUrl : undefined} frameBorder="0" allowFullScreen loading="eager" onLoad={() => setIframeLoading(false)} className={`absolute inset-0 w-full h-full ${iframeLoading ? 'opacity-0' : 'opacity-100'}`} title="IDE"></iframe>
            </div>
        </div>

        {/* Floating AI Chat Drawer */}
        <AnimatePresence>
             {isChatOpen && (
               <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed md:absolute bottom-0 md:bottom-24 right-0 md:right-6 w-full md:w-80 h-[55vh] md:h-[450px] glass-panel bg-bg-main/95 shadow-2xl z-[70] rounded-t-[32px] md:rounded-3xl flex flex-col overflow-hidden border border-white/10">
                 <div className="w-12 h-1.5 bg-text-secondary/20 rounded-full mx-auto mt-3 mb-1"></div>
                 <div className="p-3 px-4 bg-transparent flex justify-between items-center shrink-0"><span className="font-bold text-sm flex gap-2 items-center text-electric-indigo"><MessageCircle size={18}/> Chat với Thầy Thạch</span><button onClick={() => setIsChatOpen(false)} className="hover:bg-black/5 p-1.5 rounded-full"><X size={18}/></button></div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-bg-main/30">
                    {chatMessages.map((m, i) => <div key={i} className={`text-sm p-3.5 rounded-2xl max-w-[85%] leading-relaxed shadow-sm ${m.role === 'user' ? 'ml-auto bg-electric-indigo text-white rounded-tr-sm' : 'bg-white dark:bg-black/20 text-text-primary rounded-tl-sm border border-text-secondary/5'}`}>{m.text}</div>)}
                    <div ref={messagesEndRef} />
                    {isAiLoading && <div className="flex gap-1 ml-4 mt-2"><div className="w-1.5 h-1.5 bg-electric-indigo rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-electric-indigo rounded-full animate-bounce delay-75"></div><div className="w-1.5 h-1.5 bg-electric-indigo rounded-full animate-bounce delay-150"></div></div>}
                 </div>
                 <div className="p-3 border-t border-text-secondary/10 flex gap-2 bg-bg-main shrink-0"><input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} className="flex-1 bg-text-secondary/5 border border-transparent rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:bg-bg-main focus:border-electric-indigo/50 transition-all font-medium" placeholder="Nhập câu hỏi..." /><button onClick={handleSendMessage} className="p-2.5 bg-electric-indigo text-white rounded-xl shadow-lg active:scale-95 transition-transform"><Send size={18}/></button></div>
               </motion.div>
             )}
        </AnimatePresence>
        <div className="fixed md:absolute bottom-20 md:bottom-6 right-5 md:right-6 z-40">
            <motion.button animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} onClick={() => setIsChatOpen(!isChatOpen)} className="w-14 h-14 rounded-2xl bg-electric-indigo text-white flex items-center justify-center shadow-glow hover:scale-110 transition-transform active:scale-95 border-[3px] border-white/10">{isChatOpen ? <X size={28}/> : <span className="text-3xl">🤖</span>}</motion.button>
        </div>
      </div>
    </div>
  );
};
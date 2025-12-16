import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MessageCircle, CheckCircle, ChevronRight, ChevronLeft, Send, X, Lightbulb, Terminal, Eye, EyeOff, AlertCircle, Info, Map, Star, Cloud, Code } from 'lucide-react';
import { PYTHON_COURSE } from '../constants';
import { createAiMentor, ai } from '../services/gemini';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Chat } from "@google/genai";

interface IDEProps {
  onCompleteSegment: (id: string, xp: number) => void;
  onExit: () => void;
  
  // Controlled Props from App
  currentStepIndex: number;
  setCurrentStepIndex: React.Dispatch<React.SetStateAction<number>>;
  isNavOpen: boolean;
  setIsNavOpen: (open: boolean) => void;
}

const Confetti: React.FC = () => {
  const particles = useMemo(() => Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -20 - Math.random() * 30,
    r: Math.random() * 720 - 360,
    scale: 0.4 + Math.random() * 0.8,
    color: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF0055', '#8B80F9', '#00E676'][Math.floor(Math.random() * 6)]
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden">
      {/* Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: `${p.y}vh`, x: `${p.x}vw`, rotate: 0, opacity: 1 }}
          animate={{ y: '120vh', rotate: p.r, opacity: [1, 1, 0] }}
          transition={{ duration: 2.5 + Math.random(), ease: "easeOut", delay: Math.random() * 0.3 }}
          className="absolute w-4 h-4 rounded-sm shadow-sm"
          style={{ backgroundColor: p.color, left: 0, top: 0 }}
        />
      ))}
      
      {/* Congratulatory Message */}
      <motion.div 
        initial={{ scale: 0.5, opacity: 0, y: 50, rotate: -5 }}
        animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
        exit={{ scale: 1.2, opacity: 0, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="relative z-10 bg-white/90 dark:bg-[#212121]/90 backdrop-blur-xl p-8 md:p-12 rounded-[40px] shadow-2xl border-4 border-white/20 text-center max-w-md mx-4"
      >
         <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-6xl animate-bounce">🏆</div>
         <h2 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-electric-indigo to-neon-serpent mb-3 mt-4">
            XUẤT SẮC!
         </h2>
         <p className="text-lg text-text-secondary font-soft font-bold">Tiếp tục bạn ơi</p>
         <div className="mt-4 flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-electric-indigo animate-ping"></div>
            <div className="w-2 h-2 rounded-full bg-neon-serpent animate-ping delay-100"></div>
            <div className="w-2 h-2 rounded-full bg-hot-coral animate-ping delay-200"></div>
         </div>
      </motion.div>
    </div>
  );
};

export const IDE: React.FC<IDEProps> = ({ 
    onCompleteSegment, onExit, 
    currentStepIndex, setCurrentStepIndex, isNavOpen, setIsNavOpen 
}) => {
  const currentLesson = useMemo(() => PYTHON_COURSE.segments[currentStepIndex], [currentStepIndex]);
  const isAiConfigured = useMemo(() => !!ai, []);
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHint, setShowHint] = useState(false);
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
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setShowConfetti(false); setShowHint(false); setShowCodeSuggestion(false); setQuizState({}); setQuizResults({});
    if (theoryScrollRef.current) {
        theoryScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    if(isAiConfigured) {
        chatSession.current = createAiMentor(currentLesson.content);
        setChatMessages([{role: 'model', text: `Chào em! Thầy là trợ lý AI ảo. Bài học hiện tại là "${currentLesson.title}".`}]);
    } else {
        setChatMessages([{role: 'model', text: `Lỗi: Dịch vụ AI chưa được cấu hình. Vui lòng thêm API_KEY.`}]);
    }
  }, [currentLesson, isAiConfigured]);

  // Syntax Highlighting Effect
  useEffect(() => {
    if (showCodeSuggestion && codeRef.current && (window as any).hljs) {
        // Reset highlighted state to ensure re-highlighting works if content changed
        delete (codeRef.current.dataset as any).highlighted;
        (window as any).hljs.highlightElement(codeRef.current);
    }
  }, [showCodeSuggestion, currentLesson.codeSnippet]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages, isChatOpen]);

  const handleManualCompletion = () => {
    // 1. Play Confetti
    setShowConfetti(true);
    
    // 2. Award XP
    onCompleteSegment(currentLesson.id, currentLesson.xpReward);
    
    // 3. Move to next lesson after delay
    if (currentStepIndex < PYTHON_COURSE.segments.length - 1) {
        setTimeout(() => { 
            setShowConfetti(false);
            setCurrentStepIndex(p => p + 1); 
        }, 3000); // Increased to 3s to enjoy the animation
    } else {
        setTimeout(onExit, 3500);
    }
  };

  const handleQuizSelect = (qId: string, oId: string, isCorrect: boolean) => {
    setQuizState(p => ({ ...p, [qId]: oId }));
    setQuizResults(p => ({ ...p, [qId]: isCorrect }));
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !chatSession.current || !isAiConfigured) return;
    const userMsg = chatInput;
    setChatMessages(p => [...p, {role: 'user', text: userMsg}]);
    setChatInput('');
    setIsAiLoading(true);
    try {
        const response = await chatSession.current.sendMessage({ message: userMsg });
        setChatMessages(p => [...p, {role: 'model', text: response.text || "Hmm, thầy chưa biết trả lời câu này."}]);
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        const errorMessage = (error instanceof Error) ? error.message : String(error);
        setChatMessages(p => [
            ...p, 
            {
              role: 'model', 
              text: `Rất tiếc, đã xảy ra lỗi kết nối. 🛠️\n\nVui lòng kiểm tra lại VITE_API_KEY trên Vercel.\n\nChi tiết lỗi: ${errorMessage}`
            }
        ]);
    } 
    finally { 
        setIsAiLoading(false); 
    }
  };

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
    // FIXED: h-full ensures it takes exactly the remaining space from Layout's main, fixing scroll issues
    <div className="flex flex-col h-full bg-bg-main text-text-primary overflow-hidden transition-colors duration-300 relative select-none md:select-auto font-soft">
      
      {/* Confetti Overlay */}
      <AnimatePresence>
        {showConfetti && <Confetti key="confetti" />}
      </AnimatePresence>

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

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col w-full bg-bg-main relative overflow-hidden">
        <div 
            ref={theoryScrollRef} 
            className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar pb-32 md:pb-8 w-full"
        >
           <div className="glass-panel p-5 md:p-12 rounded-[28px] md:shadow-neu-out border-none md:border-solid border-white/20 max-w-5xl mx-auto">
               
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

               {/* Practice Question Block (New) */}
               {currentLesson.practiceQuestion && (
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-10 neu-out rounded-2xl p-5 md:p-6 border-l-8 border-electric-indigo bg-bg-main relative overflow-hidden"
                 >
                    <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
                        <Code size={100} className="text-electric-indigo"/>
                    </div>
                    <h4 className="font-bold text-electric-indigo text-lg md:text-2xl mb-3 flex items-center gap-2 uppercase tracking-wide">
                        <Terminal size={24}/> Nhiệm vụ Code
                    </h4>
                    <p className="text-[16px] md:text-[22px] text-text-primary leading-relaxed font-medium">
                        {currentLesson.practiceQuestion}
                    </p>
                 </motion.div>
               )}

               {/* Code Snippet - Using Highlight.js */}
               {currentLesson.codeSnippet && (
                 <div className="mt-8 neu-out rounded-2xl overflow-hidden border border-text-secondary/10 bg-bg-main dark:bg-black/30">
                    <div className="flex justify-between items-center px-4 py-3 bg-text-primary/5 border-b border-white/5">
                        <span className="text-sm font-mono font-bold text-text-secondary flex gap-2 items-center uppercase"><Eye size={14} className="text-neon-serpent"/> Code mẫu (Tham khảo)</span>
                        <div className="flex gap-2">
                            <button onClick={() => setShowCodeSuggestion(!showCodeSuggestion)} className="text-sm font-bold text-electric-indigo flex gap-1 items-center bg-electric-indigo/10 px-2 py-1.5 rounded-lg hover:bg-electric-indigo/20 transition-colors">
                                {showCodeSuggestion ? <><EyeOff size={14}/> Ẩn</> : <><Eye size={14}/> Xem Code</>}
                            </button>
                        </div>
                    </div>
                    <AnimatePresence>
                        {showCodeSuggestion ? (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                              <div className="bg-[#282c34]">
                                <pre className="m-0 p-4 md:p-6 overflow-x-auto custom-scrollbar no-copy">
                                    <code 
                                      ref={codeRef}
                                      className="language-python font-mono text-[15px] md:text-base leading-relaxed bg-transparent"
                                    >
                                        {currentLesson.codeSnippet}
                                    </code>
                                </pre>
                              </div>
                          </motion.div>
                        ) : (
                          <div className="py-12 text-center text-sm text-text-secondary bg-black/5 flex flex-col items-center gap-3">
                              <span className="text-4xl">🧑‍💻</span>
                              <div className="flex flex-col gap-1">
                                <span>Đừng vội xem đáp án nha!</span>
                                <span className="text-xs opacity-70">Hãy thử code theo yêu cầu ở trên trước nhé.</span>
                              </div>
                          </div>
                        )}
                    </AnimatePresence>
                 </div>
               )}
           </div>
        </div>

        {/* Navigation Footer */}
        <div className="p-4 flex items-center justify-between bg-bg-main border-t border-text-secondary/10 shrink-0 z-30 max-w-5xl mx-auto w-full">
           <button disabled={currentStepIndex === 0} onClick={() => setCurrentStepIndex(p => p - 1)} className="neu-btn px-6 py-3 rounded-xl text-text-primary font-bold flex gap-2 active:neu-inset disabled:opacity-50 transition-all hover:-translate-y-0.5 text-sm">
             <ChevronLeft size={18}/> Trước
           </button>
           
           <div className="flex gap-3">
               <button onClick={() => setShowHint(!showHint)} className="neu-btn px-4 py-3 rounded-xl text-electric-indigo font-bold flex gap-2 active:neu-inset transition-all text-sm md:flex hidden">
                    <Lightbulb size={18}/> Gợi ý
               </button>
               <button onClick={handleManualCompletion} disabled={showConfetti} className={`neu-btn px-6 py-3 rounded-xl font-bold flex gap-2 active:shadow-inner transition-all hover:-translate-y-1 text-sm ${showConfetti ? 'bg-green-500 text-white shadow-glow' : 'bg-electric-indigo text-white shadow-glow hover:brightness-110'}`}>
                 {showConfetti ? <><CheckCircle size={18}/> Đã xong</> : (currentStepIndex === PYTHON_COURSE.segments.length - 1 ? 'Hoàn thành' : <>Tiếp theo <ChevronRight size={18}/></>)}
               </button>
           </div>
        </div>

        {/* Mobile Hint Floating Button (Visible only on mobile) */}
        <div className="md:hidden fixed bottom-24 right-5 z-40">
             <motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }} onClick={() => setShowHint(!showHint)} className="w-12 h-12 rounded-2xl neu-btn bg-bg-main text-electric-indigo flex items-center justify-center active:neu-inset shadow-lg border border-white/20"><Lightbulb size={24} /></motion.button>
        </div>

        {/* Hint Popup */}
        <AnimatePresence>
            {showHint && currentLesson.hint && (
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="absolute bottom-24 md:bottom-24 left-4 right-4 md:left-auto md:right-auto md:w-96 p-5 rounded-2xl glass-panel shadow-neu-out z-50 bg-bg-main border-l-4 border-electric-indigo mx-auto">
                    <div className="flex justify-between items-start mb-2"><h4 className="font-bold text-electric-indigo text-sm uppercase flex items-center gap-2"><Lightbulb size={16}/> Mách nhỏ</h4><button onClick={() => setShowHint(false)} className="text-text-secondary"><X size={18}/></button></div>
                    <p className="text-sm md:text-base text-text-primary leading-relaxed font-medium">{currentLesson.hint}</p>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Floating AI Chat Drawer */}
        <AnimatePresence>
             {isChatOpen && (
               <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="fixed md:absolute bottom-0 md:bottom-24 right-0 md:right-6 w-full md:w-80 h-[55vh] md:h-[450px] glass-panel bg-bg-main/95 shadow-2xl z-[70] rounded-t-[32px] md:rounded-3xl flex flex-col overflow-hidden border border-white/10">
                 <div className="w-12 h-1.5 bg-text-secondary/20 rounded-full mx-auto mt-3 mb-1"></div>
                 <div className="p-3 px-4 bg-transparent flex justify-between items-center shrink-0"><span className="font-bold text-sm flex gap-2 items-center text-electric-indigo"><MessageCircle size={18}/> Chat với Thầy Thạch</span><button onClick={() => setIsChatOpen(false)} className="hover:bg-black/5 p-1.5 rounded-full"><X size={18}/></button></div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-bg-main/30">
                    {chatMessages.map((m, i) => <div key={i} className={`text-sm p-3.5 rounded-2xl max-w-[85%] leading-relaxed shadow-sm ${m.role === 'user' ? 'ml-auto bg-electric-indigo text-white rounded-tr-sm' : 'bg-white dark:bg-black/20 text-text-primary rounded-tl-sm border border-text-secondary/5 whitespace-pre-wrap'}`}>{m.text}</div>)}
                    <div ref={messagesEndRef} />
                    {isAiLoading && <div className="flex gap-1 ml-4 mt-2"><div className="w-1.5 h-1.5 bg-electric-indigo rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-electric-indigo rounded-full animate-bounce delay-75"></div><div className="w-1.5 h-1.5 bg-electric-indigo rounded-full animate-bounce delay-150"></div></div>}
                 </div>
                 <div className="p-3 border-t border-text-secondary/10 flex gap-2 bg-bg-main shrink-0">
                    <input 
                        value={chatInput} 
                        onChange={e => setChatInput(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handleSendMessage()} 
                        className="flex-1 bg-text-secondary/5 border border-transparent rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:bg-bg-main focus:border-electric-indigo/50 transition-all font-medium disabled:opacity-50" 
                        placeholder={isAiConfigured ? "Nhập câu hỏi..." : "AI chưa sẵn sàng"}
                        disabled={!isAiConfigured || isAiLoading}
                    />
                    <button 
                        onClick={handleSendMessage} 
                        className="p-2.5 bg-electric-indigo text-white rounded-xl shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!isAiConfigured || isAiLoading}
                    >
                        <Send size={18}/>
                    </button>
                 </div>
               </motion.div>
             )}
        </AnimatePresence>
        <div className="fixed md:absolute bottom-24 md:bottom-6 right-5 md:right-6 z-40">
            <motion.button animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} onClick={() => setIsChatOpen(!isChatOpen)} className="w-14 h-14 rounded-2xl bg-electric-indigo text-white flex items-center justify-center shadow-glow hover:scale-110 transition-transform active:scale-95 border-[3px] border-white/10 disabled:bg-gray-400 disabled:shadow-none" disabled={!isAiConfigured}>
                {isChatOpen ? <X size={28}/> : <span className="text-3xl">🤖</span>}
            </motion.button>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingProps {
  onStart: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl flex flex-col justify-center min-h-[85vh] font-soft">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="neu-out rounded-[48px] p-8 md:p-16 text-left relative overflow-hidden bg-bg-main flex flex-col items-start border border-white/20"
      >
          {/* Soft Decor */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-electric-indigo/5 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyber-cyan/5 rounded-full blur-[80px] pointer-events-none"></div>
          
          {/* Greeting Badge */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-bg-main text-neon-serpent font-bold mb-8 neu-inset border border-white/50"
          >
            <Sparkles size={18} />
            <span>Chào lớp 10A1 thân yêu! 👋</span>
          </motion.div>

          <h1 className="font-display text-4xl md:text-7xl font-bold mb-6 text-text-primary tracking-tight z-10 relative leading-tight">
            LỚP TIN HỌC <br />
            <span className="text-electric-indigo">TRẦN THẠCH</span>
          </h1>
          <p className="text-[20px] md:text-[24px] text-text-secondary max-w-2xl mb-12 font-medium z-10 relative leading-relaxed">
            Lớp học của những lập trình viên tương lai - Học Python thật là dễ :)
          </p>

          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="neu-btn px-10 py-5 rounded-2xl bg-bg-main text-electric-indigo font-bold text-xl md:text-2xl flex items-center gap-4 active:neu-inset transition-all border border-electric-indigo/10"
          >
            <div className="w-12 h-12 rounded-full bg-electric-indigo text-white flex items-center justify-center shadow-lg shadow-electric-indigo/30">
                <Play fill="currentColor" size={24} className="ml-1" />
            </div>
            VÀO LỚP NGAY
          </motion.button>
      </motion.div>
    </div>
  );
};
import React from 'react';
import { UserProgress } from '../types';
import { Play, Hash, Terminal, AlertTriangle, Check, Target, Cpu } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

interface DashboardProps {
  onContinue: () => void;
  userProgress: UserProgress;
}

export const Dashboard: React.FC<DashboardProps> = ({ onContinue }) => {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="container mx-auto px-4 md:px-6 py-6 max-w-7xl h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar font-soft"
    >
      <h2 className="font-display text-2xl md:text-3xl font-bold mb-6 text-text-primary uppercase tracking-tight flex items-center gap-3">
        Lớp học Python
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-24 md:pb-0">
        
        {/* 1. Main Mission Card */}
        <motion.div variants={item} className="md:col-span-8 neu-out rounded-[32px] p-6 md:p-10 relative overflow-hidden flex flex-col justify-center bg-bg-main border border-white/20">
          <div className="z-10 relative">
            <span className="text-electric-indigo font-mono text-sm tracking-widest uppercase mb-3 block font-bold">Nhiệm vụ hôm nay</span>
            <h3 className="font-display text-2xl md:text-5xl font-bold text-text-primary mb-4 leading-tight">Biến & Lệnh Gán</h3>
            <p className="text-text-secondary max-w-xl mb-8 text-lg font-medium leading-relaxed">
              Khám phá cách máy tính lưu trữ thông tin và thực hiện các phép toán cơ bản.
            </p>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={onContinue}
              className="neu-btn px-8 py-4 rounded-2xl font-bold text-lg text-electric-indigo flex items-center gap-3 active:neu-inset hover:bg-electric-indigo hover:text-white transition-all border border-transparent hover:border-electric-indigo/20"
            >
              <Play fill="currentColor" size={24} /> VÀO HỌC NGAY
            </motion.button>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-electric-indigo/5 rounded-full blur-3xl pointer-events-none"></div>
        </motion.div>

        {/* 2. Objectives */}
        <motion.div variants={item} className="md:col-span-4 neu-out rounded-[32px] p-6 flex flex-col bg-bg-main border border-white/20">
           <div className="flex items-center gap-2 mb-4">
              <Target className="text-hot-coral" size={24} />
              <h4 className="font-bold text-text-primary text-xl font-soft">Mục tiêu</h4>
           </div>
           
           <div className="neu-inset p-5 rounded-2xl h-full flex flex-col justify-center bg-bg-main">
              <ul className="space-y-4">
                  {['Hiểu khái niệm Biến', 'Sử dụng Lệnh Gán (=)', 'Thực hiện Phép toán'].map((t, i) => (
                    <motion.li key={i} whileHover={{ x: 5 }} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-neon-serpent/10 flex items-center justify-center text-neon-serpent"><Check size={14} strokeWidth={3} /></div>
                        <span className="text-text-secondary font-medium text-[15px]">{t}</span>
                    </motion.li>
                  ))}
              </ul>
           </div>
        </motion.div>

        {/* 3. Skills */}
        <motion.div variants={item} className="md:col-span-12 glass-panel rounded-[32px] p-6 md:p-8 shadow-neu-out border-none">
           <div className="flex items-center gap-3 mb-6">
              <Cpu className="text-cyber-cyan" size={24} />
              <h4 className="font-bold text-text-primary text-xl font-soft">Kỹ năng số</h4>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: <Terminal size={20}/>, title: "Tư duy logic", color: "text-electric-indigo", bg: "bg-electric-indigo/10" },
                { icon: <Hash size={20}/>, title: "Quản lý dữ liệu", color: "text-neon-serpent", bg: "bg-neon-serpent/10" },
                { icon: <AlertTriangle size={20}/>, title: "Giải quyết vấn đề", color: "text-hot-coral", bg: "bg-hot-coral/10" }
              ].map((skill, idx) => (
                 <motion.div whileHover={{ y: -2 }} key={idx} className="neu-btn p-4 rounded-2xl flex items-center gap-4 bg-bg-main active:neu-inset cursor-default border border-transparent hover:border-white/50">
                     <div className={`p-3 rounded-xl ${skill.bg} ${skill.color} shadow-sm`}>{skill.icon}</div>
                     <span className="text-lg text-text-primary font-bold font-soft">{skill.title}</span>
                 </motion.div>
              ))}
           </div>
        </motion.div>

      </div>
    </motion.div>
  );
};
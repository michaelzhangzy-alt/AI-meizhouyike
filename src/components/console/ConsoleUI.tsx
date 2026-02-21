"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Gamepad2, Radio, Newspaper, Users, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

// --- Components ---

const Joystick = ({ className, label, onMove, onClick }: { className?: string; label?: string; onMove?: (direction: 'up' | 'down' | 'left' | 'right') => void; onClick?: () => void }) => {
    // Simplified joystick logic for demonstration - in a real app, we'd calculate drag delta
    return (
        <div className={`relative flex flex-col items-center ${className}`}>
            {label && <span className="text-[10px] text-gray-500 dark:text-gray-500 mb-2 whitespace-pre-line text-center font-bold">{label}</span>}
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-[#1f1f1f] shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.5),inset_5px_5px_10px_rgba(0,0,0,0.1)] dark:shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.05),inset_5px_5px_10px_rgba(0,0,0,0.5)] flex items-center justify-center p-2 transition-colors duration-300">
                <motion.div
                    className="w-16 h-16 rounded-full bg-gray-300 dark:bg-[#2a2a2a] shadow-[-5px_-5px_10px_rgba(255,255,255,0.5),5px_5px_10px_rgba(0,0,0,0.1)] dark:shadow-[-5px_-5px_10px_rgba(255,255,255,0.05),5px_5px_10px_rgba(0,0,0,0.5)] cursor-pointer relative transition-colors duration-300"
                    whileTap={{ scale: 0.95 }}
                    drag
                    dragConstraints={{ left: -10, right: 10, top: -10, bottom: 10 }}
                    onDragEnd={(e, info) => {
                         if (onMove) {
                            if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
                                if (info.offset.x > 10) onMove('right');
                                else if (info.offset.x < -10) onMove('left');
                            } else {
                                if (info.offset.y > 10) onMove('down');
                                else if (info.offset.y < -10) onMove('up');
                            }
                         }
                    }}
                    onClick={onClick}
                >
                     {/* Decorative top texture */}
                     <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent dark:from-white/5"></div>
                </motion.div>
            </div>
        </div>
    );
};

const DPad = ({ className, onPress }: { className?: string; onPress?: (direction: 'up' | 'down' | 'left' | 'right') => void }) => (
    <div className={`w-32 h-32 relative ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-32 bg-gray-300 dark:bg-[#2a2a2a] rounded-lg shadow-[-2px_-2px_5px_rgba(255,255,255,0.5),2px_2px_5px_rgba(0,0,0,0.1)] dark:shadow-[-2px_-2px_5px_rgba(255,255,255,0.05),2px_2px_5px_rgba(0,0,0,0.5)] z-10 transition-colors duration-300"></div>
            <div className="absolute w-32 h-10 bg-gray-300 dark:bg-[#2a2a2a] rounded-lg shadow-[-2px_-2px_5px_rgba(255,255,255,0.5),2px_2px_5px_rgba(0,0,0,0.1)] dark:shadow-[-2px_-2px_5px_rgba(255,255,255,0.05),2px_2px_5px_rgba(0,0,0,0.5)] z-10 transition-colors duration-300"></div>
            <div className="absolute w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600 z-20 shadow-inner"></div>

            <motion.button 
                whileTap={{ scale: 0.9 }} 
                className="absolute top-0 w-10 h-10 z-30 rounded-t-lg active:bg-black/10 flex items-start justify-center pt-1"
                onClick={() => onPress?.('up')}
            >
                <ArrowUp size={12} className="text-gray-500 dark:text-gray-600" />
            </motion.button>
            <motion.button 
                whileTap={{ scale: 0.9 }} 
                className="absolute bottom-0 w-10 h-10 z-30 rounded-b-lg active:bg-black/10 flex items-end justify-center pb-1"
                onClick={() => onPress?.('down')}
            >
                <ArrowDown size={12} className="text-gray-500 dark:text-gray-600" />
            </motion.button>
            <motion.button 
                whileTap={{ scale: 0.9 }} 
                className="absolute left-0 w-10 h-10 z-30 rounded-l-lg active:bg-black/10 flex items-center justify-start pl-1"
                onClick={() => onPress?.('left')}
            >
                <ArrowLeft size={12} className="text-gray-500 dark:text-gray-600" />
            </motion.button>
            <motion.button 
                whileTap={{ scale: 0.9 }} 
                className="absolute right-0 w-10 h-10 z-30 rounded-r-lg active:bg-black/10 flex items-center justify-end pr-1"
                onClick={() => onPress?.('right')}
            >
                <ArrowRight size={12} className="text-gray-500 dark:text-gray-600" />
            </motion.button>
        </div>
    </div>
);

const ActionButton = ({ label, className, onClick, color = "text-gray-400" }: { label: string; className?: string; onClick?: () => void; color?: string }) => (
    <motion.button
        whileTap={{ scale: 0.9, boxShadow: "inset 2px 2px 5px rgba(0,0,0,0.2), inset -2px -2px 5px rgba(255,255,255,0.5)" }}
        className={`w-12 h-12 rounded-full bg-gray-300 dark:bg-[#2a2a2a] shadow-[-5px_-5px_10px_rgba(255,255,255,0.5),5px_5px_10px_rgba(0,0,0,0.1)] dark:shadow-[-5px_-5px_10px_rgba(255,255,255,0.05),5px_5px_10px_rgba(0,0,0,0.5)] flex items-center justify-center ${color} font-bold text-sm ${className} transition-colors duration-300`}
        onClick={onClick}
    >
        {label}
    </motion.button>
);

// --- Content Data ---

const SECTIONS = [
    {
        id: "home",
        icon: <Gamepad2 size={24} />,
        title: "优尼克斯",
        subtitle: "AI 周课",
        desc: "从校园到职场，掌握未来 5 年的通用语言。",
        detail: "1,203 位同学已报名 | 每周一节实战课",
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-600/10 dark:bg-blue-400/10",
        border: "border-blue-600/20 dark:border-blue-400/20"
    },
    {
        id: "course",
        icon: <Radio size={24} />,
        title: "本周直播",
        subtitle: "实战场景课",
        desc: "每周一节，把 AI 变成你的超级助手。",
        detail: "🔥 火热报名中 | 紧跟前沿技术",
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-600/10 dark:bg-red-400/10",
        border: "border-red-600/20 dark:border-red-400/20"
    },
    {
        id: "news",
        icon: <Newspaper size={24} />,
        title: "AI 资讯",
        subtitle: "行业动态",
        desc: "精选行业动态与干货，洞察未来趋势。",
        detail: "阅读更多 | 独家深度解析",
        color: "text-yellow-600 dark:text-yellow-400",
        bg: "bg-yellow-600/10 dark:bg-yellow-400/10",
        border: "border-yellow-600/20 dark:border-yellow-400/20"
    },
    {
        id: "community",
        icon: <Users size={24} />,
        title: "学习社区",
        subtitle: "加入我们",
        desc: "获取每周直播课提醒与独家学习资料。",
        detail: "立即加入 | 开启 AI 之旅",
        color: "text-green-600 dark:text-green-400",
        bg: "bg-green-600/10 dark:bg-green-400/10",
        border: "border-green-600/20 dark:border-green-400/20"
    }
];

const Screen = ({ activeIndex, onNext, onPrev }: { activeIndex: number; onNext: () => void; onPrev: () => void }) => {
    const activeSection = SECTIONS[activeIndex];

    return (
        <div className="w-full h-full bg-gray-50 dark:bg-black rounded-2xl p-6 relative overflow-hidden flex flex-col items-center justify-center shadow-inner border-[4px] border-gray-300 dark:border-[#1a1a1a] transition-colors duration-300">
            {/* Scanlines effect - Subtle in light mode */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] dark:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-20"></div>
            
            {/* Background Glow */}
            <div className={`absolute inset-0 opacity-20 dark:opacity-10 blur-3xl transition-colors duration-500 ${activeSection.color.replace('text-', 'bg-')}`}></div>

            {/* Top Bar (Status) */}
            <div className="absolute top-4 left-6 right-6 flex justify-between items-center text-[10px] text-gray-400 dark:text-gray-500 z-20 font-mono">
                <span>SYS.ONLINE</span>
                <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    CONNECTED
                </span>
                <span>BAT 85%</span>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeSection.id}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.1, y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="text-center z-20 font-mono tracking-wider flex flex-col items-center max-w-[80%]"
                >
                    <div className={`mb-4 ${activeSection.color} p-4 rounded-full ${activeSection.bg} border ${activeSection.border} shadow-sm`}>
                        {activeSection.icon}
                    </div>
                    <h2 className="text-sm opacity-60 mb-1 tracking-widest text-gray-500 dark:text-gray-400">{activeSection.title}</h2>
                    <h1 className="text-3xl font-bold mb-4 tracking-wider text-gray-800 dark:text-white drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{activeSection.subtitle}</h1>
                    
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-500 to-transparent mx-auto my-4"></div>
                    
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                        {activeSection.desc}
                    </p>
                    
                    <div className="inline-block px-3 py-1 bg-white/50 dark:bg-white/5 rounded border border-gray-200 dark:border-white/10 text-[10px] text-gray-500 dark:text-gray-400">
                        {activeSection.detail}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button onClick={onPrev} className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-200/50 dark:bg-white/5 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition-colors z-30 border border-gray-300 dark:border-white/5">
                <ChevronLeft className="text-gray-500 dark:text-white/30 w-4 h-4" />
            </button>
            <button onClick={onNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-200/50 dark:bg-white/5 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition-colors z-30 border border-gray-300 dark:border-white/5">
                <ChevronRight className="text-gray-500 dark:text-white/30 w-4 h-4" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-6 flex gap-2 z-30">
                {SECTIONS.map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 rounded-full transition-all duration-300 ${
                            i === activeIndex ? `w-6 ${activeSection.color.replace('text-', 'bg-')}` : "w-1 bg-gray-300 dark:bg-gray-700"
                        }`}
                    />
                ))}
            </div>
            
            {/* Corner Decorations */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-gray-300 dark:border-white/20"></div>
            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-gray-300 dark:border-white/20"></div>
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-gray-300 dark:border-white/20"></div>
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-gray-300 dark:border-white/20"></div>
        </div>
    );
};



export default function ConsoleUI() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const navigate = useNavigate();
    const { toggleTheme } = useTheme();

    const handleNext = () => setActiveIndex((prev) => (prev === SECTIONS.length - 1 ? 0 : prev + 1));
    const handlePrev = () => setActiveIndex((prev) => (prev === 0 ? SECTIONS.length - 1 : prev - 1));

    const handleControl = (direction: 'up' | 'down' | 'left' | 'right') => {
        if (direction === 'right' || direction === 'down') handleNext();
        if (direction === 'left' || direction === 'up') handlePrev();
    };

    const handleEnter = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            const section = SECTIONS[activeIndex];
            switch (section.id) {
                case 'home': navigate('/home'); break;
                case 'course': navigate('/weekly-class'); break;
                case 'news': navigate('/news'); break;
                case 'community': navigate('/about'); break;
                default: navigate('/home');
            }
        }, 1200); // Wait for animation
    };

    // Direct Navigation Shortcuts
    const goToNews = () => navigate('/news');
    const goToCourse = () => navigate('/weekly-class');
    const goToAbout = () => navigate('/about');

    return (
        <>
            {/* Transition Overlay */}
            <AnimatePresence>
                {isTransitioning && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black flex items-center justify-center overflow-hidden"
                    >
                        <motion.div
                            initial={{ scale: 0.1, opacity: 0 }}
                            animate={{ scale: 20, opacity: 1 }}
                            transition={{ duration: 1, ease: "easeIn" }}
                            className={`w-40 h-40 rounded-full ${SECTIONS[activeIndex].color.replace('text-', 'bg-')} blur-xl`}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white font-mono text-xl tracking-[0.5em] animate-pulse">ENTERING SYSTEM...</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Universal Layout (Mobile & Desktop) */}
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black p-2 md:p-4 transition-colors duration-300 overflow-hidden w-full h-screen fixed inset-0">
                {/* 
                    Force Landscape Logic for Mobile:
                    - Rotate 90deg on portrait screens
                    - Swap width/height to fit viewport
                    - Fixed positioning to center in viewport
                */}
                <div className="relative w-full max-w-7xl aspect-[2.4/1] bg-gray-100 dark:bg-[#1a1a1a] rounded-[20px] md:rounded-[40px] p-1 md:p-8 shadow-[10px_10px_30px_#d1d5db,-10px_-10px_30px_#ffffff] md:shadow-[20px_20px_60px_#d1d5db,-20px_-20px_60px_#ffffff] dark:shadow-[10px_10px_30px_#121212,-10px_-10px_30px_#222222] dark:md:shadow-[20px_20px_60px_#121212,-20px_-20px_60px_#222222] flex items-center justify-between gap-1 md:gap-8 border border-white/50 dark:border-white/5 select-none overflow-hidden transition-all duration-300 transform scale-100 origin-center 
                landscape:rotate-0 portrait:fixed portrait:top-1/2 portrait:left-1/2 portrait:-translate-x-1/2 portrait:-translate-y-1/2 portrait:rotate-90 portrait:w-[100vh] portrait:h-[100vw] portrait:scale-[0.85]">
                    
                    {/* Left Section - Extreme Mobile Compression */}
                    <div className="flex flex-col items-center justify-center gap-2 md:gap-12 w-[70px] md:w-[12%] h-full pt-2 md:pt-8 flex-shrink-0">
                        <div className="relative scale-[0.6] md:scale-100 origin-center">
                            <span className="absolute -top-6 md:-top-8 left-1/2 -translate-x-1/2 text-[8px] md:text-[10px] text-gray-500 w-24 text-center leading-tight font-bold whitespace-nowrap hidden md:block">L-STICK<br/>导航切换</span>
                            <Joystick onMove={handleControl} />
                        </div>
                        <div className="scale-[0.6] md:scale-100 origin-center">
                             <DPad onPress={handleControl} />
                        </div>
                    </div>

                    {/* Center Section (Screen) - Maximized */}
                    <div className="flex-1 flex items-center justify-center h-full py-1 md:py-4 px-0 md:px-2 min-w-0">
                        <Screen activeIndex={activeIndex} onNext={handleNext} onPrev={handlePrev} />
                    </div>

                    {/* Right Section - Extreme Mobile Compression */}
                    <div className="flex flex-col items-center justify-center gap-2 md:gap-12 w-[70px] md:w-[12%] h-full pt-2 md:pt-8 flex-shrink-0">
                        <div className="relative w-28 h-28 md:w-40 md:h-40 scale-[0.6] md:scale-100 origin-center">
                            {/* Diamond Layout for Buttons */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2">
                                <ActionButton label="X" color="text-yellow-500" onClick={goToNews} />
                            </div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                                <ActionButton label="B" color="text-red-500" onClick={goToAbout} />
                            </div>
                            <div className="absolute left-0 top-1/2 -translate-y-1/2">
                                <ActionButton label="Y" color="text-blue-500" onClick={goToCourse} />
                            </div>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2">
                                <ActionButton label="A" color="text-green-500" onClick={handleEnter} />
                            </div>
                        </div>
                        
                        <div className="relative mt-1 md:mt-4 scale-[0.6] md:scale-100 origin-center">
                            <span className="absolute -top-6 md:-top-8 left-1/2 -translate-x-1/2 text-[8px] md:text-[10px] text-gray-500 w-24 text-center leading-tight font-bold whitespace-nowrap hidden md:block">R-STICK<br/>点击切换主题</span>
                            <Joystick onClick={toggleTheme} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

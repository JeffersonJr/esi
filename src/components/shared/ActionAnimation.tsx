import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, Trash2, User, Home, Building, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type AnimationType = 'create-contact' | 'change-broker' | 'save-property' | 'delete' | 'success';

interface AnimationEvent {
    id: string;
    type: AnimationType;
    startX: number;
    startY: number;
    endX?: number;
    endY?: number;
    icon?: React.ElementType;
}

interface AnimationContextType {
    triggerAnimation: (event: Omit<AnimationEvent, 'id'>) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const useAnimation = () => {
    const context = useContext(AnimationContext);
    if (!context) {
        throw new Error('useAnimation must be used within an AnimationProvider');
    }
    return context;
};

export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [animations, setAnimations] = useState<AnimationEvent[]>([]);

    const triggerAnimation = useCallback((event: Omit<AnimationEvent, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        setAnimations((prev) => [...prev, { ...event, id }]);

        // Auto-remove after animation completes
        setTimeout(() => {
            setAnimations((prev) => prev.filter((a) => a.id !== id));
        }, 2000);
    }, []);

    return (
        <AnimationContext.Provider value={{ triggerAnimation }}>
            {children}
            <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
                <AnimatePresence>
                    {animations.map((anim) => (
                        <FlyingIcon key={anim.id} event={anim} />
                    ))}
                </AnimatePresence>
            </div>
        </AnimationContext.Provider>
    );
};

const FlyingIcon: React.FC<{ event: AnimationEvent }> = ({ event }) => {
    const { type, startX, startY, endX, endY, icon: CustomIcon } = event;

    // Default targets if not provided
    // In a real app, we might want to target specific UI elements (sidebar folders, trash can)
    // For now, we'll use sensible defaults or the provided coordinates
    const targetX = endX ?? (type === 'delete' ? window.innerWidth - 100 : 50);
    const targetY = endY ?? (type === 'delete' ? window.innerHeight - 50 : window.innerHeight / 2);

    const getIcon = () => {
        if (CustomIcon) return <CustomIcon className="w-6 h-6 text-indigo-600" />;

        switch (type) {
            case 'create-contact':
                return <User className="w-6 h-6 text-blue-500" />;
            case 'change-broker':
                return <User className="w-6 h-6 text-amber-500" />;
            case 'save-property':
                return <Building className="w-6 h-6 text-emerald-500" />;
            case 'delete':
                return <Trash2 className="w-6 h-6 text-red-500" />;
            case 'success':
                return <CheckCircle2 className="w-6 h-6 text-green-500" />;
            default:
                return <Folder className="w-6 h-6 text-slate-500" />;
        }
    };

    const getTargetIcon = () => {
        switch (type) {
            case 'delete':
                return <Trash2 className="w-8 h-8 text-slate-300" />;
            default:
                return <Folder className="w-8 h-8 text-slate-300" />;
        }
    };

    return (
        <>
            {/* The flying icon */}
            <motion.div
                initial={{ x: startX, y: startY, scale: 0.5, opacity: 0 }}
                animate={{
                    x: [startX, startX, targetX],
                    y: [startY, startY - 100, targetY],
                    scale: [0.5, 1.2, 0.2],
                    opacity: [0, 1, 0.8, 0],
                    rotate: [0, -20, 360]
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute flex items-center justify-center p-2 bg-white rounded-full shadow-lg border border-slate-100"
            >
                {getIcon()}
            </motion.div>

            {/* The destination visual feedback (ping at destination) */}
            <motion.div
                initial={{ x: targetX, y: targetY, scale: 0, opacity: 0 }}
                animate={{
                    scale: [0, 1.5, 1],
                    opacity: [0, 0.5, 0]
                }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className="absolute flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
            >
                {getTargetIcon()}
            </motion.div>
        </>
    );
};

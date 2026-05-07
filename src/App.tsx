import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { TopNav } from './components/TopNav';
import { MoodScreen } from './components/MoodScreen';
import { SanctuaryScreen } from './components/SanctuaryScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'mood' | 'yours'>('mood');
  const [selectedMood, setSelectedMood] = useState<string>('cozy');
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setCurrentScreen('yours');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container relative">
      <TopNav 
        currentScreen={currentScreen} 
        onNavigate={setCurrentScreen} 
        isPanelOpen={isPanelOpen}
      />
      
      <AnimatePresence mode="wait">
        {currentScreen === 'mood' && (
          <MoodScreen key="mood" onSelect={handleMoodSelect} />
        )}
        {currentScreen === 'yours' && (
          <SanctuaryScreen 
            key="yours" 
            mood={selectedMood} 
            isPanelOpen={isPanelOpen}
            onTogglePanel={setIsPanelOpen}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDisclaimer && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-4 py-2 bg-neutral-900/40 backdrop-blur-md rounded-full border border-outline-variant/20 shadow-lg pointer-events-auto"
          >
            <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-on-surface-variant opacity-60">
              All images are AI generated
            </span>
            <button 
              onClick={() => setShowDisclaimer(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors text-on-surface-variant"
            >
              <X size={10} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


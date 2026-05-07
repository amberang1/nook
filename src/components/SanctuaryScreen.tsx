import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dog, SlidersHorizontal, ChevronsLeft, ChevronsRight, 
  Play, Pause, Cat, RotateCcw, RefreshCw, X, Focus,
  ChevronDown, ChevronUp
} from 'lucide-react';

interface SanctuaryScreenProps {
  mood: string;
  isPanelOpen: boolean;
  onTogglePanel: (open: boolean) => void;
  key?: string;
}

const SOUNDS = [
  { id: 'rain_window', label: 'Rain on window', file: '/rain-loop.ogg' },
  { id: 'heavy_rain', label: 'Heavy rain', file: '/rain-loop.ogg' },
  { id: 'gentle_rain', label: 'Gentle rain', file: '/rain-loop.ogg' },
  { id: 'thunder', label: 'Thunder', file: '/rain-loop.ogg' },
  { id: 'ocean_waves', label: 'Ocean waves', file: '/nature-soft.ogg' },
  { id: 'river_stream', label: 'River stream', file: '/fish-tank.ogg' },
  { id: 'rain_tent', label: 'Rain on tent', file: '/rain-loop.ogg' },
  { id: 'crackling_fireplace', label: 'Fireplace', file: '/fire-loop.ogg' },
  { id: 'campfire', label: 'Campfire', file: '/fire-loop.ogg' },
  { id: 'birds', label: 'Birds', file: '/nature-soft.ogg' },
  { id: 'wind_trees', label: 'Wind trees', file: '/nature-soft.ogg' },
  { id: 'crickets', label: 'Crickets', file: '/nature-soft.ogg' },
  { id: 'leaves_rustling', label: 'Leaves rustling', file: '/nature-soft.ogg' },
  { id: 'frogs', label: 'Frogs', file: '/nature-soft.ogg' },
  { id: 'coffee_shop', label: 'Coffee shop', file: '/coffee-brew.ogg' },
  { id: 'keyboard', label: 'Keyboard', file: '/fan-loop.ogg' },
  { id: 'vinyl', label: 'Vinyl crackle', file: '/record-player.ogg' },
  { id: 'page_turning', label: 'Page turning', file: '/record-player.ogg' },
  { id: 'clock_ticking', label: 'Clock ticking', file: '/record-player.ogg' },
  { id: 'wind_chimes', label: 'Wind chimes', file: '/nature-soft.ogg' },
  { id: 'white_noise', label: 'White noise', file: '/fan-loop.ogg' },
  { id: 'brown_noise', label: 'Brown noise', file: '/fan-loop.ogg' },
  { id: 'pink_noise', label: 'Pink noise', file: '/fan-loop.ogg' },
  { id: 'train', label: 'Train tracks', file: '/record-player.ogg' },
  { id: 'city', label: 'City traffic', file: '/fan-loop.ogg' },
  { id: 'airplane', label: 'Airplane cabin', file: '/fan-loop.ogg' },
  { id: 'rain_train', label: 'Rain on train', file: '/rain-loop.ogg' },
  { id: 'singing_bowls', label: 'Singing bowls', file: '/nature-soft.ogg' },
  { id: 'binaural', label: 'Binaural tones', file: '/nature-soft.ogg' },
  { id: 'candle', label: 'Candle Ambience', file: '/candle-ambience.ogg' },
  { id: 'cat_purr', label: 'Cat Purring', file: '/cat-purr.ogg' },
  { id: 'dog_snoring', label: 'Dog Snoring', file: '/fan-loop.ogg' },
  { id: 'kettle', label: 'Kettle', file: '/kettle.ogg' },
];

const COZY_SCENES = [
  { id: 2, image: '/cozy-2.jpg', fallback: 'https://picsum.photos/seed/cozy-rain1/1920/1080?blur=2', sounds: { rain_window: 70, wind_trees: 30 } },
  { id: 3, image: '/cozy-3.jpg', fallback: 'https://picsum.photos/seed/cozy-attic/1920/1080?blur=2', sounds: { crickets: 60, candle: 20 } },
  { id: 4, image: '/cozy-4.jpg', fallback: 'https://picsum.photos/seed/cozy-rain2/1920/1080?blur=2', sounds: { heavy_rain: 60, thunder: 30 } },
  { id: 5, image: '/cozy-5.jpg', fallback: 'https://picsum.photos/seed/cozy-rain3/1920/1080?blur=2', sounds: { gentle_rain: 60, crackling_fireplace: 30 } },
  { id: 6, image: '/cozy-6.jpg', fallback: 'https://picsum.photos/seed/cozy-6/1920/1080?blur=2', sounds: { crackling_fireplace: 70, vinyl: 20 } },
  { id: 7, image: '/cozy-7.jpg', fallback: 'https://picsum.photos/seed/cozy-7/1920/1080?blur=2', sounds: { rain_window: 50, birds: 30 } },
];

const getScenePreset = (mood: string, index: number) => {
  const preset: Record<string, number> = {};
  SOUNDS.forEach(s => preset[s.id] = 0);
  
  if (mood === 'cozy') {
    const cozyScene = COZY_SCENES[(index - 1) % COZY_SCENES.length];
    Object.entries(cozyScene.sounds).forEach(([k, v]) => preset[k] = v as number);
  } else {
    if (mood === 'focus') { preset.white_noise = 40; preset.keyboard = 30; }
    if (mood === 'dreamy') { preset.wind_trees = 40; preset.candle = 50; }
    if (mood === 'calm') { preset.ocean_waves = 60; preset.river_stream = 20; }
    if (mood === 'moody') { preset.thunder = 60; preset.crickets = 50; }

    if (index % 2 === 0) preset.wind_trees += 20;
    if (index % 3 === 0) preset.rain_window += 30;
    if (index % 4 === 0) preset.coffee_shop += 40;
  }
  
  Object.keys(preset).forEach(k => preset[k] = Math.min(100, preset[k]));
  return preset;
};

export function SanctuaryScreen({ mood, isPanelOpen, onTogglePanel }: SanctuaryScreenProps) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);
  
  // Companions
  const [hasCat, setHasCat] = useState(false);
  const [hasDog, setHasDog] = useState(false);
  const [catScale, setCatScale] = useState(1);
  const [dogScale, setDogScale] = useState(1);
  const [catVariant, setCatVariant] = useState(1);
  const [dogVariant, setDogVariant] = useState(1);

  // Pomodoro (Focus Mode)
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [focusElapsed, setFocusElapsed] = useState(0);
  const [focusDuration, setFocusDuration] = useState(25 * 60); // Default 25 mins
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [mainVolume, setMainVolume] = useState(100);
  const [isTimerMinimized, setIsTimerMinimized] = useState(false);
  const [isTimerPanelOpen, setIsTimerPanelOpen] = useState(true);
  const [selectedCompanion, setSelectedCompanion] = useState<'cat' | 'dog' | null>(null);
  
  const [volumes, setVolumes] = useState<Record<string, number>>(() => getScenePreset(mood, 1));
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const constraintsRef = useRef(null);

  const [pinchStartDistance, setPinchStartDistance] = useState<number | null>(null);
  const [pinchStartScale, setPinchStartScale] = useState<number>(1);

  const handlePinchStart = (e: React.TouchEvent, currentScale: number) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      setPinchStartDistance(distance);
      setPinchStartScale(currentScale);
    }
  };

  const handlePinchMove = (e: React.TouchEvent, setScale: (s: number | ((prev: number) => number)) => void) => {
    if (e.touches.length === 2 && pinchStartDistance) {
      const distance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
      const scaleChange = distance / pinchStartDistance;
      const newScale = Math.min(2.5, Math.max(0.4, pinchStartScale * scaleChange));
      setScale(newScale);
    }
  };

  const getCompanionFilter = () => {
    switch (mood) {
      case 'moody':
        return 'brightness-[0.45] contrast-[0.9] saturate-[0.7] hue-rotate-[10deg]';
      case 'dreamy':
        // Pinker hue shift (320deg), lower saturation (0.5)
        return 'brightness-[0.95] contrast-[0.85] saturate-[0.5] blur-[0.2px] opacity-95 hue-rotate-[320deg]';
      case 'focus':
        // Brighter and lighter
        return 'brightness-[1.1] contrast-[1.05] saturate-[0.9]';
      case 'calm':
        // Brighter and lighter
        return 'brightness-[1.05] contrast-[1.0] saturate-[0.95]';
      default:
        return 'brightness-[0.85] contrast-[1.0]';
    }
  };

  // Initialize audio objects
  useEffect(() => {
    SOUNDS.forEach(sound => {
      const audio = new Audio(sound.file);
      audio.loop = true;
      audio.volume = 0;
      audioRefs.current[sound.id] = audio;
    });

    return () => {
      Object.values(audioRefs.current).forEach((audio: HTMLAudioElement) => {
        audio.pause();
        audio.src = '';
      });
      audioRefs.current = {};
    };
  }, []);

  // Handle volume changes and play/pause
  useEffect(() => {
    SOUNDS.forEach(sound => {
      const audio = audioRefs.current[sound.id];
      if (audio) {
        const targetVolume = (volumes[sound.id] / 100) * (mainVolume / 100);
        audio.volume = targetVolume;
        
        if (isPlaying && targetVolume > 0) {
          if (audio.paused) {
            audio.play().catch(err => console.log('Audio play blocked:', err));
          }
        } else {
          if (!audio.paused) {
            audio.pause();
          }
        }
      }
    });
  }, [volumes, mainVolume, isPlaying]);

  const [time, setTime] = useState(0);

  // Initialize scene
  useEffect(() => {
    generateNewScene();
  }, [mood]);

  const generateNewScene = (forceIndex?: number | React.MouseEvent) => {
    let newIndex;
    if (typeof forceIndex === 'number') {
      newIndex = forceIndex;
    } else if (mood === 'cozy') {
      // Cozy scenes start from 2
      if (sceneIndex < 2) newIndex = 2;
      else newIndex = sceneIndex >= 7 ? 2 : sceneIndex + 1;
    } else if (mood === 'calm') {
      if (sceneIndex < 1) newIndex = 1;
      else newIndex = sceneIndex >= 5 ? 1 : sceneIndex + 1;
    } else if (mood === 'dreamy') {
      if (sceneIndex < 1) newIndex = 1;
      else newIndex = sceneIndex >= 5 ? 1 : sceneIndex + 1;
    } else if (mood === 'moody') {
      if (sceneIndex < 1) newIndex = 1;
      else newIndex = sceneIndex >= 4 ? 1 : sceneIndex + 1;
    } else if (mood === 'focus') {
      newIndex = 1;
    } else {
      newIndex = Math.floor(Math.random() * 10) + 1;
    }
    setSceneIndex(newIndex);
    const newPreset = getScenePreset(mood, newIndex);
    
    setVolumes({
      ...newPreset,
      cat_purr: hasCat ? 60 : newPreset.cat_purr,
      dog_snoring: hasDog ? 60 : newPreset.dog_snoring,
    });
  };

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setTime(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    let interval: number;
    if (isFocusMode) {
      interval = window.setInterval(() => {
        setFocusElapsed(t => Math.min(t + 1, focusDuration));
      }, 1000);
    } else {
      setFocusElapsed(0);
    }
    return () => clearInterval(interval);
  }, [isFocusMode]);

  const progressPercent = (focusElapsed / focusDuration) * 100;

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
  };

  const handleCatClick = () => {
    if (!hasCat) {
      setHasCat(true);
      setVolumes(v => ({ ...v, cat_purr: 60 }));
    }
  };

  const removeCat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasCat(false);
    setVolumes(v => ({ ...v, cat_purr: 0 }));
  };

  const handleDogClick = () => {
    if (!hasDog) {
      setHasDog(true);
      setVolumes(v => ({ ...v, dog_snoring: 60 }));
    }
  };

  const removeDog = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasDog(false);
    setVolumes(v => ({ ...v, dog_snoring: 0 }));
  };

  const handleReset = () => {
    const resetVols: Record<string, number> = {};
    SOUNDS.forEach(s => resetVols[s.id] = 0);
    setVolumes(resetVols);
    setHasCat(false);
    setHasDog(false);
  };

  const activeSoundsList = SOUNDS.filter(s => volumes[s.id] > 0);
  const inactiveSoundsList = SOUNDS.filter(s => volumes[s.id] === 0 && s.id !== 'cat_purr' && s.id !== 'dog_snoring');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative h-screen w-screen overflow-hidden bg-background"
    >
      {/* Focus Mode Progress Bar */}
      {isFocusMode && (
        <motion.div 
          className="fixed top-0 left-0 h-1 bg-primary z-50 shadow-[0_0_10px_rgba(233,195,73,0.8)]"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ ease: "linear", duration: 1 }}
        />
      )}

      {/* Background Layer */}
      <div ref={constraintsRef} className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src={
            mood === 'cozy' ? COZY_SCENES.find(s => s.id === sceneIndex)?.image :
            mood === 'calm' ? `/calm-${sceneIndex}.jpg` :
            mood === 'focus' ? `/focus-${sceneIndex}.jpg` :
            mood === 'moody' ? `/moody-${sceneIndex}.jpg` :
            mood === 'dreamy' ? `/dreamy-${sceneIndex}.jpg` :
            `https://picsum.photos/seed/${mood}-${sceneIndex}/1920/1080?blur=2`
          } 
          onError={(e) => {
            e.currentTarget.onerror = null;
            if (mood === 'cozy') {
              e.currentTarget.src = COZY_SCENES.find(s => s.id === sceneIndex)?.fallback || `https://picsum.photos/seed/${mood}-${sceneIndex}/1920/1080?blur=2`;
            } else {
              e.currentTarget.src = `https://picsum.photos/seed/${mood}-${sceneIndex}/1920/1080?blur=2`;
            }
          }}
          alt={`${mood} atmosphere`} 
          className="w-full h-full object-cover scale-105 transition-opacity duration-500"
          referrerPolicy="no-referrer"
        />
        {/* Companion Images */}
        <AnimatePresence>
          {hasCat && (
            <motion.div
              key="cat"
              drag
              dragConstraints={constraintsRef}
              dragElastic={0.1}
              dragMomentum={false}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onTap={() => setSelectedCompanion(selectedCompanion === 'cat' ? null : 'cat')}
              onTouchStart={(e) => handlePinchStart(e, catScale)}
              onTouchMove={(e) => handlePinchMove(e, setCatScale)}
              className={`absolute bottom-[10%] left-[30%] z-30 cursor-grab active:cursor-grabbing ${selectedCompanion === 'cat' ? 'ring-2 ring-primary/40 ring-offset-4 ring-offset-transparent rounded-2xl' : ''}`}
            >
              <div className="relative">
                <motion.img 
                  src={catVariant === 1 ? "/cozycat.png" : "/cat-2.png"}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://loremflickr.com/400/400/cat?lock=1"; }}
                  alt="Cat companion"
                  style={{ scale: catScale }}
                  className={`w-[14.5vw] min-w-[96px] max-w-[240px] h-auto object-contain drop-shadow-2xl pointer-events-none transition-all duration-1000 ${getCompanionFilter()}`}
                  referrerPolicy="no-referrer"
                />
                
                {/* Mobile-friendly On-Screen Size Controls */}
                <AnimatePresence>
                  {selectedCompanion === 'cat' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute -top-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 bg-neutral-900/95 backdrop-blur-xl rounded-2xl p-4 border border-outline-variant/30 shadow-2xl pointer-events-auto min-w-[160px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Cat Size</span>
                        <button onClick={() => setSelectedCompanion(null)} className="text-on-surface-variant hover:text-primary"><X size={12} /></button>
                      </div>
                      <div className="flex items-center gap-4 w-full">
                        <button onClick={() => setCatScale(s => Math.max(0.5, s - 0.1))} className="w-8 h-8 flex items-center justify-center bg-surface-container-low rounded-lg text-on-surface hover:text-primary transition-colors text-xl font-bold">-</button>
                        <input 
                          type="range" min="0.5" max="2" step="0.1"
                          value={catScale}
                          onChange={(e) => setCatScale(parseFloat(e.target.value))}
                          className="flex-grow h-2"
                        />
                        <button onClick={() => setCatScale(s => Math.min(2, s + 0.1))} className="w-8 h-8 flex items-center justify-center bg-surface-container-low rounded-lg text-on-surface hover:text-primary transition-colors text-xl font-bold">+</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
          {hasDog && (
            <motion.div
              key="dog"
              drag
              dragConstraints={constraintsRef}
              dragElastic={0.1}
              dragMomentum={false}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onTap={() => setSelectedCompanion(selectedCompanion === 'dog' ? null : 'dog')}
              onTouchStart={(e) => handlePinchStart(e, dogScale)}
              onTouchMove={(e) => handlePinchMove(e, setDogScale)}
              className={`absolute bottom-[10%] right-[30%] z-30 cursor-grab active:cursor-grabbing ${selectedCompanion === 'dog' ? 'ring-2 ring-primary/40 ring-offset-4 ring-offset-transparent rounded-2xl' : ''}`}
            >
              <div className="relative">
                <motion.img 
                  src={dogVariant === 1 ? "/cozydog.png" : "/dog-2.png"}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://loremflickr.com/400/400/dog?lock=1"; }}
                  alt="Dog companion"
                  style={{ scale: dogScale }}
                  className={`w-[18vw] min-w-[120px] max-w-[300px] h-auto object-contain drop-shadow-2xl pointer-events-none transition-all duration-1000 ${getCompanionFilter()}`}
                  referrerPolicy="no-referrer"
                />

                {/* Mobile-friendly On-Screen Size Controls */}
                <AnimatePresence>
                  {selectedCompanion === 'dog' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute -top-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 bg-neutral-900/95 backdrop-blur-xl rounded-2xl p-4 border border-outline-variant/30 shadow-2xl pointer-events-auto min-w-[160px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Dog Size</span>
                        <button onClick={() => setSelectedCompanion(null)} className="text-on-surface-variant hover:text-primary"><X size={12} /></button>
                      </div>
                      <div className="flex items-center gap-4 w-full">
                        <button onClick={() => setDogScale(s => Math.max(0.5, s - 0.1))} className="w-8 h-8 flex items-center justify-center bg-surface-container-low rounded-lg text-on-surface hover:text-primary transition-colors text-xl font-bold">-</button>
                        <input 
                          type="range" min="0.5" max="2" step="0.1"
                          value={dogScale}
                          onChange={(e) => setDogScale(parseFloat(e.target.value))}
                          className="flex-grow h-2"
                        />
                        <button onClick={() => setDogScale(s => Math.min(2, s + 0.1))} className="w-8 h-8 flex items-center justify-center bg-surface-container-low rounded-lg text-on-surface hover:text-primary transition-colors text-xl font-bold">+</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scene Filters (moved here to apply over companions) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-background/60 via-background/20 to-primary/5 opacity-50 pointer-events-none z-40"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_65%,_rgba(233,195,73,0.08)_0%,_transparent_50%)] pointer-events-none z-40"></div>
      </div>

      {/* Side Panel */}
      <motion.aside 
        initial={{ x: -320 }}
        animate={{ x: isPanelOpen ? 0 : -320 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`fixed left-0 top-1/2 -translate-y-1/2 w-80 z-40 flex flex-col p-6 bg-neutral-900/60 backdrop-blur-xl rounded-r-2xl h-[95vh] shadow-[30px_0_60px_rgba(230,229,225,0.05)] border-r border-outline-variant/10 transition-opacity duration-700 ${isFocusMode ? 'opacity-30 hover:opacity-100' : 'opacity-100'}`}
      >
        <div className="space-y-6 flex-grow overflow-y-auto custom-scrollbar pr-2 pb-4 pt-16">
          
          {/* Regenerate Scene */}
          <button 
            onClick={() => generateNewScene()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
          >
            <RefreshCw size={16} />
            <span className="font-label text-[10px] uppercase tracking-widest font-bold">Regenerate Scene</span>
          </button>

          {/* Companions (Moved here and made a toggle) */}
          <section className="space-y-3">
            <button 
              onClick={() => setIsCompanionOpen(!isCompanionOpen)}
              className="w-full flex items-center justify-between text-primary group"
            >
              <div className="flex items-center gap-2">
                <Cat size={14} />
                <h3 className="font-label text-[10px] uppercase tracking-widest font-bold">Add Companion</h3>
              </div>
              {isCompanionOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            
            <AnimatePresence>
              {isCompanionOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pb-2">
                    {/* Cat Row */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button 
                          onClick={hasCat ? removeCat : handleCatClick}
                          className={`flex-grow flex items-center justify-center gap-2 p-2 rounded-lg transition-all ${hasCat ? 'bg-primary/10 text-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
                        >
                          <Cat size={14} />
                          <span className="text-[9px] font-bold">Cat</span>
                          {hasCat && <X size={10} className="ml-1 opacity-50" />}
                        </button>
                        <button 
                          onClick={() => setCatVariant(v => v === 1 ? 2 : 1)}
                          className={`p-2 rounded-lg transition-all ${hasCat ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
                          title="Regenerate Cat"
                        >
                          <RefreshCw size={12} className={hasCat ? "animate-spin-slow" : ""} />
                        </button>
                      </div>
                      {hasCat && (
                        <div className="px-2 space-y-1">
                          <div className="flex justify-between text-[8px] uppercase tracking-widest text-on-surface-variant opacity-60">
                            <span>Size</span>
                            <span>{Math.round(catScale * 100)}%</span>
                          </div>
                          <input 
                            type="range" min="0.5" max="2" step="0.1"
                            value={catScale}
                            onChange={(e) => setCatScale(parseFloat(e.target.value))}
                            className="w-full h-2"
                          />
                        </div>
                      )}
                    </div>

                    {/* Dog Row */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button 
                          onClick={hasDog ? removeDog : handleDogClick}
                          className={`flex-grow flex items-center justify-center gap-2 p-2 rounded-lg transition-all ${hasDog ? 'bg-primary/10 text-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
                        >
                          <Dog size={14} />
                          <span className="text-[9px] font-bold">Dog</span>
                          {hasDog && <X size={10} className="ml-1 opacity-50" />}
                        </button>
                        <button 
                          onClick={() => setDogVariant(v => v === 1 ? 2 : 1)}
                          className={`p-2 rounded-lg transition-all ${hasDog ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
                          title="Regenerate Dog"
                        >
                          <RefreshCw size={12} className={hasDog ? "animate-spin-slow" : ""} />
                        </button>
                      </div>
                      {hasDog && (
                        <div className="px-2 space-y-1">
                          <div className="flex justify-between text-[8px] uppercase tracking-widest text-on-surface-variant opacity-60">
                            <span>Size</span>
                            <span>{Math.round(dogScale * 100)}%</span>
                          </div>
                          <input 
                            type="range" min="0.5" max="2" step="0.1"
                            value={dogScale}
                            onChange={(e) => setDogScale(parseFloat(e.target.value))}
                            className="w-full h-2"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Sound Mixer */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <SlidersHorizontal size={14} />
                <h3 className="font-label text-[10px] uppercase tracking-widest font-bold">Sound Mixer</h3>
              </div>
              <button onClick={handleReset} className="text-on-surface-variant hover:text-primary transition-colors" title="Reset Sounds">
                <RotateCcw size={14} />
              </button>
            </div>
            
            <div className="space-y-1.5 mb-6">
              <div className="flex justify-between text-[9px] uppercase tracking-widest text-on-surface">
                <span>Master Volume</span>
              </div>
              <input 
                type="range" 
                min="0" max="100" 
                value={mainVolume}
                onChange={(e) => setMainVolume(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Active Sounds */}
            {activeSoundsList.length > 0 && (
              <div className="mb-8">
                <h4 className="font-label text-[9px] uppercase tracking-widest text-primary font-bold mb-4">Active Sounds</h4>
                <AnimatePresence>
                  {activeSoundsList.map(sound => (
                    <motion.div 
                      key={sound.id} 
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1 py-2">
                        <div className="flex justify-between text-[9px] uppercase tracking-widest text-on-surface">
                          <span>{sound.label}</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" max="100" 
                          value={volumes[sound.id]}
                          onChange={(e) => setVolumes({...volumes, [sound.id]: parseInt(e.target.value)})}
                          className="w-full"
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Add More Sounds */}
            {inactiveSoundsList.length > 0 && (
              <div>
                <h4 className="font-label text-[9px] uppercase tracking-widest text-primary font-bold mb-4">Add More Sounds</h4>
                <div className="space-y-4">
                  {inactiveSoundsList.map((sound) => (
                    <div key={sound.id} className="space-y-1">
                      <div className="flex justify-between text-[9px] uppercase tracking-widest text-on-surface-variant">
                        <span>{sound.label}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={volumes[sound.id]}
                        onChange={(e) => setVolumes({...volumes, [sound.id]: parseInt(e.target.value)})}
                        className="w-full opacity-50 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </motion.aside>

      {/* Panel Toggle Button */}
      <button 
        onClick={() => onTogglePanel(!isPanelOpen)}
        className={`fixed top-1/2 -translate-y-1/2 z-50 p-2 bg-surface-container-highest/80 backdrop-blur-md rounded-r-xl border border-l-0 border-outline-variant/20 text-on-surface-variant hover:text-primary transition-all duration-500 ${isPanelOpen ? 'left-80' : 'left-0'}`}
      >
        {isPanelOpen ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
      </button>

      {/* Pomodoro Timer (Bottom Right) */}
      <div className="absolute bottom-8 right-6 md:right-12 flex flex-col items-end gap-4 z-50 max-w-[calc(100vw-48px)]">
        <AnimatePresence>
          {!isTimerPanelOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setIsTimerPanelOpen(true)}
              className="p-3 bg-surface-container-highest/80 backdrop-blur-xl rounded-full border border-outline-variant/20 shadow-2xl text-on-surface-variant hover:text-primary transition-all"
              title="Show Pomodoro"
            >
              <Focus size={20} />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isFocusMode && isTimerPanelOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: 1,
                width: isTimerMinimized ? '48px' : 'auto',
                height: isTimerMinimized ? '48px' : 'auto',
              }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className={`bg-surface-container-highest/80 backdrop-blur-xl rounded-2xl border border-outline-variant/20 shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ${isTimerMinimized ? 'p-0 items-center justify-center' : 'p-4 min-w-[200px] text-center'}`}
            >
              {isTimerMinimized ? (
                <button 
                  onClick={() => setIsTimerMinimized(false)}
                  className="w-full h-full flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                  title="Show Timer"
                >
                  <Focus size={20} className="animate-pulse" />
                </button>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-6" /> {/* Spacer */}
                    <div className="text-primary font-mono text-2xl">
                      {formatTime(focusDuration - focusElapsed)}
                    </div>
                    <button 
                      onClick={() => setIsTimerMinimized(true)}
                      className="p-1 text-on-surface-variant hover:text-primary transition-colors"
                      title="Minimize"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Pomodoro Active
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isTimerPanelOpen && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className={`relative flex flex-col gap-2 bg-surface-container-highest/60 backdrop-blur-md p-3 rounded-2xl border border-outline-variant/20 shadow-2xl transition-all duration-500 ${isFocusMode && isTimerMinimized ? 'opacity-40 hover:opacity-100' : 'opacity-100'}`}
            >
              {/* Top Toggle Button */}
              <button 
                onClick={() => setIsTimerPanelOpen(false)}
                className="absolute -top-3 -right-3 p-1.5 bg-surface-container-highest border border-outline-variant/20 rounded-full text-on-surface-variant hover:text-primary transition-all shadow-lg"
                title="Hide Pomodoro"
              >
                <X size={12} />
              </button>

              {!isFocusMode && (
                <div className="flex gap-2 mb-2">
                  {[15, 25, 40].map(mins => (
                    <button
                      key={mins}
                      onClick={() => setFocusDuration(mins * 60)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${focusDuration === mins * 60 ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              )}
              
              <button 
                onClick={() => setIsFocusMode(!isFocusMode)}
                className={`w-full py-3 px-6 rounded-xl border text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 flex items-center justify-center gap-2 ${
                  isFocusMode 
                    ? 'bg-primary text-on-primary border-primary shadow-[0_0_15px_rgba(233,195,73,0.4)]' 
                    : 'border-outline-variant/20 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <Focus size={14} />
                {isFocusMode ? 'Stop' : 'Start Pomodoro'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}

import { Coffee, Focus, Droplets, CloudRain, Wind, Moon } from 'lucide-react';
import { motion } from 'motion/react';

const moods = [
  { id: 'cozy', label: 'Cozy', icon: Coffee, color: 'text-orange-400', bgHover: 'group-hover:bg-orange-400/5', shadowHover: 'group-hover:shadow-orange-500/10' },
  { id: 'focus', label: 'Focus', icon: Focus, color: 'text-blue-400', bgHover: 'group-hover:bg-blue-400/5', shadowHover: 'group-hover:shadow-blue-500/10' },
  { id: 'dreamy', label: 'Dreamy', icon: CloudRain, color: 'text-purple-400', bgHover: 'group-hover:bg-purple-400/5', shadowHover: 'group-hover:shadow-purple-500/10' },
  { id: 'calm', label: 'Calm', icon: Wind, color: 'text-emerald-400', bgHover: 'group-hover:bg-emerald-400/5', shadowHover: 'group-hover:shadow-emerald-500/10' },
  { id: 'moody', label: 'Moody', icon: Moon, color: 'text-slate-400', bgHover: 'group-hover:bg-slate-400/5', shadowHover: 'group-hover:shadow-slate-500/10' },
];

interface MoodScreenProps {
  onSelect: (mood: string) => void;
  key?: string;
}

export function MoodScreen({ onSelect }: MoodScreenProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-32 overflow-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "linear-gradient(to bottom, rgba(14, 14, 14, 0.4), rgba(14, 14, 14, 0.8)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" 
        }}
      />

      <div className="relative z-10 max-w-4xl text-center mb-20 mt-12">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-headline text-5xl md:text-7xl font-light text-on-surface tracking-tight mb-4"
        >
          How do you feel right now?
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-body text-on-surface-variant text-lg tracking-wide opacity-80"
        >
          Choose a mood to shape your digital environment.
        </motion.p>
      </div>

      <motion.div 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="relative z-10 flex flex-wrap justify-center gap-4 md:gap-6 w-full max-w-3xl mx-auto"
      >
        {moods.map((mood) => (
          <div 
            key={mood.id}
            onClick={() => onSelect(mood.id)}
            className="glass-card group flex flex-col items-center justify-center w-[calc(33.33%-1rem)] md:w-[calc(33.33%-1.5rem)] min-w-[140px] max-w-[220px] aspect-square rounded-2xl p-4 cursor-pointer relative overflow-hidden"
          >
            <div className={`absolute inset-0 opacity-0 transition-opacity duration-700 ${mood.bgHover}`}></div>
            <div className={`w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center mb-3 shadow-xl transition-all ${mood.shadowHover}`}>
              <mood.icon className={`w-5 h-5 opacity-80 ${mood.color}`} strokeWidth={1.5} />
            </div>
            <span className={`font-label text-[10px] uppercase tracking-[0.2em] font-medium text-on-surface transition-colors ${mood.color.replace('text-', 'group-hover:text-')}`}>
              {mood.label}
            </span>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

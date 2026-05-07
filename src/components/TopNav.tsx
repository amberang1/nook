
interface TopNavProps {
  currentScreen: 'mood' | 'yours';
  onNavigate: (screen: 'mood' | 'yours') => void;
  isPanelOpen: boolean;
}

export function TopNav({ currentScreen, onNavigate, isPanelOpen }: TopNavProps) {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-6 bg-transparent pointer-events-none">
      <div className="flex items-center pointer-events-auto">
        <div 
          className={`text-2xl font-headline italic cursor-pointer transition-all duration-500 ${
            currentScreen === 'yours' 
              ? (isPanelOpen ? 'text-primary/30' : 'text-primary/60') 
              : 'text-primary'
          }`}
          onClick={() => onNavigate('mood')}
        >
          Nook
        </div>
      </div>

      <div className="flex items-center gap-6 pointer-events-auto">
        {/* Settings and User profile removed for launch as they have no functionality yet */}
      </div>
    </nav>
  );
}


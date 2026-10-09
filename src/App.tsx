import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Entrance from './components/Entrance';
import AuraPlayer from './components/AuraPlayer';
import Conquests from './components/sections/Conquests';
import Arsenal from './components/sections/Arsenal';
import Transmission from './components/sections/Transmission';

// --- NEW HUD ARCHITECTURE ---

const App = () => {
   // 'BOOT' | 'ARSENAL' | 'CONQUESTS' | 'TRANSMISSION'
   const [currentView, setCurrentView] = useState<'BOOT' | 'ARSENAL' | 'CONQUESTS' | 'TRANSMISSION'>('BOOT');
   const [hasEntered, setHasEntered] = useState(false);

   const handleEntranceComplete = () => {
      setHasEntered(true);
      setCurrentView('CONQUESTS');
   };

   return (
      <main className="relative w-screen h-screen bg-void-black text-white overflow-hidden selection:bg-warrior-crimson selection:text-white">

         {/* ENTRANCE LAYER */}
         {!hasEntered && <Entrance onComplete={handleEntranceComplete} />}

         {/* AUDIO LAYER (Persistent) */}
         <AuraPlayer startPlaying={hasEntered} />

         {/* AMBIENT BACKGROUND (Static & Noise) */}
         <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-50 contrast-150"></div>

         {/* CONTENT LAYER */}
         <div className={`relative z-10 w-full h-full flex flex-col transition-opacity duration-1000 ${hasEntered ? 'opacity-100' : 'opacity-0'}`}>

            {/* HUD HEADER (Top Bar) */}
            <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-void-black/80 backdrop-blur z-20">
               <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${hasEntered ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="font-mono text-xs tracking-[0.2em] text-warrior-silver">VASUDEV SIDDH // PORTFOLIO_SYS</span>
               </div>
               <div className="font-mono text-xs text-warrior-crimson animate-pulse-fast">
                  [ OP: WARRIOR ]
               </div>
            </header>

            {/* MAIN VIEWPORT */}
            <div className="flex-1 p-4 md:p-8 relative overflow-hidden">
               {/* HUD CORNERS */}
               <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20" />
               <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20" />
               <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20" />
               <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20" />

               {/* DYNAMIC CONTENT */}
               <AnimatePresence mode="wait">
                  <motion.div
                     key={currentView}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     transition={{ duration: 0.3 }}
                     className="w-full h-full"
                  >
                     {currentView === 'CONQUESTS' && <Conquests />}
                     {currentView === 'ARSENAL' && <Arsenal />}
                     {currentView === 'TRANSMISSION' && <Transmission />}
                  </motion.div>
               </AnimatePresence>
            </div>

            {/* HUD NAVIGATION (Bottom Bar) */}
            <nav className="h-20 border-t border-white/10 flex items-center justify-center gap-4 md:gap-12 bg-void-black/80 backdrop-blur z-20 relative">
               {['CONQUESTS', 'ARSENAL', 'TRANSMISSION'].map((view) => (
                  <button
                     key={view}
                     onClick={() => setCurrentView(view as any)}
                     className={`
                                relative px-6 py-2 font-mono text-xs md:text-sm tracking-[0.2em] transition-all duration-300
                                border border-transparent
                                ${currentView === view
                           ? 'text-warrior-crimson font-bold border-warrior-crimson/50 bg-warrior-crimson/5'
                           : 'text-warrior-silver opacity-50 hover:opacity-100 hover:text-white'}
                            `}
                  >
                     {/* Marker line for active tab */}
                     {currentView === view && (
                        <motion.div
                           layoutId="activeTab"
                           className="absolute bottom-0 left-0 w-full h-[2px] bg-warrior-crimson box-shadow-[0_0_10px_#8B0000]"
                        />
                     )}
                     {view}
                  </button>
               ))}
            </nav>

         </div>
      </main>
   );
};

export default App;

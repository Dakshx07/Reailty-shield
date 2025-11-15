import React, { useState, lazy, Suspense } from 'react';
type { AnalysisMode } from '../types';
import ModeSelector from './ModeSelector'; // This is now the Sidebar

// Lazy load components for better initial performance
const TextAnalysis = lazy(() => import('./TextAnalysis'));
const MediaAnalysis = lazy(() => import('./MediaAnalysis'));
const ArAnalysis = lazy(() => import('./ArAnalysis'));
const SpreadVisualization = lazy(() => import('./SpreadVisualization'));
const ChallengeMode = lazy(() => import('./ChallengeMode'));

interface DashboardProps {
  showSplash: () => void;
}

// Define a more specific type for the component map to improve type safety
interface ComponentMap {
  [key: string]: React.LazyExoticComponent<React.FC<any>>;
}

const componentMap: ComponentMap = {
    challenge: ChallengeMode,
    text: TextAnalysis,
    media: MediaAnalysis,
    ar: ArAnalysis,
    spread: SpreadVisualization,
};

const Dashboard: React.FC<DashboardProps> = ({ showSplash }) => {
  // Initialize state with a default mode, ensuring it's a valid AnalysisMode
  const [mode, setMode] = useState<AnalysisMode>('text');
  
  // Safely get the component based on the current mode
  const ActiveComponent = componentMap[mode] || TextAnalysis; // Fallback to a default component

  return (
    <div className="min-h-screen flex w-full relative">
      <div className="absolute inset-0 bg-neutral-900/50 hud-grid"></div>
      <ModeSelector 
        currentMode={mode} 
        onSelectMode={setMode as (mode: AnalysisMode) => void} // Explicitly cast for clarity
        onShowSplash={showSplash}
      />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto relative [perspective:1200px]">
        <div key={mode} className="w-full max-w-6xl mx-auto animate-panel-enter">
          {/* Use Suspense to handle lazy-loaded components */}
          <Suspense fallback={<div className='text-white'>Loading...</div>}> {/* Provide a fallback UI */}
             <ActiveComponent />
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

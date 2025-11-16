import React, { useState, useEffect } from 'react';
import type { ChallengeItem } from '../types';
import Confetti from './ui/Confetti';
import { AcademicCapIcon, CheckCircleIcon, ShieldExclamationIcon } from './Icons';

// Consider fetching challenges from an API in a real application.
const mockChallenges: ChallengeItem[] = [
  { id: 1, claim: "Eating oranges prevents COVID-19 because of Vitamin C.", isMisinfo: true, tip: "While Vitamin C is good for immunity, it's not a proven cure or prevention for COVID-19. Always check with health authorities like the WHO." },
  { id: 2, claim: "A study found that regular exercise can improve cardiovascular health.", isMisinfo: false, tip: "This claim is well-supported by scientific evidence. Reputable health organizations consistently recommend exercise." },
  { id: 3, claim: "You can charge your phone by microwaving it for 30 seconds.", isMisinfo: true, tip: "This is a dangerous hoax that can destroy your phone and microwave. Be wary of 'secret' tech tricks that defy physics." },
  { id: 4, claim: "The Eiffel Tower is located in Paris, France.", isMisinfo: false, tip: "This is a widely known and easily verifiable fact. Simple facts are rarely the subject of complex misinformation." },
  { id: 5, claim: "A picture shows a shark swimming on a flooded highway in Houston.", mediaUrl: "https://images.unsplash.com/photo-1574042353323-24143a443715?q=80&w=2070&auto=format&fit=crop", isMisinfo: true, tip: "This is a classic example of a photoshopped image that goes viral after natural disasters. Use reverse image search to find the original photo." }
];

// Memoize components to prevent unnecessary re-renders
const MemoizedConfetti = React.memo(Confetti);

const ChallengeMode: React.FC = () => {
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
    // Use a more descriptive type for answer state
    const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | 'idle'>('idle');
    const [showConfetti, setShowConfetti] = useState(false);

    // Ensure challenge data is stable
    const challenges = React.useMemo(() => mockChallenges, []);
    const currentChallenge = challenges[currentChallengeIndex];

    // Use useEffect for side effects like confetti timeout
    useEffect(() => {
        if (showConfetti) {
            const timer = setTimeout(() => setShowConfetti(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [showConfetti]);

    const handleAnswer = (isMisinfoGuess: boolean) => {
        if (answerStatus !== 'idle') return;

        const isCorrect = isMisinfoGuess === currentChallenge.isMisinfo;

        if (isCorrect) {
            setAnswerStatus('correct');
            setScore(prev => prev + 10);
            setStreak(prev => prev + 1);
            setShowConfetti(true);
        } else {
            setAnswerStatus('incorrect');
            setStreak(0);
        }
    };
    
    const handleNext = () => {
        setAnswerStatus('idle');
        // Use modulo arithmetic for cycling through challenges safely
        setCurrentChallengeIndex(prevIndex => (prevIndex + 1) % challenges.length);
    };
    
    // Extracted components for better readability and reusability
    const GameCard = React.memo(() => (
        <div className="relative animate-[challenge-card-in_0.5s_ease-out_forwards]">
            {showConfetti && <MemoizedConfetti />}
            {currentChallenge.mediaUrl && (
                <img 
                    src={currentChallenge.mediaUrl} 
                    alt="Challenge media" 
                    className="w-full h-64 object-cover rounded-t-2xl border-t border-x border-white/10" 
                    // Added error handling for image loading
                    onError={(e) => (e.currentTarget.style.display = 'none')} 
                />
            )}
            <div className="bg-black/20 border border-white/10 p-8 rounded-b-2xl">
                 <p className="text-gray-400 text-sm font-bold tracking-widest">IS THIS MISINFORMATION?</p>
                <h3 className="text-2xl md:text-3xl font-semibold text-white my-4">{currentChallenge.claim}</h3>
                
                <div className="mt-8 grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => handleAnswer(true)}
                        disabled={answerStatus !== 'idle'}
                        className="py-4 text-lg font-bold bg-red-600/80 hover:bg-red-600 disabled:opacity-50 disabled:hover:bg-red-600/80 rounded-lg transition-all transform hover:scale-105 disabled:scale-100"
                    >False / Misinfo</button>
                    <button 
                        onClick={() => handleAnswer(false)}
                        disabled={answerStatus !== 'idle'}
                        className="py-4 text-lg font-bold bg-green-600/80 hover:bg-green-600 disabled:opacity-50 disabled:hover:bg-green-600/80 rounded-lg transition-all transform hover:scale-105 disabled:scale-100"
                    >True / Authentic</button>
                </div>
            </div>
        </div>
    ));

    const ResultCard = React.memo(() => (
        <div className="bg-black/20 border border-white/10 rounded-2xl p-8 animate-[challenge-card-in_0.5s_ease-out_forwards]">
            <div className="flex items-center gap-4">
                 {answerStatus === 'correct' ? <CheckCircleIcon className="w-12 h-12 text-green-400" /> : <ShieldExclamationIcon className="w-12 h-12 text-red-400" />}
                <div>
                    <h3 className={`font-clash text-3xl font-semibold ${answerStatus === 'correct' ? 'text-green-400' : 'text-red-400'}`}>
                        {answerStatus === 'correct' ? 'Correct!' : 'Incorrect!'}
                    </h3>
                    <p className="text-gray-400">The claim was {currentChallenge.isMisinfo ? 'indeed misinformation' : 'authentic'}.</p>
                </div>
            </div>
            <div className="mt-6 bg-black/20 p-4 rounded-lg border border-white/10">
                <p className="font-semibold text-cyan-300 flex items-center gap-2"><AcademicCapIcon className="w-5 h-5"/> Educational Tip:</p>
                <p className="text-gray-300 mt-2">{currentChallenge.tip}</p>
            </div>
            <button onClick={handleNext} className="mt-8 w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-500 transition-colors">
                {currentChallengeIndex === challenges.length - 1 ? 'Play Again' : 'Next Challenge'}
            </button>
        </div>
    ));

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="font-clash text-5xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 text-center">Cognitive Training Simulator</h1>
            <p className="text-xl text-gray-400 mb-8 text-center">Sharpen your skills. Spot the lies.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {answerStatus === 'idle' ? <GameCard /> : <ResultCard />}
                </div>
                <div className="space-y-6">
                    <div className="bg-black/20 border border-white/10 rounded-2xl p-6 text-center">
                        <p className="text-gray-400 text-sm tracking-widest">CURRENT STREAK</p>
                        <p className={`font-clash text-7xl font-bold text-yellow-400 transition-transform duration-300 animate-score-pop`}>{streak}</p>
                    </div>
                     <div className="bg-black/20 border border-white/10 rounded-2xl p-6 text-center">
                        <p className="text-gray-400 text-sm tracking-widest">TOTAL SCORE</p>
                        <p className={`font-clash text-7xl font-bold text-cyan-300 transition-transform duration-300 animate-score-pop`}>{score}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChallengeMode;
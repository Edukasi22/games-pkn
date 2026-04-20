import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  Plus,
  Minus,
  Sparkles,
  Loader2,
  Home
} from 'lucide-react';
import { ROUNDS as STATIC_ROUNDS, type Round, type Question } from './data.ts';
import { generateGameQuestions, type GeneratedRound } from './services/geminiService';
import { soundService } from './services/soundService';

type AppState = 'home' | 'setup' | 'round_intro' | 'playing' | 'answer' | 'scoreboard' | 'winner' | 'loading';
type BuzzedTeam = 'A' | 'B' | null;

export default function App() {
  // Game State
  const [appState, setAppState] = useState<AppState>('home');
  const [rounds, setRounds] = useState<Round[]>(STATIC_ROUNDS);
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [buzzedTeam, setBuzzedTeam] = useState<BuzzedTeam>(null);
  const [isQuestionVisible, setIsQuestionVisible] = useState(false);
  
  // Team Data
  const [teamA, setTeamA] = useState({ name: 'Siswa A', score: 0 });
  const [teamB, setTeamB] = useState({ name: 'Siswa B', score: 0 });
  
  const currentRound = rounds[currentRoundIdx];
  const currentQuestion = currentRound?.questions[currentQuestionIdx];

  const handleAIStart = async () => {
    setAppState('loading');
    soundService.playStart();
    try {
      const generated = await generateGameQuestions();
      
      // Shuffle helper
      const shuffle = <T,>(array: T[]): T[] => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
      };

      // Map generated to Round interface format with shuffled options
      const mappedRounds: Round[] = generated.map((r, rIdx) => ({
        id: rIdx + 1,
        title: r.title,
        description: r.description,
        questions: r.questions.map((q, qIdx) => ({
          id: (rIdx + 1) * 100 + qIdx,
          ...q,
          options: shuffle(q.options)
        }))
      }));
      setRounds(mappedRounds);
      setAppState('setup');
    } catch (error) {
      console.error(error);
      // Fallback: Shuffle and use static questions if AI fails
      const shuffle = <T,>(array: T[]): T[] => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
      };

      const shuffledStatic = STATIC_ROUNDS.map(r => ({
        ...r,
        questions: r.questions.map(q => ({
          ...q,
          options: shuffle(q.options)
        }))
      }));
      setRounds(shuffledStatic);
      setAppState('setup'); 
    }
  };

  const handlePracticeStart = () => {
    soundService.playStart();
    
    // Shuffle helper
    const shuffle = <T,>(array: T[]): T[] => {
      const newArray = [...array];
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
      return newArray;
    };

    // Collect all questions from all rounds
    const allQuestions = STATIC_ROUNDS.flatMap(r => r.questions);
    // Shuffle and pick 2
    const practiceQuestions = shuffle(allQuestions).slice(0, 2).map((q, idx) => ({
      ...q,
      id: 999 + idx,
      options: shuffle(q.options)
    }));

    const practiceRound: Round = {
      id: 0,
      title: "Mode Latihan",
      description: "Pemanasan sebelum kompetisi sesungguhnya!",
      questions: practiceQuestions
    };

    setRounds([practiceRound]);
    setAppState('setup');
  };

  // Buzzer logic
  const handleBuzz = (team: 'A' | 'B') => {
    if (buzzedTeam) return;
    soundService.playBuzz();
    setBuzzedTeam(team);
  };

  const startQuestion = () => {
    soundService.playClick();
    setIsQuestionVisible(true);
    setBuzzedTeam(null);
  };

  const updateScore = (team: 'A' | 'B', amount: number) => {
    if (amount > 0) soundService.playSuccess();
    else if (amount < 0) soundService.playFail();

    if (team === 'A') {
      setTeamA(prev => ({ ...prev, score: Math.max(0, prev.score + amount) }));
    } else {
      setTeamB(prev => ({ ...prev, score: Math.max(0, prev.score + amount) }));
    }
  };

  const resetGame = () => {
    soundService.playStart();
    setAppState('home');
    setCurrentRoundIdx(0);
    setCurrentQuestionIdx(0);
    setTeamA({ name: 'Siswa A', score: 0 });
    setTeamB({ name: 'Siswa B', score: 0 });
    setBuzzedTeam(null);
    setIsQuestionVisible(false);
    setRounds(STATIC_ROUNDS);
  };

  const nextQuestion = () => {
    soundService.playClick();
    if (currentQuestionIdx < currentRound.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setBuzzedTeam(null);
      setIsQuestionVisible(false);
      setAppState('playing');
    } else {
      setAppState('scoreboard');
    }
  };

  const nextRound = () => {
    soundService.playStart();
    if (currentRoundIdx < rounds.length - 1) {
      setCurrentRoundIdx(prev => prev + 1);
      setCurrentQuestionIdx(0);
      setBuzzedTeam(null);
      setIsQuestionVisible(false);
      setAppState('round_intro');
    } else {
      setAppState('winner');
    }
  };

  const goToState = (state: AppState) => {
    soundService.playClick();
    setAppState(state);
    if (state === 'playing') {
      setBuzzedTeam(null);
      setIsQuestionVisible(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 text-white font-sans overflow-hidden">
      {/* Global Home Button (Non-Home states) */}
      {appState !== 'home' && appState !== 'loading' && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={resetGame}
          className="fixed top-6 right-6 z-50 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/20 transition-all shadow-xl group"
          title="Ke Halaman Utama"
        >
          <Home className="text-white group-hover:text-yellow-400 transition-colors" size={24} />
        </motion.button>
      )}

      <AnimatePresence mode="wait">
        
        {/* --- HOME PAGE --- */}
        {appState === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 5 }}
              className="mb-8"
            >
              <Trophy size={100} className="text-yellow-400 mx-auto drop-shadow-xl" />
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black mb-4 uppercase tracking-tighter drop-shadow-2xl">
              TEBAK<br />PANCASILA
            </h1>
            <p className="text-xl md:text-2xl mb-12 opacity-90 max-w-2xl font-medium">
              Edisi Spesial Kelas 5 SD. Uji pengetahuanmu tentang dasar negara dan sejarah Indonesia!
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={handleAIStart}
                className="flex items-center justify-center gap-3 px-12 py-6 bg-yellow-400 hover:bg-yellow-300 text-indigo-900 rounded-full text-3xl font-bold transition-all shadow-2xl hover:scale-105 active:scale-95"
              >
                MULAI GAME <Sparkles size={28} />
              </button>
              <button
                onClick={handlePracticeStart}
                className="flex items-center justify-center gap-3 px-12 py-4 bg-white/20 hover:bg-white/30 text-white rounded-full text-xl font-bold transition-all backdrop-blur-md border-2 border-white/20 hover:scale-105 active:scale-95"
              >
                MODE LATIHAN (2 SOAL)
              </button>
            </div>

            {/* Footer */}
            <div className="mt-20 opacity-60 text-sm font-medium tracking-widest flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-400" />
              <span>GAME BUATAN GURU.KECIL</span>
              <Sparkles size={16} className="text-yellow-400" />
            </div>
          </motion.div>
        )}

        {/* --- LOADING PAGE --- */}
        {appState === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
          >
            <Loader2 size={100} className="text-yellow-400 animate-spin mb-8" />
            <h2 className="text-4xl font-black uppercase mb-4">Menyiapkan Soal Pintar...</h2>
            <p className="text-xl text-blue-200">AI sedang menyusun tantangan Pancasila dan sejarah untukmu!</p>
          </motion.div>
        )}

        {/* --- SETUP PAGE --- */}
        {appState === 'setup' && (
          <motion.div
            key="setup"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center justify-center min-h-screen p-8"
          >
            <div className="bg-white/10 backdrop-blur-md p-12 rounded-3xl border border-white/20 w-full max-w-3xl shadow-2xl">
              <div className="flex items-center gap-4 mb-10">
                <Trophy size={48} className="text-yellow-400" />
                <h2 className="text-4xl font-bold">Siapkan Tim</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                <div className="space-y-4">
                  <label className="block text-lg font-bold uppercase tracking-widest text-blue-200">Nama Tim A</label>
                  <input
                    type="text"
                    value={teamA.name}
                    onChange={(e) => setTeamA(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white/20 border-2 border-white/30 rounded-xl p-4 text-2xl font-bold focus:border-yellow-400 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-lg font-bold uppercase tracking-widest text-purple-200">Nama Tim B</label>
                  <input
                    type="text"
                    value={teamB.name}
                    onChange={(e) => setTeamB(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white/20 border-2 border-white/30 rounded-xl p-4 text-2xl font-bold focus:border-yellow-400 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mt-8">
                <button 
                  onClick={() => goToState('home')}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold flex items-center gap-2"
                >
                   Kembali
                </button>
                <button 
                  onClick={() => goToState('round_intro')}
                  className="px-10 py-5 bg-yellow-400 hover:bg-yellow-300 text-indigo-900 rounded-xl font-black text-2xl shadow-xl flex items-center gap-2"
                >
                  Lanjut <ArrowRight size={28} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- ROUND INTRO --- */}
        {appState === 'round_intro' && (
          <motion.div
            key="round_intro"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="max-w-4xl"
            >
              <span className="inline-block px-6 py-2 bg-yellow-400 text-indigo-900 font-black rounded-full mb-6 tracking-widest uppercase text-xl">
                Babak {currentRoundIdx + 1}
              </span>
              <h2 className="text-5xl md:text-6xl font-black mb-6 uppercase leading-tight drop-shadow-xl italic">
                {currentRound.title.split(': ')[1]}
              </h2>
              <p className="text-xl text-blue-100 mb-12 font-medium">
                {currentRound.description}
              </p>
              <button
                onClick={() => goToState('playing')}
                className="group relative px-12 py-6 bg-white text-indigo-900 rounded-2xl text-2xl font-black hover:bg-yellow-400 transition-all shadow-2xl"
              >
                MULAI PERTANYAAN
                <div className="absolute -bottom-2 -right-2 w-full h-full border-2 border-white rounded-2xl -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* --- PLAYING / QUESTION --- */}
        {(appState === 'playing' || appState === 'answer') && (
          <motion.div
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col min-h-screen relative"
          >
            {/* Buzzer Background Overlays */}
            <AnimatePresence>
              {buzzedTeam === 'A' && (
                <motion.div 
                  initial={{ opacity: 0, x: -100 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0 }}
                  className="absolute inset-y-0 left-0 w-1/2 bg-blue-500/20 pointer-events-none z-0 border-r-8 border-blue-400"
                />
              )}
              {buzzedTeam === 'B' && (
                <motion.div 
                  initial={{ opacity: 0, x: 100 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  exit={{ opacity: 0 }}
                  className="absolute inset-y-0 right-0 w-1/2 bg-purple-500/20 pointer-events-none z-0 border-l-8 border-purple-400"
                />
              )}
            </AnimatePresence>

            {/* Header / Score & Timer */}
            <header className="relative z-20 flex flex-col md:flex-row justify-between items-center gap-6 p-6 md:p-8">
              <div className="flex gap-4 md:gap-8">
                <div className={`transition-all duration-300 ${buzzedTeam === 'A' ? 'scale-110 ring-8 ring-blue-400' : buzzedTeam === 'B' ? 'opacity-40 grayscale' : ''} bg-blue-600 rounded-3xl p-4 min-w-[160px] shadow-2xl border-b-8 border-blue-800 flex items-center justify-between`}>
                  <div>
                    <p className="text-xs uppercase font-black text-blue-200 mb-0.5">{teamA.name}</p>
                    <p className="text-4xl font-black">{teamA.score}</p>
                  </div>
                  <Trophy size={24} className="text-blue-200/30" />
                </div>
                <div className={`transition-all duration-300 ${buzzedTeam === 'B' ? 'scale-110 ring-8 ring-purple-400' : buzzedTeam === 'A' ? 'opacity-40 grayscale' : ''} bg-purple-600 rounded-3xl p-4 min-w-[160px] shadow-2xl border-b-8 border-purple-800 flex items-center justify-between`}>
                  <div>
                    <p className="text-xs uppercase font-black text-purple-200 mb-0.5">{teamB.name}</p>
                    <p className="text-4xl font-black">{teamB.score}</p>
                  </div>
                  <Trophy size={24} className="text-purple-200/30" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-2xl font-black bg-black/30 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-white/20">
                   {currentQuestionIdx + 1} / {currentRound.questions.length}
                </div>
                <button onClick={() => goToState('scoreboard')} className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors border-2 border-white/10">
                  <Trophy size={28} className="text-yellow-400" />
                </button>
              </div>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-6">
              {!isQuestionVisible ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startQuestion}
                  className="px-20 py-10 bg-yellow-400 text-indigo-900 rounded-[40px] text-6xl font-black shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-6"
                >
                  <Play fill="currentColor" size={60} /> MULAI SOAL
                </motion.button>
              ) : (
                <div className="w-full max-w-7xl">
                  {/* Question Display */}
                  <div className="flex flex-col gap-8 mb-10 relative">
                    <div className="bg-white/95 text-indigo-900 p-6 md:p-8 rounded-[30px] shadow-2xl border-b-[8px] border-yellow-400 text-center">
                      <h2 className="text-2xl md:text-3xl font-black leading-tight tracking-tight uppercase">
                        {currentQuestion.question}
                      </h2>
                    </div>

                    {appState === 'answer' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
                      >
                        <div className="bg-green-500 text-white p-12 rounded-[40px] shadow-[0_0_80px_rgba(34,197,94,0.5)] border-4 border-white flex flex-col items-center justify-center animate-bounce-slow pointer-events-auto">
                          <CheckCircle2 size={80} className="mb-4 drop-shadow-md" />
                          <h3 className="text-2xl font-black uppercase mb-2 opacity-90 tracking-widest">JAWABAN BENAR:</h3>
                          <p className="text-5xl md:text-6xl font-black tracking-tighter drop-shadow-xl italic">{currentQuestion.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Options / Action Area */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative">
                    {currentQuestion.options.map((option, idx) => {
                      const isCorrect = option === currentQuestion.answer;
                      const isAnswerState = appState === 'answer';
                      
                      return (
                        <div 
                          key={idx}
                          className={`
                            p-6 rounded-3xl text-2xl md:text-3xl font-black flex items-center gap-6 transition-all duration-300
                            ${isAnswerState ? (isCorrect ? 'bg-green-500 text-white scale-105 shadow-2xl ring-8 ring-green-300' : 'bg-red-500/20 text-white/30') : 'bg-white/10 hover:bg-white/20 border-4 border-white/20 shadow-lg'}
                          `}
                        >
                          <span className="w-14 h-14 rounded-2xl bg-black/20 flex items-center justify-center text-xl shrink-0">{String.fromCharCode(65 + idx)}</span>
                          <span className="leading-snug">{option}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* IFP BUZZER AREA - GIANT BUTTONS */}
                  {!buzzedTeam && appState !== 'answer' && (
                    <div className="flex gap-8 h-48 md:h-56">
                       <button 
                        onMouseDown={() => handleBuzz('A')}
                        onTouchStart={() => handleBuzz('A')}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-400 rounded-3xl border-b-[12px] border-blue-900 shadow-2xl flex flex-col items-center justify-center group transition-all"
                       >
                          <p className="text-xl font-black text-blue-200 uppercase mb-2 tracking-widest group-active:translate-y-2">TEKAN SAYA!</p>
                          <span className="text-4xl md:text-6xl font-black group-active:translate-y-2 uppercase drop-shadow-md">{teamA.name}</span>
                       </button>
                       <button 
                        onMouseDown={() => handleBuzz('B')}
                        onTouchStart={() => handleBuzz('B')}
                        className="flex-1 bg-purple-600 hover:bg-purple-500 active:bg-purple-400 rounded-3xl border-b-[12px] border-purple-900 shadow-2xl flex flex-col items-center justify-center group transition-all"
                       >
                          <p className="text-xl font-black text-purple-200 uppercase mb-2 tracking-widest group-active:translate-y-2">TEKAN SAYA!</p>
                          <span className="text-4xl md:text-6xl font-black group-active:translate-y-2 uppercase drop-shadow-md">{teamB.name}</span>
                       </button>
                    </div>
                  )}

                  {buzzedTeam && appState !== 'answer' && (
                    <motion.div 
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="flex flex-col items-center gap-6"
                    >
                       <h3 className={`text-4xl md:text-6xl font-black uppercase text-center ${buzzedTeam === 'A' ? 'text-blue-300' : 'text-purple-300'} pointer-events-none drop-shadow-lg italic tracking-tighter`}>
                          Waktunya {buzzedTeam === 'A' ? teamA.name : teamB.name} Menjawab!
                       </h3>
                       <button 
                        onClick={() => setAppState('answer')}
                        className="px-16 py-8 bg-yellow-400 text-indigo-900 rounded-3xl font-black text-4xl shadow-2xl flex items-center gap-6 transition-transform hover:scale-105 active:scale-95 border-b-[10px] border-yellow-600"
                      >
                         CEK JAWABAN <CheckCircle2 size={50} />
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </main>

            {/* Answer Control Overlay */}
            {appState === 'answer' && (
              <footer className="relative z-30 bg-black/60 backdrop-blur-xl p-8 border-t-4 border-white/20 flex flex-col items-center gap-6">
                <p className="text-xl font-black uppercase tracking-widest text-yellow-400">Siapa yang dapat poin?</p>
                <div className="flex flex-wrap justify-center gap-6">
                   <button 
                    onClick={() => {
                        updateScore('A', 10);
                        nextQuestion();
                    }}
                    className={`px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-2xl shadow-xl border-b-6 border-blue-900 flex items-center gap-3 transition-transform hover:-translate-y-1`}
                  >
                    POIN UNTUK {teamA.name.toUpperCase()} <Plus size={32} />
                  </button>
                  <button 
                    onClick={() => {
                        updateScore('B', 10);
                        nextQuestion();
                    }}
                    className={`px-10 py-5 bg-purple-600 hover:bg-purple-500 rounded-2xl font-black text-2xl shadow-xl border-b-6 border-purple-900 flex items-center gap-3 transition-transform hover:-translate-y-1`}
                  >
                    POIN UNTUK {teamB.name.toUpperCase()} <Plus size={32} />
                  </button>
                  <button 
                    onClick={nextQuestion}
                    className="px-8 py-5 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-xl shadow-xl border-2 border-white/10 flex items-center gap-3"
                  >
                    TIDAK ADA POIN <ArrowRight size={28} />
                  </button>
                </div>
              </footer>
            )}
          </motion.div>
        )}

        {/* --- SCOREBOARD / MID-GAME SCORE --- */}
        {appState === 'scoreboard' && (
          <motion.div
            key="scoreboard"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col items-center justify-center min-h-screen p-6"
          >
             <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl p-10 md:p-16 rounded-[40px] border-4 border-white/10 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-6 mb-10 border-b-2 border-white/10 pb-6">
                    <Trophy size={48} className="text-yellow-400" />
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Papan Skor</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-blue-600/30 rounded-3xl p-8 border-2 border-blue-400/50 flex flex-col items-center">
                        <span className="text-lg font-black uppercase text-blue-200 mb-2">{teamA.name}</span>
                        <span className="text-7xl font-black mb-6">{teamA.score}</span>
                        <div className="flex gap-4">
                            <button onClick={() => updateScore('A', -10)} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"><Minus size={24}/></button>
                            <button onClick={() => updateScore('A', 10)} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"><Plus size={24}/></button>
                        </div>
                    </div>
                    <div className="bg-purple-600/30 rounded-3xl p-8 border-2 border-purple-400/50 flex flex-col items-center">
                        <span className="text-lg font-black uppercase text-purple-200 mb-2">{teamB.name}</span>
                        <span className="text-7xl font-black mb-6">{teamB.score}</span>
                        <div className="flex gap-4">
                            <button onClick={() => updateScore('B', -10)} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"><Minus size={24}/></button>
                            <button onClick={() => updateScore('B', 10)} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"><Plus size={24}/></button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 justify-center">
                    <button 
                        onClick={() => goToState('playing')}
                        className="px-10 py-5 bg-white text-indigo-900 rounded-2xl font-black font-2xl shadow-xl flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
                    >
                        KE PERTANYAAN <ArrowRight size={28} />
                    </button>
                    <button 
                        onClick={nextRound}
                        className="px-10 py-5 bg-yellow-400 text-indigo-900 rounded-2xl font-black font-2xl shadow-xl flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
                    >
                        LANJUT BABAK BARU <ArrowRight size={28} />
                    </button>
                </div>
             </div>
          </motion.div>
        )}

        {/* --- WINNER SCREEN --- */}
        {appState === 'winner' && (
          <motion.div
            key="winner"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
          >
            <motion.div
                animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mb-8"
            >
                <Trophy size={200} className="text-yellow-400 mx-auto drop-shadow-2xl" />
            </motion.div>
            
            <h1 className="text-5xl font-black mb-4 uppercase drop-shadow-xl">Selesai!</h1>
            
            <div className="bg-white/10 backdrop-blur-md p-10 rounded-[40px] border-4 border-white/20 mb-12">
                <p className="text-2xl font-bold mb-6 text-blue-200">PEMENANGNYA ADALAH...</p>
                <h2 className="text-6xl md:text-7xl font-black mb-8 uppercase text-yellow-400 italic">
                    {teamA.score > teamB.score ? teamA.name : (teamB.score > teamA.score ? teamB.name : 'SERI!')}
                </h2>
                <div className="flex justify-center gap-12">
                    <div className="flex flex-col items-center">
                        <span className="text-sm font-bold uppercase text-white/60 mb-2">{teamA.name}</span>
                        <span className="text-4xl font-black">{teamA.score}</span>
                    </div>
                    <div className="flex flex-col items-center border-l border-white/20 pl-12">
                        <span className="text-sm font-bold uppercase text-white/60 mb-2">{teamB.name}</span>
                        <span className="text-4xl font-black">{teamB.score}</span>
                    </div>
                </div>
            </div>

            <button
              onClick={resetGame}
              className="flex items-center gap-3 px-12 py-6 bg-white text-indigo-900 rounded-full text-3xl font-black transition-all shadow-2xl hover:scale-105"
            >
              MAIN LAGI
            </button>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-30">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-blue-400 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-purple-500 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[20%] w-48 h-48 bg-yellow-400 rounded-full blur-[80px]" />
      </div>
    </div>
  );
}

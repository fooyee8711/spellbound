import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, ChevronRight, Wand2, HelpCircle, Volume2, Settings, BarChart3, RotateCcw, Palette, Moon, Sun, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { WORDS } from './constants';
import { speakText } from './services/localTutorService';

export default function App() {
  const [view, setView] = useState<'learning' | 'settings'>('learning');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [learnedWords, setLearnedWords] = useState<string[]>(() => {
    const saved = localStorage.getItem('learnedWords');
    return saved ? JSON.parse(saved) : [];
  });
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    localStorage.setItem('learnedWords', JSON.stringify(learnedWords));
  }, [learnedWords]);

  const unlearnedWords = WORDS.filter(w => !learnedWords.includes(w.id));
  const safeIndex = Math.min(currentIndex, Math.max(0, unlearnedWords.length - 1));
  const currentWord = unlearnedWords[safeIndex];

  const handleNextWord = () => {
    if (currentWord) {
      setLearnedWords(prev => {
        if (!prev.includes(currentWord.id)) {
          return [...prev, currentWord.id];
        }
        return prev;
      });
    }
    setShowHint(false);
    if (safeIndex >= unlearnedWords.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(safeIndex);
    }
  };

  const handlePrevWord = () => {
    setCurrentIndex(prev => {
      if (prev > 0) return prev - 1;
      return Math.max(0, unlearnedWords.length - 1);
    });
    setShowHint(false);
  };

  const playSound = async (text: string) => {
    await speakText(text);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gradient-to-br from-[#1a365d] to-[#0a192f] text-white' : 'bg-white text-ink'}`}>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <header className="relative text-center mb-12">
          <div className="absolute top-0 right-0 flex items-center gap-2">
            <button 
              onClick={view === 'settings' ? () => setView('learning') : handlePrevWord} 
              className="p-1.5 text-magic-gold hover:bg-magic-gold/10 rounded-full transition-colors"
              title="Go Back"
            >
              <ArrowLeft size={24} />
            </button>
            {view === 'learning' && (
              <button onClick={() => setView('settings')} className="p-1.5 text-magic-gold hover:bg-magic-gold/10 rounded-full transition-colors">
                <Settings size={24} />
              </button>
            )}
          </div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-2"
          >
            <Wand2 className="text-magic-gold w-8 h-8" />
            <h1 className="text-5xl font-bold text-magic-gold tracking-widest uppercase">SpellBound</h1>
          </motion.div>
          <p className="text-magic-gold/70 italic text-lg">Master the language, unleash the magic</p>
        </header>

        <main>
          {view === 'settings' && (
            <div className="magical-card space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-ink/5 rounded-lg">
                  <BarChart3 className="text-magic-gold" />
                  <div>
                    <h3 className="font-bold">Learning Statistics</h3>
                    <p className="text-sm text-ink/60">Words learned: {learnedWords.length} / {WORDS.length}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setLearnedWords([])} className="flex-1 flex items-center justify-center gap-2 p-3 bg-red-500/10 text-red-600 rounded-lg font-bold hover:bg-red-500/20">
                    <RotateCcw size={18} /> Reset Progress
                  </button>

                  <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="flex-1 flex items-center justify-center gap-2 p-3 bg-ink/5 rounded-lg font-bold hover:bg-ink/10">
                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </button>
                </div>

                <div className="p-3 bg-ink/5 rounded-lg">
                  <h3 className="font-bold mb-4">Manage Word Library</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {WORDS.map(word => (
                      <div key={word.id} className="flex items-center justify-between p-2 border-b border-ink/10">
                        <span>{word.target}</span>
                        <button 
                          onClick={() => setLearnedWords(prev => prev.includes(word.id) ? prev.filter(id => id !== word.id) : [...prev, word.id])}
                          className={`px-2 py-1 rounded-full text-sm font-bold ${learnedWords.includes(word.id) ? 'bg-magic-blue text-white' : 'bg-ink/10'}`}
                        >
                          {learnedWords.includes(word.id) ? 'Learned' : 'Learn'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'learning' && (
            unlearnedWords.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="magical-card text-center py-16"
              >
                <CheckCircle2 className="w-20 h-20 text-magic-gold mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">All Spells Mastered!</h2>
                <p className="text-ink/70 mb-8 text-lg">You have successfully learned all the words in your library.</p>
                <button 
                  onClick={() => setLearnedWords([])} 
                  className="bg-magic-blue text-white px-6 py-2.5 rounded-full font-bold hover:bg-magic-blue/90 transition-all shadow-lg hover:shadow-xl"
                >
                  Reset Progress & Start Over
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={currentWord.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="magical-card"
              >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-4">
                    <h2 className="text-6xl font-bold text-ink lowercase">
                      {currentWord.target}
                    </h2>
                    <button onClick={() => playSound(currentWord.target)} className="p-1.5 bg-magic-gold/20 rounded-full"><Volume2 size={24} /></button>
                    <button 
                      onClick={() => setShowHint(!showHint)}
                      className="p-1.5 bg-ink/5 rounded-full hover:bg-ink/10 transition-colors"
                      title="Show Translation"
                    >
                      <HelpCircle size={24} className="text-ink/40" />
                    </button>
                  </div>
                  {showHint && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-magic-gold font-bold text-xl"
                    >
                      Meaning: {currentWord.translation}
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-magic-gold font-bold uppercase text-sm tracking-tighter">
                  <BookOpen size={18} /><span>Memory Anchor</span>
                </div>
                <div className="bg-white/50 p-6 rounded-xl border border-ink/5 italic font-serif text-xl leading-relaxed">
                  <div className="flex items-center gap-2 mb-2">
                    <button onClick={() => playSound(currentWord.originalSentence)} className="p-1.5 bg-magic-gold/20 rounded-full"><Volume2 size={16} /></button>
                  </div>
                  "{currentWord.originalSentence.split(currentWord.target).map((part, i, arr) => (
                    <span key={i}>
                      {part}
                      {i < arr.length - 1 && <span className="text-magic-gold font-bold underline">{currentWord.target}</span>}
                    </span>
                  ))}"
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-lg text-ink/80 leading-relaxed">{currentWord.sceneDescription}</p>
                  <button onClick={() => playSound(currentWord.sceneDescription)} className="p-1.5 bg-magic-gold/20 rounded-full shrink-0"><Volume2 size={16} /></button>
                </div>

                <div className="pt-4">
                  <button onClick={handleNextWord} className="flex items-center gap-2 bg-magic-blue text-white px-5 py-2.5 rounded-full font-bold hover:bg-magic-blue/90 transition-all group">Got it! Next Spell <ChevronRight size={20} /></button>
                </div>
              </div>
            </motion.div>
            )
          )}
        </main>

        <footer className="mt-12 text-center text-magic-gold/40 text-sm">
          <p>© 2026 Summa. Unleash your inner wizard.</p>
        </footer>
      </div>
    </div>
  );
}

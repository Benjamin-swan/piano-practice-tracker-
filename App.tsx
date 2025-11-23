import React, { useState, useEffect, useMemo } from 'react';
import TrackRow from './components/TrackRow';
import AddTrackForm from './components/AddTrackForm';
import PianoHeader from './components/PianoHeader';
import { Song, FruitTheme } from './types';

const STORAGE_KEY = 'piano_progress_tracker_v1';

const App: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Load from LocalStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setSongs(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse songs", e);
      }
    }
    setLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
    }
  }, [songs, loaded]);

  const handleAddSong = (title: string, date: string, theme: FruitTheme) => {
    const newSong: Song = {
      id: crypto.randomUUID(),
      title,
      date, // YYYY-MM-DD
      theme,
      practiceCount: 0,
      memo: '',
    };
    // Add to top of list
    setSongs((prev) => [newSong, ...prev]);
  };

  const handleUpdateProgress = (id: string, newCount: number) => {
    setSongs((prev) =>
      prev.map((song) =>
        song.id === id ? { ...song, practiceCount: newCount } : song
      )
    );
  };

  const handleUpdateMemo = (id: string, newMemo: string) => {
    setSongs((prev) => 
        prev.map((song) => 
            song.id === id ? { ...song, memo: newMemo } : song
        )
    );
  };

  const handleDeleteSong = (id: string) => {
    setSongs((prev) => prev.filter((s) => s.id !== id));
  };

  // --- Grouping & Filtering Logic ---

  const groupedSongs = useMemo(() => {
    // 1. Filter
    const filtered = songs.filter(song => 
      song.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Group by Date
    const groups: Record<string, Song[]> = {};
    filtered.forEach(song => {
      if (!groups[song.date]) groups[song.date] = [];
      groups[song.date].push(song);
    });

    // 3. Sort Dates Descending
    const sortedDates = Object.keys(groups).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );

    return sortedDates.map(date => ({
      date,
      songs: groups[date]
    }));
  }, [songs, searchTerm]);

  const getDateLabel = (dateStr: string) => {
    const today = new Date();
    const date = new Date(dateStr);
    
    // Reset times for accurate comparison
    const todayStr = today.toISOString().split('T')[0];
    
    // Check Yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (dateStr === todayStr) return 'Today';
    if (dateStr === yesterdayStr) return 'Yesterday';
    
    return date.toLocaleDateString(undefined, { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const totalPracticeSessions = songs.reduce((acc, song) => acc + song.practiceCount, 0);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-gradient-to-br from-slate-50 to-slate-200">
      <header className="bg-gray-900 text-white relative z-20 shadow-md">
         {/* Interactive Piano Header */}
         <PianoHeader />
         
         <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Piano Tracker</h1>
                    <p className="text-gray-400 text-sm mt-1">Visualize your practice. Fill the bars.</p>
                </div>
                <div className="text-right hidden sm:block">
                    <div className="text-2xl font-bold text-blue-400">{totalPracticeSessions}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">Total Sessions</div>
                </div>
            </div>
         </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 -mt-4 z-30">
        <AddTrackForm onAdd={handleAddSong} />

        {/* Search Bar */}
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-lg">🔍</span>
          </div>
          <input
            type="text"
            placeholder="Search your songs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all text-gray-700"
          />
        </div>

        <div className="space-y-8">
            {groupedSongs.length === 0 && loaded ? (
                <div className="text-center py-20 opacity-50">
                    <div className="text-6xl mb-4">🎹</div>
                    <p className="text-xl font-medium text-gray-500">
                      {searchTerm ? 'No matches found.' : 'No songs yet.'}
                    </p>
                    {!searchTerm && <p className="text-gray-400">Add a track above to start your journey.</p>}
                </div>
            ) : (
                groupedSongs.map((group) => (
                    <div key={group.date} className="relative">
                        {/* Sticky Date Header */}
                        <div className="sticky top-0 z-10 py-2 mb-3 bg-gradient-to-r from-slate-100/95 to-slate-200/95 backdrop-blur-md border-b border-gray-200/50">
                            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider px-2">
                                {getDateLabel(group.date)}
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {group.songs.map((song) => (
                                <TrackRow
                                    key={song.id}
                                    song={song}
                                    onUpdate={handleUpdateProgress}
                                    onUpdateMemo={handleUpdateMemo}
                                    onDelete={handleDeleteSong}
                                />
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
      </main>

      <footer className="border-t border-gray-200/50 py-8 mt-12 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Piano Progress Tracker. Keep practicing! 🎵</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
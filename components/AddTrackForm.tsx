import React, { useState } from 'react';
import { FruitTheme, THEMES } from '../types';

interface AddTrackFormProps {
  onAdd: (title: string, date: string, theme: FruitTheme) => void;
}

const AddTrackForm: React.FC<AddTrackFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [theme, setTheme] = useState<FruitTheme>('🍎');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd(title, date, theme);
    
    // Reset fields
    setTitle('');
    // Keep date as is for convenience of adding multiple for same day
    setIsExpanded(false);
  };

  return (
    <div className="mb-8">
        {!isExpanded ? (
             <button 
                onClick={() => setIsExpanded(true)}
                className="w-full py-4 bg-white border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-blue-400 hover:text-blue-500 transition-all hover:bg-blue-50 flex items-center justify-center gap-2"
             >
                <span className="text-xl">＋</span> Add New Song to Practice
             </button>
        ) : (
            <form 
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 animate-fade-in-down"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">New Practice Track</h2>
                    <button 
                        type="button" 
                        onClick={() => setIsExpanded(false)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Date Input */}
                    <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                            required
                        />
                    </div>

                    {/* Title Input */}
                    <div className="md:col-span-6">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Song Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Minuet in G"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                            required
                            autoFocus
                        />
                    </div>

                    {/* Theme Selector */}
                    <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Reward Theme</label>
                        <div className="relative">
                            <select
                                value={theme}
                                onChange={(e) => setTheme(e.target.value as FruitTheme)}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all cursor-pointer"
                            >
                                {THEMES.map((t) => (
                                    <option key={t.value} value={t.value}>
                                        {t.value} {t.label}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                                ▼
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-md hover:shadow-lg transform active:scale-95"
                    >
                        Start Tracking
                    </button>
                </div>
            </form>
        )}
    </div>
  );
};

export default AddTrackForm;
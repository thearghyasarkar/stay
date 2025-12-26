import React, { useState, useEffect, useRef } from 'react';
import { format, addDays } from 'date-fns';
import { useSearchParams } from 'react-router-dom';
import { useJournal } from '../hooks/useJournal';
import { User } from '../firebase';
import EntryList from '../components/EntryList';
import JournalEditor from '../components/JournalEditor';
import { Icon } from '../components/UI';
import { EntryType, CATEGORIES } from '../types';

interface HomePageProps {
  user: User;
}

const HomePage: React.FC<HomePageProps> = ({ user }) => {
  const [searchParams] = useSearchParams();
  const [currentDateObj, setCurrentDateObj] = useState(new Date());
  const dateInputRef = useRef<HTMLInputElement>(null);
  
  // Effect to handle URL date parameter
  useEffect(() => {
    const dateParam = searchParams.get('date');
    if (dateParam) {
      const parsedDate = new Date(dateParam + 'T00:00:00'); // Ensure local time doesn't shift day
      if (!isNaN(parsedDate.getTime())) {
        setCurrentDateObj(parsedDate);
      }
    }
  }, [searchParams]);

  const dateStr = format(currentDateObj, 'yyyy-MM-dd');
  
  const { entries, loading, error, addEntry, toggleTask, deleteEntry, isImportant, toggleImportance } = useJournal(user.uid, dateStr);
  const [selectedType, setSelectedType] = useState<EntryType>('task');

  const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setCurrentDateObj(new Date(e.target.value + 'T00:00:00'));
    }
  };

  const openDatePicker = () => {
    // showPicker is the modern standard for opening native date controls
    const input = dateInputRef.current;
    if (input) {
        if (typeof (input as any).showPicker === 'function') {
            (input as any).showPicker();
        } else {
            // Fallback for older browsers (focus usually triggers it on mobile)
            input.focus();
            input.click();
        }
    }
  };

  // Filter entries based on the selected tab
  const filteredEntries = entries.filter(entry => entry.type === selectedType);

  return (
    <div className="flex flex-col flex-1 min-h-full">
      {/* Sticky Header Container */}
      <div className="sticky top-0 z-30 bg-paper-light/95 dark:bg-paper-dark/95 backdrop-blur-md -mx-4 md:-mx-8 px-4 md:px-8 border-b border-stone-100 dark:border-stone-800 shadow-sm transition-all duration-300">
        
        {/* Date Controls */}
        <div className="flex items-center justify-between pb-4 pt-2">
          <div className="flex items-center gap-3">
            
            <div className="text-left" onClick={openDatePicker}>
               <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 animate-fade-in cursor-pointer active:opacity-70 transition-opacity">
                  {format(currentDateObj, 'MMMM d')}
               </h2>
               <p className="text-[0.6rem] text-stone-500 uppercase tracking-widest pt-1 font-medium animate-fade-in">
                  {format(currentDateObj, 'EEEE, yyyy')}
               </p>
            </div>
            
            <div className="relative pl-2 pb-2">
                <button 
                  onClick={openDatePicker} 
                  className="p-2 bg-stone-100 dark:bg-stone-800 rounded-full text-stone-500 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-95 transition-all"
                  aria-label="Select date"
                >
                  <Icon name="calendar" size={16} />
                </button>
                <input 
                    type="date" 
                    ref={dateInputRef}
                    value={dateStr}
                    onChange={handleDateSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pointer-events-none"
                    tabIndex={-1}
                />
            </div>

          </div>

          <button 
            onClick={toggleImportance}
            className={`
              p-3 rounded-full transition-all duration-300 active:scale-90
              ${isImportant 
                ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rotate-0' 
                : 'text-stone-300 dark:text-stone-700 hover:text-stone-400 rotate-12'}
            `}
          >
            <Icon name="star" size={20} className={isImportant ? "fill-current" : ""} />
          </button>
        </div>

         {/*  Category Tabs */}
       
        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x lg:mb-8 border-b border-stone-200 dark:border-stone-800">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.type}
            onClick={() => setSelectedType(cat.type)}
            className={`
              flex items-center gap-2 pb-3 text-xs font-medium transition-all relative whitespace-nowrap snap-start
              ${selectedType === cat.type
                ? 'text-stone-900 dark:text-stone-100' 
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'}
            `}
          >
            {/* <Icon name={cat.icon} size={16} /> */}
            {cat.label}
            {selectedType === cat.type && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-stone-900 dark:bg-stone-100" />
            )}
          </button>
        ))}
      </div> 
  
      </div>

      {/* Journal Content */}
      <div className="flex-1 py-6 animate-slide-up pb-4">
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center animate-fade-in">
            <Icon name="alert-circle" size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-red-800 dark:text-red-200 mb-2">Access Error</h3>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
          </div>
        ) : loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800 dark:border-stone-200"></div>
          </div>
        ) : (
          <div className="min-h-[200px]">
            {filteredEntries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 opacity-60">
                    <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-4">
                        <Icon name={CATEGORIES.find(c => c.type === selectedType)?.icon || 'edit'} size={24} className="text-stone-400" />
                    </div>
                    <p className="text-stone-500 dark:text-stone-400 font-medium">
                        No {CATEGORIES.find(c => c.type === selectedType)?.label.toLowerCase()} yet.
                    </p>
                </div>
            ) : (
                <EntryList 
                    entries={filteredEntries} 
                    onToggleTask={toggleTask}
                    onDelete={deleteEntry}
                />
            )}
          </div>
        )}
      </div>

      {/* Editor - Tabs are now inside for better reachability */}
      <JournalEditor 
        onAdd={addEntry} 
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        showCategories={true}
      />
    </div>
  );
};

export default HomePage;
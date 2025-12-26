import React from 'react';
import { JournalEntry, CATEGORIES } from '../types';
import { Icon } from './UI';
import { format } from 'date-fns';

interface EntryListProps {
  entries: JournalEntry[];
  onToggleTask: (id: string, status: boolean) => void;
  onDelete: (id: string) => void;
  showDate?: boolean;
}

const EntryList: React.FC<EntryListProps> = ({ entries, onToggleTask, onDelete, showDate = false }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-20 opacity-50">
        <Icon name="pen-tool" size={48} className="mx-auto mb-4 text-stone-300 dark:text-stone-700" />
        <p>No entries yet. Start writing.</p>
      </div>
    );
  }

  // Group by type for a cleaner layout on the daily view
  // But prompt says "order by order" for day logging.
  // Strategy: 
  // Tasks -> Grouped at top.
  // Logs/Reflections -> Chronological list below.
  // Facts/Vocab/Dates -> Chips or small cards mixed in or at bottom.
  // BUT: Prompt asks for "Beautiful notebook like journal".
  // Let's list chronologically but style differently.

  return (
    <div className="space-y-2 lg:space-y-6">
      {entries.map((entry) => {
        const cat = CATEGORIES.find(c => c.type === entry.type);
        
        return (
          <div key={entry.id} className="group relative pl-0 md:pl-4 transition-all">
            {/* Timestamp / Line */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-stone-100 dark:bg-stone-800 hidden md:block group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors" />
            
            <div className="flex gap-4">
               {/* Icon */}
              {/* <div className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border z-10 bg-paper-light dark:bg-paper-dark
                ${entry.type === 'task' && entry.isCompleted ? 'border-green-500 text-green-500' : 'border-stone-200 dark:border-stone-700 text-stone-400'}
              `}>
                <Icon name={cat?.icon || 'circle'} size={14} />
              </div> */}

              <div className="flex-1 px-4 pb-4">
                 <div className={`flex items-center justify-between mb-1
                 `}>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold uppercase tracking-wider text-stone-400
                         ${entry.type === 'log' ? 'hidden' : ''}
                         ${entry.type === 'task' ? 'hidden' : ''}
                         ${entry.type === 'vocabulary' ? 'hidden' : ''}`}>
                          {cat?.label}
                        </span>
                        <span className={`text-xs text-stone-300 dark:text-stone-600
                         ${entry.type === 'task' ? 'hidden' : ''}`}>
                            {format(entry.createdAt, 'h:mm a')}
                        </span>
                        {showDate && (
                            <span className="text-xs text-stone-300 dark:text-stone-600">
                                • {entry.date}
                            </span>
                        )}
                    </div>
                    <button 
                        onClick={() => onDelete(entry.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-red-300 hover:text-red-500 transition-all"
                    >
                        <Icon name="trash" size={14} />
                    </button>
                 </div>

                 {entry.type === 'task' ? (
                   <div 
                      onClick={() => onToggleTask(entry.id, !!entry.isCompleted)}
                      className="cursor-pointer flex items-start gap-3 mt-1"
                   >
                      <div className={`mt-1 w-4 h-4 rounded border flex items-center justify-center transition-colors ${entry.isCompleted ? 'bg-stone-800 border-stone-800 dark:bg-stone-200' : 'border-stone-300'}`}>
                         {entry.isCompleted && <Icon name="check" size={10} className="text-white dark:text-black" />}
                      </div>
                      <p className={`text-md font-medium ${entry.isCompleted ? 'line-through text-stone-400' : ''}`}>
                        {entry.content}
                      </p>
                   </div>
                 ) : (
                    <div className={`
                        p-1 rounded-xl mt-1 text-md leading-relaxed
                        ${entry.type === 'reflection' ? 'bg-stone-50 dark:bg-stone-800/50 italic font-serif text-stone-700 dark:text-stone-300' : ''}
                        ${entry.type === 'vocabulary' ? 'bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30' : ''}
                        ${entry.type === 'birthday' ? 'bg-pink-50/50 dark:bg-pink-900/10 border border-pink-100 dark:border-pink-900/30' : ''}
                        ${entry.type === 'fact' ? 'border-l-4 border-blue-200 dark:border-blue-900 pl-4' : ''}
                    `}>
                        {entry.content}
                    </div>
                 )}
                 {/*  
      <div className="flex gap-4 mb-8 border-b border-stone-200 dark:border-stone-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center gap-2 pb-3 text-sm font-medium transition-all relative
              ${activeTab === tab.id 
                ? 'text-stone-900 dark:text-stone-100' 
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'}
            `}
          >
            <Icon name={tab.icon} size={16} />
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-stone-900 dark:bg-stone-100" />
            )}
          </button>
        ))}
      </div> */}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EntryList;
import React, { useState } from 'react';
import { useGlobalSearch } from '../hooks/useJournal';
import { User } from '../firebase';
import EntryList from '../components/EntryList';
import { Input, Icon, Badge } from '../components/UI';
import { EntryType, CATEGORIES } from '../types';

interface SearchPageProps {
  user: User;
}

const SearchPage: React.FC<SearchPageProps> = ({ user }) => {
  const { results, search, searching } = useGlobalSearch(user.uid);
  const [term, setTerm] = useState('');
  const [filterType, setFilterType] = useState<EntryType | undefined>(undefined);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    search(term, filterType);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-6">Search</h2>
        
        <form onSubmit={handleSearch} className="relative mb-4">
          <Input 
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search entries..."
            className="pl-10 text-lg"
          />
          <Icon name="search" className="absolute left-0 top-3.5 text-stone-400" />
        </form>

        <div className="flex gap-2 flex-wrap">
          <Badge 
            active={filterType === undefined} 
            onClick={() => setFilterType(undefined)}
          >
            All
          </Badge>
          {CATEGORIES.map(cat => (
             <Badge 
                key={cat.type}
                active={filterType === cat.type}
                onClick={() => setFilterType(cat.type)}
             >
               <Icon name={cat.icon} size={12} />
               {cat.label}
             </Badge>
          ))}
          <button 
            onClick={() => handleSearch()} 
            className="ml-auto text-sm font-medium text-stone-800 dark:text-stone-200"
          >
            Apply
          </button>
        </div>
      </div>

      <div className="flex-1">
        {searching ? (
           <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800 dark:border-stone-200"></div>
           </div>
        ) : (
          <EntryList 
            entries={results} 
            // Read-only search results usually don't allow modification in place for simplicity
            onToggleTask={() => {}} 
            onDelete={() => {}} 
            showDate={true}
          />
        )}
        
        {!searching && results.length === 0 && term && (
           <div className="text-center text-stone-400 mt-12">No results found.</div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
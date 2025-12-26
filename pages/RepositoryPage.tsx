import React, { useState, useEffect } from 'react';
import { User, db, collection, query, where, onSnapshot, orderBy } from '../firebase';
import { JournalEntry, EntryType } from '../types';
import EntryList from '../components/EntryList';
import { Icon } from '../components/UI';

interface RepositoryPageProps {
  user: User;
}

const RepositoryPage: React.FC<RepositoryPageProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'vocabulary' | 'birthday' | 'fact'>('vocabulary');
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, `users/${user.uid}/entries`),
      where("type", "==", activeTab),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newEntries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JournalEntry[];
      setEntries(newEntries);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user.uid, activeTab]);

  const tabs = [
    { id: 'vocabulary', label: 'Vocabulary', icon: 'book-open' },
    { id: 'birthday', label: 'Dates', icon: 'calendar-heart' },
    { id: 'fact', label: 'Facts', icon: 'lightbulb' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-6">Repository</h2>
      
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
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-800 dark:border-stone-200"></div>
        </div>
      ) : (
        <EntryList 
            entries={entries} 
            onToggleTask={() => {}} 
            onDelete={() => {}} 
            showDate={true}
        />
      )}
    </div>
  );
};

export default RepositoryPage;
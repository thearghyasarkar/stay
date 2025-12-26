import React from 'react';
import { useImportantDates } from '../hooks/useJournal';
import { User } from '../firebase';
import { format } from 'date-fns';
import { Icon, Card } from '../components/UI';
import { Link } from 'react-router-dom';

interface ImportantDatesPageProps {
  user: User;
}

const ImportantDatesPage: React.FC<ImportantDatesPageProps> = ({ user }) => {
  const dates = useImportantDates(user.uid);
  
  // Sort dates descending
  const sortedDates = [...dates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div>
      <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-2">Important Days</h2>
      <p className="text-stone-500 mb-8">A collection of days you marked as special.</p>

      {sortedDates.length === 0 ? (
         <div className="text-center py-20 opacity-50">
            <Icon name="star" size={48} className="mx-auto mb-4 text-stone-300 dark:text-stone-700" />
            <p>No important days marked yet.</p>
         </div>
      ) : (
        <div className="grid gap-4">
          {sortedDates.map((d) => {
            const dateObj = new Date(d.date);
            return (
                <Link to={`/?date=${d.date}`} key={d.date}> {/* Note: HomePage needs to read url param if implemented, but for simplicity user can navigate via calendar */}
                   <Card className="hover:border-stone-300 dark:hover:border-stone-600 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                         <div className="flex flex-col items-center justify-center bg-stone-100 dark:bg-stone-800 w-16 h-16 rounded-lg text-stone-900 dark:text-stone-100 font-serif">
                            <span className="text-xs uppercase font-sans tracking-widest">{format(dateObj, 'MMM')}</span>
                            <span className="text-2xl font-bold">{format(dateObj, 'dd')}</span>
                         </div>
                         <div>
                            <p className="font-medium text-lg text-stone-800 dark:text-stone-200">{format(dateObj, 'EEEE, yyyy')}</p>
                            <p className="text-sm text-stone-500">Tap to view entries</p>
                         </div>
                      </div>
                      <Icon name="chevron-right" className="text-stone-300 group-hover:text-stone-500" />
                   </Card>
                </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImportantDatesPage;
export type EntryType = 
  | 'task' 
  | 'log' 
  | 'reflection' 
  | 'fact' 
  | 'vocabulary' 
  | 'birthday';

export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  type: EntryType;
  date: string; // YYYY-MM-DD
  createdAt: number;
  isCompleted?: boolean; // For tasks
}

export interface DayMetadata {
  date: string; // YYYY-MM-DD
  isImportant: boolean;
  userId: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
}

export const CATEGORIES: { type: EntryType; label: string; icon: string }[] = [
  { type: 'task', label: 'Tasks', icon: 'check-square' },
  { type: 'log', label: 'Logs', icon: 'clock' },
  { type: 'reflection', label: 'Reflections', icon: 'moon' },
  { type: 'fact', label: 'Facts', icon: 'lightbulb' },
  { type: 'vocabulary', label: 'Vocabulary', icon: 'book-open' },
  { type: 'birthday', label: 'Dates', icon: 'calendar-heart' },
];
import { useState, useEffect } from 'react';
import { 
  db, 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  updateDoc, 
  doc, 
  deleteDoc,
  serverTimestamp,
  orderBy,
  setDoc,
  getDoc
} from '../firebase';
import { JournalEntry, EntryType, DayMetadata } from '../types';

export const useJournal = (userId: string | undefined, dateStr: string) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isImportant, setIsImportant] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);

    const q = query(
      collection(db, `users/${userId}/entries`),
      where("date", "==", dateStr),
      orderBy("createdAt", "asc")
      
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
      const newEntries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JournalEntry[];
      setEntries(newEntries);
      setLoading(false);
    },
    (err) => {
      console.error("Journal subscription error:", err);
      setError(err.message);
      setLoading(false);
    }
  );

    // Check if day is important
    const checkImportance = async () => {
      try {
        const docRef = doc(db, `users/${userId}/days/${dateStr}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setIsImportant(docSnap.data().isImportant);
        } else {
          setIsImportant(false);
        }
      } catch (err: any) {
        console.error("Check importance error:", err);
        // Don't overwrite main error if it exists, but ensure we catch this
        setError(prev => prev || err.message);
      }
    };
    checkImportance();

    return () => unsubscribe();
  }, [userId, dateStr]);

  
  const addEntry = async (content: string, type: EntryType) => {
    if (!userId) return;
    try {
      await addDoc(collection(db, `users/${userId}/entries`), {
        userId,
        content,
        type,
        date: dateStr,
        createdAt: Date.now(),
        isCompleted: false
      });
    } catch (err: any) {
      console.error("Add entry error:", err);
      setError(err.message);
    }
  };

  const toggleTask = async (entryId: string, currentStatus: boolean) => {
    if (!userId) return;
    try {
      await updateDoc(doc(db, `users/${userId}/entries`, entryId), {
        isCompleted: !currentStatus
      });
    } catch (err: any) {
      console.error("Toggle task error:", err);
      setError(err.message);
    }
  };

  const deleteEntry = async (entryId: string) => {
    if (!userId) return;
    try {
      await deleteDoc(doc(db, `users/${userId}/entries`, entryId));
    } catch (err: any) {
      console.error("Delete entry error:", err);
      setError(err.message);
    }
  };

  const toggleImportance = async () => {
    if (!userId) return;
    try {
      const newStatus = !isImportant;
      setIsImportant(newStatus);
      await setDoc(doc(db, `users/${userId}/days/${dateStr}`), {
        date: dateStr,
        isImportant: newStatus,
        userId
      }, { merge: true });
    } catch (err: any) {
      console.error("Toggle importance error:", err);
      setError(err.message);
      // Revert optimistic update if needed, though simple enough here
      setIsImportant(!isImportant); 
    }
  };

  return { entries, loading, error, addEntry, toggleTask, deleteEntry, isImportant, toggleImportance };
};

export const useGlobalSearch = (userId: string | undefined) => {
    // Note: Client-side filtering for simplicity in this demo. 
    // For production with massive data, use Algolia or specialized Firestore structure.
    const [results, setResults] = useState<JournalEntry[]>([]);
    const [searching, setSearching] = useState(false);

    const search = async (term: string, typeFilter?: EntryType, dateRange?: {start: string, end: string}) => {
        if (!userId) return;
        setSearching(true);
        
        try {
            let constraints: any[] = [orderBy("createdAt", "desc")];
            
            // Basic optimization: if searching specific date range, let firestore handle it
            if (dateRange) {
                constraints.push(where("date", ">=", dateRange.start));
                constraints.push(where("date", "<=", dateRange.end));
            }
            
            // If searching by type, firestore can handle it
            if (typeFilter) {
                constraints.push(where("type", "==", typeFilter));
            }

            const q = query(collection(db, `users/${userId}/entries`), ...constraints);
            
            // We fetch once then filter content client-side for "keywords"
            // Firestore doesn't support partial string match (LIKE %term%) natively
            const snapshot = await new Promise<any>((resolve, reject) => {
              const unsub = onSnapshot(q, 
                (snap) => {
                  unsub();
                  resolve(snap);
                },
                (err) => {
                  unsub();
                  reject(err);
                }
              );
          });

            const allFetched = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() })) as JournalEntry[];
            
            const filtered = allFetched.filter(entry => {
                const matchesTerm = term ? entry.content.toLowerCase().includes(term.toLowerCase()) : true;
                return matchesTerm;
            });

            setResults(filtered);
        } catch (e) {
            console.error("Search failed", e);
        } finally {
            setSearching(false);
        }
    };

    return { results, search, searching };
};

export const useImportantDates = (userId: string | undefined) => {
  const [dates, setDates] = useState<DayMetadata[]>([]);

  useEffect(() => {
    if (!userId) return;
    const q = query(
      collection(db, `users/${userId}/days`),
      where("isImportant", "==", true)
    );
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        setDates(snapshot.docs.map(doc => doc.data() as DayMetadata));
      },
      (error) => {
        console.error("Important dates subscription error:", error);
      }
    );
    return () => unsubscribe();
  }, [userId]);

  return dates;
};
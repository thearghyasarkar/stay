import React, { useState, useEffect, useRef } from 'react';
import { Icon, Button } from './UI';
import { EntryType, CATEGORIES } from '../types';

interface JournalEditorProps {
  onAdd: (content: string, type: EntryType) => Promise<void>;
  selectedType: EntryType;
  setSelectedType: (type: EntryType) => void;
  showCategories?: boolean;
}

const JournalEditor: React.FC<JournalEditorProps> = ({ onAdd, selectedType, setSelectedType, showCategories = true }) => {
  const [content, setContent] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        
         setContent(prev => {
            if (transcript.startsWith(prev)) return transcript;
            return transcript;
         });
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
         setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setContent(''); 
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim()) return;
    
    await onAdd(content, selectedType);
    setContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="sticky bottom-0 z-30 bg-paper-light/95 dark:bg-paper-dark/95 backdrop-blur-md pt-4 pb-2 border-t border-stone-100 dark:border-stone-800 -mx-4 md:-mx-8 px-4 md:px-8">
       {/*  Category Tabs */}
       {/* {showCategories && (
        <div className="flex gap-4 mb-8 border-b border-stone-200 dark:border-stone-800">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.type}
            onClick={() => setSelectedType(cat.type)}
            className={`
              flex items-center gap-2 pb-3 text-sm font-medium transition-all relative
              ${selectedType === cat.type
                ? 'text-stone-900 dark:text-stone-100' 
                : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'}
            `}
          >
            <Icon name={cat.icon} size={16} />
            {cat.label}
            {selectedType === cat.type && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-stone-900 dark:bg-stone-100" />
            )}
          </button>
        ))}
      </div> 
       )} */}

      <form onSubmit={handleSubmit} className="relative flex items-end gap-2 lg:pb-2">
        <div className="flex-1 relative bg-stone-100 dark:bg-stone-800 rounded-3xl transition-all focus-within:ring-2 focus-within:ring-stone-400/20 dark:focus-within:ring-stone-500/30">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Add to ${CATEGORIES.find(c => c.type === selectedType)?.label.toLowerCase()}...`}
            className="w-full bg-transparent border-none px-5 py-3.5 lg:pr-12 resize-none focus:outline-none min-h-[52px] max-h-[150px] text-base leading-relaxed scrollbar-hide placeholder:text-stone-400"
            rows={1}
            style={{ height: 'auto' }} 
            onInput={(e) => {
                e.currentTarget.style.height = 'auto';
                e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
            }}
          />
          <button
            type="button"
            onClick={toggleListening}
            className={`absolute right-1.5 bottom-1.5 p-2.5 rounded-full transition-all active:scale-90 ${isListening ? 'bg-red-500 text-white animate-pulse shadow-md' : 'text-stone-400 hover:text-stone-600 active:bg-stone-200 dark:active:bg-stone-700'}`}
          >
            <Icon name={isListening ? 'mic-off' : 'mic'} size={20} />
          </button>
        </div>
        
        <button 
          type="submit" 
          disabled={!content.trim()}
          className={`
            h-[52px] w-[52px] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-sm
            ${content.trim() 
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 translate-y-0 opacity-100' 
              : 'bg-stone-200 text-stone-400 dark:bg-stone-800 dark:text-stone-600 cursor-not-allowed'}
          `}
        >
          <Icon name="arrow-up" size={24} className={content.trim() ? "translate-y-[1px]" : ""} />
        </button>
      </form>
    </div>
  );
};

export default JournalEditor;
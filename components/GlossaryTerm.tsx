
import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X, Info } from 'lucide-react';
import { GLOSSARY } from '../utils/glossary';
import { useLanguage } from '../context/LanguageContext';

interface GlossaryTermProps {
  term: string;
  children: React.ReactNode;
}

export const GlossaryTerm: React.FC<GlossaryTermProps> = ({ term, children }) => {
  const [show, setShow] = useState(false);
  const { language } = useLanguage();
  const popoverRef = useRef<HTMLDivElement>(null);
  const termKey = term.toLowerCase();
  
  const data = GLOSSARY[termKey] ? GLOSSARY[termKey][language] : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show]);

  if (!data) {
    return <>{children}</>;
  }

  return (
    <span className="relative inline-block group">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShow(!show);
        }}
        className="border-b border-dashed border-blue-500 hover:border-blue-700 dark:border-blue-400 dark:hover:border-blue-300 transition-colors cursor-help font-medium"
        aria-haspopup="true"
        title={data.title}
      >
        {children}
      </button>

      {show && (
        <div 
          ref={popoverRef}
          className="absolute z-[100] bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-white dark:border-t-slate-800"></div>
          
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 text-sm">
              <Info size={14} /> {data.title}
            </h4>
            <button onClick={() => setShow(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
              <X size={14} />
            </button>
          </div>
          <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
            {data.definition}
          </p>
        </div>
      )}
    </span>
  );
};

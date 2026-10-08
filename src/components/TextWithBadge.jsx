import React from 'react';

export default function TextWithBadge({ text }) {
  if (!text) return null;
  
  // Regex to match English words or phrases (allows letters, spaces, hyphens, and numbers)
  // Ensures it starts and ends with a letter, or is a single letter
  const regex = /([a-zA-Z][a-zA-Z0-9\s\-]*[a-zA-Z]|[a-zA-Z])/g;
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, index) => {
        if (/^[a-zA-Z][a-zA-Z0-9\s\-]*[a-zA-Z]$|^[a-zA-Z]$/.test(part)) {
          return (
            <span 
              key={index} 
              className="inline-flex items-center mx-1 px-1.5 py-0.5 bg-teal-50/80 dark:bg-teal-900/40 text-teal-800 dark:text-teal-200 rounded-md border border-teal-100 dark:border-teal-800 shadow-sm whitespace-nowrap font-sans font-semibold text-sm" 
              dir="ltr"
            >
              {part}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

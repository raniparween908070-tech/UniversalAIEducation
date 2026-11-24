import React from 'react';

interface FormattedTextProps {
  content: string;
}

export const FormattedText: React.FC<FormattedTextProps> = ({ content }) => {
  if (!content) return null;

  // Split lines to handle line breaks, bullet points, and paragraphs
  const lines = content.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        // Check for bullet points (- or *)
        const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
        const textToProcess = isBullet ? line.trim().substring(2) : line;

        // Parse **bold** within the line
        const parts = textToProcess.split(/(\*\*.*?\*\*)/g);

        const renderedLine = parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const boldText = part.slice(2, -2);
            return <strong key={pIdx} className="font-bold text-indigo-700 dark:text-indigo-300">{boldText}</strong>;
          }
          return part;
        });

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-4">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
              <span>{renderedLine}</span>
            </div>
          );
        }

        if (line.trim() === '') {
          return <div key={idx} className="h-2" />;
        }

        return (
          <p key={idx} className="leading-relaxed">
            {renderedLine}
          </p>
        );
      })}
    </div>
  );
};

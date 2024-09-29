import React from 'react';

interface LabelProps {
  htmlFor: string;
  text: string;
  className?: string;
}

const Label: React.FC<LabelProps> = ({ htmlFor, text, className }) => {
  return (
    <label htmlFor={htmlFor} className={`max-md:text-2xl block text-sm font-medium text-white ${className}`}>
      {text}
    </label>
  );
};

export default Label;

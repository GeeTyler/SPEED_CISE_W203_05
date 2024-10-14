import React, { ReactNode } from 'react';

interface SelectProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  children: ReactNode;  // Add this line
}

const Select: React.FC<SelectProps> = ({ id, value, onChange, children, ...props }) => (
  <select
    id={id}
    value={value}
    onChange={onChange}
    {...props}
    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
  >
    {children}
  </select>
);

export default Select;

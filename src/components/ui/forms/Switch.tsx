import React from 'react';

interface SwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const Switch: React.FC<SwitchProps> = ({ id, checked, onChange, label }) => {
  return (
    <div className='flex items-center'>
      {label && (
        <label
          htmlFor={id}
          className='mr-3 text-gray-900 dark:text-white cursor-pointer'
        >
          {label}
        </label>
      )}
      <input
        type='checkbox'
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className='sr-only'
      />
      <div
        className={`relative inline-block w-10 h-6 rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          ${checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}`}
        onClick={() => onChange(!checked)}
      >
        <span
          className={`absolute left-0 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform ease-in-out duration-200
            ${checked ? 'translate-x-4' : 'translate-x-0'}`}
        ></span>
      </div>
    </div>
  );
};

export default Switch;

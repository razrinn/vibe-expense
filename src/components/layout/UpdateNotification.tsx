import React from 'react';
import { useUpdateNotification } from '../../context/UpdateNotificationContext';
import { X } from 'lucide-react';

const UpdateNotification: React.FC = () => {
  const { showUpdateNotification, hideNotification } = useUpdateNotification();

  if (!showUpdateNotification) {
    return null;
  }

  return (
    <div className='fixed top-0 left-0 right-0 bg-green-500 text-white p-3 flex items-center justify-between z-50'>
      <p className='text-sm font-medium'>
        Update is available! Click to reload.
      </p>
      <button
        onClick={() => window.location.reload()}
        className='ml-4 px-3 py-1 rounded-md bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 text-white text-sm font-medium'
      >
        Reload
      </button>
      <button
        onClick={hideNotification}
        className='ml-2 p-1 rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400'
        aria-label='Close notification'
      >
        <X className='h-5 w-5' />
      </button>
    </div>
  );
};

export default UpdateNotification;

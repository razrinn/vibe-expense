import React, { ReactNode } from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Sidebar from './Sidebar';

interface PageContainerProps {
  children: ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <div className='flex min-h-screen bg-gray-100 dark:bg-black-950'>
      <Sidebar />

      <div className='flex-1 flex flex-col sm:ml-64'>
        <Header />

        <main className='flex-1 p-4 sm:p-6 pb-20 sm:pb-6'>{children}</main>

        <Navigation />
      </div>
    </div>
  );
};

export default PageContainer;

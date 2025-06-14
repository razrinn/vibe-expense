import Header from './Header';
import Navigation from './Navigation';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
const PageLayout = () => {
  return (
    <div className='flex min-h-dvh bg-gray-100 dark:bg-black-950'>
      <Sidebar />

      <div className='flex-1 flex flex-col sm:ml-64'>
        <Header />

        <main className='flex-1 p-4 sm:p-6 pb-safe-offset-20 sm:pb-6'>
          <Outlet />
        </main>

        <Navigation />
      </div>
    </div>
  );
};

export default PageLayout;

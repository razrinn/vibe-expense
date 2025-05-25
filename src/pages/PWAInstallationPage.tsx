import React from 'react';
import PageContainer from '../components/layout/PageContainer';

const PWAInstallationPage: React.FC = () => {
  return (
    <PageContainer>
      <div className='space-y-8'>
        <div className='bg-white dark:bg-black-900 rounded-lg shadow p-6 borderborder-gray-200 dark:border-gray-700'>
          <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
            Install Progressive Web App (PWA)
          </h3>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400 mb-4'>
            Follow these steps to install this application to your home screen
            for a native app-like experience.
          </p>

          <div className='space-y-6'>
            <div>
              <h4 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                For Android Users:
              </h4>
              <ol className='list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2'>
                <li>Open the app in your Chrome browser.</li>
                <li>
                  Tap the three-dot menu icon (
                  <span className='font-bold'>⋮</span>) in the top right corner.
                </li>
                <li>
                  Select "<span className='font-bold'>Add to Home screen</span>"
                  or "<span className='font-bold'>Install app</span>".
                </li>
                <li>Confirm the installation when prompted.</li>
                <li>The app icon will appear on your home screen.</li>
              </ol>
            </div>

            <div>
              <h4 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                For iOS Users (Safari):
              </h4>
              <ol className='list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2'>
                <li>Open the app in your Safari browser.</li>
                <li>
                  Tap the <span className='font-bold'>Share</span> button at the
                  bottom of the screen.
                </li>
                <li>
                  Scroll down and select "
                  <span className='font-bold'>Add to Home Screen</span>".
                </li>
                <li>
                  Tap "<span className='font-bold'>Add</span>" in the top right
                  corner.
                </li>
                <li>The app icon will appear on your home screen.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default PWAInstallationPage;

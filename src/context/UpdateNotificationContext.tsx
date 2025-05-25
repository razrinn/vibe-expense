import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

interface UpdateNotificationContextType {
  isUpdateAvailable: boolean;
  showUpdateNotification: boolean;
  hideNotification: () => void;
}

const UpdateNotificationContext = createContext<
  UpdateNotificationContextType | undefined
>(undefined);

export const UpdateNotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);

  const hideNotification = useCallback(() => {
    setShowUpdateNotification(false);
    localStorage.setItem('updateNotificationDismissed', 'true');
  }, []);

  useEffect(() => {
    // Check if the notification was previously dismissed for the current version
    const dismissed = localStorage.getItem('updateNotificationDismissed');
    if (dismissed === 'true') {
      setShowUpdateNotification(false);
    }

    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NEW_VERSION_AVAILABLE') {
        console.log('New version available:', event.data.version);
        setIsUpdateAvailable(true);
        // Only show if not previously dismissed for this update cycle
        if (localStorage.getItem('updateNotificationDismissed') !== 'true') {
          setShowUpdateNotification(true);
        }
        // Reset dismissal status for the new version
        localStorage.removeItem('updateNotificationDismissed');
      }
    };

    // Register service worker if not already registered
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          // Listen for messages from the service worker
          navigator.serviceWorker.addEventListener(
            'message',
            handleServiceWorkerMessage
          );
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener(
          'message',
          handleServiceWorkerMessage
        );
      }
    };
  }, []);

  return (
    <UpdateNotificationContext.Provider
      value={{ isUpdateAvailable, showUpdateNotification, hideNotification }}
    >
      {children}
    </UpdateNotificationContext.Provider>
  );
};

export const useUpdateNotification = () => {
  const context = useContext(UpdateNotificationContext);
  if (context === undefined) {
    throw new Error(
      'useUpdateNotification must be used within an UpdateNotificationProvider'
    );
  }
  return context;
};

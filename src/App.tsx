
import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Index from "./pages/Index";
import AssetDetail from "./pages/AssetDetail";
import Dashboard from "./pages/Dashboard";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import AdminCategories from "./pages/admin/Categories";
import AdminSuperCategories from "./pages/admin/SuperCategories";
import Leaderboard from './pages/Leaderboard';
import { toast } from "@/hooks/use-toast";

// Enhanced service worker registration with update notification
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/serviceWorker.js', {
        scope: '/'
      });

      // Check for updates to the service worker
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker is installed but waiting to activate
              toast({
                title: "App Update Available",
                description: "Refresh to use the latest version",
                action: (
                  <button 
                    onClick={() => window.location.reload()} 
                    className="bg-primary text-white px-3 py-1 rounded text-xs"
                  >
                    Refresh Now
                  </button>
                ),
                duration: 10000,
              });
            }
          });
        }
      });

      console.log('Service Worker registered successfully:', registration);
      
      // Check for controller change (when a new service worker takes over)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('New service worker controller activated');
      });
      
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Configure background sync for offline actions
const setupBackgroundSync = async () => {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Check if sync is available on this registration
      if ('sync' in registration) {
        // Register sync event
        (registration as any).sync.register('sync-favorites');
        console.log('Background sync registered');
      } else {
        console.log('Background Sync API not available in this browser');
      }
    } catch (error) {
      console.error('Background sync registration failed:', error);
    }
  } else {
    console.log('Background Sync not supported on this browser');
  }
};

// Request notification permission
const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('Notification permission granted');
        
        // Subscribe to push notifications (in a real app, this would connect to a push service)
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          const registration = await navigator.serviceWorker.ready;
          
          try {
            // This would be where you subscribe to your push service
            // For demonstration, we'll just log that it's ready
            console.log('Push notification ready to subscribe');
          } catch (error) {
            console.error('Error subscribing to push notifications:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  }
};

// Check if the app is installed as PWA
const isPwa = () => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
};

// App installation promotion
const checkAppInstallPromotion = () => {
  let deferredPrompt: any;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show the install promotion to the user
    setTimeout(() => {
      if (deferredPrompt && !localStorage.getItem('installPromptDismissed')) {
        toast({
          title: "Install CryptoView",
          description: "Add to your home screen for a better experience",
          action: (
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  if (deferredPrompt) {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult: {outcome: string}) => {
                      if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                      }
                      deferredPrompt = null;
                    });
                  }
                }} 
                className="bg-primary text-white px-3 py-1 rounded text-xs"
              >
                Install
              </button>
              <button 
                onClick={() => {
                  localStorage.setItem('installPromptDismissed', 'true');
                }} 
                className="bg-muted text-muted-foreground px-3 py-1 rounded text-xs"
              >
                Dismiss
              </button>
            </div>
          ),
          duration: 10000,
        });
      }
    }, 5000); // Show after 5 seconds
  });
  
  // Handle app installed event
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
  });
};

// Check internet connection status
const setupNetworkStatusMonitoring = () => {
  const updateNetworkStatus = () => {
    if (navigator.onLine) {
      console.log('Back online');
      document.body.classList.remove('offline');
      toast({
        title: "You're back online",
        description: "All features are now available",
        duration: 3000,
      });
    } else {
      console.log('Offline');
      document.body.classList.add('offline');
      toast({
        title: "You're offline",
        description: "Limited functionality available",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  window.addEventListener('online', updateNetworkStatus);
  window.addEventListener('offline', updateNetworkStatus);
  
  // Check initial status
  updateNetworkStatus();
};

// Handle Web Share API for sharing content
export const shareContent = async (title: string, text: string, url: string) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
      console.log('Content shared successfully');
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing content:', error);
      }
    }
  } else {
    // Fallback for browsers that don't support the Web Share API
    console.log('Web Share API not supported');
    // Copy to clipboard instead
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${title} - ${text} ${url}`);
        toast({
          title: "Link copied to clipboard",
          description: "You can now paste and share it",
          duration: 3000,
        });
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  }
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isPwaInstalled, setIsPwaInstalled] = useState(isPwa());
  
  useEffect(() => {
    // Register service worker
    registerServiceWorker();
    
    // Setup background sync
    setupBackgroundSync();
    
    // Request notification permission (after user interaction)
    const requestNotifications = () => {
      requestNotificationPermission();
      window.removeEventListener('click', requestNotifications);
    };
    window.addEventListener('click', requestNotifications);
    
    // Check for app installation
    checkAppInstallPromotion();
    
    // Monitor network status
    setupNetworkStatusMonitoring();
    
    // Check if the app is installed as a PWA
    const mediaQueryList = window.matchMedia('(display-mode: standalone)');
    const mediaQueryChangeHandler = (e: MediaQueryListEvent) => {
      setIsPwaInstalled(e.matches);
    };
    
    mediaQueryList.addEventListener('change', mediaQueryChangeHandler);
    
    // Cleanup
    return () => {
      window.removeEventListener('click', requestNotifications);
      mediaQueryList.removeEventListener('change', mediaQueryChangeHandler);
    };
  }, []);
  
  // Update online status in state
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {!isOnline && (
              <div className="fixed bottom-0 left-0 w-full bg-destructive text-white p-2 text-center text-sm z-50">
                You're currently offline. Some features may be limited.
              </div>
            )}
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/asset/:id" element={<AssetDetail />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/super-categories" element={<AdminSuperCategories />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;

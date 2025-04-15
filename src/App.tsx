
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import AssetDetail from '@/pages/AssetDetail';
import AuthDialog from '@/components/auth/AuthDialog';
import Dashboard from '@/pages/Dashboard';
import Leaderboard from '@/pages/Leaderboard';
import Messages from '@/pages/Messages';
import Categories from '@/pages/admin/Categories';
import SuperCategories from '@/pages/admin/SuperCategories';
import SuperAdminDashboard from '@/pages/admin/SuperAdminDashboard';
import NotFound from '@/pages/NotFound';
import './App.css';
import { useLanguage } from './contexts/LanguageContext';
import Header from './components/Header';

function App() {
  const { loadLanguage } = useLanguage();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    loadLanguage();
  }, [loadLanguage]);

  return (
    <div className="app">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/asset/:id" element={<AssetDetail />} />
          <Route path="/login" element={
            <div>
              <AuthDialog isOpen={true} onClose={() => setIsAuthOpen(false)} />
            </div>
          } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:conversationId" element={<Messages />} />
          
          {/* Admin routes */}
          <Route path="/admin/super" element={<SuperAdminDashboard />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/super-categories" element={<SuperCategories />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </ThemeProvider>
    </div>
  );
}

export default App;


import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import AuthDialog from "./auth/AuthDialog";
import { 
  User, 
  LogOut,
  MessageSquare,
  Settings,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { user, logout } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const isAdmin = user.profile?.role === 'admin';

  return (
    <header className="w-full py-6 px-4 md:px-8 border-b border-border/40 bg-white/80 backdrop-blur-md sticky top-0 z-10 animate-fade-in">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-md">
            C
          </div>
          <h1 className="text-xl font-semibold tracking-tight">CryptoView</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {!isHome && (
            <Link 
              to="/" 
              className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              Back to Assets
            </Link>
          )}
          
          {user.isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* Messages Link */}
              <Link to="/messages">
                <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Messages
                </Button>
              </Link>
              
              {/* Dashboard & Admin Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                    <ChevronDown className="h-3 w-3 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Admin</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/categories" className="cursor-pointer">
                          Asset Categories
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/super-categories" className="cursor-pointer">
                          Super Categories & Banner
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => logout()}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => setIsAuthDialogOpen(true)}
              size="sm"
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </div>
      
      <AuthDialog 
        isOpen={isAuthDialogOpen} 
        onClose={() => setIsAuthDialogOpen(false)} 
      />
    </header>
  );
};

export default Header;

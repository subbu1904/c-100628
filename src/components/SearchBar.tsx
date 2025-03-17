
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; 
import { Search, Mic, X } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Voice recognition support check
  const [supportsVoiceSearch, setSupportsVoiceSearch] = useState(false);
  
  useEffect(() => {
    // Check if browser supports SpeechRecognition
    const checkVoiceSupport = () => {
      return 'SpeechRecognition' in window || 
             'webkitSpeechRecognition' in window || 
             'mozSpeechRecognition' in window || 
             'msSpeechRecognition' in window;
    };
    
    setSupportsVoiceSearch(checkVoiceSupport());
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };
  
  const startVoiceSearch = () => {
    if (!supportsVoiceSearch) {
      toast({
        title: "Voice Search Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
      return;
    }
    
    setIsListening(true);
    
    // Set up speech recognition with proper type checking
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognitionAPI) {
      toast({
        title: "Voice Search Error",
        description: "Failed to initialize speech recognition.",
        variant: "destructive"
      });
      setIsListening(false);
      return;
    }
    
    const recognition = new SpeechRecognitionAPI();
    
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      onSearch(transcript);
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      toast({
        title: "Voice Search Error",
        description: `Could not recognize speech: ${event.error}`,
        variant: "destructive"
      });
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
    
    toast({
      title: "Listening...",
      description: "Speak now to search for assets.",
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search by name, symbol..."
          className="pl-10 pr-16"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        
        {supportsVoiceSearch && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={`absolute right-1 top-1/2 transform -translate-y-1/2 ${isListening ? 'text-primary animate-pulse' : ''}`}
            onClick={startVoiceSearch}
          >
            <Mic className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;

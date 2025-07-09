import React, { useState, useEffect } from 'react';
import { useNavigation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const NavigationIndicator = () => {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (navigation.state === 'loading') {
      setProgress(30);
      
      const timer = setTimeout(() => {
        setProgress(60);
      }, 100);

      const timer2 = setTimeout(() => {
        setProgress(90);
      }, 300);

      return () => {
        clearTimeout(timer);
        clearTimeout(timer2);
      };
    } else {
      setProgress(100);
      const timer = setTimeout(() => {
        setProgress(0);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [navigation.state]);

  if (navigation.state === 'idle' && progress === 0) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <Progress 
        value={progress} 
        className="h-1 rounded-none border-none bg-transparent"
      />
      {navigation.state === 'loading' && (
        <div className="absolute top-2 right-4 flex items-center space-x-2 bg-background/80 backdrop-blur px-3 py-1 rounded-full shadow-sm">
          <Loader2 className="h-3 w-3 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default NavigationIndicator;
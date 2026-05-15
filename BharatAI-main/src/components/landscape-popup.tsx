
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Gift } from 'lucide-react';

export function LandscapePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(true); // Default to true on server

  // Check sessionStorage on client mount
  useEffect(() => {
    setHasBeenDismissed(sessionStorage.getItem('landscapeSuggestionShown') === 'true');
  }, []);

  useEffect(() => {
    // Only run on client and if not dismissed
    if (typeof window === 'undefined' || hasBeenDismissed) return;

    let timer: NodeJS.Timeout;

    const checkOrientationAndShow = () => {
      clearTimeout(timer); // Clear previous timer
      const isPortrait = window.innerHeight > window.innerWidth;
      
      // We only want to show the popup in portrait mode.
      if (isPortrait) {
        timer = setTimeout(() => {
          setIsVisible(true);
        }, 1500); // Show after 1.5 seconds in portrait
      } else {
        setIsVisible(false); // Hide immediately if in landscape
      }
    };

    checkOrientationAndShow(); // Initial check

    window.addEventListener('resize', checkOrientationAndShow);
    window.addEventListener('orientationchange', checkOrientationAndShow);

    return () => {
      window.removeEventListener('resize', checkOrientationAndShow);
      window.removeEventListener('orientationchange', checkOrientationAndShow);
      clearTimeout(timer);
    };
  }, [hasBeenDismissed]); // Rerun if dismissal state changes

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('landscapeSuggestionShown', 'true');
    setHasBeenDismissed(true);
  };

  // Render nothing if it has been dismissed for this session.
  if (hasBeenDismissed && !isVisible) { // Keep rendering if visible to allow for exit animation
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.7 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            rotate: [0, -3, 3, -3, 0],
          }}
          exit={{ opacity: 0, y: 100, scale: 0.7, transition: { duration: 0.2 } }}
          transition={{ type: 'spring', stiffness: 100, damping: 10, delay: 0.5 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Card className="bg-card/80 backdrop-blur-xl border border-primary/30 shadow-2xl shadow-primary/20 max-w-sm">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className='flex items-center gap-3'>
                <div className="p-2 bg-primary/20 rounded-full">
                    <Gift className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-semibold">
                    A Tip For You!
                </CardTitle>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 -mt-1 -mr-1 shrink-0" onClick={handleDismiss}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mt-2">
                For the best experience, please rotate your device to landscape mode.
              </p>
              <Button className="w-full mt-4" onClick={handleDismiss}>
                Got it!
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

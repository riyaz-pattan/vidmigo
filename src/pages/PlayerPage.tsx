
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '@/components/VideoPlayer';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const PlayerPage = () => {
  const { videoPath } = useParams<{ videoPath: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Request fullscreen when component mounts
    const enterFullscreen = async () => {
      try {
        if (document.documentElement && document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.log('Fullscreen request failed:', err);
      }
    };

    enterFullscreen();
    
    // Disable screen timeout
    if (navigator.wakeLock) {
      navigator.wakeLock.request('screen')
        .catch(err => console.log('Wake lock error:', err));
    }
    
    // Exit fullscreen when component unmounts
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen()
          .catch(err => console.log('Error exiting fullscreen:', err));
      }
    };
  }, []);

  useEffect(() => {
    if (!videoPath) {
      toast({
        title: "Error",
        description: "No video path provided",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    // Simulate video loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [videoPath, navigate, toast]);
  
  const handleClose = () => {
    navigate('/');
  };
  
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-player-control animate-spin" />
          <p className="text-white mt-4">Loading video...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black z-50">
      {videoPath && (
        <VideoPlayer 
          videoPath={decodeURIComponent(videoPath)}
          onClose={handleClose}
        />
      )}
    </div>
  );
};

export default PlayerPage;

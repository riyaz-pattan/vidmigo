
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoPlayer from '@/components/VideoPlayer';

const PlayerPage = () => {
  const { videoPath } = useParams<{ videoPath: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Enable fullscreen mode and prevent sleep
    document.documentElement.requestFullscreen?.()
      .catch(err => console.log('Fullscreen request failed:', err));
    
    // On cleanup, exit fullscreen
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen?.()
          .catch(err => console.log('Error exiting fullscreen:', err));
      }
    };
  }, []);
  
  const handleClose = () => {
    navigate('/');
  };
  
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

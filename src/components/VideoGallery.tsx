
import React from 'react';
import { Play, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

type VideoItem = {
  id: string;
  title: string;
  thumbnail: string;
  path: string;
  duration: number;
  lastPlayed?: Date;
};

type VideoGalleryProps = {
  title: string;
  videos: VideoItem[];
  onVideoSelect: (path: string) => void;
};

const VideoGallery: React.FC<VideoGalleryProps> = ({ title, videos, onVideoSelect }) => {
  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <div 
            key={video.id} 
            className="video-item"
            onClick={() => onVideoSelect(video.path)}
          >
            <div className="video-thumbnail">
              <img 
                src={video.thumbnail} 
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                {formatDuration(video.duration)}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40">
                <div className="bg-player-control/90 rounded-full p-2">
                  <Play className="h-6 w-6 text-white" fill="white" />
                </div>
              </div>
            </div>
            
            <div className="p-2">
              <h3 className="text-sm font-medium truncate">{video.title}</h3>
              <div className="flex items-center text-xs text-gray-400 mt-1">
                {video.lastPlayed && (
                  <>
                    <Clock className="h-3 w-3 mr-1" />
                    <span className="mr-2">
                      {new Date(video.lastPlayed).toLocaleDateString()}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGallery;

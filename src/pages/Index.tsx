
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import VideoGallery from '@/components/VideoGallery';
import FileBrowser from '@/components/FileBrowser';

// Mock data for recently played videos
const recentVideos = [
  {
    id: '1',
    title: 'Big Buck Bunny',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/220px-Big_buck_bunny_poster_big.jpg',
    path: '/Movies/Big Buck Bunny.mp4',
    duration: 596,
    lastPlayed: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: '2',
    title: 'Sintel',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Sintel_poster.jpg/220px-Sintel_poster.jpg',
    path: '/Movies/Sintel.mp4',
    duration: 888,
    lastPlayed: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  },
  {
    id: '3',
    title: 'Tears of Steel',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Tears_of_Steel_poster.jpg/220px-Tears_of_Steel_poster.jpg',
    path: '/Movies/Action/Movie1.mp4',
    duration: 734,
    lastPlayed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
  },
  {
    id: '4',
    title: 'Elephant Dream',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Elephants_Dream_cover.jpg/220px-Elephants_Dream_cover.jpg',
    path: '/Movies/Action/Movie2.mkv',
    duration: 654,
    lastPlayed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3) // 3 days ago
  }
];

// Mock data for folders
const folders = [
  {
    id: '1',
    title: 'Action Movies',
    thumbnail: 'https://images.unsplash.com/photo-1559570278-eb8d71d06403?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.0.3',
    path: '/Movies/Action',
    videos: 12
  },
  {
    id: '2',
    title: 'Comedy',
    thumbnail: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.0.3',
    path: '/Movies/Comedy',
    videos: 8
  },
  {
    id: '3',
    title: 'Downloads',
    thumbnail: 'https://images.unsplash.com/photo-1618609377864-68609b757c27?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.0.3',
    path: '/Downloads',
    videos: 5
  },
  {
    id: '4',
    title: 'Camera Roll',
    thumbnail: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3',
    path: '/Camera',
    videos: 23
  }
];

const Index = () => {
  const navigate = useNavigate();
  
  const handleVideoSelect = (videoPath: string) => {
    // Navigate to the player page with the selected video path
    navigate(`/player/${encodeURIComponent(videoPath)}`);
  };

  return (
    <div className="min-h-screen bg-player-background text-white">
      <header className="py-4 px-6 flex items-center justify-between border-b border-white/10">
        <h1 className="text-xl font-semibold">
          <span className="text-player-control">vid</span>migo
        </h1>
      </header>
      
      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="w-full border-b border-white/10 p-0 h-auto">
          <TabsTrigger 
            value="recent" 
            className="flex-1 py-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-player-control"
          >
            Recent
          </TabsTrigger>
          <TabsTrigger 
            value="folders" 
            className="flex-1 py-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-player-control"
          >
            Folders
          </TabsTrigger>
          <TabsTrigger 
            value="browse" 
            className="flex-1 py-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-player-control"
          >
            Browse
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="mt-0">
          <VideoGallery 
            title="Continue Watching" 
            videos={recentVideos.slice(0, 2)} 
            onVideoSelect={handleVideoSelect}
          />
          <VideoGallery 
            title="Recently Played" 
            videos={recentVideos} 
            onVideoSelect={handleVideoSelect}
          />
        </TabsContent>
        
        <TabsContent value="folders" className="mt-0">
          <VideoGallery 
            title="Video Folders" 
            videos={folders.map(folder => ({
              ...folder,
              duration: 0
            }))} 
            onVideoSelect={handleVideoSelect}
          />
        </TabsContent>
        
        <TabsContent value="browse" className="mt-0 h-[calc(100vh-8rem)]">
          <FileBrowser onFileSelect={handleVideoSelect} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;

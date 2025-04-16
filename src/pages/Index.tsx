
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import FileBrowser from '@/components/FileBrowser';

const Index = () => {
  const navigate = useNavigate();
  
  const handleVideoSelect = (videoPath: string) => {
    navigate(`/player/${encodeURIComponent(videoPath)}`);
  };

  return (
    <div className="min-h-screen bg-player-background text-white">
      <header className="py-4 px-6 flex items-center justify-between border-b border-white/10">
        <h1 className="text-xl font-semibold">
          <span className="text-player-control">vid</span>migo
        </h1>
      </header>
      
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="w-full border-b border-white/10 p-0 h-auto">
          <TabsTrigger 
            value="browse" 
            className="flex-1 py-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-player-control"
          >
            Browse
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse" className="mt-0 h-[calc(100vh-8rem)]">
          <FileBrowser onFileSelect={handleVideoSelect} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;

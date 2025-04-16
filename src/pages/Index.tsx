
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import FileBrowser from '@/components/FileBrowser';
import { Filesystem, Permissions } from '@capacitor/core';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Home, FolderOpen, Settings, Info } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  
  useEffect(() => {
    checkAndRequestPermissions();
  }, []);

  const checkAndRequestPermissions = async () => {
    try {
      // Check existing permissions
      const permission = await Permissions.query({
        name: 'storage'
      });
      
      if (permission.state === 'granted') {
        setPermissionsGranted(true);
        return;
      }
      
      // Request permissions
      const requested = await Permissions.requestPermissions({
        permissions: ['storage']
      });
      
      if (requested.storage === 'granted') {
        setPermissionsGranted(true);
        toast({
          title: "Storage access granted",
          description: "You can now browse your media files"
        });
      } else {
        toast({
          title: "Permission denied",
          description: "Storage access is required to browse media files",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Permission error:', error);
      toast({
        title: "Permission error",
        description: "Could not request storage permissions",
        variant: "destructive"
      });
    }
  };

  const handleVideoSelect = (videoPath: string) => {
    navigate(`/player/${encodeURIComponent(videoPath)}`);
  };

  return (
    <div className="min-h-screen bg-player-background text-white">
      <header className="py-4 px-6 flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#1A1F2C] to-[#2A2F3C]">
        <h1 className="text-xl font-semibold">
          <span className="text-player-control">vid</span>migo
        </h1>
        
        <Button variant="ghost" size="icon" onClick={() => toast({ title: "Settings", description: "Settings button clicked" })}>
          <Settings className="h-5 w-5 text-player-control" />
        </Button>
      </header>
      
      {!permissionsGranted ? (
        <div className="flex flex-col items-center justify-center h-[80vh] p-6 text-center">
          <FolderOpen className="h-16 w-16 text-player-control mb-4" />
          <h2 className="text-xl font-medium mb-4">Storage Access Required</h2>
          <p className="text-gray-400 mb-6">To browse and play your videos, we need permission to access your device's storage.</p>
          <Button 
            onClick={checkAndRequestPermissions}
            className="bg-player-control hover:bg-player-controlHover"
          >
            Grant Permission
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="w-full border-b border-white/10 p-0 h-auto bg-[#232836]">
            <TabsTrigger 
              value="browse" 
              className="flex-1 py-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-player-control data-[state=active]:text-player-control"
            >
              <Home className="h-4 w-4 mr-2" />
              Browse
            </TabsTrigger>
            <TabsTrigger 
              value="folders" 
              className="flex-1 py-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-player-control data-[state=active]:text-player-control"
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Folders
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse" className="mt-0 h-[calc(100vh-8rem)]">
            <FileBrowser onFileSelect={handleVideoSelect} />
          </TabsContent>
          
          <TabsContent value="folders" className="mt-0 h-[calc(100vh-8rem)]">
            <FileBrowser onFileSelect={handleVideoSelect} folderView={true} />
          </TabsContent>
        </Tabs>
      )}
      
      <footer className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#232836] py-2 px-4 text-xs text-center text-gray-400">
        Vidmigo Player v1.0
      </footer>
    </div>
  );
};

export default Index;

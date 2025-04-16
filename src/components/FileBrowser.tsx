
import React, { useState } from 'react';
import { Folder, File, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FileItem = {
  name: string;
  path: string;
  isDirectory: boolean;
  size?: number;
  lastModified?: Date;
};

type FileSystemProps = {
  onFileSelect: (path: string) => void;
};

// This is a mock implementation - will be replaced with actual file system access
const FileBrowser: React.FC<FileSystemProps> = ({ onFileSelect }) => {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [history, setHistory] = useState<string[]>(['/']);
  const [files, setFiles] = useState<FileItem[]>([
    // Mock data - will be replaced with actual file system
    { name: 'Movies', path: '/Movies', isDirectory: true },
    { name: 'Downloads', path: '/Downloads', isDirectory: true },
    { name: 'Camera', path: '/Camera', isDirectory: true },
    { name: 'DCIM', path: '/DCIM', isDirectory: true },
  ]);

  const navigateToDirectory = (path: string) => {
    // Mock navigation - will be replaced with actual file system access
    setCurrentPath(path);
    setHistory([...history, path]);
    
    if (path === '/Movies') {
      setFiles([
        { name: 'Action', path: '/Movies/Action', isDirectory: true },
        { name: 'Comedy', path: '/Movies/Comedy', isDirectory: true },
        { name: 'Big Buck Bunny.mp4', path: '/Movies/Big Buck Bunny.mp4', isDirectory: false, size: 1024 * 1024 * 150 },
        { name: 'Sintel.mp4', path: '/Movies/Sintel.mp4', isDirectory: false, size: 1024 * 1024 * 120 },
      ]);
    } else if (path === '/Movies/Action') {
      setFiles([
        { name: 'Movie1.mp4', path: '/Movies/Action/Movie1.mp4', isDirectory: false, size: 1024 * 1024 * 200 },
        { name: 'Movie2.mkv', path: '/Movies/Action/Movie2.mkv', isDirectory: false, size: 1024 * 1024 * 250 },
        { name: 'Movie3.avi', path: '/Movies/Action/Movie3.avi', isDirectory: false, size: 1024 * 1024 * 180 },
      ]);
    } else if (path === '/Movies/Comedy') {
      setFiles([
        { name: 'Comedy1.mp4', path: '/Movies/Comedy/Comedy1.mp4', isDirectory: false, size: 1024 * 1024 * 140 },
        { name: 'Comedy2.mp4', path: '/Movies/Comedy/Comedy2.mp4', isDirectory: false, size: 1024 * 1024 * 160 },
      ]);
    } else if (path === '/Downloads') {
      setFiles([
        { name: 'Downloaded1.mp4', path: '/Downloads/Downloaded1.mp4', isDirectory: false, size: 1024 * 1024 * 300 },
        { name: 'Downloaded2.mkv', path: '/Downloads/Downloaded2.mkv', isDirectory: false, size: 1024 * 1024 * 280 },
      ]);
    } else if (path === '/Camera') {
      setFiles([
        { name: 'Video1.mp4', path: '/Camera/Video1.mp4', isDirectory: false, size: 1024 * 1024 * 50 },
        { name: 'Video2.mp4', path: '/Camera/Video2.mp4', isDirectory: false, size: 1024 * 1024 * 45 },
      ]);
    } else if (path === '/DCIM') {
      setFiles([
        { name: 'Recording1.mp4', path: '/DCIM/Recording1.mp4', isDirectory: false, size: 1024 * 1024 * 60 },
        { name: 'Recording2.mp4', path: '/DCIM/Recording2.mp4', isDirectory: false, size: 1024 * 1024 * 65 },
      ]);
    } else {
      setFiles([
        { name: 'Movies', path: '/Movies', isDirectory: true },
        { name: 'Downloads', path: '/Downloads', isDirectory: true },
        { name: 'Camera', path: '/Camera', isDirectory: true },
        { name: 'DCIM', path: '/DCIM', isDirectory: true },
      ]);
    }
  };

  const navigateBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const previousPath = newHistory[newHistory.length - 1];
      setCurrentPath(previousPath);
      setHistory(newHistory);
      navigateToDirectory(previousPath);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const handleFileClick = (file: FileItem) => {
    if (file.isDirectory) {
      navigateToDirectory(file.path);
    } else {
      onFileSelect(file.path);
    }
  };

  const getBreadcrumbs = () => {
    const pathParts = currentPath.split('/').filter(Boolean);
    
    return (
      <div className="flex items-center gap-1 overflow-x-auto pb-2 no-scrollbar">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigateToDirectory('/')}
          className="text-xs flex items-center gap-1"
        >
          <Home className="h-3 w-3" />
        </Button>
        
        {pathParts.map((part, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="h-3 w-3 opacity-50" />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigateToDirectory('/' + pathParts.slice(0, index + 1).join('/'))}
              className="text-xs"
            >
              {part}
            </Button>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Browse Files</h2>
          <Button variant="ghost" size="icon" onClick={navigateBack} disabled={history.length <= 1}>
            <ChevronRight className="h-4 w-4 rotate-180" />
          </Button>
        </div>
        {getBreadcrumbs()}
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {files.map((file, index) => (
            <div 
              key={index}
              className={cn(
                "folder-item",
                file.isDirectory ? "" : "pl-8"
              )}
              onClick={() => handleFileClick(file)}
            >
              <div className="mr-3">
                {file.isDirectory ? (
                  <Folder className="h-5 w-5 text-player-control" />
                ) : (
                  <File className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <div className="flex-1 truncate">
                <div className="text-sm font-medium">{file.name}</div>
                {!file.isDirectory && (
                  <div className="text-xs text-gray-400">{formatFileSize(file.size)}</div>
                )}
              </div>
              {file.isDirectory && (
                <ChevronRight className="h-4 w-4 opacity-50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileBrowser;

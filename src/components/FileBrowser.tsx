import React, { useState, useEffect } from 'react';
import { Folder, File, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Filesystem, Directory, FilesystemDirectory } from '@capacitor/filesystem';
import { useToast } from '@/components/ui/use-toast';

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

const FileBrowser: React.FC<FileSystemProps> = ({ onFileSelect }) => {
  const [currentPath, setCurrentPath] = useState<string>('/');
  const [history, setHistory] = useState<string[]>(['/']);
  const [files, setFiles] = useState<FileItem[]>([]);
  const { toast } = useToast();

  const listFiles = async (path: string) => {
    try {
      const result = await Filesystem.readdir({
        path: path === '/' ? '' : path,
        directory: Directory.ExternalStorage
      });

      const filesData: FileItem[] = result.files.map(file => ({
        name: file.name,
        path: file.uri || `${path}/${file.name}`,
        isDirectory: file.type === 'directory',
        size: file.size,
        lastModified: file.mtime ? new Date(file.mtime) : undefined
      }));

      // Filter for video files and directories
      const filteredFiles = filesData.filter(file => 
        file.isDirectory || 
        file.name.match(/\.(mp4|mkv|avi|mov|webm)$/i)
      );

      // Sort directories first, then files
      const sortedFiles = filteredFiles.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });

      setFiles(sortedFiles);
    } catch (error) {
      console.error('Error reading directory:', error);
      toast({
        title: "Error",
        description: "Could not access files. Please check storage permissions.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    listFiles(currentPath);
  }, [currentPath]);

  const navigateToDirectory = (path: string) => {
    setCurrentPath(path);
    setHistory([...history, path]);
  };

  const navigateBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const previousPath = newHistory[newHistory.length - 1];
      setCurrentPath(previousPath);
      setHistory(newHistory);
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
                "flex items-center p-2 hover:bg-white/5 rounded cursor-pointer",
                "transition-colors duration-200"
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

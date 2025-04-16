
import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX,
  Maximize, Minimize, Lock, Unlock, Settings, X, RotateCcw, 
  ArrowLeft, Subtitles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/components/ui/use-toast';

type VideoPlayerProps = {
  videoPath: string;
  onClose: () => void;
};

const VIDEO_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const SEEK_TIME = 10; // 10 seconds for seeking

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoPath, onClose }) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [locked, setLocked] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [brightness, setBrightness] = useState(0.8); // Mock brightness value
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [subtitleDelay, setSubtitleDelay] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<string>('contain');

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mock function for loading video - in a real app, this would use device APIs
  useEffect(() => {
    // Mock video loading
    if (videoRef.current) {
      // In a real app, we would set the src to the actual file path
      // For our prototype, we'll use a sample video from the web
      videoRef.current.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
      
      const video = videoRef.current;
      video.addEventListener('loadedmetadata', () => {
        setDuration(video.duration);
      });
      
      video.addEventListener('timeupdate', () => {
        setCurrentTime(video.currentTime);
      });
      
      video.addEventListener('ended', () => {
        setPlaying(false);
      });
    }
    
    // Show toast indicating which video would be loaded
    toast({
      title: "Loading video",
      description: `Path: ${videoPath}`,
      duration: 3000,
    });
  }, [videoPath, toast]);

  // Auto-hide controls after inactivity
  useEffect(() => {
    if (!locked) {
      resetControlsTimeout();
    }
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [locked]);

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    setShowControls(true);
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (!showSettings) {
        setShowControls(false);
      }
    }, 3000);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
    resetControlsTimeout();
  };

  const seek = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
      resetControlsTimeout();
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    resetControlsTimeout();
  };

  const handleBrightnessChange = (value: number[]) => {
    const newBrightness = value[0];
    setBrightness(newBrightness);
    // In a real app, we would change screen brightness
    // This is just a mock implementation
    toast({
      title: "Brightness adjusted",
      description: `${Math.round(newBrightness * 100)}%`,
      duration: 1000,
    });
    resetControlsTimeout();
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        toast({
          title: "Fullscreen error",
          description: `Error: ${err.message}`,
          variant: "destructive",
        });
      });
    } else {
      document.exitFullscreen();
    }
    resetControlsTimeout();
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleLock = () => {
    setLocked(!locked);
    if (locked) {
      setShowControls(true);
      resetControlsTimeout();
    } else {
      setShowControls(false);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || locked) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = pos * duration;
    }
    resetControlsTimeout();
  };

  const changePlaybackSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
    resetControlsTimeout();
  };

  const handleSubtitleDelayChange = (value: number[]) => {
    setSubtitleDelay(value[0]);
    // In a real app, we would adjust subtitle timing
    toast({
      title: "Subtitle delay adjusted",
      description: `${value[0] > 0 ? '+' : ''}${value[0].toFixed(1)}s`,
      duration: 1000,
    });
    resetControlsTimeout();
  };

  const changeAspectRatio = (ratio: string) => {
    setAspectRatio(ratio);
    toast({
      title: "Aspect Ratio",
      description: ratio.charAt(0).toUpperCase() + ratio.slice(1),
      duration: 1000,
    });
    resetControlsTimeout();
  };

  // Touch handlers for gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    if (locked) return;
    
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
    resetControlsTimeout();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (locked || !containerRef.current) return;
    
    const touch = e.touches[0];
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    
    // Only perform action if movement is significant
    if (Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) return;
    
    // Horizontal swipe (seek forward/backward)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      e.preventDefault();
      const seekSeconds = (deltaX / containerWidth) * 100;
      seek(seekSeconds > 0 ? SEEK_TIME : -SEEK_TIME);
      setTouchStartX(touch.clientX);
      
      toast({
        title: seekSeconds > 0 ? "Forward" : "Backward",
        description: `${SEEK_TIME} seconds`,
        duration: 1000,
      });
    } 
    // Vertical swipe on left side (brightness)
    else if (Math.abs(deltaY) > Math.abs(deltaX) && touch.clientX < containerWidth / 2) {
      e.preventDefault();
      const newBrightness = Math.max(0, Math.min(1, brightness - (deltaY / containerHeight)));
      setBrightness(newBrightness);
      setTouchStartY(touch.clientY);
      
      toast({
        title: "Brightness",
        description: `${Math.round(newBrightness * 100)}%`,
        duration: 1000,
      });
    }
    // Vertical swipe on right side (volume)
    else if (Math.abs(deltaY) > Math.abs(deltaX) && touch.clientX > containerWidth / 2) {
      e.preventDefault();
      const newVolume = Math.max(0, Math.min(1, volume - (deltaY / containerHeight)));
      setVolume(newVolume);
      if (videoRef.current) {
        videoRef.current.volume = newVolume;
      }
      setTouchStartY(touch.clientY);
      
      toast({
        title: "Volume",
        description: `${Math.round(newVolume * 100)}%`,
        duration: 1000,
      });
    }
  };

  const handleDoubleTap = () => {
    if (locked) return;
    togglePlay();
  };
  
  // Format time from seconds to MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-black"
      onClick={() => {
        if (!locked) {
          resetControlsTimeout();
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onDoubleClick={handleDoubleTap}
    >
      <video
        ref={videoRef}
        className={cn(
          "w-full h-full outline-none",
          {
            "object-contain": aspectRatio === "contain",
            "object-cover": aspectRatio === "cover",
            "object-fill": aspectRatio === "fill"
          }
        )}
        playsInline
      />
      
      {/* Lock screen button - always visible */}
      <div className="absolute top-4 right-4 z-30">
        <Button 
          variant="ghost" 
          size="icon" 
          className="video-control"
          onClick={toggleLock}
        >
          {locked ? <Unlock className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
        </Button>
      </div>
      
      {/* Back button - only visible in unlocked state */}
      {!locked && showControls && (
        <div className="absolute top-4 left-4 z-30">
          <Button 
            variant="ghost" 
            size="icon" 
            className="video-control"
            onClick={onClose}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      {/* Video controls overlay */}
      {showControls && !locked && (
        <>
          {/* Center play/pause button */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <Button 
              variant="ghost" 
              size="icon" 
              className="video-control w-16 h-16 pointer-events-auto"
              onClick={togglePlay}
            >
              {playing ? 
                <Pause className="h-8 w-8" /> : 
                <Play className="h-8 w-8" fill="currentColor" />
              }
            </Button>
          </div>
          
          {/* Bottom control bar */}
          <div className="control-bar bottom-0">
            {/* Progress bar */}
            <div 
              ref={progressBarRef}
              className="seekbar mb-4"
              onClick={handleProgressBarClick}
            >
              <div 
                className="seekbar-progress"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                <div className="seekbar-thumb"></div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              {/* Time */}
              <div className="text-xs">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              
              {/* Control buttons */}
              <div className="flex items-center space-x-2">
                {/* Volume control */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="video-control relative">
                      {volume === 0 ? (
                        <VolumeX className="h-5 w-5" />
                      ) : volume < 0.5 ? (
                        <Volume1 className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="top" className="w-64 p-4 bg-player-background border-white/10">
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Volume</h4>
                      <Slider
                        defaultValue={[volume]}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                
                {/* Rewind */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="video-control"
                  onClick={() => seek(-SEEK_TIME)}
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                
                {/* Play/Pause */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="video-control"
                  onClick={togglePlay}
                >
                  {playing ? 
                    <Pause className="h-5 w-5" /> : 
                    <Play className="h-5 w-5" fill="currentColor" />
                  }
                </Button>
                
                {/* Forward */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="video-control"
                  onClick={() => seek(SEEK_TIME)}
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
                
                {/* Subtitles */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={cn(
                        "video-control", 
                        showSubtitles ? "text-player-control" : "text-white/70"
                      )}
                    >
                      <Subtitles className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="top" className="w-64 p-4 bg-player-background border-white/10">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Subtitles</h4>
                        <Button 
                          variant={showSubtitles ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setShowSubtitles(!showSubtitles)}
                          className={showSubtitles ? "bg-player-control hover:bg-player-controlHover" : ""}
                        >
                          {showSubtitles ? "On" : "Off"}
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-xs flex justify-between">
                          <span>Delay</span>
                          <span>{subtitleDelay > 0 ? '+' : ''}{subtitleDelay.toFixed(1)}s</span>
                        </div>
                        <Slider
                          defaultValue={[subtitleDelay]}
                          min={-5}
                          max={5}
                          step={0.1}
                          onValueChange={handleSubtitleDelayChange}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                {/* Settings */}
                <Popover open={showSettings} onOpenChange={setShowSettings}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="video-control"
                      onClick={() => setShowSettings(!showSettings)}
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent side="top" align="end" className="w-64 p-4 bg-player-background border-white/10">
                    <div className="space-y-4">
                      <h4 className="font-medium mb-2">Settings</h4>
                      
                      {/* Playback Speed */}
                      <div className="space-y-2">
                        <h5 className="text-xs text-gray-400">Playback Speed</h5>
                        <div className="flex flex-wrap gap-2">
                          {VIDEO_SPEEDS.map((speed) => (
                            <Button 
                              key={speed} 
                              variant={playbackSpeed === speed ? "default" : "outline"} 
                              size="sm"
                              onClick={() => changePlaybackSpeed(speed)}
                              className={cn(
                                "text-xs flex-1",
                                playbackSpeed === speed ? "bg-player-control hover:bg-player-controlHover" : ""
                              )}
                            >
                              {speed}x
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Aspect Ratio */}
                      <div className="space-y-2">
                        <h5 className="text-xs text-gray-400">Aspect Ratio</h5>
                        <div className="flex flex-wrap gap-2">
                          {['contain', 'cover', 'fill'].map((ratio) => (
                            <Button 
                              key={ratio} 
                              variant={aspectRatio === ratio ? "default" : "outline"} 
                              size="sm"
                              onClick={() => changeAspectRatio(ratio)}
                              className={cn(
                                "text-xs flex-1",
                                aspectRatio === ratio ? "bg-player-control hover:bg-player-controlHover" : ""
                              )}
                            >
                              {ratio.charAt(0).toUpperCase() + ratio.slice(1)}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Brightness */}
                      <div className="space-y-2">
                        <div className="text-xs flex justify-between">
                          <span>Brightness</span>
                          <span>{Math.round(brightness * 100)}%</span>
                        </div>
                        <Slider
                          defaultValue={[brightness]}
                          max={1}
                          step={0.01}
                          onValueChange={handleBrightnessChange}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                {/* Fullscreen */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="video-control"
                  onClick={toggleFullscreen}
                >
                  {fullscreen ? 
                    <Minimize className="h-5 w-5" /> : 
                    <Maximize className="h-5 w-5" />
                  }
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Lock mode overlay */}
      {locked && (
        <div 
          className="absolute inset-0 z-40 flex items-center justify-center"
          onClick={() => setShowControls(prev => !prev)}
        >
          {showControls && (
            <div 
              className="video-control p-6 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                toggleLock();
              }}
            >
              <Unlock className="h-10 w-10" />
            </div>
          )}
        </div>
      )}
      
      {/* Subtitle area */}
      {showSubtitles && (
        <div className="absolute bottom-20 left-0 right-0 text-center z-20">
          <div className="inline-block px-4 py-1 bg-black/70 text-white rounded-md">
            {/* Mockup subtitle text - this would be populated from the actual subtitle file */}
            {currentTime > 5 && currentTime < 15 ? 
              "Sample subtitle text would appear here." : 
              currentTime > 20 && currentTime < 30 ? 
              "Another line of subtitle text." : ""}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;

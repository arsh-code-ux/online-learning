import React, { useState, useRef, useEffect } from 'react';
import { 
  FaPlay, 
  FaExpand, 
  FaPause, 
  FaVolumeMute, 
  FaVolumeUp,
  FaExternalLinkAlt,
  FaCompress,
  FaCog,
  FaDownload
} from 'react-icons/fa';

const EnhancedVideoPlayer = ({ videoUrl, title, onVideoComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(100);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const getVideoId = (url) => {
    if (!url) return null;
    
    // Handle different YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getVideoId(videoUrl);

  useEffect(() => {
    // Handle fullscreen change events
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const openYouTube = () => {
    if (videoId) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
      window.open(youtubeUrl, '_blank');
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    
    // Clear existing timeout
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    // Hide controls after 3 seconds of inactivity
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleMouseMove = () => {
    showControlsTemporarily();
  };

  const handleIframeLoad = () => {
    setLoading(false);
  };

  if (!videoId) {
    return (
      <div className="video-placeholder bg-gray-100 rounded-lg p-8 text-center">
        <FaPlay className="text-4xl text-gray-400 mb-4 mx-auto" />
        <p className="text-gray-600">Video not available</p>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1&controls=1&autoplay=0&mute=${isMuted ? 1 : 0}`;

  return (
    <div 
      ref={containerRef}
      className={`enhanced-video-player ${isFullscreen ? 'fullscreen' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <style jsx>{`
        .enhanced-video-player {
          position: relative;
          width: 100%;
          background: #000;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }
        
        .enhanced-video-player.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 9999;
          border-radius: 0;
        }
        
        .video-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          height: 0;
        }
        
        .enhanced-video-player.fullscreen .video-container {
          padding-bottom: 0;
          height: 100vh;
        }
        
        .video-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        
        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.3) 0%,
            transparent 20%,
            transparent 80%,
            rgba(0, 0, 0, 0.7) 100%
          );
          pointer-events: none;
          opacity: ${showControls ? 1 : 0};
          transition: opacity 0.3s ease;
        }
        
        .video-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 20px;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          transform: translateY(${showControls ? '0' : '100%'});
          transition: transform 0.3s ease;
          pointer-events: auto;
        }
        
        .controls-row {
          display: flex;
          align-items: center;
          gap: 15px;
          color: white;
        }
        
        .control-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 12px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          backdrop-filter: blur(10px);
        }
        
        .control-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }
        
        .control-button.primary {
          background: #3b82f6;
          padding: 15px;
          font-size: 18px;
        }
        
        .control-button.primary:hover {
          background: #2563eb;
        }
        
        .volume-control {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .volume-slider {
          width: 80px;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          outline: none;
          cursor: pointer;
        }
        
        .video-title {
          position: absolute;
          top: 20px;
          left: 20px;
          color: white;
          font-size: 18px;
          font-weight: 600;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
          transform: translateY(${showControls ? '0' : '-100%'});
          transition: transform 0.3s ease;
        }
        
        .video-actions {
          position: absolute;
          top: 20px;
          right: 20px;
          display: flex;
          gap: 10px;
          transform: translateY(${showControls ? '0' : '-100%'});
          transition: transform 0.3s ease;
        }
        
        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          z-index: 10;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-left: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 15px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .flex-1 {
          flex: 1;
        }
      `}</style>
      
      <div className="video-container">
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            Loading video...
          </div>
        )}
        
        <iframe
          ref={playerRef}
          className="video-iframe"
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          onLoad={handleIframeLoad}
        />
        
        <div className="video-overlay">
          <div className="video-title">{title}</div>
          
          <div className="video-actions">
            <button 
              className="control-button" 
              onClick={openYouTube}
              title="Open in YouTube"
            >
              <FaExternalLinkAlt />
            </button>
          </div>
          
          <div className="video-controls">
            <div className="controls-row">
              <button 
                className="control-button primary"
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              
              <div className="volume-control">
                <button 
                  className="control-button"
                  onClick={toggleMute}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
                
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                  title="Volume"
                />
              </div>
              
              <div className="flex-1"></div>
              
              <button 
                className="control-button"
                onClick={() => {}}
                title="Settings"
              >
                <FaCog />
              </button>
              
              <button 
                className="control-button"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedVideoPlayer;
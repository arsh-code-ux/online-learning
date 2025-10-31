import React, { useState } from 'react';
import { FaExternalLinkAlt, FaExpand } from 'react-icons/fa';

const SimpleVideoPlayer = ({ videoUrl, title, onVideoComplete }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Extract YouTube video ID from different URL formats
  const getVideoId = (url) => {
    if (!url) return null;
    
    try {
      // Handle embed URLs
      if (url.includes('/embed/')) {
        const embedMatch = url.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
        return embedMatch ? embedMatch[1] : null;
      }
      
      // Handle watch URLs
      if (url.includes('watch?v=')) {
        const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
        return watchMatch ? watchMatch[1] : null;
      }
      
      // Handle youtu.be URLs
      if (url.includes('youtu.be/')) {
        const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
        return shortMatch ? shortMatch[1] : null;
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing video URL:', error);
      return null;
    }
  };

  const videoId = getVideoId(videoUrl);
  
  const openYouTube = () => {
    if (videoId) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
      window.open(youtubeUrl, '_blank');
    }
  };

  const toggleFullscreen = () => {
    const iframe = document.getElementById(`video-${videoId}`);
    if (iframe) {
      if (!document.fullscreenElement) {
        iframe.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  if (!videoId) {
    return (
      <div className="video-error">
        <div style={{
          background: '#f3f4f6',
          border: '2px dashed #d1d5db',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          color: '#6b7280'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎥</div>
          <h3>Video Unavailable</h3>
          <p>Unable to load video. Please check the video URL.</p>
          {videoUrl && (
            <p style={{ fontSize: '12px', marginTop: '8px' }}>
              URL: {videoUrl}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Create clean embed URL with proper parameters
  const embedUrl = `https://www.youtube.com/embed/${videoId}?` + 
    'autoplay=0' +
    '&controls=1' +
    '&modestbranding=1' +
    '&rel=0' +
    '&showinfo=0' +
    '&fs=1' +
    '&cc_load_policy=0' +
    '&iv_load_policy=3';

  return (
    <div className="simple-video-player">
      <style jsx>{`
        .simple-video-player {
          position: relative;
          width: 100%;
          background: #000;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }
        
        .video-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          height: 0;
        }
        
        .video-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        
        .video-controls-overlay {
          position: absolute;
          top: 0;
          right: 0;
          padding: 12px;
          background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%);
          border-bottom-left-radius: 12px;
        }
        
        .control-button {
          background: rgba(255, 255, 255, 0.9);
          border: none;
          color: #1f2937;
          padding: 8px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-left: 8px;
          font-size: 14px;
        }
        
        .control-button:hover {
          background: rgba(255, 255, 255, 1);
          transform: scale(1.05);
        }
        
        .video-title {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
          color: white;
          padding: 20px 16px 16px;
          font-size: 16px;
          font-weight: 600;
        }
        
        @media (max-width: 640px) {
          .control-button {
            padding: 6px;
            font-size: 12px;
          }
          
          .video-title {
            font-size: 14px;
            padding: 16px 12px 12px;
          }
        }
      `}</style>
      
      <div className="video-container">
        <iframe
          id={`video-${videoId}`}
          className="video-iframe"
          src={embedUrl}
          title={title || 'Educational Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
        
        <div className="video-controls-overlay">
          <button 
            className="control-button" 
            onClick={openYouTube}
            title="Open in YouTube"
          >
            <FaExternalLinkAlt />
          </button>
          
          <button 
            className="control-button"
            onClick={toggleFullscreen}
            title="Fullscreen"
          >
            <FaExpand />
          </button>
        </div>
        
        {title && (
          <div className="video-title">
            {title}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleVideoPlayer;
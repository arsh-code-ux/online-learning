import React, { useState } from 'react';
import { FaPlay, FaExpand, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

const VideoPlayer = ({ videoUrl, title, onVideoComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Convert YouTube watch URLs to embed URLs
  const getEmbedUrl = (url) => {
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`;
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url; // Return as-is if already an embed URL
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="video-player-container">
      <style jsx>{`
        .video-player-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          height: 0;
          background: #000;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .video-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 12px;
        }
        
        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        
        .video-player-container:hover .video-overlay {
          opacity: 1;
        }
        
        .play-button {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #333;
          font-size: 24px;
          cursor: pointer;
          transition: all 0.3s ease;
          pointer-events: all;
        }
        
        .play-button:hover {
          background: white;
          transform: scale(1.1);
        }
        
        .video-title {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          color: white;
          padding: 20px;
          font-size: 16px;
          font-weight: 600;
        }
      `}</style>
      
      <iframe
        className="video-iframe"
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
      
      <div className="video-overlay">
        <div className="play-button">
          <FaPlay />
        </div>
      </div>
      
      <div className="video-title">
        {title}
      </div>
    </div>
  );
};

export default VideoPlayer;
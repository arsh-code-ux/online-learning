import React from 'react';
import SimpleVideoPlayer from '../components/SimpleVideoPlayer';

const VideoTest = () => {
  const testVideos = [
    {
      id: 1,
      title: "Communication Skills Test",
      url: "https://www.youtube.com/watch?v=HAnw168huqA"
    },
    {
      id: 2,
      title: "Types of Communication Test",
      url: "https://www.youtube.com/watch?v=R1vskiVDwl4"
    },
    {
      id: 3,
      title: "Embed Format Test",
      url: "https://www.youtube.com/embed/HAnw168huqA"
    },
    {
      id: 4,
      title: "Short URL Test",
      url: "https://youtu.be/HAnw168huqA"
    }
  ];

  return (
    <div style={{ 
      padding: '40px 20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      background: '#f8fafc',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '40px', 
        color: '#1e293b',
        fontSize: '32px',
        fontWeight: 'bold'
      }}>
        🎥 Video Player Test Page
      </h1>
      
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <p style={{ color: '#64748b', fontSize: '16px' }}>
          Testing different YouTube URL formats with our SimpleVideoPlayer component
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gap: '40px',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
      }}>
        {testVideos.map((video) => (
          <div key={video.id} style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ 
              marginBottom: '16px', 
              color: '#1e293b',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              {video.title}
            </h3>
            
            <p style={{ 
              marginBottom: '16px', 
              color: '#64748b',
              fontSize: '14px',
              fontFamily: 'monospace',
              background: '#f1f5f9',
              padding: '8px 12px',
              borderRadius: '6px'
            }}>
              URL: {video.url}
            </p>
            
            <SimpleVideoPlayer 
              videoUrl={video.url}
              title={video.title}
              onVideoComplete={() => console.log(`Video ${video.id} completed`)}
            />
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '40px',
        padding: '24px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ color: '#1e293b', marginBottom: '16px' }}>
          🔧 Troubleshooting Guide
        </h3>
        <ul style={{ color: '#64748b', lineHeight: '1.6' }}>
          <li>• If videos don't load, check your internet connection</li>
          <li>• Some videos may be region-restricted</li>
          <li>• Click "Open in YouTube" button to test external links</li>
          <li>• Try the fullscreen button to test iframe interactions</li>
          <li>• Check browser console for any error messages</li>
        </ul>
      </div>
    </div>
  );
};

export default VideoTest;
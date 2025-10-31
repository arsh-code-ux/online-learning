import React, { useState } from 'react';
import { 
  FaPlay, 
  FaLock, 
  FaCheck, 
  FaClock, 
  FaChevronDown, 
  FaBook,
  FaVideo
} from 'react-icons/fa';
import SimpleVideoPlayer from './SimpleVideoPlayer';
import Quiz from './Quiz';

const CurriculumSection = ({ curriculum, isEnrolled = false }) => {
  const [expandedModule, setExpandedModule] = useState(null);
  const [completedModules, setCompletedModules] = useState(new Set());
  const [isPaidUser, setIsPaidUser] = useState(false); // Track if user has paid for premium content
  const [quizTaken, setQuizTaken] = useState(false);

  // Check if user has paid for premium access
  React.useEffect(() => {
    if (curriculum && curriculum.isPremium) {
      const premiumCourses = JSON.parse(localStorage.getItem('premiumCourses') || '[]');
      setIsPaidUser(premiumCourses.includes(curriculum.courseId));
    } else {
      setIsPaidUser(true); // Free courses are always accessible
    }
  }, [curriculum]);

  const toggleModule = (moduleId) => {
    if (!isEnrolled) {
      return; // Don't allow expansion if not enrolled
    }
    
    // For premium courses, check if user has paid (except for preview module)
    if (curriculum && curriculum.isPremium && !isPaidUser) {
      const moduleIndex = curriculum.modules.findIndex(m => m.id === moduleId);
      const isPreviewModule = moduleIndex === 0; // Only first module is preview
      
      if (!isPreviewModule) {
        // Show payment required message for locked modules
        alert('🔒 This module is locked. Please complete payment to access all course content!');
        return;
      }
    }
    
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  const markModuleComplete = (moduleId) => {
    const newCompleted = new Set(completedModules);
    if (completedModules.has(moduleId)) {
      newCompleted.delete(moduleId);
    } else {
      newCompleted.add(moduleId);
    }
    setCompletedModules(newCompleted);
  };

  // Check if quiz already taken for this course
  React.useEffect(() => {
    if (curriculum && curriculum.courseId) {
      const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
      const existing = progress[curriculum.courseId]?.quiz;
      setQuizTaken(!!existing && existing.passed);
    }
  }, [curriculum]);

  if (!curriculum || !curriculum.modules) {
    return (
      <div className="curriculum-section">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
        <div className="text-center py-8">
          <p className="text-gray-600">Curriculum not available for this course.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="curriculum-section">
      <style jsx>{`
        .curriculum-section {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          margin: 32px 0;
        }
        
        .curriculum-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #f1f5f9;
        }
        
        .curriculum-stats {
          display: flex;
          gap: 24px;
          font-size: 14px;
          color: #64748b;
        }
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .module-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .module-item {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
          transition: all 0.3s ease;
          background: white;
        }
        
        .module-item:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }
        
        .module-header {
          display: flex;
          align-items: center;
          padding: 20px;
          cursor: pointer;
          background: #f8fafc;
          transition: background 0.3s ease;
        }
        
        .module-header:hover {
          background: #f1f5f9;
        }
        
        .module-header.locked {
          cursor: not-allowed;
          opacity: 0.6;
        }
        
        .module-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
          font-size: 18px;
        }
        
        .module-icon.completed {
          background: #10b981;
          color: white;
        }
        
        .module-icon.available {
          background: #3b82f6;
          color: white;
        }
        
        .module-icon.locked {
          background: #94a3b8;
          color: white;
        }
        
        .module-info {
          flex: 1;
        }
        
        .module-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }
        
        .module-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 14px;
          color: #64748b;
        }
        
        .expand-icon {
          margin-left: 16px;
          color: #64748b;
          transition: transform 0.3s ease;
        }
        
        .expand-icon.expanded {
          transform: rotate(180deg);
        }
        
        .module-content {
          padding: 0;
          max-height: 0;
          overflow: hidden;
          transition: all 0.5s ease;
        }
        
        .module-content.expanded {
          max-height: 2000px;
          padding: 24px;
        }
        
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: start;
        }
        
        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          
          .curriculum-stats {
            flex-direction: column;
            gap: 8px;
          }
        }
        
        .written-content {
          background: #f8fafc;
          border-radius: 12px;
          padding: 24px;
          border-left: 4px solid #3b82f6;
        }
        
        .written-content h3 {
          color: #1e293b;
          margin-bottom: 16px;
          font-size: 20px;
          font-weight: 600;
        }
        
        .written-content h4 {
          color: #334155;
          margin: 20px 0 12px 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .written-content ul, .written-content ol {
          margin: 12px 0;
          padding-left: 24px;
        }
        
        .written-content li {
          margin: 8px 0;
          color: #475569;
          line-height: 1.6;
        }
        
        .written-content p {
          color: #475569;
          line-height: 1.6;
          margin: 12px 0;
        }
        
        .written-content table {
          margin: 20px 0;
          border-collapse: collapse;
          width: 100%;
        }
        
        .written-content th, .written-content td {
          border: 1px solid #e2e8f0;
          padding: 12px;
          text-align: left;
        }
        
        .written-content th {
          background-color: #f1f5f9;
          font-weight: 600;
        }
        
        .complete-button {
          margin-top: 24px;
          padding: 12px 24px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .complete-button:hover {
          background: #059669;
          transform: translateY(-2px);
        }
        
        .complete-button.completed {
          background: #6b7280;
        }
        
        .enrollment-notice {
          text-align: center;
          padding: 32px;
          background: #fef3c7;
          border-radius: 12px;
          margin: 16px 0;
        }
        
        .enrollment-notice h3 {
          color: #92400e;
          margin-bottom: 8px;
        }
        
        .enrollment-notice p {
          color: #a16207;
        }
        
        .premium-notice {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 32px;
          border-radius: 16px;
          margin: 20px 0;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        
        .premium-notice::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(255, 255, 255, 0.05) 10px,
            rgba(255, 255, 255, 0.05) 20px
          );
          animation: shimmer 3s linear infinite;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%); }
          100% { transform: translateX(100%) translateY(100%); }
        }
        
        .premium-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255, 215, 0, 0.9);
          color: #1a1a1a;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          backdrop-filter: blur(10px);
        }
        
        .premium-notice h3 {
          font-size: 24px;
          margin: 16px 0;
          z-index: 1;
          position: relative;
        }
        
        .premium-notice p {
          font-size: 16px;
          margin-bottom: 20px;
          opacity: 0.9;
          z-index: 1;
          position: relative;
        }
        
        .premium-price {
          margin: 20px 0;
          z-index: 1;
          position: relative;
        }
        
        .price {
          font-size: 32px;
          font-weight: bold;
          color: #ffd700;
          display: block;
        }
        
        .price-note {
          font-size: 14px;
          opacity: 0.8;
          margin-top: 8px;
          display: block;
        }
        
        .premium-preview {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
          z-index: 1;
          position: relative;
        }
        
        .premium-preview h4 {
          color: #ffd700;
          font-size: 18px;
          margin-bottom: 12px;
        }
        
        .premium-preview ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .premium-preview li {
          padding: 8px 0;
          font-size: 16px;
          opacity: 0.9;
        }
        
        .preview-module {
          border: 2px solid #ffd700 !important;
          position: relative;
        }
        
        .preview-module::after {
          content: "🔍 FREE PREVIEW";
          position: absolute;
          top: 10px;
          right: 10px;
          background: #ffd700;
          color: #1a1a1a;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }
        
        .premium-unlock-btn {
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          color: #1a1a1a;
          border: none;
          padding: 16px 32px;
          border-radius: 50px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 1;
          position: relative;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }
        
        .premium-unlock-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
          background: linear-gradient(45deg, #ffed4e, #ffd700);
        }
        
        .module-item.premium {
          border: 2px solid transparent;
          background: linear-gradient(white, white) padding-box,
                      linear-gradient(45deg, #667eea, #764ba2) border-box;
          position: relative;
        }
        
        .module-item.premium::before {
          content: '💎';
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 20px;
          z-index: 1;
        }
      `}</style>
      
      <div className="curriculum-header">
        <h2 className="text-3xl font-bold text-gray-900">Course Curriculum</h2>
        <div className="curriculum-stats">
          <div className="stat-item">
            <FaVideo />
            <span>{curriculum.modules.length} Modules</span>
          </div>
          <div className="stat-item">
            <FaClock />
            <span>{curriculum.totalDuration}</span>
          </div>
          <div className="stat-item">
            <FaCheck />
            <span>{completedModules.size}/{curriculum.modules.length} Completed</span>
          </div>
        </div>
      </div>

      {!isEnrolled && (
        <div className="enrollment-notice">
          <h3>🔒 Enroll to Access Full Curriculum</h3>
          <p>Please enroll in this course to access video content and detailed learning materials.</p>
        </div>
      )}

      {curriculum.isPremium && !isPaidUser && (
        <div className="premium-notice">
          <div className="premium-badge">
            <span>💎 PREMIUM COURSE</span>
          </div>
          <h3>🚀 Premium Course Preview</h3>
          <p>Get a glimpse of what this premium course offers. Complete payment to unlock all {curriculum.modules.length} modules and start your learning journey!</p>
          
          <div className="premium-preview">
            <h4>📚 What You'll Get:</h4>
            <ul>
              <li>✅ {curriculum.modules.length} comprehensive video modules</li>
              <li>✅ {curriculum.totalDuration} of premium content</li>
              <li>✅ Hands-on projects and assignments</li>
              <li>✅ Certificate of completion</li>
              <li>✅ Lifetime access to updates</li>
            </ul>
          </div>

          <div className="premium-price">
            <span className="price">₹{(curriculum.price / 100).toFixed(2)}</span>
            <span className="price-note">One-time payment • Lifetime access</span>
          </div>
          <button 
            className="premium-unlock-btn"
            onClick={() => {
              // Navigate to payment page
              window.location.href = `/payment?course=${curriculum.courseId}&price=${curriculum.price}`;
            }}
          >
            🔓 Unlock Full Course
          </button>
        </div>
      )}

      <div className="module-list">
        {curriculum.modules.map((module, index) => {
          const isCompleted = completedModules.has(module.id);
          const isExpanded = expandedModule === module.id;
          
          // Preview logic for premium courses
          const isPreviewModule = curriculum.isPremium && index === 0; // Only first module as preview
          const isLocked = curriculum.isPremium ? 
            (!isPaidUser && !isPreviewModule) : // Premium: locked except for preview module if not paid
            !isEnrolled; // Free: locked only if not enrolled
          
          const isPremiumLocked = curriculum.isPremium && !isPaidUser && !isPreviewModule;

          return (
            <div key={module.id} className={`module-item ${curriculum.isPremium ? 'premium' : ''} ${isPreviewModule ? 'preview-module' : ''}`}>
              <div 
                className={`module-header ${isLocked ? 'locked' : ''}`}
                onClick={() => toggleModule(module.id)}
              >
                <div className={`module-icon ${isCompleted ? 'completed' : isLocked ? 'locked' : 'available'}`}>
                  {isCompleted ? <FaCheck /> : isLocked ? <FaLock /> : <FaPlay />}
                </div>
                
                <div className="module-info">
                  <h3 className="module-title">
                    {index + 1}. {module.moduleTitle}
                  </h3>
                  <div className="module-meta">
                    <span className="stat-item">
                      <FaClock />
                      {module.duration}
                    </span>
                    <span className="stat-item">
                      <FaVideo />
                      Video + Notes
                    </span>
                    {isCompleted && (
                      <span className="stat-item" style={{ color: '#10b981' }}>
                        <FaCheck />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
                
                {isEnrolled && (
                  <div className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                    <FaChevronDown />
                  </div>
                )}
              </div>
              
              {isEnrolled && !isPremiumLocked && (
                <div className={`module-content ${isExpanded ? 'expanded' : ''}`}>
                  <div className="content-grid">
                    <div>
                      <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaVideo style={{ color: '#3b82f6' }} />
                        Video Lesson
                      </h4>
                      <SimpleVideoPlayer 
                        videoUrl={module.videoUrl}
                        title={module.moduleTitle}
                        onVideoComplete={() => markModuleComplete(module.id)}
                      />
                      
                      {/* Video Summary */}
                      {module.videoSummary && (
                        <div 
                          className="video-summary-container"
                          dangerouslySetInnerHTML={{ __html: module.videoSummary }}
                          style={{ marginTop: '16px' }}
                        />
                      )}
                    </div>
                    
                    <div>
                      <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaBook style={{ color: '#10b981' }} />
                        Learning Notes
                      </h4>
                      <div 
                        className="written-content"
                        dangerouslySetInnerHTML={{ __html: module.content }}
                      />
                      <button 
                        className={`complete-button ${isCompleted ? 'completed' : ''}`}
                        onClick={() => markModuleComplete(module.id)}
                      >
                        {isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {isEnrolled && isPremiumLocked && isExpanded && (
                <div className="premium-module-lock">
                  <div style={{ padding: '32px', textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '12px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
                    <h3 style={{ marginBottom: '12px' }}>Premium Content Locked</h3>
                    <p style={{ marginBottom: '20px', opacity: '0.9' }}>
                      This module contains premium content. Unlock it to access high-quality videos and advanced materials.
                    </p>
                    <button 
                      style={{
                        background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                        color: '#1a1a1a',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '25px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        window.location.href = `/payment?course=${curriculum.courseId}&price=${curriculum.price}`;
                      }}
                    >
                      Unlock Now - ₹{(curriculum.price / 100).toFixed(2)}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {curriculum.isPremium && !isPaidUser && (
        <div className="locked-modules-preview" style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          padding: '24px', 
          borderRadius: '16px', 
          margin: '24px 0',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>🔒 {curriculum.modules.length - 1} More Modules Locked</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            {curriculum.modules.slice(1, Math.min(4, curriculum.modules.length)).map((module, index) => (
              <div key={module.id} style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                padding: '12px', 
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h4 style={{ fontSize: '14px', margin: '0 0 4px 0' }}>{index + 2}. {module.moduleTitle}</h4>
                <p style={{ fontSize: '12px', opacity: '0.8', margin: '0' }}>🕒 {module.duration}</p>
              </div>
            ))}
            {curriculum.modules.length > 4 && (
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                padding: '12px', 
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <p style={{ fontSize: '16px', margin: '0', fontWeight: 'bold' }}>
                  +{curriculum.modules.length - 4} More...
                </p>
              </div>
            )}
          </div>
          <p style={{ opacity: '0.9', fontSize: '16px', marginBottom: '16px' }}>
            💎 Unlock all modules, projects, and get your completion certificate!
          </p>
          <button 
            onClick={() => {
              window.location.href = `/payment?course=${curriculum.courseId}&price=${curriculum.price}`;
            }}
            style={{
              background: '#ffd700',
              color: '#1a1a1a',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🚀 Unlock Full Course - ₹{(curriculum.price / 100).toFixed(2)}
          </button>
        </div>
      )}
      
      {isEnrolled && (
        <div style={{ textAlign: 'center', marginTop: '32px', padding: '24px', background: '#f0f9ff', borderRadius: '12px' }}>
          <h3 style={{ color: '#1e40af', marginBottom: '8px' }}>🎓 Course Progress</h3>
          <p style={{ color: '#1d4ed8' }}>
            You've completed {completedModules.size} out of {curriculum.modules.length} modules. 
            {completedModules.size === curriculum.modules.length ? ' Congratulations! 🎉' : ' Keep going!'}
          </p>
          <div style={{ background: '#e0f2fe', height: '8px', borderRadius: '4px', margin: '16px 0' }}>
            <div 
              style={{ 
                background: '#0ea5e9', 
                height: '100%', 
                borderRadius: '4px',
                  // Include quiz completion as final 100% step
                  width: `${( (completedModules.size / curriculum.modules.length) * 90 ) + (quizTaken ? 10 : 0)}%`,
                transition: 'width 0.5s ease'
              }}
            />
          </div>
        </div>
      )}
    
      {/* Show quiz when modules completed and quiz not yet passed */}
      {isEnrolled && completedModules.size === curriculum.modules.length && !quizTaken && (
        <div style={{ marginTop: '20px' }}>
          <Quiz
            courseId={curriculum.courseId}
            onComplete={({ percent, passed }) => {
              setQuizTaken(passed);
              // store final course completion state
              const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
              progress[curriculum.courseId] = progress[curriculum.courseId] || {};
              progress[curriculum.courseId].modulesCompleted = completedModules.size;
              progress[curriculum.courseId].quiz = { percent, passed };
              localStorage.setItem('courseProgress', JSON.stringify(progress));
            }}
          />
        </div>
      )}
    </div>
  );
};

export default CurriculumSection;
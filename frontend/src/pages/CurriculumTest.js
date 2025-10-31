import React from 'react';
import { getCurriculumByCourseId } from '../data/courseCurriculum';
import CurriculumSection from '../components/CurriculumSection';

const CurriculumTest = () => {
  // Test loading curriculum for different IDs
  const testIds = ['10', 'communication-skills', '1', 'soft-skills'];
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Curriculum Test Page</h1>
        
        {testIds.map(id => {
          const curriculum = getCurriculumByCourseId(id);
          console.log(`Testing ID "${id}":`, curriculum);
          
          return (
            <div key={id} className="mb-12 p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Test ID: "{id}"</h2>
              
              {curriculum ? (
                <div>
                  <p className="text-green-600 mb-4">✅ Curriculum found!</p>
                  <p><strong>Title:</strong> {curriculum.courseTitle}</p>
                  <p><strong>Modules:</strong> {curriculum.modules?.length || 0}</p>
                  <p><strong>Duration:</strong> {curriculum.totalDuration}</p>
                  
                  <div className="mt-4">
                    <CurriculumSection curriculum={curriculum} isEnrolled={true} />
                  </div>
                </div>
              ) : (
                <p className="text-red-600">❌ No curriculum found</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CurriculumTest;
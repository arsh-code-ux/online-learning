import React, { useState, useEffect, useContext } from 'react';
import { 
  FaCertificate, 
  FaDownload, 
  FaShare,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaEye,
  FaCalendar,
  FaStar,
  FaSearch,
  FaFilter,
  FaTrophy,
  FaPrint,
  FaCheck
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { CourseContext } from '../context/CourseContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CertificatesPage = () => {
  const { user } = useContext(AuthContext);
  const { getUserCertificates } = useContext(CourseContext);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'soft-skills', name: 'Soft Skills' },
    { id: 'technical-skills', name: 'Technical Skills' },
    { id: 'analytical-skills', name: 'Analytical Skills' }
  ];

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    filterCertificates();
  }, [certificates, searchTerm, selectedCategory]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      // Only show certificates earned by the user (stored in localStorage after passing quiz)
      const local = JSON.parse(localStorage.getItem('certificates') || '[]');
      
      // Transform local certificates to display format
      const earnedCertificates = local.map(lc => ({
        _id: lc._id,
        courseId: lc.courseId,
        courseTitle: lc.courseTitle || lc.courseId,
        category: lc.category || 'technical-skills',
        instructor: lc.instructor || 'Expert Instructor',
        completedAt: new Date(lc.completedAt),
        score: lc.score || lc.percent || 0,
        certificateNumber: lc.certificateNumber,
        isVerified: lc.isVerified !== false,
        skills: lc.skills || []
      }));

      setCertificates(earnedCertificates);
    } catch (error) {
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const filterCertificates = () => {
    let filtered = [...certificates];

    if (searchTerm) {
      filtered = filtered.filter(cert =>
        cert.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(cert => cert.category === selectedCategory);
    }

    setFilteredCertificates(filtered);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'soft-skills':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'technical-skills':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'analytical-skills':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleDownloadCertificate = (certificate) => {
    // Simulate PDF download
    toast.success('Certificate downloaded successfully!');
  };

  const handleShareCertificate = (certificate, platform) => {
    const shareUrl = `${window.location.origin}/certificate/verify/${certificate.certificateNumber}`;
    const shareText = `I just earned a certificate in "${certificate.courseTitle}" from LearnHub! 🎓`;

    const shareUrls = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    } else {
      // Copy to clipboard for other sharing
      navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      toast.success('Certificate link copied to clipboard!');
    }
  };

  const CertificateModal = ({ certificate, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Certificate Preview */}
        <div className="p-8">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-8 border-yellow-400 rounded-lg p-12 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 text-yellow-300 opacity-20">
              <FaTrophy className="text-4xl" />
            </div>
            <div className="absolute top-4 right-4 text-yellow-300 opacity-20">
              <FaCertificate className="text-4xl" />
            </div>
            <div className="absolute bottom-4 left-4 text-yellow-300 opacity-20">
              <FaStar className="text-4xl" />
            </div>
            <div className="absolute bottom-4 right-4 text-yellow-300 opacity-20">
              <FaStar className="text-4xl" />
            </div>

            {/* Certificate Content */}
            <div className="relative z-10">
              <div className="mb-6">
                <FaCertificate className="text-6xl text-yellow-500 mx-auto mb-4" />
                <h1 className="text-4xl font-bold text-gray-800 mb-2">Certificate of Completion</h1>
                <div className="w-32 h-1 bg-yellow-400 mx-auto"></div>
              </div>

              <div className="mb-8">
                <p className="text-lg text-gray-600 mb-4">This is to certify that</p>
                <h2 className="text-3xl font-bold text-primary-600 mb-4">
                  {user?.fullName || user?.name || 'Student Name'}
                </h2>
                <p className="text-lg text-gray-600 mb-4">has successfully completed the course</p>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">{certificate.courseTitle}</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Instructor</p>
                  <p className="font-semibold text-gray-800">{certificate.instructor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completion Date</p>
                  <p className="font-semibold text-gray-800">
                    {certificate.completedAt.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Final Score</p>
                  <p className="font-semibold text-gray-800">{certificate.score}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Certificate ID</p>
                  <p className="font-semibold text-gray-800">{certificate.certificateNumber}</p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-sm text-gray-600 mb-2">Skills Acquired</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {certificate.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <FaCheck className="text-green-500 mr-2" />
                  <span>Verified Certificate</span>
                </div>
                <div className="flex items-center">
                  <FaCalendar className="text-blue-500 mr-2" />
                  <span>Issued by LearnHub</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={() => handleDownloadCertificate(certificate)}
              className="btn-primary"
            >
              <FaDownload className="mr-2" />
              Download PDF
            </button>
            <button
              onClick={() => window.print()}
              className="btn-secondary"
            >
              <FaPrint className="mr-2" />
              Print
            </button>
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Close
            </button>
          </div>

          {/* Name Change Request Notice */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Is the name on your certificate incorrect?
            </p>
            <button
              onClick={() => {
                toast.info('Please contact support@learnhub.com with your certificate ID and correct full name for name correction.');
              }}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium underline"
            >
              Request Name Change
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Certificates</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Showcase your achievements and share your professional accomplishments
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">{certificates.length}</div>
              <div className="text-sm text-gray-600">Total Certificates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {certificates.filter(cert => cert.score >= 90).length}
              </div>
              <div className="text-sm text-gray-600">Excellent Scores</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {new Set(certificates.map(cert => cert.category)).size}
              </div>
              <div className="text-sm text-gray-600">Skill Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="py-6 px-4 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search certificates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredCertificates.length === 0 ? (
            <div className="text-center py-20">
              <FaCertificate className="mx-auto text-6xl text-gray-300 mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {certificates.length === 0 ? 'No certificates yet' : 'No certificates found'}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                {certificates.length === 0 
                  ? 'Complete your first course to earn your first certificate!'
                  : 'Try adjusting your search terms or filters.'
                }
              </p>
              {certificates.length === 0 && (
                <button
                  onClick={() => window.location.href = '/courses'}
                  className="btn-primary"
                >
                  Browse Courses
                </button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCertificates.map((certificate) => (
                <div key={certificate._id} className="card group hover:shadow-lg transition-all duration-300">
                  {/* Certificate Preview */}
                  <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-primary-50 to-purple-50 p-6 text-center border-b-4 border-yellow-400">
                    <FaCertificate className="text-4xl text-yellow-500 mx-auto mb-3" />
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                      {certificate.courseTitle}
                    </h3>
                    <p className="text-sm text-gray-600">by {certificate.instructor}</p>
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(certificate.category)}`}>
                        {certificate.category.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Certificate Details */}
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Completion Date</span>
                        <span className="font-medium">
                          {certificate.completedAt.toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Final Score</span>
                        <span className={`font-medium ${
                          certificate.score >= 90 ? 'text-green-600' :
                          certificate.score >= 80 ? 'text-yellow-600' : 'text-gray-600'
                        }`}>
                          {certificate.score}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Certificate ID</span>
                        <span className="font-mono text-xs">{certificate.certificateNumber}</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-1">
                        {certificate.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {certificate.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                            +{certificate.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setSelectedCertificate(certificate);
                            setShowModal(true);
                          }}
                          className="btn-secondary text-sm"
                        >
                          <FaEye className="mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadCertificate(certificate)}
                          className="btn-primary text-sm"
                        >
                          <FaDownload className="mr-1" />
                          Download
                        </button>
                      </div>

                      {/* Share Options */}
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleShareCertificate(certificate, 'linkedin')}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Share on LinkedIn"
                        >
                          <FaLinkedin />
                        </button>
                        <button
                          onClick={() => handleShareCertificate(certificate, 'twitter')}
                          className="p-2 text-blue-400 hover:bg-blue-50 rounded-full transition-colors"
                          title="Share on Twitter"
                        >
                          <FaTwitter />
                        </button>
                        <button
                          onClick={() => handleShareCertificate(certificate, 'facebook')}
                          className="p-2 text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                          title="Share on Facebook"
                        >
                          <FaFacebook />
                        </button>
                        <button
                          onClick={() => handleShareCertificate(certificate, 'copy')}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                          title="Copy Link"
                        >
                          <FaShare />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Certificate Modal */}
      {showModal && selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => {
            setShowModal(false);
            setSelectedCertificate(null);
          }}
        />
      )}
    </div>
  );
};

export default CertificatesPage;
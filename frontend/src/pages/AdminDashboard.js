import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaUsers, FaCertificate, FaBookOpen, FaChartLine, 
  FaUserGraduate, FaMoneyBillWave, FaCog, FaSignOutAlt,
  FaHome, FaDatabase, FaPlus, FaEdit, FaSearch, FaTrash,
  FaEye, FaDownload, FaEnvelope, FaShieldAlt, FaBan, FaUnlock, FaKey
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [blockedEmails, setBlockedEmails] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEnrollments: 0,
    totalCertificates: 0,
    totalCourses: 0,
    revenue: 0,
    blockedAccounts: 0
  });
  const [allUsers, setAllUsers] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Unauthorized! Admin access only.');
      navigate('/admin/login');
      return;
    }
    loadAllData();
  }, [user, navigate]);

  const loadAllData = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const certs = JSON.parse(localStorage.getItem('certificates') || '[]');
    const premiumCourses = JSON.parse(localStorage.getItem('premiumCourses') || '[]');
    const blocked = JSON.parse(localStorage.getItem('blockedAdminEmails') || '[]');
    
    setBlockedEmails(blocked);
    
    let totalEnrollments = 0;
    const usersWithEnrollments = users.filter(u => u.role !== 'admin').map(u => {
      const userProgress = JSON.parse(localStorage.getItem(`courseProgress_${u.id}`) || '{}');
      const enrollments = Object.keys(userProgress);
      totalEnrollments += enrollments.length;
      
      return {
        ...u,
        enrollments,
        enrollmentCount: enrollments.length
      };
    });

    setAllUsers(usersWithEnrollments);
    setCertificates(certs);

    setStats({
      totalUsers: usersWithEnrollments.length,
      totalEnrollments,
      totalCertificates: certs.length,
      totalCourses: 5,
      revenue: premiumCourses.length * 999,
      blockedAccounts: blocked.length
    });
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.filter(u => u.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      loadAllData();
      toast.success('User deleted successfully');
    }
  };

  const handleUnblockEmail = (email) => {
    if (window.confirm(`Are you sure you want to unblock ${email}? They will be able to attempt admin login again.`)) {
      const blocked = JSON.parse(localStorage.getItem('blockedAdminEmails') || '[]');
      const updated = blocked.filter(e => e !== email);
      localStorage.setItem('blockedAdminEmails', JSON.stringify(updated));
      loadAllData();
      toast.success(`✅ ${email} has been unblocked!`);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <div className={`${bgColor} rounded-xl p-6 shadow-lg transform hover:scale-105 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center`}>
          <Icon className="text-white text-2xl" />
        </div>
      </div>
    </div>
  );

  const TabButton = ({ tab, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
        activeTab === tab
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon className="text-xl" />
      <span className="font-medium">{label}</span>
    </button>
  );

  const filteredUsers = allUsers.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FaHome className="text-white text-3xl" />
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-blue-100">Welcome back, {user?.name}!</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-6">
              <nav className="space-y-2">
                <TabButton tab="overview" icon={FaChartLine} label="Overview" />
                <TabButton tab="alldata" icon={FaDatabase} label="All Data" />
                <TabButton tab="users" icon={FaUsers} label="Users" />
                <TabButton tab="certificates" icon={FaCertificate} label="Certificates" />
                <TabButton tab="security" icon={FaShieldAlt} label="Security" />
                <TabButton tab="courses" icon={FaBookOpen} label="Courses" />
                <TabButton tab="settings" icon={FaCog} label="Settings" />
              </nav>
            </div>
          </div>

          <div className="col-span-12 md:col-span-9">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <StatCard icon={FaUsers} title="Total Users" value={stats.totalUsers} color="bg-blue-500" bgColor="bg-blue-50" />
                  <StatCard icon={FaUserGraduate} title="Total Enrollments" value={stats.totalEnrollments} color="bg-green-500" bgColor="bg-green-50" />
                  <StatCard icon={FaCertificate} title="Certificates Issued" value={stats.totalCertificates} color="bg-purple-500" bgColor="bg-purple-50" />
                  <StatCard icon={FaBookOpen} title="Total Courses" value={stats.totalCourses} color="bg-orange-500" bgColor="bg-orange-50" />
                  <StatCard icon={FaMoneyBillWave} title="Revenue" value={`₹${stats.revenue.toLocaleString()}`} color="bg-pink-500" bgColor="bg-pink-50" />
                  <StatCard icon={FaBan} title="Blocked Accounts" value={stats.blockedAccounts} color="bg-red-500" bgColor="bg-red-50" />
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={() => setActiveTab('courses')} className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg">
                      <FaPlus /><span className="font-medium">Add New Course</span>
                    </button>
                    <button onClick={() => setActiveTab('alldata')} className="flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg">
                      <FaDatabase /><span className="font-medium">View All Data</span>
                    </button>
                    <button onClick={() => setActiveTab('security')} className="flex items-center justify-center space-x-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg">
                      <FaShieldAlt /><span className="font-medium">Security Center</span>
                    </button>
                    <button onClick={() => setActiveTab('certificates')} className="flex items-center justify-center space-x-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg">
                      <FaEdit /><span className="font-medium">View Certificates</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {allUsers.slice(0, 5).map((u, idx) => (
                      <div key={idx} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-gray-700">New user registered: {u.email}</p>
                        <span className="text-xs text-gray-500 ml-auto">Recently</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'alldata' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">All Data - Complete Overview</h2>
                  <button className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                    <FaDownload /><span>Export Data</span>
                  </button>
                </div>

                <div className="relative mb-6">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search users by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollments</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificates</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => {
                        const userCerts = certificates.filter(c => c.userId === user.id);
                        return (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"><div className="flex items-center"><FaEnvelope className="mr-2 text-gray-400" />{user.email}</div></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email.split('@')[0]}</td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{user.enrollmentCount} courses</span></td>
                            <td className="px-6 py-4 whitespace-nowrap"><span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{userCerts.length} certs</span></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-3">
                                <button onClick={() => toast.success(`Viewing details for ${user.name}`)} className="text-blue-600 hover:text-blue-900" title="View Details"><FaEye /></button>
                                <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900" title="Delete User"><FaTrash /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12"><FaUsers className="mx-auto text-6xl text-gray-300 mb-4" /><p className="text-gray-500 text-lg">No users found</p></div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">User Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allUsers.map((user) => (
                    <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">{user.name.charAt(0)}</div>
                        <div><h3 className="font-semibold text-gray-900">{user.name}</h3><p className="text-sm text-gray-500">{user.email}</p></div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600"><span className="font-medium">Enrollments:</span> {user.enrollmentCount}</p>
                        <p className="text-gray-600"><span className="font-medium">Role:</span> Student</p>
                      </div>
                      <button onClick={() => handleDeleteUser(user.id)} className="mt-4 w-full bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors">Delete User</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'certificates' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Certificate Management</h2>
                <div className="space-y-4">
                  {certificates.map((cert, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{cert.courseName}</h3>
                          <p className="text-sm text-gray-500">Student ID: {cert.userId}</p>
                          <p className="text-sm text-gray-500">Issued: {new Date(cert.issuedDate).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right"><span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">Score: {cert.score}%</span></div>
                      </div>
                    </div>
                  ))}
                  {certificates.length === 0 && (
                    <div className="text-center py-12"><FaCertificate className="mx-auto text-6xl text-gray-300 mb-4" /><p className="text-gray-500 text-lg">No certificates issued yet</p></div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <FaShieldAlt className="text-3xl text-red-500" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Security Center</h2>
                      <p className="text-gray-500">Manage blocked accounts and security settings</p>
                    </div>
                  </div>
                  <div className="bg-red-100 px-4 py-2 rounded-lg">
                    <span className="text-red-800 font-bold">{blockedEmails.length} Blocked</span>
                  </div>
                </div>

                {/* Security Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-600 text-sm font-medium">Blocked Accounts</p>
                        <p className="text-3xl font-bold text-red-700">{blockedEmails.length}</p>
                      </div>
                      <FaBan className="text-red-400 text-3xl" />
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-600 text-sm font-medium">Max Attempts</p>
                        <p className="text-3xl font-bold text-yellow-700">3</p>
                      </div>
                      <FaKey className="text-yellow-400 text-3xl" />
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">Security Status</p>
                        <p className="text-lg font-bold text-green-700">Active</p>
                      </div>
                      <FaShieldAlt className="text-green-400 text-3xl" />
                    </div>
                  </div>
                </div>

                {/* Blocked Accounts List */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Blocked Email Addresses</h3>
                  {blockedEmails.length === 0 ? (
                    <div className="text-center py-12">
                      <FaShieldAlt className="mx-auto text-6xl text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">No blocked accounts</p>
                      <p className="text-gray-400 text-sm mt-2">Accounts are automatically blocked after 3 failed passkey attempts</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {blockedEmails.map((email, idx) => (
                        <div key={idx} className="bg-white border border-red-200 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-all duration-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                              <FaBan className="text-red-500" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{email}</p>
                              <p className="text-sm text-gray-500">Blocked due to failed passkey attempts</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleUnblockEmail(email)}
                            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                          >
                            <FaUnlock />
                            <span>Unblock</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Security Policy */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center">
                    <FaShieldAlt className="mr-2" />
                    Security Policy
                  </h3>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-start">
                      <span className="mr-2">🔒</span>
                      <span>Admin passkey required for all admin login attempts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">⚠️</span>
                      <span>Maximum 3 failed passkey attempts allowed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">🚫</span>
                      <span>Account permanently blocked after 3 failed attempts</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">🔓</span>
                      <span>Only super admin can unblock accounts from this panel</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">📧</span>
                      <span>Blocked emails cannot signup or login as admin</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Management</h2>
                <div className="text-center py-12">
                  <FaBookOpen className="mx-auto text-6xl text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg mb-4">Course management features coming soon...</p>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"><FaPlus className="inline mr-2" />Add New Course</button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Settings</h2>
                <div className="space-y-6">
                  <div><h3 className="font-semibold text-gray-900 mb-2">Account Information</h3><p className="text-gray-600">Name: {user?.name}</p><p className="text-gray-600">Email: {user?.email}</p><p className="text-gray-600">Role: Administrator</p></div>
                  <div><h3 className="font-semibold text-gray-900 mb-2">System Settings</h3><p className="text-gray-500">Configure system-wide settings here...</p></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

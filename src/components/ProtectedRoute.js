import { useAuth } from '../contexts/AuthContext';
import { Spin } from 'antd';
import Login from './Auth/Login';
import { useState } from 'react';

const ProtectedRoute = ({ children, fallback = null }) => {
  const { isAuthenticated, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-antique-white flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallback) {
      return fallback;
    }
    
    return (
      <>
        <div className="min-h-screen bg-antique-white flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-white text-2xl">🔒</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">
              Please sign in to access this page and enjoy our personalized shopping experience.
            </p>
            <button
              onClick={() => setShowLogin(true)}
              className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              Sign In Now
            </button>
          </div>
        </div>
        
        {showLogin && (
          <Login 
            onAuthSuccess={() => setShowLogin(false)}
            onClose={() => setShowLogin(false)}
          />
        )}
      </>
    );
  }

  return children;
};

export default ProtectedRoute;
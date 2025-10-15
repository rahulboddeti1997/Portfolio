import { useState } from 'react';
import { Button, Dropdown, Avatar, Badge } from 'antd';
import { UserOutlined, ShoppingCartOutlined, HeartOutlined, LogoutOutlined, SettingOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Login from './Auth/Login';

const UserMenu = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const history = useHistory();
  const [showLogin, setShowLogin] = useState(false);
  
  // Get cart and wishlist counts from Redux
  const cartItems = useSelector(state => state.products.cartItems || []);
  const products = useSelector(state => state.products.products || []);
  const wishlistCount = products.filter(product => product.wishListed).length;
  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  const handleSignOut = async () => {
    await signOut();
    history.push('/');
  };

  const handleAuthSuccess = () => {
    setShowLogin(false);
  };

  const userMenuItems = [
    {
      key: 'account',
      label: (
        <div className="flex items-center gap-3 py-2">
          <UserOutlined className="text-gray-600" />
          <div>
            <div className="font-medium text-gray-800">My Account</div>
            <div className="text-sm text-gray-500">Profile, Orders, Wishlist & Settings</div>
          </div>
        </div>
      ),
      onClick: () => history.push('/account')
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: (
        <div className="flex items-center gap-3 py-2 text-red-600">
          <LogoutOutlined />
          <div>
            <div className="font-medium">Sign Out</div>
            <div className="text-sm text-red-500">Logout from account</div>
          </div>
        </div>
      ),
      onClick: handleSignOut
    },
  ];

  if (!isAuthenticated) {
    return (
      <>
        <div className="flex items-center gap-4">
          <Button
            type="default"
            onClick={() => setShowLogin(true)}
            className="bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-md transition-all duration-300 rounded-lg px-6"
          >
            Sign In
          </Button>
        </div>

        {showLogin && (
          <Login 
            onAuthSuccess={handleAuthSuccess}
            onClose={() => setShowLogin(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {wishlistCount > 0 && (
        <Badge count={wishlistCount} size="small" offset={[-3, 3]}>
          <Button
            type="text"
            icon={<HeartOutlined className="text-white text-lg" />}
            onClick={() => history.push('/account')}
            className="flex items-center justify-center hover:bg-gray-700 border-0 rounded-lg p-2"
          />
        </Badge>
      )}

      <Dropdown
        menu={{ items: userMenuItems }}
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
        overlayClassName="user-dropdown"
        overlayStyle={{ minWidth: '280px' }}
      >
        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-700/20 rounded-lg p-2 transition-all duration-300">
          <Avatar
            size={40}
            icon={<UserOutlined />}
            src={user?.user_metadata?.avatar_url}
            className="bg-gradient-to-r from-gray-600 to-gray-700"
          />
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-white truncate max-w-32">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </div>
            <div className="text-xs text-gray-300">
              {user?.email}
            </div>
          </div>
        </div>
      </Dropdown>
    </div>
  );
};

export default UserMenu;
import { UserOutlined, ShoppingOutlined, HeartOutlined, SettingOutlined, EditOutlined, LogoutOutlined, BellOutlined, CreditCardOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined, CheckCircleOutlined, ClockCircleOutlined, TruckOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Divider, Badge, Switch, Input, Form, message, Statistic } from "antd";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "../contexts/AuthContext";

const Profile = (props) => {
  const { user, signOut, updateProfile } = useAuth();
  const products = useSelector((state) => state.products.products);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef([]);
  const [activeSection, setActiveSection] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User",
    email: user?.email || "",
    phone: user?.user_metadata?.phone || "",
    address: user?.user_metadata?.address || ""
  });

  // Update userInfo when user data changes
  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
        address: user.user_metadata?.address || ""
      });
    }
  }, [user]);

  // Mock order data
  const orders = [
    {
      id: "ORD001",
      date: "2025-10-10",
      status: "Delivered",
      total: 2499,
      items: 3,
      image: "/images/1.svg"
    },
    {
      id: "ORD002", 
      date: "2025-10-05",
      status: "In Transit",
      total: 1899,
      items: 2,
      image: "/images/2.svg"
    },
    {
      id: "ORD003",
      date: "2025-09-28",
      status: "Delivered", 
      total: 3299,
      items: 4,
      image: "/images/3.svg"
    }
  ];

  const wishlistItems = products.filter(product => product.wishListed);

  const navigationItems = [
    {
      key: "profile",
      title: "Profile",
      icon: UserOutlined,
      description: "Personal information"
    },
    {
      key: "orders",
      title: "Orders",
      icon: ShoppingOutlined,
      description: `${orders.length} orders`,
      badge: orders.filter(o => o.status === "In Transit").length
    },
    {
      key: "wishlist",
      title: "Wishlist",
      icon: HeartOutlined,
      description: `${wishlistItems.length} items`,
      badge: wishlistItems.length
    },
    {
      key: "settings",
      title: "Settings",
      icon: SettingOutlined,
      description: "Account preferences"
    }
  ];

  useEffect(() => {
    const observers = [];
    
    sectionRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                setVisibleSections(prev => new Set([...prev, index]));
              }, index * 80);
            }
          },
          {
            threshold: 0.1,
            rootMargin: '50px 0px -50px 0px'
          }
        );
        
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [activeSection]);

  const setSectionRef = (index) => (el) => {
    sectionRefs.current[index] = el;
  };

  const handleSaveProfile = async (values) => {
    try {
      const updates = {
        full_name: values.name,
        phone: values.phone,
        address: values.address
      };
      
      const { error } = await updateProfile(updates);
      if (!error) {
        setUserInfo(values);
        setEditMode(false);
      }
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <CheckCircleOutlined className="text-green-500" />;
      case 'In Transit': return <TruckOutlined className="text-blue-500" />;
      case 'Processing': return <ClockCircleOutlined className="text-orange-500" />;
      default: return <ClockCircleOutlined className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'success';
      case 'In Transit': return 'processing';
      case 'Processing': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  function renderProfileContent() {
    return (
      <div className="space-y-6">
        <div 
          ref={setSectionRef(0)}
          className={`transition-all duration-500 ease-out ${
            visibleSections.has(0) 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg">
                  <UserOutlined className="text-white text-xl" />
                </div>
                Personal Information
              </h2>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setEditMode(!editMode)}
                className="bg-gradient-to-r from-gray-600 to-gray-700 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {editMode ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            {editMode ? (
              <Form
                layout="vertical"
                initialValues={userInfo}
                onFinish={handleSaveProfile}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter your name' }]}
                  >
                    <Input size="large" prefix={<UserOutlined />} className="rounded-lg" />
                  </Form.Item>
                  
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}
                  >
                    <Input size="large" prefix={<MailOutlined />} className="rounded-lg" />
                  </Form.Item>
                  
                  <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{ required: true, message: 'Please enter your phone' }]}
                  >
                    <Input size="large" prefix={<PhoneOutlined />} className="rounded-lg" />
                  </Form.Item>
                  
                  <Form.Item
                    label="Address"
                    name="address"
                    rules={[{ required: true, message: 'Please enter your address' }]}
                  >
                    <Input size="large" prefix={<EnvironmentOutlined />} className="rounded-lg" />
                  </Form.Item>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    size="large"
                    className="bg-gradient-to-r from-gray-600 to-gray-700 border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Save Changes
                  </Button>
                </div>
              </Form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600 font-medium mb-1">Full Name</p>
                    <p className="text-gray-800 font-semibold">{userInfo.name}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600 font-medium mb-1">Email</p>
                    <p className="text-gray-800 font-semibold">{userInfo.email}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600 font-medium mb-1">Phone</p>
                    <p className="text-gray-800 font-semibold">{userInfo.phone}</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-sm text-gray-600 font-medium mb-1">Address</p>
                    <p className="text-gray-800 font-semibold">{userInfo.address}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  function renderOrdersContent() {
    return (
      <div className="space-y-6">
        <div 
          ref={setSectionRef(1)}
          className={`transition-all duration-500 ease-out ${
            visibleSections.has(1) 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg">
                <ShoppingOutlined className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Order History</h2>
              <Badge count={orders.length} showZero className="ml-auto" />
            </div>

            <div className="space-y-4">
              {orders.map((order, index) => (
                <div
                  key={order.id}
                  ref={setSectionRef(index + 10)}
                  className={`
                    p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 cursor-pointer
                    ${visibleSections.has(index + 10) 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 translate-x-8'
                    }
                  `}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={order.image} 
                        alt="Order"
                        className="w-16 h-16 rounded-lg object-cover border-2 border-gray-200"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">#{order.id}</h3>
                          <p className="text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-800">₹{order.total.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">{order.items} items</p>
                          </div>
                          
                          <Badge 
                            status={getStatusColor(order.status)} 
                            text={
                              <span className="flex items-center gap-2 font-medium">
                                {getStatusIcon(order.status)}
                                {order.status}
                              </span>
                            }
                            className="whitespace-nowrap"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  function renderWishlistContent() {
    return (
      <div className="space-y-6">
        <div 
          ref={setSectionRef(2)}
          className={`transition-all duration-500 ease-out ${
            visibleSections.has(2) 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg">
                <HeartOutlined className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">My Wishlist</h2>
              <Badge count={wishlistItems.length} showZero className="ml-auto" />
            </div>

            {wishlistItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item, index) => (
                  <div
                    key={item.id}
                    ref={setSectionRef(index + 20)}
                    className={`
                      group relative bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden
                      ${visibleSections.has(index + 20) 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-8'
                      }
                    `}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img 
                        src={item.image_url || item.image || `/images/${item.id}.svg`} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3">
                        <Button
                          type="text"
                          shape="circle"
                          icon={<HeartOutlined />}
                          className="bg-white/90 backdrop-blur-sm text-red-500 hover:bg-red-50 shadow-lg"
                        />
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-gray-700">₹{item.price.toLocaleString()}</span>
                        <Button 
                          type="primary" 
                          size="small"
                          className="bg-gradient-to-r from-gray-600 to-gray-700 border-0"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HeartOutlined className="text-6xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500">Start adding items you love!</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  function renderSettingsContent() {
    return (
      <div className="space-y-6">
        <div 
          ref={setSectionRef(3)}
          className={`transition-all duration-500 ease-out ${
            visibleSections.has(3) 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg">
                <SettingOutlined className="text-white text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <BellOutlined className="text-gray-600 text-xl" />
                      <div>
                        <h3 className="font-semibold text-gray-800">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive order updates via email</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <CreditCardOutlined className="text-gray-600 text-xl" />
                      <div>
                        <h3 className="font-semibold text-gray-800">Auto Payment</h3>
                        <p className="text-sm text-gray-600">Enable one-click checkout</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <Divider />

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Danger Zone</h3>
                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-red-800">Delete Account</h4>
                      <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                    </div>
                    <Button 
                      danger 
                      className="hover:bg-red-600 hover:text-white border-red-300"
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  function renderContent() {
    switch (activeSection) {
      case "profile":
        return renderProfileContent();
      case "orders":
        return renderOrdersContent();
      case "wishlist":
        return renderWishlistContent();
      case "settings":
        return renderSettingsContent();
      default:
        return renderProfileContent();
    }
  }

  return (
    <div className="min-h-screen bg-antique-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <Avatar
                size={120}
                icon={<UserOutlined />}
                src={user?.user_metadata?.avatar_url}
                className="bg-gradient-to-br from-gray-600 to-gray-700 border-4 border-white shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {userInfo.name}
              </h1>
              <p className="text-gray-600 mb-4 flex items-center justify-center md:justify-start gap-2">
                <MailOutlined />
                {userInfo.email}
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Statistic
                  title="Total Orders"
                  value={orders.length}
                  prefix={<ShoppingOutlined />}
                  valueStyle={{ color: '#4b5563', fontSize: '1.5rem' }}
                />
                <Statistic
                  title="Wishlist Items"
                  value={wishlistItems.length}
                  prefix={<HeartOutlined />}
                  valueStyle={{ color: '#6b7280', fontSize: '1.5rem' }}
                />
                <Statistic
                  title="Member Since"
                  value="2024"
                  valueStyle={{ color: '#374151', fontSize: '1.5rem' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Modern Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm sticky top-8">
              <div className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.key;
                  
                  return (
                    <div
                      key={item.key}
                      onClick={() => setActiveSection(item.key)}
                      className={`
                        relative p-4 rounded-xl cursor-pointer transition-all duration-300 group
                        ${isActive 
                          ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-lg transform scale-105' 
                          : 'hover:bg-gray-50 hover:shadow-md hover:transform hover:scale-102'
                        }
                      `}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl opacity-20 blur-xl"></div>
                      )}
                      
                      <div className="relative flex items-center gap-3">
                        <div className={`
                          p-2 rounded-lg transition-all duration-300
                          ${isActive 
                            ? 'bg-white/20' 
                            : 'bg-gray-100 group-hover:bg-gray-200'
                          }
                        `}>
                          <Icon className={`text-lg ${isActive ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-semibold truncate ${isActive ? 'text-white' : 'text-gray-800'}`}>
                              {item.title}
                            </h3>
                            {item.badge && item.badge > 0 && (
                              <Badge 
                                count={item.badge} 
                                className="scale-90"
                                style={{ backgroundColor: isActive ? '#ffffff' : '#6b7280' }}
                              />
                            )}
                          </div>
                          <p className={`text-sm truncate ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                            {item.description}
                          </p>
                        </div>
                        
                        <div className={`
                          w-2 h-2 rounded-full transition-all duration-300
                          ${isActive ? 'bg-white' : 'bg-transparent group-hover:bg-gray-400'}
                        `}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <Divider className="my-6" />
              
              <Button
                icon={<LogoutOutlined />}
                type="text"
                danger
                block
                onClick={signOut}
                className="flex items-center justify-center gap-2 h-12 hover:bg-red-50 border border-red-200 rounded-xl"
              >
                Sign Out
              </Button>
            </Card>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="space-y-8">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
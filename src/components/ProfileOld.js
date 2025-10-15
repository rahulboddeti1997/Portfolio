import { UserOutlined, ShoppingOutlined, HeartOutlined, SettingOutlined, EditOutlined, LogoutOutlined, BellOutlined, CreditCardOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined, CheckCircleOutlined, ClockCircleOutlined, TruckOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Divider, List, Badge, Switch, Input, Form, message, Statistic } from "antd";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const Profile = (props) => {
  const products = useSelector((state) => state.products.products);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef([]);
  const [activeSection, setActiveSection] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "Rahul Boddeti",
    email: "rahul@hira.com",
    phone: "+91 98765 43210",
    address: "123 Fashion Street, Mumbai, Maharashtra 400001"
  });

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

  const handleSaveProfile = (values) => {
    setUserInfo(values);
    setEditMode(false);
    message.success('Profile updated successfully!');
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

  const tabItems = [
    {
      key: "1",
      label: (
        <span className="flex items-center gap-2">
          <UserOutlined />
          Profile
        </span>
      ),
      children: (
        <div className="space-y-6">
          {/* Profile Header */}
          <div 
            ref={setSectionRef(0)}
            className={`transition-all duration-500 ease-out ${
              visibleSections.has(0) 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <Card className="bg-gradient-to-r from-slate-800 to-slate-700 text-white border-0">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar 
                    size={100} 
                    icon={<UserOutlined />} 
                    className="bg-antique-200 text-slate-800 border-4 border-white shadow-lg"
                  />
                  <Button 
                    size="small" 
                    shape="circle" 
                    icon={<EditOutlined />} 
                    className="absolute -bottom-2 -right-2 bg-white text-slate-800 hover:bg-antique-100"
                  />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">{userInfo.name}</h1>
                  <p className="text-antique-100 mb-2">Premium Member since 2024</p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <MailOutlined /> {userInfo.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <PhoneOutlined /> {userInfo.phone}
                    </span>
                  </div>
                </div>
                <Button 
                  type="primary" 
                  icon={<EditOutlined />}
                  onClick={() => setEditMode(true)}
                  className="bg-antique-200 text-slate-800 hover:bg-antique-300 border-0"
                >
                  Edit Profile
                </Button>
              </div>
            </Card>
          </div>

          {/* Profile Stats */}
          <div 
            ref={setSectionRef(1)}
            className={`transition-all duration-500 ease-out ${
              visibleSections.has(1) 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="text-center hover:shadow-md transition-shadow">
                <ShoppingOutlined className="text-3xl text-blue-500 mb-2" />
                <h3 className="text-xl font-bold">{orders.length}</h3>
                <p className="text-gray-600">Total Orders</p>
              </Card>
              <Card className="text-center hover:shadow-md transition-shadow">
                <HeartOutlined className="text-3xl text-red-500 mb-2" />
                <h3 className="text-xl font-bold">{wishlistItems.length}</h3>
                <p className="text-gray-600">Wishlist Items</p>
              </Card>
              <Card className="text-center hover:shadow-md transition-shadow">
                <CreditCardOutlined className="text-3xl text-green-500 mb-2" />
                <h3 className="text-xl font-bold">₹{orders.reduce((sum, order) => sum + order.total, 0)}</h3>
                <p className="text-gray-600">Total Spent</p>
              </Card>
            </div>
          </div>

          {/* Profile Form */}
          {editMode && (
            <div 
              ref={setSectionRef(2)}
              className={`transition-all duration-500 ease-out ${
                visibleSections.has(2) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <Card title="Edit Profile Information">
                <Form
                  layout="vertical"
                  initialValues={userInfo}
                  onFinish={handleSaveProfile}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label="Full Name" name="name" rules={[{ required: true }]}>
                      <Input placeholder="Enter your full name" />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
                      <Input placeholder="Enter your email" />
                    </Form.Item>
                    <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
                      <Input placeholder="Enter your phone number" />
                    </Form.Item>
                    <Form.Item label="Address" name="address" rules={[{ required: true }]}>
                      <Input.TextArea placeholder="Enter your address" rows={3} />
                    </Form.Item>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button type="primary" htmlType="submit" className="bg-slate-800 hover:bg-slate-700">
                      Save Changes
                    </Button>
                    <Button onClick={() => setEditMode(false)}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Card>
            </div>
          )}
        </div>
      )
    },
    {
      key: "2",
      label: (
        <span className="flex items-center gap-2">
          <ShoppingOutlined />
          Orders ({orders.length})
        </span>
      ),
      children: (
        <div 
          ref={setSectionRef(3)}
          className={`transition-all duration-500 ease-out ${
            visibleSections.has(3) 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <Card title="Order History">
            <List
              dataSource={orders}
              renderItem={(order, index) => (
                <List.Item 
                  className={`transition-all duration-500 ease-out ${
                    visibleSections.has(3) 
                      ? 'opacity-100 translate-x-0' 
                      : 'opacity-0 translate-x-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-lg">Order #{order.id}</h4>
                        <p className="text-gray-600">
                          {new Date(order.date).toLocaleDateString()} • {order.items} items
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge 
                          status={getStatusColor(order.status)} 
                          text={order.status} 
                          className="font-medium"
                        />
                        <span className="font-bold text-lg">₹{order.total}</span>
                        <Button type="link" className="text-slate-800">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </div>
      )
    },
    {
      key: "3",
      label: (
        <span className="flex items-center gap-2">
          <HeartOutlined />
          Wishlist ({wishlistItems.length})
        </span>
      ),
      children: (
        <div 
          ref={setSectionRef(4)}
          className={`transition-all duration-500 ease-out ${
            visibleSections.has(4) 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <Card title="My Wishlist">
            {wishlistItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistItems.map((item, index) => (
                  <Card
                    key={item.id}
                    hoverable
                    cover={
                      <img 
                        alt={item.name} 
                        src={item.image} 
                        className="h-48 object-cover"
                      />
                    }
                    className={`transition-all duration-500 ease-out ${
                      visibleSections.has(4) 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <Card.Meta 
                      title={item.name}
                      description={
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-lg">₹{item.price}</span>
                            <span className="text-gray-500 line-through">₹{item.mrp}</span>
                            <span className="text-green-600 text-sm">{item.discount}% OFF</span>
                          </div>
                          <Button 
                            type="primary" 
                            block 
                            className="bg-slate-800 hover:bg-slate-700"
                          >
                            Move to Cart
                          </Button>
                        </div>
                      }
                    />
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <HeartOutlined className="text-6xl text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500 mb-4">Save items you love to view them here</p>
                <Button 
                  type="primary" 
                  onClick={() => props.history.push('/products')}
                  className="bg-slate-800 hover:bg-slate-700"
                >
                  Browse Products
                </Button>
              </div>
            )}
          </Card>
        </div>
      )
    },
    {
      key: "4",
      label: (
        <span className="flex items-center gap-2">
          <SettingOutlined />
          Settings
        </span>
      ),
      children: (
        <div 
          ref={setSectionRef(5)}
          className={`transition-all duration-500 ease-out ${
            visibleSections.has(5) 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="space-y-6">
            <Card title="Notification Preferences">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-gray-600 text-sm">Receive updates about your orders and offers</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Divider />
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-gray-600 text-sm">Get order updates via SMS</p>
                  </div>
                  <Switch />
                </div>
                <Divider />
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Marketing Updates</h4>
                    <p className="text-gray-600 text-sm">Receive promotional offers and news</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>

            <Card title="Account Actions">
              <div className="space-y-4">
                <Button 
                  icon={<CreditCardOutlined />} 
                  block 
                  className="text-left h-12"
                >
                  Manage Payment Methods
                </Button>
                <Button 
                  icon={<EnvironmentOutlined />} 
                  block 
                  className="text-left h-12"
                >
                  Manage Addresses
                </Button>
                <Button 
                  icon={<BellOutlined />} 
                  block 
                  className="text-left h-12"
                >
                  Notification Settings
                </Button>
                <Divider />
                <Button 
                  icon={<LogoutOutlined />} 
                  danger 
                  block 
                  className="h-12"
                >
                  Sign Out
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-antique-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <Avatar
                size={120}
                icon={<UserOutlined />}
                className="bg-gradient-to-br from-amber-500 to-orange-500 border-4 border-white shadow-xl"
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
                  valueStyle={{ color: '#d97706', fontSize: '1.5rem' }}
                />
                <Statistic
                  title="Wishlist Items"
                  value={wishlistItems.length}
                  prefix={<HeartOutlined />}
                  valueStyle={{ color: '#dc2626', fontSize: '1.5rem' }}
                />
                <Statistic
                  title="Member Since"
                  value="2024"
                  valueStyle={{ color: '#059669', fontSize: '1.5rem' }}
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
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg transform scale-105' 
                          : 'hover:bg-amber-50 hover:shadow-md hover:transform hover:scale-102'
                        }
                      `}
                    >
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl opacity-20 blur-xl"></div>
                      )}
                      
                      <div className="relative flex items-center gap-3">
                        <div className={`
                          p-2 rounded-lg transition-all duration-300
                          ${isActive 
                            ? 'bg-white/20' 
                            : 'bg-amber-100 group-hover:bg-amber-200'
                          }
                        `}>
                          <Icon className={`text-lg ${isActive ? 'text-white' : 'text-amber-600'}`} />
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
                                style={{ backgroundColor: isActive ? '#ffffff' : '#f59e0b' }}
                              />
                            )}
                          </div>
                          <p className={`text-sm truncate ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                            {item.description}
                          </p>
                        </div>
                        
                        <div className={`
                          w-2 h-2 rounded-full transition-all duration-300
                          ${isActive ? 'bg-white' : 'bg-transparent group-hover:bg-amber-300'}
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
};

export default Profile;

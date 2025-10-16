import { useState, useEffect } from "react";
import { Button, Card, Form, Input, Divider, message } from "antd";
import { GoogleOutlined, MailOutlined, LockOutlined, UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { createClient } from '@supabase/supabase-js';

// Supabase configuration with fallbacks
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Only initialize Supabase if we have valid credentials
let supabase = null;

if (supabaseUrl && supabaseKey && supabaseUrl !== 'your-supabase-url') {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    // Supabase not properly configured, component will show fallback UI
  }
}

const Login = ({ onAuthSuccess, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // Only proceed if Supabase is available
    if (!supabase) {
      return;
    }

    // Check if user is already authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        onAuthSuccess(session.user);
      }
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          onAuthSuccess(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [onAuthSuccess]);

  const handleEmailAuth = async (values) => {
    if (!supabase) {
      message.error('Authentication service is not available. Please check your configuration.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        // Sign in with email
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) throw error;
        
        message.success('Login successful!');
        onAuthSuccess(data.user);
      } else {
        // Sign up with email
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              full_name: values.fullName,
              phone: values.phone,
            }
          }
        });

        if (error) throw error;

        if (data.user && !data.session) {
          message.success('Please check your email for verification link!');
        } else {
          message.success('Account created successfully!');
          onAuthSuccess(data.user);
        }
      }
    } catch (error) {
      message.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!supabase) {
      message.error('Authentication service is not available. Please check your configuration.');
      return;
    }

    setGoogleLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
    } catch (error) {
      message.error('Google authentication failed');
      setGoogleLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    form.resetFields();
  };

  // Show configuration message if Supabase is not set up
  if (!supabase) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-2xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Authentication Setup Required</h2>
            <p className="text-gray-600 mb-6">
              Supabase authentication is not configured. Please set up your environment variables.
            </p>
            <div className="text-left bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Required environment variables:</p>
              <code className="text-xs text-gray-600">
                REACT_APP_SUPABASE_URL<br/>
                REACT_APP_SUPABASE_ANON_KEY
              </code>
            </div>
            <Button
              type="primary"
              onClick={onClose}
              className="bg-gradient-to-r from-gray-600 to-gray-700 border-0"
            >
              Close
            </Button>
          </div>
          
          <Button
            type="text"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
          >
            ×
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <UserOutlined className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600">
            {isLogin 
              ? 'Sign in to your account to continue shopping' 
              : 'Join us and start your shopping journey'
            }
          </p>
        </div>

        {/* Google Auth Button */}
        <Button
          type="default"
          size="large"
          icon={<GoogleOutlined />}
          onClick={handleGoogleAuth}
          loading={googleLoading}
          className="w-full mb-6 h-12 border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 rounded-xl"
        >
          <span className="font-medium">Continue with Google</span>
        </Button>

        <Divider className="text-gray-500 font-medium">or</Divider>

        {/* Email/Password Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEmailAuth}
          className="space-y-4"
        >
          {!isLogin && (
            <Form.Item
              name="fullName"
              rules={[{ required: true, message: 'Please enter your full name' }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Full Name"
                className="rounded-xl h-12"
              />
            </Form.Item>
          )}

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input
              size="large"
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Email Address"
              className="rounded-xl h-12"
            />
          </Form.Item>

          {!isLogin && (
            <Form.Item
              name="phone"
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <Input
                size="large"
                prefix={<PhoneOutlined className="text-gray-400" />}
                placeholder="Phone Number"
                className="rounded-xl h-12"
              />
            </Form.Item>
          )}

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' }
            ]}
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password"
              className="rounded-xl h-12"
            />
          </Form.Item>

          {!isLogin && (
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="Confirm Password"
                className="rounded-xl h-12"
              />
            </Form.Item>
          )}

          <Form.Item className="mb-6">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="w-full h-12 bg-gradient-to-r from-gray-700 to-gray-800 border-0 rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </Form.Item>
        </Form>

        {/* Switch between login/register */}
        <div className="text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Button
              type="link"
              onClick={switchMode}
              className="p-0 h-auto font-medium text-gray-700 hover:text-gray-900"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </Button>
          </p>
        </div>

        {/* Close button */}
        <Button
          type="text"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
        >
          ×
        </Button>
      </Card>
    </div>
  );
};

export default Login;
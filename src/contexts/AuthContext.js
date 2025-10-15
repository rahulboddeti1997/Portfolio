import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { message } from 'antd';

// Supabase configuration with fallbacks
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Only initialize Supabase if we have valid credentials
let supabase = null;

if (supabaseUrl && supabaseKey && supabaseUrl !== 'your-supabase-url') {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.warn('Supabase initialization failed:', error.message);
  }
}

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Only proceed if Supabase is properly initialized
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.warn('Session error:', error.message);
        } else {
          setSession(session);
          setUser(session?.user || null);
        }
      } catch (error) {
        console.warn('Auth initialization error:', error.message);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);

        // if (event === 'SIGNED_IN') {
        //   message.success('Welcome back!');
        // } else if (event === 'SIGNED_OUT') {
        //   message.info('You have been signed out');
        // }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (!supabase) {
      message.error('Authentication not available');
      return;
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      message.error('Error signing out');
    }
  };

  const updateProfile = async (updates) => {
    if (!supabase) {
      message.error('Authentication not available');
      return { data: null, error: 'Supabase not initialized' };
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates
      });
      
      if (error) throw error;
      
      setUser(data.user);
      message.success('Profile updated successfully');
      return { data, error: null };
    } catch (error) {
      message.error('Failed to update profile');
      return { data: null, error };
    }
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    session,
    loading,
    isAuthenticated,
    signOut,
    updateProfile,
    supabase
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
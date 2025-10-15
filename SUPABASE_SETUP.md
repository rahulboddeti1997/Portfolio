# Supabase Authentication Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project" and fill in your project details
3. Wait for the project to be created (takes 1-2 minutes)

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy your Project URL and anon public key
3. Create a `.env` file in your project root (copy from `.env.example`)
4. Replace the placeholders with your actual credentials:

```env
REACT_APP_SUPABASE_URL=https://your-project-ref.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Configure Authentication Providers

### Enable Email Authentication:
1. Go to Authentication → Settings in your Supabase dashboard
2. Email authentication is enabled by default

### Enable Google OAuth:
1. Go to Authentication → Settings → Auth Providers
2. Enable Google provider
3. You'll need to create a Google OAuth app:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your domain to authorized origins
   - Add `https://your-project-ref.supabase.co/auth/v1/callback` to authorized redirect URIs
4. Copy Client ID and Client Secret to Supabase

## 4. Configure Site URL and Redirect URLs

1. In Authentication → Settings → Site URL, set your app URL:
   - For development: `http://localhost:3000`
   - For production: your actual domain
2. Add redirect URLs for OAuth:
   - `http://localhost:3000` (for development)
   - Your production domain

## 5. Test the Integration

1. Start your React app: `npm start`
2. Try signing up with email or Google
3. Check the Authentication → Users tab in Supabase to see registered users

## Features Included

✅ **Email/Password Authentication**
- Sign up with email verification
- Sign in with email/password
- Password validation

✅ **Google OAuth**
- One-click Google sign-in
- Automatic profile data import

✅ **Protected Routes**
- Account page requires authentication
- Automatic redirect to login

✅ **User Profile Management**
- Update profile information
- Persistent data storage in Supabase
- Real-time sync across devices

✅ **Session Management**
- Automatic session handling
- Remember user across browser sessions
- Secure token management

✅ **E-commerce Integration**
- Cart and wishlist tied to user accounts
- Order history (ready for backend integration)
- Personalized shopping experience

## Security Features

- Secure authentication flows
- JWT token management
- Row Level Security (RLS) ready
- Email verification
- Password strength validation

## Next Steps

1. Set up user profiles table in Supabase for additional user data
2. Create orders table for e-commerce functionality
3. Implement email templates for better user experience
4. Add password reset functionality
5. Set up Row Level Security policies for data protection

## File Structure

```
src/
├── components/
│   ├── Auth/
│   │   └── Login.js          # Login/Register modal
│   ├── UserMenu.js           # User dropdown menu
│   └── ProtectedRoute.js     # Route protection
├── contexts/
│   └── AuthContext.js        # Authentication context
└── App.js                    # Main app with auth integration
```

## Support

If you need help setting up Supabase, check their excellent [documentation](https://supabase.com/docs) or reach out to their support team.
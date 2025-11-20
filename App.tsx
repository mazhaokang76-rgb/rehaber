import React, { useState } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { TabBar } from './components/TabBar';
import { HomeTab } from './tabs/HomeTab';
import { CommunityTab } from './tabs/CommunityTab';
import { ProfileTab } from './tabs/ProfileTab';
import { User } from './types';
import { supabaseService } from './services/supabase';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'community' | 'profile'>('home');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = async (phone: string, name: string) => {
    try {
      setIsAuthenticating(true);
      const userData = await supabaseService.login(phone, name);
      setUser(userData);
    } catch (error) {
      console.error("Login failed:", error);
      // Fallback should handle most DB errors, but if we get here, something major failed
      alert("登录出现错误，请检查网络");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('home');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} loading={isAuthenticating} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl overflow-hidden flex flex-col">
        <main className="flex-1 relative">
          {activeTab === 'home' && <HomeTab user={user} />}
          {activeTab === 'community' && <CommunityTab />}
          {activeTab === 'profile' && (
            <ProfileTab 
              user={user} 
              onUpdateUser={handleUpdateUser}
              onLogout={handleLogout} 
            />
          )}
        </main>
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}

export default App;
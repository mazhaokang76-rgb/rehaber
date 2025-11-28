import React, { useState } from 'react';
import { Home, BookOpen, Users, LayoutGrid, User } from 'lucide-react';
import { NavTab } from './types';

// Pages
import { Home as HomePage } from './pages/Home';
import { Info as InfoPage } from './pages/Info';
import { Community as CommunityPage } from './pages/Community';
import { Tools as ToolsPage } from './pages/Tools';
import { Profile as ProfilePage } from './pages/Profile';
import { Logo } from './components/Logo';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>(NavTab.HOME);

  const renderContent = () => {
    switch (activeTab) {
      case NavTab.HOME: return <HomePage />;
      case NavTab.INFO: return <InfoPage />;
      case NavTab.COMMUNITY: return <CommunityPage />;
      case NavTab.TOOLS: return <ToolsPage />;
      case NavTab.PROFILE: return <ProfilePage />;
      default: return <HomePage />;
    }
  };

  return (
    // Mobile-first layout container
    <div className="min-h-screen bg-gray-100 flex justify-center font-sans">
      <div className="w-full max-w-md bg-white h-screen relative overflow-hidden flex flex-col shadow-2xl">
        
        {/* Top Navigation (Logo) - Only show on Home/Info for branding */}
        {(activeTab === NavTab.HOME || activeTab === NavTab.INFO) && (
             <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm/50">
                <div className="flex items-center space-x-2">
                    <Logo className="h-8 w-8" />
                    <span className="font-bold text-xl tracking-tight text-gray-800">锐汗步</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center relative">
                   {/* Placeholder for notification bell or similar */}
                   <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                </div>
            </div>
        )}

        {/* Main Content Area - Scrollable */}
        <main className="flex-1 overflow-y-auto no-scrollbar bg-gray-50 relative">
          {renderContent()}
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-center sticky bottom-0 z-40 pb-safe">
          <NavButton 
            active={activeTab === NavTab.HOME} 
            onClick={() => setActiveTab(NavTab.HOME)} 
            icon={Home} 
            label="首页" 
          />
          <NavButton 
            active={activeTab === NavTab.INFO} 
            onClick={() => setActiveTab(NavTab.INFO)} 
            icon={BookOpen} 
            label="资讯" 
          />
          <NavButton 
            active={activeTab === NavTab.COMMUNITY} 
            onClick={() => setActiveTab(NavTab.COMMUNITY)} 
            icon={Users} 
            label="社区" 
          />
          <NavButton 
            active={activeTab === NavTab.TOOLS} 
            onClick={() => setActiveTab(NavTab.TOOLS)} 
            icon={LayoutGrid} 
            label="工具" 
          />
          <NavButton 
            active={activeTab === NavTab.PROFILE} 
            onClick={() => setActiveTab(NavTab.PROFILE)} 
            icon={User} 
            label="我的" 
          />
        </nav>
      </div>
    </div>
  );
};

// Helper Component for Nav Buttons
const NavButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
}> = ({ active, onClick, icon: Icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center space-y-1 transition-colors duration-200 w-12 py-1 ${
      active ? 'text-brand-600' : 'text-gray-400 hover:text-gray-600'
    }`}
  >
    <Icon size={24} strokeWidth={active ? 2.5 : 2} />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default App;
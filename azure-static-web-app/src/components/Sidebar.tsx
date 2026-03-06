import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Users, 
  Newspaper,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const menuItems = [
  { path: '/', icon: Home, label: 'Overzicht', description: 'Dashboard en statistieken' },
  { path: '/kennisbank', icon: BookOpen, label: 'Kennisbank', description: 'Zoek en beheer kennis' },
  { path: '/cases', icon: Award, label: 'Case Studies', description: 'Succesverhalen' },
  { path: '/trends', icon: TrendingUp, label: 'Trends & Insights', description: 'Branche ontwikkelingen' },
  { path: '/team', icon: Users, label: 'Team & Expertise', description: 'Onze specialisten' },
  { path: '/nieuws', icon: Newspaper, label: 'Intern Nieuws', description: 'Bedrijfsupdates' },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();

  return (
    <>
      {/* Collapsed state - alleen toggle knop */}
      {isCollapsed && (
        <div className="w-16 bg-gray-900 flex flex-col items-center py-4">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-3 hover:bg-gray-800 rounded-lg text-white transition-colors mb-8"
            aria-label="Open menu"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Expanded sidebar */}
      {!isCollapsed && (
        <div className="w-64 bg-gray-900 text-white flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Buro Staal</h2>
              <p className="text-sm text-gray-400">Kennisbank</p>
            </div>
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Sluit menu"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer - Admin link */}
          <div className="p-4 border-t border-gray-800">
            <Link
              to="/admin"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                location.pathname === '/admin'
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Admin Panel</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

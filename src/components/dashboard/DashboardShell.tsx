'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, CreditCard, Users, Settings, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export function DashboardShell({ user, children }: { user: any, children: React.ReactNode }) {
  const pathname = usePathname();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const navItems = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'My Card', href: '/dashboard/card', icon: CreditCard },
    { name: 'Leads', href: '/dashboard/leads', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Top Bar for Mobile */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-10">
        <div className="font-bold text-xl text-primary">BizCard</div>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
          {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
        </div>
      </div>

      {/* Sidebar for Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r min-h-screen sticky top-0">
        <div className="p-6 border-b">
          <div className="font-bold text-2xl text-primary">BizCard</div>
        </div>
        <div className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3 mb-4 px-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
              {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <div className="font-medium truncate">{user.user_metadata?.full_name || 'User'}</div>
              <div className="text-xs text-gray-500 truncate">{user.email}</div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0 relative">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Bottom Nav for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3 pb-safe z-20">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center space-y-1 p-2 ${
                isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'fill-primary/20' : ''}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

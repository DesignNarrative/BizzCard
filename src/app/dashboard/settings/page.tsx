'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { LogOut, Copy, ExternalLink, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: cardData } = await supabase
          .from('cards')
          .select('id, is_active')
          .eq('user_id', user.id)
          .single();
        
        setCard(cardData);
      }
      setLoading(false);
    }
    load();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const toggleCardStatus = async () => {
    if (!card) return;
    setIsUpdating(true);
    const newStatus = !card.is_active;
    
    const { error } = await supabase
      .from('cards')
      .update({ is_active: newStatus })
      .eq('id', card.id);
      
    if (!error) {
      setCard({ ...card, is_active: newStatus });
      toast.success(`Card ${newStatus ? 'activated' : 'paused'}`);
    } else {
      toast.error('Failed to update status');
    }
    setIsUpdating(false);
  };

  const copyLink = () => {
    if (!card) return;
    const url = `${window.location.origin}/c/${card.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile Section */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Account</h2>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-2xl font-bold">
            {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="font-medium text-lg">{user?.user_metadata?.full_name || 'User'}</div>
            <div className="text-gray-500">{user?.email}</div>
          </div>
        </div>
        
        <div className="flex justify-between items-center py-3 border-t">
          <div>
            <div className="font-medium">Current Plan</div>
            <div className="text-sm text-gray-500">Free Tier</div>
          </div>
          <button className="text-primary text-sm font-medium hover:underline">Upgrade</button>
        </div>
      </div>

      {/* Card Settings */}
      {card && (
        <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6">
          <h2 className="text-lg font-semibold border-b pb-2">Card Settings</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Card Status</div>
              <div className="text-sm text-gray-500">
                {card.is_active ? 'Your card is publicly visible.' : 'Your card is currently paused and hidden.'}
              </div>
            </div>
            <button
              onClick={toggleCardStatus}
              disabled={isUpdating}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${card.is_active ? 'bg-primary' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${card.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="space-y-2">
            <div className="font-medium text-gray-900">Your Card Link</div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-50 p-3 rounded-lg border text-sm text-gray-600 truncate font-mono">
                {window.location.origin}/c/{card.id}
              </div>
              <button 
                onClick={copyLink}
                className="p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center min-w-[48px]"
              >
                {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
              </button>
              <a 
                href={`/c/${card.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors flex items-center justify-center min-w-[48px]"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
        <h2 className="text-lg font-semibold text-red-600 mb-4 border-b border-red-50 pb-2">Danger Zone</h2>
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 text-red-600 font-medium px-4 py-2 hover:bg-red-50 rounded-lg transition-colors w-full justify-center border border-red-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}

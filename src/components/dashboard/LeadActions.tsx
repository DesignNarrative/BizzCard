'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Phone, MessageCircle, Save } from 'lucide-react';
import { toast } from 'sonner';

type LeadActionsProps = {
  lead: {
    id: string;
    phone: string;
    status: string;
    notes: string;
  }
};

const STATUS_OPTIONS = ['New', 'Contacted', 'Converted', 'Not Interested'];

export function LeadActions({ lead }: LeadActionsProps) {
  const supabase = createClient();
  const [status, setStatus] = useState(lead.status || 'New');
  const [notes, setNotes] = useState(lead.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from('leads')
      .update({ status, notes, updated_at: new Date().toISOString() })
      .eq('id', lead.id);

    setIsSaving(false);
    if (error) {
      toast.error('Failed to update lead');
    } else {
      toast.success('Lead updated successfully');
    }
  };

  const cleanPhone = lead.phone ? lead.phone.replace(/\D/g, '') : '';

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-3">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <a 
          href={`tel:${cleanPhone}`}
          className={`flex items-center justify-center space-x-2 w-full py-3 rounded-xl font-medium transition-colors ${
            cleanPhone ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
          onClick={(e) => !cleanPhone && e.preventDefault()}
        >
          <Phone className="w-5 h-5" />
          <span>Call Lead</span>
        </a>
        <a 
          href={`https://wa.me/${cleanPhone}`}
          target="_blank" rel="noopener noreferrer"
          className={`flex items-center justify-center space-x-2 w-full py-3 rounded-xl font-medium transition-colors ${
            cleanPhone ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-gray-50 text-gray-400 cursor-not-allowed'
          }`}
          onClick={(e) => !cleanPhone && e.preventDefault()}
        >
          <MessageCircle className="w-5 h-5" />
          <span>WhatsApp</span>
        </a>
      </div>

      {/* Status & Notes */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select 
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50"
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Private Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Add notes about this lead..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50 resize-none text-sm"
          ></textarea>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center space-x-2 bg-gray-900 text-white py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Updates'}</span>
        </button>
      </div>
    </div>
  );
}

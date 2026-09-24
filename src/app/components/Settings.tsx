import React, { useState } from 'react';
import { ChevronRight, Building2, Settings as SettingsIcon, Tags, Upload, Trash2, Users, FileText } from 'lucide-react';
import Frame18 from '../imports/Frame1984077723';

interface SettingsProps {
  onClose?: () => void;
}

type SettingsSection = 
  | 'business-profile'
  | 'general'
  | 'tags-attributes'
  | 'import-export'
  | 'message-deletion'
  | 'team-inbox-settings'
  | 'attribute-settings';

export function Settings({ onClose }: SettingsProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('team-inbox-settings');

  const sidebarItems = [
    { id: 'business-profile', label: 'Business Profile', icon: Building2 },
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'tags-attributes', label: 'Tags and Attributes', icon: Tags },
    { id: 'import-export', label: 'Import/Export chats', icon: Upload },
    { id: 'message-deletion', label: 'Message Deletion', icon: Trash2 },
    { id: 'team-inbox-settings', label: 'Team Inbox Settings', icon: Users },
    { id: 'attribute-settings', label: 'Attribute Settings', icon: FileText },
  ];

  return (
    <div className="flex h-full bg-white">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Settings</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as SettingsSection)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                  isActive
                    ? 'bg-green-50 text-green-700 border-r-2 border-green-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-[640px] overflow-y-auto bg-white">
        {activeSection === 'team-inbox-settings' && (
          <div className="p-6">
            <Frame18 />
          </div>
        )}

        {/* Other sections placeholder */}
        {activeSection !== 'team-inbox-settings' && (
          <div className="p-6">
            <h1 className="text-xl font-semibold text-gray-900 mb-4">
              {sidebarItems.find(item => item.id === activeSection)?.label}
            </h1>
            <div className="text-center text-gray-500 py-12">
              This section is under development
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
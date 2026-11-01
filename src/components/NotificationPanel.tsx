import React from 'react';
import { 
  X, 
  Bell, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { AppNotification, Language } from '../types';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onViewScheme: (schemeId: string) => void;
  language: Language;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onViewScheme,
  language
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl border-l border-stone-200 flex flex-col animate-slideIn">
      
      {/* Header */}
      <div className="p-4 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-700" />
          <h3 className="text-sm font-bold text-stone-900">
            Government Scheme Alerts
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:text-stone-900"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-xs text-stone-400">
            No active alerts at this moment.
          </div>
        ) : (
          notifications.map(notif => {
            const title = language === 'ta' && notif.title_ta ? notif.title_ta : language === 'hi' && notif.title_hi ? notif.title_hi : notif.title;
            const message = language === 'ta' && notif.message_ta ? notif.message_ta : language === 'hi' && notif.message_hi ? notif.message_hi : notif.message;

            return (
              <div
                key={notif.id}
                onClick={() => onMarkRead(notif.id)}
                className={`p-3.5 rounded-xl border text-xs transition-all space-y-1.5 ${
                  notif.isRead 
                    ? 'bg-white border-stone-200 opacity-80' 
                    : 'bg-emerald-50/50 border-emerald-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    notif.priority === 'high' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {notif.type === 'deadline' ? 'Deadline' : notif.type === 'broadcast' ? 'Announcement' : 'Scheme Alert'}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">{notif.createdAt}</span>
                </div>

                <h4 className="font-bold text-stone-900">
                  {title}
                </h4>

                <p className="text-[11px] text-stone-600 leading-relaxed">
                  {message}
                </p>

                {notif.schemeId && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewScheme(notif.schemeId!);
                      onClose();
                    }}
                    className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 pt-1"
                  >
                    <span>View Scheme Guidelines</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSessionToken } from '../utils/sessions';
import { X, Bell, Check, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const API_BASE_URL = 'http://localhost:8080/api';

const NotificationsModal = ({ isOpen, onClose, userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread', or 'read'
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const isTurkish = currentLanguage === 'tr';
  
  // Helper function to get localized notification content
  const getLocalizedNotificationContent = (notification) => {
    if (isTurkish && notification.titleTr && notification.messageTr) {
      return {
        title: notification.titleTr,
        message: notification.messageTr
      };
    }
    return {
      title: notification.title,
      message: notification.message
    };
  };

  // Fetch notifications when modal opens or language changes
  useEffect(() => {
    if (isOpen && userId) {
      fetchNotifications();
    }
  }, [isOpen, userId, activeTab, currentLanguage]);

  // Fetch notifications based on active tab
  const fetchNotifications = async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = useSessionToken();
      let endpoint = `${API_BASE_URL}/notifications/all`;
      
      if (activeTab === 'unread') {
        endpoint = `${API_BASE_URL}/notifications/unread`;
      }
      
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setNotifications(response.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(t('notifications.error.load'));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle notification click - mark as read and navigate to /my-tickets
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        const token = useSessionToken();
        await axios.put(`${API_BASE_URL}/notifications/${notification.id}/read`, { isRead: true }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        // Update local state
        setNotifications(notifications.map(notif => 
          notif.id === notification.id ? { ...notif, isRead: true } : notif
        ));
      } catch (err) {
        console.error('Error marking notification as read:', err);
        setError(t('notifications.error.update'));
      }
    }
  
    // Only navigate and close modal if not a broadcast notification
    if (notification.type !== 'BROADCAST') {
      // Close the modal
      onClose();
      
      // Navigate to /my-tickets page
      navigate('/my-tickets');
    }
  };

  // Mark notification as read
  const markAsRead = async (id, event) => {
    // Stop event propagation to prevent the modal backdrop from closing
    event.stopPropagation();
    
    try {
      const token = useSessionToken();
      await axios.put(`${API_BASE_URL}/notifications/${id}/read`, { isRead: true }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      // Update local state
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError(t('notifications.error.update'));
    }
  };

  // Mark notification as unread
  const markAsUnread = async (id, event) => {
    // Stop event propagation to prevent the modal backdrop from closing
    event.stopPropagation();
    
    try {
      const token = useSessionToken();
      await axios.put(`${API_BASE_URL}/notifications/${id}/read`, { isRead: false }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      // Update local state
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, isRead: false } : notif
      ));
    } catch (err) {
      console.error('Error marking notification as unread:', err);
      setError(t('notifications.error.update'));
    }
  };

  // Mark all as read
  const markAllAsRead = async (event) => {
    // Stop event propagation to prevent the modal backdrop from closing
    event.stopPropagation();
    
    try {
      await axios.put(`${API_BASE_URL}/notifications/read-all`, {}, {
        headers: {
          Authorization: `Bearer ${useSessionToken()}`,
        }
      });
      // Update local state
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
      setError(t('notifications.error.update'));
    }
  };

  // Delete notification
  const deleteNotification = async (id, event) => {
    // Stop event propagation to prevent the modal backdrop from closing
    event.stopPropagation();
    const token = useSessionToken();
    try {
      await axios.delete(`${API_BASE_URL}/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      // Update local state
      setNotifications(notifications.filter(notif => notif.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError(t('notifications.error.delete'));
    }
  };

  // Get notification icon color based on type
  const getNotificationColor = (type) => {
    switch (type) {
      case 'TICKET_CREATED':
        return 'text-green-600';
      case 'TICKET_UPDATED':
        return 'text-blue-600';
      case 'VOYAGE_CANCELLED':
        return 'text-red-600';
      case 'VOYAGE_DELAYED':
        return 'text-yellow-600';
      case 'BROADCAST':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  // Filter notifications based on the active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !notification.isRead;
    if (activeTab === 'read') return notification.isRead;
    return true;
  });

  // Handle modal backdrop click without closing it when clicking content
  const handleModalClick = (event) => {
    // Only close if clicking directly on the backdrop
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center"
      onClick={handleModalClick}
    >
      <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>

      {/* Modal panel */}
      <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all max-w-lg w-full sm:max-w-xl md:max-w-2xl mx-4" onClick={e => e.stopPropagation()}>
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-[#0D3A73]">{t('notifications.title')}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-4">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'all'
                  ? 'border-b-2 border-[#0D3A73] text-[#0D3A73]'
                  : 'text-gray-500 hover:text-[#0D3A73]'
              }`}
              onClick={() => setActiveTab('all')}
            >
              {t('notifications.tabs.all')}
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'unread'
                  ? 'border-b-2 border-[#0D3A73] text-[#0D3A73]'
                  : 'text-gray-500 hover:text-[#0D3A73]'
              }`}
              onClick={() => setActiveTab('unread')}
            >
              {t('notifications.tabs.unread')}
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'read'
                  ? 'border-b-2 border-[#0D3A73] text-[#0D3A73]'
                  : 'text-gray-500 hover:text-[#0D3A73]'
              }`}
              onClick={() => setActiveTab('read')}
            >
              {t('notifications.tabs.read')}
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end mb-4">
            <button
              onClick={(e) => markAllAsRead(e)}
              className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition-colors mr-2"
              disabled={!notifications.some(n => !n.isRead)}
            >
              {t('notifications.actions.markAllRead')}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Notification content area */}
          <div className="max-h-96 overflow-y-auto">
            {/* Loading state */}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D3A73]"></div>
              </div>
            ) : (
              <>
                {/* Empty state */}
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Bell size={48} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">{t('notifications.empty')}</p>
                  </div>
                ) : (
                  /* Notification list */
                  <div className="space-y-4">
                    {filteredNotifications.map(notification => {
                      // Get localized content based on current language
                      const { title, message } = getLocalizedNotificationContent(notification);
                      
                      return (
                        <div 
                          key={notification.id}
                          className={`border rounded-lg overflow-hidden ${
                            notification.isRead ? 'bg-white' : 'bg-blue-50'
                          } cursor-pointer`}
                        >
                          <div 
                            className="p-4"
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex items-start">
                              <div className={`mr-4 ${getNotificationColor(notification.type)}`}>
                                <Bell size={20} />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{title}</h3>
                                <p className="text-gray-600 text-sm mt-1">{message}</p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {new Date(notification.createdAt).toLocaleString(
                                    isTurkish ? 'tr-TR' : undefined
                                  )}
                                </p>
                              </div>
                              <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
                                {notification.isRead ? (
                                  <button
                                    onClick={(e) => markAsUnread(notification.id, e)}
                                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                    title={t('notifications.actions.markAsUnread')}
                                  >
                                    <Check size={16} />
                                  </button>
                                ) : (
                                  <button
                                    onClick={(e) => markAsRead(notification.id, e)}
                                    className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                    title={t('notifications.actions.markAsRead')}
                                  >
                                    <Check size={16} />
                                  </button>
                                )}
                                <button
                                  onClick={(e) => deleteNotification(notification.id, e)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                                  title={t('notifications.actions.delete')}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
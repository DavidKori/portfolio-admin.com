import React, { useState, useEffect, useContext } from 'react';
import { messagesAPI } from '../api/axios';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../hooks/useToast';
import { formatDateTime, truncateText } from '../utils/helpers';
import { UnreadContext } from '../context/unreadContext';
import '../styles/section.css';

const Messages = () => {
   const { unreadCount, setUnreadCount } = useContext(UnreadContext);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'read', 'unread'
  const { showSuccess, showError } = useToast();
  const [unreadMessagesLength,setUnreadMessagesLength] = useState(0);

  useEffect(() => {
    fetchMessages();
  }, []);


  useEffect(() => {
    filterMessages();
  }, [messages, searchTerm, filter]);

  const fetchMessages = async () => {
    try {
      const response = await messagesAPI.getAll();
      const response1 = await messagesAPI.getUnread();
      setMessages(response.data || []);
      setUnreadMessagesLength(response1.data.length || 0);
      setUnreadCount(response1.data.length || 0)
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = [...messages];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(msg =>
        msg.name?.toLowerCase().includes(term) ||
        msg.email?.toLowerCase().includes(term) ||
        msg.message?.toLowerCase().includes(term)
      );
    }

    // Apply read/unread filter
    if (filter === 'read') {
      filtered = filtered.filter(msg => msg.read);
    } else if (filter === 'unread') {
      filtered = filtered.filter(msg => !msg.read);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredMessages(filtered);
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await messagesAPI.markAsRead(messageId);
      setMessages(prev => prev.map(msg =>
        msg._id === messageId ? { ...msg, read: true } : msg
      ));
      showSuccess('Message marked as read');
    } catch (error) {
      showError('Failed to mark message as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadMessages = messages.filter(msg => !msg.read);
      console.log(unreadMessages)
      await Promise.all(unreadMessages.map(msg => messagesAPI.markAsRead(msg._id)));
      
      setMessages(prev => prev.map(msg => ({ ...msg, read: true })));
      setUnreadMessagesLength(0);
      setUnreadCount(0)
      showSuccess('All messages marked as read');
    } catch (error) {
      showError('Failed to mark all messages as read');
    }
  };

  const handleDelete = async () => {
    if (!messageToDelete) return;
    
    try {
      await messagesAPI.delete(messageToDelete._id);
      setMessages(prev => prev.filter(msg => msg._id !== messageToDelete._id));
      if (!messageToDelete.read){
        setUnreadMessagesLength(unreadMessagesLength - 1);
        setUnreadCount(unreadCount - 1)
      }
      showSuccess('Message deleted successfully');
      
      // If we're viewing the message being deleted, clear the view
      if (selectedMessage && selectedMessage._id === messageToDelete._id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      showError('Failed to delete message');
    } finally {
      setMessageToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleSelectMessage = async (message) => {
    setSelectedMessage(message);
    
    // Mark as read if it's unread
    if (!message.read) {
      await handleMarkAsRead(message._id);
      setUnreadMessagesLength(unreadMessagesLength-1);
      setUnreadCount(unreadCount - 1)
    }
  };

  const getUnreadCount = () => {
    return messages.filter(msg => !msg.read).length;
  };

  if (loading) {
    return <div className="section-loading">Loading messages...</div>;
  }

  return (
    <div className="section-container">
      <div className="section-header">
        <h1>Messages</h1>
        <p>Manage messages from portfolio visitors</p>
      </div>

      <div className="section-content">
        <div className="messages-controls">
          <div className="search-filter">
            <input
              type="text"
              placeholder=" 🔍 Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
            
            <button
              onClick={handleMarkAllAsRead}
              className="btn-secondary"
              disabled={getUnreadCount() === 0}
            >
              Mark All as Read
            </button>
          </div>
          {unreadMessagesLength!==0 && (
            <div className='unreadMsg-container'>
              <span>{unreadMessagesLength} New Messages </span> 
            </div>
          )}
        </div>

        <div className="messages-layout">
          <div className="messages-list">
            {filteredMessages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✉️</div>
                <h3>No Messages Found</h3>
                <p>
                  {searchTerm || filter !== 'all'
                    ? 'No messages match your search criteria'
                    : 'No messages yet. They will appear here when visitors contact you.'
                  }
                </p>
              </div>
            ) : (
              <div className="messages-container">
                {filteredMessages.map((message) => (
                  <div
                    key={message._id}
                    className={`message-item ${!message.read ? 'unread' : ''} ${selectedMessage?._id === message._id ? 'selected' : ''}`}
                    onClick={() => handleSelectMessage(message)}
                  >
                    <div className="message-header">
                      <div className="message-sender">
                        <div className="sender-name">{message.name}</div>
                        <div className="sender-email">{message.email}</div>
                      </div>
                      <div className="message-time">
                        {formatDateTime(message.createdAt)}
                      </div>
                    </div>
                    
                    <div className="message-preview">
                      {truncateText(message.message, 100)}
                    </div>
                    
                    {!message.read && (
                      <div className="unread-badge">New</div>
                    )}
                    
                    <div className="message-actions">
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMessageToDelete(message);
                          setShowDeleteModal(true);
                        }}
                        title="Delete message"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="message-detail">
            {selectedMessage ? (
              <div className="detail-card">
                <div className="detail-header">
                  <h3>Message from {selectedMessage.name}</h3>
                  <button
                    className="close-detail"
                    onClick={() => setSelectedMessage(null)}
                  >
                    ✕
                  </button>
                </div>
                
                <div className="detail-meta">
                  <div className="meta-item">
                    <strong>Email:</strong> {selectedMessage.email}
                  </div>
                  <div className="meta-item">
                    <strong>Sent:</strong> {formatDateTime(selectedMessage.createdAt)}
                  </div>
                  <div className="meta-item">
                    <strong>Status:</strong> 
                    <span className={`status-badge ${selectedMessage.read ? 'read' : 'unread'}`}>
                      {selectedMessage.read ? 'Read' : 'Unread'}
                    </span>
                  </div>
                </div>
                
                <div className="detail-content">
                  <p>{selectedMessage.message}</p>
                </div>
                
                <div className="detail-actions">
                  <a
                    href={`https://mail.google.com/mail/?view=cm&to=${selectedMessage.email}.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="reply-btn"
                  >
                    Reply via Email
                  </a>

                  <button
                    className="btn-delete"
                    onClick={() => {
                      setMessageToDelete(selectedMessage);
                      setShowDeleteModal(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="select-message-prompt">
                <div className="prompt-icon">👈</div>
                <h3>Select a Message</h3>
                <p>Click on a message from the list to view its details here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete Message"
      />
    </div>
  );
};

export default Messages;
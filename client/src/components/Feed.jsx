import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, Share2, PlusCircle, Loader2, X, Image as ImageIcon, Send, UserPlus } from 'lucide-react';
import axios from 'axios';
import './Components.css';

const Feed = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newStory, setNewStory] = useState({ content: '', location: '', imageUrl: '' });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const response = await axios.get('/api/stories');
      setStories(response.data);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      await axios.post('/api/stories', newStory);
      setNewStory({ content: '', location: '', imageUrl: '' });
      setShowCreateModal(false);
      fetchStories();
    } catch (error) {
      console.error("Posting story failed:", error);
    } finally {
      setPosting(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      await axios.post(`/api/social/follow/${userId}`);
      // Optional: Update UI to show following status
    } catch (error) {
      console.error("Follow failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="loader-container">
        <Loader2 className="spinner" size={40} />
      </div>
    );
  }

  return (
    <div className="feed-container">
      <header className="page-header">
        <h1>Travel Feed</h1>
        <button className="create-post-btn" onClick={() => setShowCreateModal(true)}>
          <PlusCircle size={20} />
          <span>Post Story</span>
        </button>
      </header>

      <div className="stories-grid">
        {stories.length > 0 ? stories.map(story => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="story-card"
          >
            <div className="story-header">
              <div className="user-avatar">{story.user?.userName?.charAt(0) || 'U'}</div>
              <div className="user-meta">
                <span className="user-name">{story.user?.fullName || story.user?.userName || 'Traveler'}</span>
                <span className="story-location">{story.location}</span>
              </div>
              <button
                className="follow-btn-sm"
                onClick={() => handleFollow(story.userId)}
              >
                <UserPlus size={16} />
              </button>
            </div>

            {story.imageUrl && <img src={story.imageUrl} alt={story.location} className="story-image" />}

            <div className="story-content">
              <p>{story.content}</p>
            </div>

            <div className="story-actions">
              <button className="action-btn">
                <Heart size={20} />
                <span>{story.likes || 0}</span>
              </button>
              <button className="action-btn">
                <MessageSquare size={20} />
                <span>{story.comments || 0}</span>
              </button>
              <button className="action-btn ml-auto">
                <Share2 size={20} />
              </button>
            </div>
          </motion.div>
        )) : (
          <div className="no-data">
            <p>No stories yet. Be the first to share your journey!</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="booking-modal"
              onClick={e => e.stopPropagation()}
            >
              <button className="close-btn" onClick={() => setShowCreateModal(false)}><X size={24} /></button>
              <div className="modal-header">
                <h2>Share Your Experience</h2>
              </div>
              <form onSubmit={handleCreateStory} className="modal-content">
                <div className="card-form">
                  <input
                    type="text"
                    placeholder="Location (e.g. Kyoto, Japan)"
                    value={newStory.location}
                    onChange={e => setNewStory({ ...newStory, location: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Image URL (Optional)"
                    value={newStory.imageUrl}
                    onChange={e => setNewStory({ ...newStory, imageUrl: e.target.value })}
                  />
                  <textarea
                    placeholder="What's on your mind?"
                    rows="5"
                    className="story-textarea"
                    value={newStory.content}
                    onChange={e => setNewStory({ ...newStory, content: e.target.value })}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="confirm-btn" disabled={posting}>
                  {posting ? <Loader2 className="spinner" size={20} /> : <><Send size={18} /> Post Now</>}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Feed;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, MapPin, Settings, Heart, Calendar, Award, Edit3, Loader2, Camera, Plus, Save, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../AuthContext';
import './Profile.css';

const ProfilePage = () => {
    const { user: authUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings');
    const [stats, setStats] = useState({ bookings: 0, saved: 0, followers: 0 });
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ fullName: '', bio: '', interests: [] });
    const [savedPlaces, setSavedPlaces] = useState([]);
    const [myBookings, setMyBookings] = useState([]);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            const [profileRes, savedRes, bookingsRes] = await Promise.all([
                axios.get('/api/profiles/me'),
                axios.get('/api/social/saved'),
                axios.get('/api/bookings/my')
            ]);

            const profData = profileRes.data;
            setProfile(profData);
            setEditForm({
                fullName: profData.fullName || '',
                bio: profData.bio || '',
                interests: profData.interests || []
            });
            setSavedPlaces(savedRes.data);
            setMyBookings(bookingsRes.data);
            setStats({
                saved: savedRes.data.length,
                bookings: bookingsRes.data.length,
                followers: 124 // Mock
            });
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await axios.put('/api/profiles/me', editForm);
            setProfile({ ...profile, ...editForm });
            setIsEditing(false);
        } catch (error) {
            console.error("Update failed:", error);
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
        <div className="profile-container">
            <header className="profile-header">
                <div className="cover-photo">
                    <div className="edit-cover"><Camera size={18} /></div>
                </div>

                <div className="profile-main-info">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar">
                            {profile?.fullName?.charAt(0) || authUser?.name?.charAt(0)}
                        </div>
                        <button className="avatar-edit"><Camera size={14} /></button>
                    </div>

                    <div className="profile-text">
                        {isEditing ? (
                            <form className="edit-profile-form" onSubmit={handleUpdateProfile}>
                                <input
                                    type="text"
                                    value={editForm.fullName}
                                    onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                                    placeholder="Full Name"
                                />
                                <textarea
                                    value={editForm.bio}
                                    onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                                    placeholder="Tell your travel story..."
                                />
                                <div className="edit-actions">
                                    <button type="submit" className="save-submit-btn"><Save size={16} /> Save Changes</button>
                                    <button type="button" className="cancel-edit-btn" onClick={() => setIsEditing(false)}><X size={16} /> Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <>
                                <div className="name-row">
                                    <h1>{profile?.fullName || authUser?.name}</h1>
                                    {profile?.isVerified && <Award size={20} className="verified-icon" />}
                                    <button className="edit-profile-btn" onClick={() => setIsEditing(true)}>
                                        <Edit3 size={16} /> Edit Profile
                                    </button>
                                </div>
                                <p className="user-handle">@{authUser?.email?.split('@')[0]}</p>
                                <p className="user-bio">{profile?.bio || "No bio yet. Tell the world about your travels!"}</p>

                                <div className="interests-tags">
                                    {profile?.interests?.map(interest => (
                                        <span key={interest} className="interest-tag">{interest}</span>
                                    ))}
                                    <button className="add-interest"><Plus size={14} /></button>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="profile-stats">
                        <div className="stat-item">
                            <span className="stat-value">{stats.bookings}</span>
                            <span className="stat-label">Trips</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{stats.saved}</span>
                            <span className="stat-label">Saved</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{stats.followers}</span>
                            <span className="stat-label">Followers</span>
                        </div>
                    </div>
                </div>
            </header>

            <nav className="profile-nav">
                <button
                    className={`nav-tab ${activeTab === 'bookings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('bookings')}
                >
                    <Calendar size={18} /> My Bookings
                </button>
                <button
                    className={`nav-tab ${activeTab === 'saved' ? 'active' : ''}`}
                    onClick={() => setActiveTab('saved')}
                >
                    <Heart size={18} /> Wishlist
                </button>
                <button className="nav-tab settings-tab">
                    <Settings size={18} /> Settings
                </button>
            </nav>

            <div className="profile-content">
                <AnimatePresence mode="wait">
                    {activeTab === 'bookings' ? (
                        <motion.div
                            key="bookings"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="tab-content"
                        >
                            {myBookings.length > 0 ? (
                                <div className="profile-grid">
                                    {myBookings.map(b => (
                                        <div key={b.id} className="mini-card">
                                            <img src={b.destination?.imageUrl} alt={b.destination?.name} />
                                            <div className="mini-card-info">
                                                <h4>{b.destination?.name}</h4>
                                                <span>{new Date(b.bookingDate).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="tab-placeholder">Your upcoming and past adventures will appear here.</p>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="saved"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="tab-content"
                        >
                            {savedPlaces.length > 0 ? (
                                <div className="profile-grid">
                                    {savedPlaces.map(s => (
                                        <div key={s.id} className="mini-card">
                                            <img src={s.destination?.imageUrl} alt={s.destination?.name} />
                                            <div className="mini-card-info">
                                                <h4>{s.destination?.name}</h4>
                                                <span className="price-tag">${s.destination?.price}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="tab-placeholder">Destinations you've saved for later.</p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProfilePage;

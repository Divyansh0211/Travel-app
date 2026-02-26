import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, Loader2 } from 'lucide-react';
import axios from 'axios';
import './Components.css';

const ReviewSection = ({ destinationId }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [posting, setPosting] = useState(false);

    useEffect(() => {
        fetchReviews();
    }, [destinationId]);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`/api/social/reviews/${destinationId}`);
            setReviews(response.data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPosting(true);
        try {
            await axios.post('/api/social/review', {
                destinationId,
                rating: newReview.rating,
                comment: newReview.comment
            });
            setNewReview({ rating: 5, comment: '' });
            fetchReviews();
        } catch (error) {
            console.error("Posting review failed:", error);
        } finally {
            setPosting(false);
        }
    };

    if (loading) return <Loader2 className="spinner" />;

    return (
        <div className="reviews-section">
            <div className="section-header">
                <h3><MessageSquare size={20} /> Traveler Reviews</h3>
                <span>{reviews.length} Reviews</span>
            </div>

            <form className="review-form" onSubmit={handleSubmit}>
                <div className="rating-selector">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                            className={newReview.rating >= star ? 'star-active' : ''}
                        >
                            <Star size={20} fill={newReview.rating >= star ? '#fbbf24' : 'transparent'} />
                        </button>
                    ))}
                </div>
                <div className="input-group">
                    <textarea
                        placeholder="Share your experience..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        required
                    />
                    <button type="submit" disabled={posting}>
                        {posting ? <Loader2 className="spinner" size={18} /> : <Send size={18} />}
                    </button>
                </div>
            </form>

            <div className="reviews-list">
                {reviews.map(review => (
                    <div key={review.id} className="review-card">
                        <div className="review-header">
                            <div className="review-user">
                                <div className="user-avatar-sm">{review.user?.userName?.charAt(0) || 'U'}</div>
                                <span>{review.user?.fullName || review.user?.userName || 'Traveler'}</span>
                            </div>
                            <div className="review-stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} fill={i < review.rating ? '#fbbf24' : 'transparent'} />
                                ))}
                            </div>
                        </div>
                        <p className="review-text">{review.comment}</p>
                    </div>
                ))}
                {reviews.length === 0 && <p className="no-data-sm">No reviews yet. Be the first to rate!</p>}
            </div>
        </div>
    );
};

export default ReviewSection;

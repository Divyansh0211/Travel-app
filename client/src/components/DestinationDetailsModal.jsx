import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Star, Share2, Info, Navigation, Calendar } from 'lucide-react';
import ReviewSection from './ReviewSection';
import './Components.css';

const DestinationDetailsModal = ({ destination, onClose, onBook }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                className="dest-details-modal"
                onClick={e => e.stopPropagation()}
            >
                <button className="close-btn" onClick={onClose}><X size={24} /></button>

                <div className="dest-details-grid">
                    <div className="dest-visuals">
                        <img src={destination.imageUrl} alt={destination.name} className="main-dest-img" />
                        <div className="img-overlay-info">
                            <h2>{destination.name}</h2>
                            <div className="dest-meta-pills">
                                <span className="pill"><MapPin size={14} /> {destination.description?.split(',')[1] || 'Global'}</span>
                                <span className="pill"><Star size={14} fill="#fbbf24" color="#fbbf24" /> {destination.rating || '4.8'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="dest-description-section">
                        <div className="tabs-header">
                            <button className="active-tab">About</button>
                            <button>Amenities</button>
                            <button>Location</button>
                        </div>

                        <div className="dest-text-content">
                            <p>{destination.description}</p>
                            <div className="dest-highlights">
                                <div className="highlight">
                                    <Info size={18} />
                                    <div>
                                        <span>Best Time to Visit</span>
                                        <p>October to April</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ReviewSection destinationId={destination.id} />
                    </div>
                </div>

                <div className="dest-modal-footer">
                    <div className="price-info">
                        <span>Total Price</span>
                        <p>${destination.price}/night</p>
                    </div>
                    <div className="footer-actions">
                        <button className="share-btn"><Share2 size={20} /></button>
                        <button className="book-now-btn" onClick={onBook}>
                            <Calendar size={18} /> Book Your Trip
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DestinationDetailsModal;

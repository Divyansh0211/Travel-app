import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, Filter, Loader2, Heart, Info } from 'lucide-react';
import axios from 'axios';
import BookingModal from './BookingModal';
import DestinationDetailsModal from './DestinationDetailsModal';
import './Components.css';

const Discover = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDest, setSelectedDest] = useState(null);
  const [detailsDest, setDetailsDest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('/api/destinations');
        setDestinations(response.data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const handleBookingConfirm = async (date) => {
    try {
      await axios.post('/api/bookings', {
        destinationId: selectedDest.id,
        travelDate: date
      });
      setSelectedDest(null);
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  const handleSave = async (destId) => {
    try {
      await axios.post(`/api/social/save/${destId}`);
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loader-container">
        <Loader2 className="spinner" size={40} />
      </div>
    );
  }

  return (
    <div className="discover-container">
      <header className="page-header">
        <h1>Discover Destinations</h1>
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Where do you want to go?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="filter-btn">
            <Filter size={18} />
          </button>
        </div>
      </header>

      <section className="destinations-section">
        <div className="destinations-grid">
          {filteredDestinations.length > 0 ? filteredDestinations.map(dest => (
            <motion.div
              key={dest.id}
              whileHover={{ y: -10 }}
              className="dest-card"
              onClick={() => setDetailsDest(dest)}
            >
              <div className="dest-image-wrapper">
                {dest.imageUrl && <img src={dest.imageUrl} alt={dest.name} />}
                <div className="dest-rating">
                  <Star size={14} fill="#fbbf24" color="#fbbf24" />
                  <span>{dest.rating || '4.5'}</span>
                </div>
                <button
                  className="save-btn-overlay"
                  onClick={(e) => { e.stopPropagation(); handleSave(dest.id); }}
                >
                  <Heart size={18} />
                </button>
              </div>
              <div className="dest-info">
                <h3>{dest.name}</h3>
                <div className="dest-location">
                  <MapPin size={16} />
                  <span>{dest.description?.split(',')[0]}</span>
                </div>
                <div className="dest-footer">
                  <span className="dest-price">${dest.price}/night</span>
                  <div className="card-actions">
                    <button className="info-btn-sm"><Info size={16} /></button>
                    <button className="book-btn" onClick={(e) => { e.stopPropagation(); setSelectedDest(dest); }}>Book Now</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="no-data">
              <p>No destinations found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {detailsDest && (
          <DestinationDetailsModal
            destination={detailsDest}
            onClose={() => setDetailsDest(null)}
            onBook={() => {
              setSelectedDest(detailsDest);
              setDetailsDest(null);
            }}
          />
        )}
        {selectedDest && (
          <BookingModal
            destination={selectedDest}
            onClose={() => setSelectedDest(null)}
            onConfirm={handleBookingConfirm}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Discover;

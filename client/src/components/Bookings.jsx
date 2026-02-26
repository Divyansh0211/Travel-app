import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plane, CheckCircle, Clock, MoreVertical, MapPin, Loader2 } from 'lucide-react';
import axios from 'axios';
import './Components.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/bookings/my');
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="loader-container">
        <Loader2 className="spinner" size={40} />
      </div>
    );
  }

  return (
    <div className="bookings-container">
      <header className="page-header">
        <h1>My Bookings</h1>
      </header>

      <div className="bookings-list">
        {bookings.length > 0 ? bookings.map(booking => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="booking-card"
          >
            {booking.destination?.imageUrl && (
              <img src={booking.destination.imageUrl} alt={booking.destination.name} className="booking-thumb" />
            )}

            <div className="booking-main">
              <div className="booking-header">
                <span className="booking-id">BK-{booking.id}</span>
                <span className="status-badge confirmed">
                  <CheckCircle size={14} /> Confirmed
                </span>
              </div>

              <div className="booking-info">
                <h3>{booking.destination?.name || 'Unknown Destination'}</h3>
                <div className="info-row">
                  <MapPin size={16} />
                  <span>{new Date(booking.travelDate).toLocaleDateString()}</span>
                </div>
                <div className="info-row">
                  <Plane size={16} />
                  <span>Flight + Stay</span>
                </div>
              </div>
            </div>

            <div className="booking-side">
              <span className="booking-price">${booking.destination?.price || '0'}</span>
              <button className="manage-btn">
                <MoreVertical size={20} />
              </button>
            </div>
          </motion.div>
        )) : (
          <div className="no-data">
            <p>You have no active bookings.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;

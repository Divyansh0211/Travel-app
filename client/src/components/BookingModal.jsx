import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, ChevronLeft, ChevronRight, CreditCard, CheckCircle, ShieldCheck } from 'lucide-react';
import './BookingModal.css';

const BookingModal = ({ destination, onClose, onConfirm }) => {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState(null);

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const renderCalendar = () => {
        const totalDays = daysInMonth(currentMonth, currentYear);
        const firstDay = firstDayOfMonth(currentMonth, currentYear);
        const days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        for (let d = 1; d <= totalDays; d++) {
            const isSelected = selectedDate &&
                selectedDate.getDate() === d &&
                selectedDate.getMonth() === currentMonth &&
                selectedDate.getFullYear() === currentYear;

            const isPast = new Date(currentYear, currentMonth, d) < new Date().setHours(0, 0, 0, 0);

            days.push(
                <div
                    key={d}
                    className={`calendar-day ${isSelected ? 'selected' : ''} ${isPast ? 'past' : ''}`}
                    onClick={() => !isPast && setSelectedDate(new Date(currentYear, currentMonth, d))}
                >
                    {d}
                </div>
            );
        }

        return days;
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="booking-modal"
                onClick={e => e.stopPropagation()}
            >
                <button className="close-btn" onClick={onClose}><X size={24} /></button>

                <div className="modal-header">
                    <div className="dest-mini-info">
                        <img src={destination.imageUrl} alt={destination.name} />
                        <div>
                            <h3>{destination.name}</h3>
                            <p>${destination.price}/night</p>
                        </div>
                    </div>
                    <div className="stepper">
                        <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
                        <div className="step-line"></div>
                        <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                        <div className="step-line"></div>
                        <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
                    </div>
                </div>

                <div className="modal-content">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="step-container"
                            >
                                <div className="calendar-header">
                                    <h4>Select Travel Date</h4>
                                    <div className="calendar-nav">
                                        <button onClick={handlePrevMonth}><ChevronLeft size={20} /></button>
                                        <span>{monthNames[currentMonth]} {currentYear}</span>
                                        <button onClick={handleNextMonth}><ChevronRight size={20} /></button>
                                    </div>
                                </div>
                                <div className="calendar-grid">
                                    <div className="weekday">Su</div>
                                    <div className="weekday">Mo</div>
                                    <div className="weekday">Tu</div>
                                    <div className="weekday">We</div>
                                    <div className="weekday">Th</div>
                                    <div className="weekday">Fr</div>
                                    <div className="weekday">Sa</div>
                                    {renderCalendar()}
                                </div>
                                <button
                                    className="next-btn"
                                    disabled={!selectedDate}
                                    onClick={() => setStep(2)}
                                >
                                    Continue to Payment
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="step-container"
                            >
                                <h4>Secure Payment</h4>
                                <div className="payment-summary">
                                    <div className="summary-row">
                                        <span>Stay at {destination.name}</span>
                                        <span>${destination.price}</span>
                                    </div>
                                    <div className="summary-row">
                                        <span>Service Fee</span>
                                        <span>$45</span>
                                    </div>
                                    <div className="total-row">
                                        <span>Total</span>
                                        <span>${destination.price + 45}</span>
                                    </div>
                                </div>

                                <div className="payment-methods">
                                    <div className="payment-method active">
                                        <CreditCard size={20} />
                                        <span>Credit / Debit Card</span>
                                    </div>
                                    <div className="payment-method">
                                        <span>UPI / Wallets</span>
                                    </div>
                                </div>

                                <div className="card-form">
                                    <input type="text" placeholder="Card Number" defaultValue="**** **** **** 4421" disabled />
                                    <div className="form-row">
                                        <input type="text" placeholder="MM/YY" defaultValue="12/28" disabled />
                                        <input type="text" placeholder="CVC" defaultValue="***" disabled />
                                    </div>
                                </div>

                                <div className="trust-badge">
                                    <ShieldCheck size={18} />
                                    <span>Secure 256-bit SSL Encrypted Payment</span>
                                </div>

                                <div className="action-buttons">
                                    <button className="back-btn" onClick={() => setStep(1)}>Back</button>
                                    <button className="confirm-btn" onClick={() => setStep(3)}>Confirm & Pay</button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="step-container success-step"
                            >
                                <CheckCircle size={64} color="#10b981" />
                                <h2>Booking Confirmed!</h2>
                                <p>Pack your bags for {destination.name}</p>
                                <div className="qr-box">
                                    <div className="mock-qr">
                                        <div className="qr-pixel"></div>
                                        <div className="qr-pixel"></div>
                                        <div className="qr-pixel"></div>
                                        <div className="qr-pixel"></div>
                                        <span>BK-{Math.floor(Math.random() * 9000) + 1000}</span>
                                    </div>
                                    <p className="qr-hint">Show this QR code at check-in</p>
                                </div>
                                <button className="done-btn" onClick={() => onConfirm(selectedDate)}>Go to My Bookings</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default BookingModal;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, MapPin, User, Calendar, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';

const PaymentMethod = {
  CREDIT_CARD: 'credit_card',
  UPI: 'upi',
  NET_BANKING: 'net_banking',
} as const;

type PaymentMethodType = typeof PaymentMethod[keyof typeof PaymentMethod];

const Checkout: React.FC = () => {
  const { bookingDetails, proceedToPayment, loading } = useBooking();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>(PaymentMethod.CREDIT_CARD);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [showPassengers, setShowPassengers] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!bookingDetails || bookingDetails.passengers.length === 0) {
    navigate('/');
    return null;
  }

  const formatTime = (time24: string = "00:00") => {
    if (!time24) return "00:00";
    const [hour, minute] = time24.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const validatePaymentDetails = () => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod === PaymentMethod.CREDIT_CARD) {
      if (!cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }

      if (!cardName.trim()) {
        newErrors.cardName = 'Name on card is required';
      }

      if (!cardExpiry.trim()) {
        newErrors.cardExpiry = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
        newErrors.cardExpiry = 'Expiry date must be in MM/YY format';
      }

      if (!cardCvv.trim()) {
        newErrors.cardCvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(cardCvv)) {
        newErrors.cardCvv = 'CVV must be 3 or 4 digits';
      }
    } else if (paymentMethod === PaymentMethod.UPI) {
      if (!upiId.trim()) {
        newErrors.upiId = 'UPI ID is required';
      } else if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) {
        newErrors.upiId = 'Enter a valid UPI ID (e.g., name@upi)';
      }
    } else if (paymentMethod === PaymentMethod.NET_BANKING) {
      if (!selectedBank) {
        newErrors.bank = 'Please select a bank';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validatePaymentDetails()) {
      return;
    }

    try {
      await proceedToPayment();
      alert("Payment successful!");
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '');

    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }

    setCardExpiry(value);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trip Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Trip Information</h2>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{bookingDetails.busName}</h3>
                  <p className="text-sm text-gray-500 mb-2">{bookingDetails.busType}</p>

                  <div className="flex items-center space-x-6 mt-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm">{formatDate(bookingDetails.journeyDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0 flex flex-col items-end">
                  <div className="flex items-center space-x-6">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium">{formatTime(bookingDetails.departureTime)}</span>
                      <span className="text-xs text-gray-500">{bookingDetails.source}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{formatTime(bookingDetails.arrivalTime)}</span>
                      <span className="text-xs text-gray-500">{bookingDetails.destination}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div
                className="flex items-center justify-between mb-4 cursor-pointer"
                onClick={() => setShowPassengers(!showPassengers)}
              >
                <h2 className="text-lg font-semibold text-gray-900">Passenger Details</h2>
                {showPassengers ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>

              {showPassengers && (
                <div className="space-y-4">
                  {bookingDetails.passengers.map((passenger, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-md">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-500 mr-2" />
                            <h3 className="font-medium text-gray-900">{passenger.name}</h3>
                          </div>
                          <div className="mt-1 ml-6 text-sm text-gray-500">
                            {passenger.age} years • {passenger.gender.charAt(0).toUpperCase() + passenger.gender.slice(1)}
                          </div>
                        </div>
                        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          Seat {passenger.seatNumber}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Method</h2>

              <div className="space-y-4">
                {/* Credit Card */}
                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === PaymentMethod.CREDIT_CARD}
                      onChange={() => setPaymentMethod(PaymentMethod.CREDIT_CARD)}
                      className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                    <span className="ml-2 text-gray-700">Credit / Debit Card</span>
                  </label>

                  {paymentMethod === PaymentMethod.CREDIT_CARD && (
                    <div className="mt-4 ml-6 space-y-4">
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          className={`input ${errors.cardNumber ? 'border-red-500' : ''}`}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                        {errors.cardNumber && (
                          <p className="mt-1 text-xs text-red-500">{errors.cardNumber}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className={`input ${errors.cardName ? 'border-red-500' : ''}`}
                          placeholder="John Doe"
                        />
                        {errors.cardName && (
                          <p className="mt-1 text-xs text-red-500">{errors.cardName}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            id="cardExpiry"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            className={`input ${errors.cardExpiry ? 'border-red-500' : ''}`}
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                          {errors.cardExpiry && (
                            <p className="mt-1 text-xs text-red-500">{errors.cardExpiry}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="password"
                            id="cardCvv"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            className={`input ${errors.cardCvv ? 'border-red-500' : ''}`}
                            placeholder="123"
                            maxLength={4}
                          />
                          {errors.cardCvv && (
                            <p className="mt-1 text-xs text-red-500">{errors.cardCvv}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="saveCard"
                          type="checkbox"
                          checked={saveCard}
                          onChange={() => setSaveCard(!saveCard)}
                          className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)] rounded"
                        />
                        <label htmlFor="saveCard" className="ml-2 text-sm text-gray-700">
                          Save this card for future payments
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* UPI */}
                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === PaymentMethod.UPI}
                      onChange={() => setPaymentMethod(PaymentMethod.UPI)}
                      className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                    <span className="ml-2 text-gray-700">UPI</span>
                  </label>

                  {paymentMethod === PaymentMethod.UPI && (
                    <div className="mt-4 ml-6">
                      <div>
                        <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                          UPI ID
                        </label>
                        <input
                          type="text"
                          id="upiId"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className={`input ${errors.upiId ? 'border-red-500' : ''}`}
                          placeholder="name@upi"
                        />
                        {errors.upiId && (
                          <p className="mt-1 text-xs text-red-500">{errors.upiId}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Net Banking */}
                <div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === PaymentMethod.NET_BANKING}
                      onChange={() => setPaymentMethod(PaymentMethod.NET_BANKING)}
                      className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)]"
                    />
                    <span className="ml-2 text-gray-700">Net Banking</span>
                  </label>

                  {paymentMethod === PaymentMethod.NET_BANKING && (
                    <div className="mt-4 ml-6">
                      <div>
                        <label htmlFor="bank" className="block text-sm font-medium text-gray-700 mb-1">
                          Select Bank
                        </label>
                        <select
                          id="bank"
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className={`select ${errors.bank ? 'border-red-500' : ''}`}
                        >
                          <option value="">Select a bank</option>
                          <option value="hdfc">HDFC Bank</option>
                          <option value="sbi">State Bank of India</option>
                          <option value="icici">ICICI Bank</option>
                          <option value="axis">Axis Bank</option>
                          <option value="kotak">Kotak Mahindra Bank</option>
                        </select>
                        {errors.bank && (
                          <p className="mt-1 text-xs text-red-500">{errors.bank}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-sm text-gray-600 mb-4">
                Your booking details will be sent to this contact information.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    className="input"
                    placeholder="John Doe"
                    defaultValue={user?.name || ''}
                  />
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    className="input"
                    placeholder="john@example.com"
                    defaultValue={user?.email || ''}
                  />
                </div>

                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    className="input"
                    placeholder="+91 9876543210"
                    defaultValue={user?.phone || ''}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Booking Summary</h2>

              <div className="space-y-4">
                {/* Journey Info */}
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Journey Date</span>
                    <span className="font-medium">{formatDate(bookingDetails.journeyDate)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-500">From - To</span>
                    <span className="font-medium">{bookingDetails.source} - {bookingDetails.destination}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-500">Bus</span>
                    <span className="font-medium">{bookingDetails.busName}</span>
                  </div>
                </div>

                {/* Seat Info */}
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Selected Seats</span>
                    <span className="font-medium">{bookingDetails.selectedSeats.length}</span>
                  </div>
                  <div className="mt-2">
                    <div className="text-sm text-gray-500 mb-1">Seat Numbers</div>
                    <div className="flex flex-wrap gap-1">
                      {bookingDetails.selectedSeats.map((seatId, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {seatId}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">Base Fare (₹{bookingDetails.fare} × {bookingDetails.selectedSeats.length})</span>
                    <span>₹{bookingDetails.fare * bookingDetails.selectedSeats.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">Tax</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500">Booking Fee</span>
                    <span>₹0</span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total Amount</span>
                    <span className="text-xl font-bold text-[var(--primary)]">
                      ₹{bookingDetails.totalAmount}
                    </span>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="btn btn-primary w-full mt-6"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Pay Now
                      </>
                    )}
                  </button>
                </div>

                {/* Policies */}
                <div className="mt-6 text-xs text-gray-500">
                  <p>By proceeding, you agree to our <a href="#" className="text-[var(--primary)]">Terms of Service</a> and <a href="#" className="text-[var(--primary)]">Privacy Policy</a>.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
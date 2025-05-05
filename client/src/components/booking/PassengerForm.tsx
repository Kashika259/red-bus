import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking, Passenger } from '../../contexts/BookingContext';

interface PassengerFormProps {
  seatNumber: string;
  onClose: () => void;
}

const PassengerForm: React.FC<PassengerFormProps> = ({ seatNumber, onClose }) => {
  const { addPassenger, bookingDetails } = useBooking();
  const [name, setName] = useState('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!age) {
      newErrors.age = 'Age is required';
    } else if (parseInt(age) < 1 || parseInt(age) > 120) {
      newErrors.age = 'Age must be between 1 and 120';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Add passenger
    const passenger: Passenger = {
      name: name.trim(),
      age: parseInt(age),
      gender,
      seatNumber,
    };
    
    addPassenger(passenger);
    onClose();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-medium text-gray-900 mb-4">Passenger Details for Seat {seatNumber}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`input ${errors.name ? 'border-red-500' : ''}`}
              placeholder="e.g. John Doe"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>
          
          {/* Age Field */}
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className={`input ${errors.age ? 'border-red-500' : ''}`}
              placeholder="e.g. 25"
              min="1"
              max="120"
            />
            {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
          </div>
          
          {/* Gender Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === 'male'}
                  onChange={() => setGender('male')}
                  className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="ml-2 text-sm text-gray-700">Male</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === 'female'}
                  onChange={() => setGender('female')}
                  className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="ml-2 text-sm text-gray-700">Female</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={gender === 'other'}
                  onChange={() => setGender('other')}
                  className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="ml-2 text-sm text-gray-700">Other</span>
              </label>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PassengerForm;
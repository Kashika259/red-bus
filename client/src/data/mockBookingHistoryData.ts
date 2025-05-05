export const mockBookingHistoryData = [
  {
    id: 'RB123456789',
    journeyDate: '2025-07-15',
    source: 'Delhi',
    destination: 'Jaipur',
    busName: 'Rajasthan Travels',
    departureTime: '22:00',
    arrivalTime: '05:00',
    seats: ['A1', 'A2'],
    amount: 2400,
    status: 'confirmed',
    passengers: [
      { name: 'John Doe', age: 28, gender: 'male', seatNumber: 'A1' },
      { name: 'Jane Doe', age: 26, gender: 'female', seatNumber: 'A2' }
    ]
  },
  {
    id: 'RB987654321',
    journeyDate: '2023-06-10',
    source: 'Mumbai',
    destination: 'Pune',
    busName: 'Maharashtra Express',
    departureTime: '17:30',
    arrivalTime: '20:45',
    seats: ['B5'],
    amount: 550,
    status: 'completed',
    passengers: [
      { name: 'John Doe', age: 28, gender: 'male', seatNumber: 'B5' }
    ]
  },
  {
    id: 'RB567891234',
    journeyDate: '2024-03-22',
    source: 'Bangalore',
    destination: 'Chennai',
    busName: 'Chennai Travels',
    departureTime: '22:00',
    arrivalTime: '05:00',
    seats: ['L3', 'L4', 'L5'],
    amount: 3300,
    status: 'cancelled',
    passengers: [
      { name: 'John Doe', age: 28, gender: 'male', seatNumber: 'L3' },
      { name: 'Jane Doe', age: 26, gender: 'female', seatNumber: 'L4' },
      { name: 'Mike Smith', age: 32, gender: 'male', seatNumber: 'L5' }
    ]
  },
  {
    id: 'RB456789123',
    journeyDate: '2023-12-15',
    source: 'Delhi',
    destination: 'Mumbai',
    busName: 'Mumbai Express',
    departureTime: '18:30',
    arrivalTime: '10:45',
    seats: ['U7', 'U8'],
    amount: 3800,
    status: 'completed',
    passengers: [
      { name: 'John Doe', age: 28, gender: 'male', seatNumber: 'U7' },
      { name: 'Jane Doe', age: 26, gender: 'female', seatNumber: 'U8' }
    ]
  },
  {
    id: 'RB789123456',
    journeyDate: '2025-08-05',
    source: 'Hyderabad',
    destination: 'Bangalore',
    busName: 'Hyderabad Express',
    departureTime: '20:30',
    arrivalTime: '05:00',
    seats: ['L6'],
    amount: 950,
    status: 'confirmed',
    passengers: [
      { name: 'John Doe', age: 28, gender: 'male', seatNumber: 'L6' }
    ]
  }
];
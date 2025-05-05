export const mockSeatData = [
  // Bus 1 - Sleeper
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `bus1_seat${i+1}`,
    busId: 'bus1',
    number: `${i+1}`,
    isAvailable: ![2, 5, 8, 13, 17, 20, 25].includes(i+1),
    isLadiesSeat: [3, 14, 22].includes(i+1),
    isWindowSeat: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28].includes(i+1),
    deck: i+1 <= 15 ? 'lower' : 'upper' as 'lower' | 'upper',
    price: i+1 <= 15 ? 950 : 900,
  })),
  
  // Bus 2 - Volvo Sleeper
  ...Array.from({ length: 36 }, (_, i) => ({
    id: `bus2_seat${i+1}`,
    busId: 'bus2',
    number: `${i+1}`,
    isAvailable: ![4, 9, 11, 17, 22, 28, 30, 31].includes(i+1),
    isLadiesSeat: [5, 16, 25].includes(i+1),
    isWindowSeat: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].includes(i+1),
    deck: i+1 <= 18 ? 'lower' : 'upper' as 'lower' | 'upper',
    price: i+1 <= 18 ? 1200 : 1100,
  })),
  
  // Bus 3 - Non-AC Sleeper
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `bus3_seat${i+1}`,
    busId: 'bus3',
    number: `${i+1}`,
    isAvailable: ![1, 7, 9, 15].includes(i+1),
    isLadiesSeat: [8, 20, 28].includes(i+1),
    isWindowSeat: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28].includes(i+1),
    deck: i+1 <= 15 ? 'lower' : 'upper' as 'lower' | 'upper',
    price: i+1 <= 15 ? 750 : 700,
  })),
  
  // Bus 4 - AC Seater
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `bus4_seat${i+1}`,
    busId: 'bus4',
    number: `${i+1}`,
    isAvailable: ![2, 7, 12, 18, 25, 30, 35].includes(i+1),
    isLadiesSeat: [5, 20, 33].includes(i+1),
    isWindowSeat: [1, 5, 9, 13, 17, 21, 25, 29, 33, 37].includes(i+1),
    deck: 'lower' as 'lower' | 'upper',
    price: 550,
  })),
  
  // Bus 5 - Volvo AC Seater
  ...Array.from({ length: 45 }, (_, i) => ({
    id: `bus5_seat${i+1}`,
    busId: 'bus5',
    number: `${i+1}`,
    isAvailable: ![3, 7, 11, 16, 22, 27, 33, 38, 41, 42, 43, 44, 45].includes(i+1),
    isLadiesSeat: [5, 19, 36].includes(i+1),
    isWindowSeat: [1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41, 45].includes(i+1),
    deck: 'lower' as 'lower' | 'upper',
    price: 650,
  })),
];
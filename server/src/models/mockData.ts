import { Truck, Order, CityDistanceCache, CityNode } from './types';

export const CITIES: CityNode[] = [
  { name: 'Colombo', x: 200, y: 350 },
  { name: 'Negombo', x: 190, y: 300 },
  { name: 'Galle', x: 220, y: 480 },
  { name: 'Matara', x: 250, y: 520 },
  { name: 'Kandy', x: 300, y: 320 },
  { name: 'Kurunegala', x: 260, y: 270 },
  { name: 'Anuradhapura', x: 280, y: 160 },
  { name: 'Jaffna', x: 260, y: 40 },
  { name: 'Trincomalee', x: 380, y: 180 },
  { name: 'Badulla', x: 370, y: 360 },
  { name: 'Ratnapura', x: 260, y: 390 },
  { name: 'Batticaloa', x: 420, y: 260 }
];

// Precalculated shortest distances (Module 1 Dijkstra Cache simulation in km)
export const CITY_DISTANCES: CityDistanceCache = {
  'Colombo->Colombo': 0,
  'Colombo->Negombo': 38,
  'Colombo->Galle': 118,
  'Colombo->Matara': 160,
  'Colombo->Kandy': 115,
  'Colombo->Kurunegala': 94,
  'Colombo->Anuradhapura': 205,
  'Colombo->Jaffna': 395,
  'Colombo->Trincomalee': 258,
  'Colombo->Badulla': 218,
  'Colombo->Ratnapura': 101,
  'Colombo->Batticaloa': 314,

  'Negombo->Colombo': 38,
  'Negombo->Kandy': 104,
  'Negombo->Galle': 156,
  'Negombo->Kurunegala': 76,
  'Negombo->Jaffna': 365,
  'Negombo->Anuradhapura': 175,
  'Negombo->Trincomalee': 240,
  'Negombo->Badulla': 230,
  'Negombo->Matara': 198,
  'Negombo->Ratnapura': 125,
  'Negombo->Batticaloa': 305,

  'Kandy->Colombo': 115,
  'Kandy->Negombo': 104,
  'Kandy->Galle': 222,
  'Kandy->Kurunegala': 42,
  'Kandy->Anuradhapura': 138,
  'Kandy->Jaffna': 320,
  'Kandy->Trincomalee': 182,
  'Kandy->Badulla': 116,
  'Kandy->Matara': 245,
  'Kandy->Ratnapura': 120,
  'Kandy->Batticaloa': 210,

  'Galle->Colombo': 118,
  'Galle->Matara': 44,
  'Galle->Kandy': 222,
  'Galle->Negombo': 156,
  'Galle->Kurunegala': 212,
  'Galle->Ratnapura': 130,
  'Galle->Anuradhapura': 323,
  'Galle->Jaffna': 513,
  'Galle->Trincomalee': 376,
  'Galle->Badulla': 240,
  'Galle->Batticaloa': 380,

  'Kurunegala->Colombo': 94,
  'Kurunegala->Kandy': 42,
  'Kurunegala->Anuradhapura': 112,
  'Kurunegala->Galle': 212,
  'Kurunegala->Jaffna': 301,
  'Kurunegala->Trincomalee': 176,
  'Kurunegala->Negombo': 76,
  'Kurunegala->Badulla': 158,
  'Kurunegala->Matara': 254,
  'Kurunegala->Ratnapura': 132,
  'Kurunegala->Batticaloa': 236,

  'Anuradhapura->Colombo': 205,
  'Anuradhapura->Jaffna': 198,
  'Anuradhapura->Trincomalee': 108,
  'Anuradhapura->Kandy': 138,
  'Anuradhapura->Kurunegala': 112,
  'Anuradhapura->Galle': 323,
  'Anuradhapura->Negombo': 175,
  'Anuradhapura->Badulla': 230,
  'Anuradhapura->Matara': 365,
  'Anuradhapura->Ratnapura': 240,
  'Anuradhapura->Batticaloa': 210,

  'Jaffna->Colombo': 395,
  'Jaffna->Anuradhapura': 198,
  'Jaffna->Kandy': 320,
  'Jaffna->Galle': 513,
  'Jaffna->Trincomalee': 235,
  'Jaffna->Kurunegala': 301,
  'Jaffna->Negombo': 365,
  'Jaffna->Badulla': 415,
  'Jaffna->Matara': 555,
  'Jaffna->Ratnapura': 440,
  'Jaffna->Batticaloa': 385,

  'Trincomalee->Colombo': 258,
  'Trincomalee->Kandy': 182,
  'Trincomalee->Anuradhapura': 108,
  'Trincomalee->Jaffna': 235,
  'Trincomalee->Batticaloa': 138,
  'Trincomalee->Galle': 376,
  'Trincomalee->Kurunegala': 176,
  'Trincomalee->Badulla': 225,
  'Trincomalee->Matara': 418,
  'Trincomalee->Negombo': 240,
  'Trincomalee->Ratnapura': 295,

  'Badulla->Colombo': 218,
  'Badulla->Kandy': 116,
  'Badulla->Ratnapura': 135,
  'Badulla->Batticaloa': 152,
  'Badulla->Galle': 240,
  'Badulla->Anuradhapura': 230,
  'Badulla->Jaffna': 415,
  'Badulla->Kurunegala': 158,
  'Badulla->Matara': 210,
  'Badulla->Negombo': 230,
  'Badulla->Trincomalee': 225,

  'Matara->Colombo': 160,
  'Matara->Galle': 44,
  'Matara->Ratnapura': 142,
  'Matara->Kandy': 245,
  'Matara->Badulla': 210,
  'Matara->Anuradhapura': 365,
  'Matara->Jaffna': 555,
  'Matara->Kurunegala': 254,
  'Matara->Negombo': 198,
  'Matara->Trincomalee': 418,
  'Matara->Batticaloa': 340,

  'Ratnapura->Colombo': 101,
  'Ratnapura->Galle': 130,
  'Ratnapura->Kandy': 120,
  'Ratnapura->Badulla': 135,
  'Ratnapura->Matara': 142,
  'Ratnapura->Negombo': 125,
  'Ratnapura->Kurunegala': 132,
  'Ratnapura->Anuradhapura': 240,
  'Ratnapura->Jaffna': 440,
  'Ratnapura->Trincomalee': 295,
  'Ratnapura->Batticaloa': 275,

  'Batticaloa->Colombo': 314,
  'Batticaloa->Trincomalee': 138,
  'Batticaloa->Badulla': 152,
  'Batticaloa->Kandy': 210,
  'Batticaloa->Anuradhapura': 210,
  'Batticaloa->Jaffna': 385,
  'Batticaloa->Galle': 380,
  'Batticaloa->Matara': 340,
  'Batticaloa->Kurunegala': 236,
  'Batticaloa->Negombo': 305,
  'Batticaloa->Ratnapura': 275
};

export function getCityDistance(from: string, to: string): number {
  if (from === to) return 0;
  const key = `${from}->${to}`;
  if (CITY_DISTANCES[key] !== undefined) {
    return CITY_DISTANCES[key];
  }
  const reverseKey = `${to}->${from}`;
  if (CITY_DISTANCES[reverseKey] !== undefined) {
    return CITY_DISTANCES[reverseKey];
  }
  return 150; // Fallback estimated distance
}

export const INITIAL_TRUCKS: Truck[] = [
  { id: 1, code: 'TRK-01', model: 'Isuzu Elf 3.5T', currentLocation: 'Colombo', capacityKg: 3500, usedKg: 1200, availableAtMinutes: 15, driverName: 'Kasun Perera', costPerKm: 1.8 },
  { id: 2, code: 'TRK-02', model: 'Mitsubishi Fuso Canter', currentLocation: 'Negombo', capacityKg: 4200, usedKg: 850, availableAtMinutes: 0, driverName: 'Sunil Silva', costPerKm: 2.1 },
  { id: 3, code: 'TRK-03', model: 'Tata Ultra 6T', currentLocation: 'Kandy', capacityKg: 6000, usedKg: 4800, availableAtMinutes: 45, driverName: 'Nimal Fernando', costPerKm: 2.5 },
  { id: 4, code: 'TRK-04', model: 'Eicher Pro 3008', currentLocation: 'Kurunegala', capacityKg: 5000, usedKg: 1500, availableAtMinutes: 20, driverName: 'Dinesh Bandara', costPerKm: 2.2 },
  { id: 5, code: 'TRK-05', model: 'Hino 500 Series', currentLocation: 'Galle', capacityKg: 7500, usedKg: 3200, availableAtMinutes: 30, driverName: 'Chaminda Rajapakse', costPerKm: 2.9 },
  { id: 6, code: 'TRK-06', model: 'Ashok Leyland Boss', currentLocation: 'Anuradhapura', capacityKg: 5500, usedKg: 2100, availableAtMinutes: 10, driverName: 'Rohan Jayawardena', costPerKm: 2.4 },
  { id: 7, code: 'TRK-07', model: 'Isuzu Forward 8T', currentLocation: 'Colombo', capacityKg: 8000, usedKg: 2000, availableAtMinutes: 60, driverName: 'Mahesh Gunasekara', costPerKm: 3.1 },
  { id: 8, code: 'TRK-08', model: 'Mahindra Furio 7', currentLocation: 'Ratnapura', capacityKg: 4000, usedKg: 3800, availableAtMinutes: 5, driverName: 'Priyantha Kumara', costPerKm: 2.0 },
  { id: 9, code: 'TRK-09', model: 'Volvo FL 12T', currentLocation: 'Kandy', capacityKg: 12000, usedKg: 5000, availableAtMinutes: 90, driverName: 'Anura Wickramasinghe', costPerKm: 4.2 },
  { id: 10, code: 'TRK-10', model: 'Scania P-Series 10T', currentLocation: 'Badulla', capacityKg: 10000, usedKg: 4200, availableAtMinutes: 40, driverName: 'Samantha Dissanayake', costPerKm: 3.8 }
];

export const INITIAL_ORDERS: Order[] = [
  { id: 101, trackingNumber: 'ORD-9821', destination: 'Kandy', weight: 850, profit: 450, deadlineMinutes: 180, priority: 4, createdAt: '2026-08-26 09:30', status: 'PENDING' },
  { id: 102, trackingNumber: 'ORD-9822', destination: 'Galle', weight: 1400, profit: 620, deadlineMinutes: 240, priority: 3, createdAt: '2026-08-26 10:15', status: 'PENDING' },
  { id: 103, trackingNumber: 'ORD-9823', destination: 'Jaffna', weight: 2200, profit: 1250, deadlineMinutes: 600, priority: 5, createdAt: '2026-08-26 11:00', status: 'PENDING' },
  { id: 104, trackingNumber: 'ORD-9824', destination: 'Trincomalee', weight: 650, profit: 380, deadlineMinutes: 360, priority: 2, createdAt: '2026-08-26 11:45', status: 'PENDING' },
  { id: 105, trackingNumber: 'ORD-9825', destination: 'Matara', weight: 3100, profit: 980, deadlineMinutes: 300, priority: 4, createdAt: '2026-08-26 12:20', status: 'PENDING' }
];

// Pre-sorted operational delivery window slots (in minute offsets from now, sorted ascending)
export const SCHEDULED_DELIVERY_SLOTS: number[] = [
  30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 270, 300, 330, 360, 420, 480, 540, 600, 720
];

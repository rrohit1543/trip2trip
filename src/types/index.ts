export type UserRole = 'customer' | 'operator' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  authIdentifier: string; // mobile number or email address
  authMethod: 'mobile' | 'email';
  passwordHash?: string;
  role: UserRole;
  avatar: string;
  isVerified: boolean;
  mfaEnabled?: boolean;
  operatorCompany?: string;
}

export interface OtpSession {
  id: string;
  target: string; // mobile number or email address
  code: string;
  expiresAt: number; // timestamp in ms
  attempts: number;
  maxAttempts: number;
  isUsed: boolean;
  type: 'registration' | 'password_reset' | 'admin_mfa';
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  eventType:
    | 'LOGIN_SUCCESS'
    | 'LOGIN_FAILED'
    | 'OTP_SENT'
    | 'OTP_VERIFIED'
    | 'OTP_FAILED'
    | 'PASSWORD_RESET_REQUESTED'
    | 'PASSWORD_RESET_SUCCESS'
    | 'ADMIN_MFA_SENT'
    | 'ADMIN_MFA_SUCCESS'
    | 'UNAUTHORIZED_ADMIN_ATTEMPT';
  identifier: string;
  details: string;
}

export interface OperatorKYC {
  id: string;
  operatorId: string;
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  aadhaarNumber: string;
  panNumber: string;
  gstNumber?: string;
  travelAgencyReg?: string;
  bankAccount: string;
  ifscCode: string;
  upiId: string;
  address: string;
  emergencyContact: string;
  logoUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
}

export interface TripLocation {
  name: string;
  lat: number;
  lng: number;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  activities: string[];
  meals: string;
  stayDetails: string;
}

export interface TourGuide {
  name: string;
  phone: string;
  rating: number;
  languages: string[];
  photo: string;
}

export interface Vehicle {
  type: string;
  regNumber: string;
  amenities: string[];
  driverName: string;
  driverPhone: string;
}

export interface HotelInfo {
  name: string;
  stars: number;
  location: string;
  images: string[];
}

export interface Trip {
  id: string;
  operatorId: string;
  operatorName: string;
  operatorLogo: string;
  operatorRating: number;
  operatorReviewsCount: number;
  name: string;
  category: 'Trekking' | 'Heritage' | 'Beach Caravan' | 'Leisure & Luxury' | 'Spiritual' | 'Adventure';
  departureCity: string;
  destinationCity: string;
  pickupLocation: TripLocation;
  dropPoints: TripLocation[];
  durationDays: number;
  durationNights: number;
  departureDateTime: string;
  returnDateTime: string;
  pricePerPerson: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeatNumbers: number[];
  bookingDeadline: string;
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  cancellationPolicy: string;
  requiredDocuments: string[];
  images: string[];
  tourGuide: TourGuide;
  vehicle: Vehicle;
  hotel: HotelInfo;
  difficultyLevel: 'Easy' | 'Moderate' | 'Hard';
  tags: string[];
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  routePath: [number, number][];
  intermediateCities: string[];
}

export interface LiveTelemetry {
  tripId: string;
  currentLat: number;
  currentLng: number;
  currentSpeed: number;
  heading: number;
  currentStopIndex: number;
  currentStopName: string;
  nextStopName: string;
  etaNextStop: string;
  etaDestination: string;
  lastUpdated: string;
  progressPercent: number;
}

export interface Booking {
  id: string;
  tripId: string;
  tripName: string;
  operatorName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  selectedSeats: number[];
  totalAmount: number;
  bookingDate: string;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Wallet';
  paymentStatus: 'paid' | 'pending' | 'failed';
  transactionId: string;
  pickupPoint: string;
  dropPoint: string;
  boardingStatus: 'pending' | 'boarded' | 'no-show';
}

export interface Review {
  id: string;
  tripId: string;
  operatorId: string;
  customerId: string;
  customerName: string;
  operatorRating: number;
  driverRating: number;
  guideRating: number;
  comment: string;
  photos: string[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  tripId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
}

export interface RouteSearchResult {
  departureCity: string;
  destinationCity: string;
  upcomingCount: number;
  liveCount: number;
  nearIntermediateCount: number;
  nearDestinationCount: number;
  matchingTrips: Trip[];
}

import { useState, useEffect } from 'react';
import {
  User,
  UserRole,
  OperatorKYC,
  Trip,
  LiveTelemetry,
  Booking,
  Review,
  ChatMessage,
  RouteSearchResult
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_OPERATOR_KYC,
  INITIAL_TRIPS,
  INITIAL_TELEMETRY,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_CHAT
} from './mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'trip2trip_current_user',
  USERS: 'trip2trip_users',
  KYC: 'trip2trip_kyc',
  TRIPS: 'trip2trip_trips',
  TELEMETRY: 'trip2trip_telemetry',
  BOOKINGS: 'trip2trip_bookings',
  REVIEWS: 'trip2trip_reviews',
  CHAT: 'trip2trip_chat',
};

// Helper for localStorage
function getStored<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage set error:', e);
  }
}

export function useTrip2TripStore() {
  const [currentUser, setCurrentUser] = useState<User>(() =>
    getStored<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0])
  );

  const [users, setUsers] = useState<User[]>(() =>
    getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS)
  );

  const [operatorKYC, setOperatorKYC] = useState<OperatorKYC[]>(() =>
    getStored<OperatorKYC[]>(STORAGE_KEYS.KYC, INITIAL_OPERATOR_KYC)
  );

  const [trips, setTrips] = useState<Trip[]>(() =>
    getStored<Trip[]>(STORAGE_KEYS.TRIPS, INITIAL_TRIPS)
  );

  const [telemetry, setTelemetry] = useState<Record<string, LiveTelemetry>>(() =>
    getStored<Record<string, LiveTelemetry>>(STORAGE_KEYS.TELEMETRY, INITIAL_TELEMETRY)
  );

  const [bookings, setBookings] = useState<Booking[]>(() =>
    getStored<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS)
  );

  const [reviews, setReviews] = useState<Review[]>(() =>
    getStored<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS)
  );

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() =>
    getStored<ChatMessage[]>(STORAGE_KEYS.CHAT, INITIAL_CHAT)
  );

  // Sync to local storage
  useEffect(() => { setStored(STORAGE_KEYS.CURRENT_USER, currentUser); }, [currentUser]);
  useEffect(() => { setStored(STORAGE_KEYS.USERS, users); }, [users]);
  useEffect(() => { setStored(STORAGE_KEYS.KYC, operatorKYC); }, [operatorKYC]);
  useEffect(() => { setStored(STORAGE_KEYS.TRIPS, trips); }, [trips]);
  useEffect(() => { setStored(STORAGE_KEYS.TELEMETRY, telemetry); }, [telemetry]);
  useEffect(() => { setStored(STORAGE_KEYS.BOOKINGS, bookings); }, [bookings]);
  useEffect(() => { setStored(STORAGE_KEYS.REVIEWS, reviews); }, [reviews]);
  useEffect(() => { setStored(STORAGE_KEYS.CHAT, chatMessages); }, [chatMessages]);

  // Real-time GPS movement simulation ticker for live trips
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const next = { ...prev };
        let updated = false;

        trips.forEach((trip) => {
          if (trip.status === 'live' && trip.routePath.length >= 2) {
            const currentTelem = next[trip.id] || {
              tripId: trip.id,
              currentLat: trip.routePath[0][0],
              currentLng: trip.routePath[0][1],
              currentSpeed: 60,
              heading: 0,
              currentStopIndex: 0,
              currentStopName: trip.departureCity,
              nextStopName: trip.dropPoints[0]?.name || trip.destinationCity,
              etaNextStop: '30 mins',
              etaDestination: '4 hours',
              lastUpdated: 'Just now',
              progressPercent: 10,
            };

            // Increment progress percent smoothly
            let newProgress = (currentTelem.progressPercent + 0.5) % 100;
            const routeIndex = Math.min(
              Math.floor((newProgress / 100) * (trip.routePath.length - 1)),
              trip.routePath.length - 2
            );

            const startCoord = trip.routePath[routeIndex];
            const endCoord = trip.routePath[routeIndex + 1];
            const segmentProgress = ((newProgress / 100) * (trip.routePath.length - 1)) - routeIndex;

            const currentLat = startCoord[0] + (endCoord[0] - startCoord[0]) * segmentProgress;
            const currentLng = startCoord[1] + (endCoord[1] - startCoord[1]) * segmentProgress;
            const currentSpeed = 55 + Math.floor(Math.sin(Date.now() / 3000) * 15);

            // Determine next stop
            const stopCount = trip.dropPoints.length;
            const currentStopIdx = Math.min(Math.floor((newProgress / 100) * stopCount), stopCount - 1);
            const nextStopObj = trip.dropPoints[currentStopIdx] || { name: trip.destinationCity };

            next[trip.id] = {
              ...currentTelem,
              currentLat,
              currentLng,
              currentSpeed,
              currentStopName: currentStopIdx > 0 ? trip.dropPoints[currentStopIdx - 1]?.name : trip.departureCity,
              nextStopName: nextStopObj.name,
              progressPercent: parseFloat(newProgress.toFixed(1)),
              lastUpdated: 'Live GPS',
            };
            updated = true;
          }
        });

        return updated ? next : prev;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [trips]);

  // Actions
  const switchUserRole = (role: UserRole) => {
    const targetUser = users.find((u) => u.role === role) || {
      id: `usr_${role}_demo`,
      name: role === 'customer' ? 'Demo Customer' : role === 'operator' ? 'Demo Operator' : 'Super Admin',
      email: `${role}@trip2trip.com`,
      phone: '+91 99000 11223',
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      isVerified: true,
      operatorCompany: role === 'operator' ? 'Royal Expeditions' : undefined,
    };
    setCurrentUser(targetUser);
  };

  const submitKYC = (data: Omit<OperatorKYC, 'id' | 'status' | 'createdAt'>) => {
    const newKYC: OperatorKYC = {
      ...data,
      id: `kyc_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setOperatorKYC((prev) => [newKYC, ...prev]);

    // Mark current operator as KYC pending
    setUsers((prev) =>
      prev.map((u) => (u.id === data.operatorId ? { ...u, operatorCompany: data.companyName } : u))
    );
    if (currentUser.id === data.operatorId) {
      setCurrentUser((prev) => ({ ...prev, operatorCompany: data.companyName }));
    }
  };

  const updateKYCStatus = (kycId: string, status: 'approved' | 'rejected', reason?: string) => {
    setOperatorKYC((prev) =>
      prev.map((k) => (k.id === kycId ? { ...k, status, rejectionReason: reason } : k))
    );

    const targetKyc = operatorKYC.find((k) => k.id === kycId);
    if (targetKyc && status === 'approved') {
      setUsers((prev) =>
        prev.map((u) => (u.id === targetKyc.operatorId ? { ...u, isVerified: true } : u))
      );
      if (currentUser.id === targetKyc.operatorId) {
        setCurrentUser((prev) => ({ ...prev, isVerified: true }));
      }
    }
  };

  const createTrip = (tripData: Omit<Trip, 'id' | 'operatorId' | 'operatorName' | 'operatorLogo' | 'operatorRating' | 'operatorReviewsCount' | 'status' | 'bookedSeatNumbers'>) => {
    const newTrip: Trip = {
      ...tripData,
      id: `trip_${Date.now()}`,
      operatorId: currentUser.id,
      operatorName: currentUser.operatorCompany || currentUser.name,
      operatorLogo: currentUser.avatar,
      operatorRating: 4.9,
      operatorReviewsCount: 1,
      status: 'upcoming',
      bookedSeatNumbers: [],
    };
    setTrips((prev) => [newTrip, ...prev]);
  };

  const toggleLiveTrip = (tripId: string) => {
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === tripId) {
          const nextStatus = t.status === 'live' ? 'completed' : 'live';
          if (nextStatus === 'live' && !telemetry[tripId]) {
            setTelemetry((telemPrev) => ({
              ...telemPrev,
              [tripId]: {
                tripId: t.id,
                currentLat: t.routePath[0]?.[0] || 28.6139,
                currentLng: t.routePath[0]?.[1] || 77.2090,
                currentSpeed: 60,
                heading: 0,
                currentStopIndex: 0,
                currentStopName: t.departureCity,
                nextStopName: t.dropPoints[0]?.name || t.destinationCity,
                etaNextStop: '25 mins',
                etaDestination: `${t.durationDays * 6} hrs`,
                lastUpdated: 'Just started',
                progressPercent: 5,
              },
            }));
          }
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const createBooking = (bookingData: Omit<Booking, 'id' | 'bookingDate' | 'transactionId' | 'boardingStatus'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `bk_${Date.now().toString().slice(-6)}`,
      bookingDate: new Date().toISOString(),
      transactionId: `TXN_${bookingData.paymentMethod}_${Math.floor(100000 + Math.random() * 900000)}`,
      boardingStatus: 'pending',
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Deduct available seats in trip
    setTrips((prev) =>
      prev.map((t) => {
        if (t.id === bookingData.tripId) {
          const updatedBooked = Array.from(new Set([...t.bookedSeatNumbers, ...bookingData.selectedSeats]));
          return {
            ...t,
            bookedSeatNumbers: updatedBooked,
            availableSeats: Math.max(0, t.totalSeats - updatedBooked.length),
          };
        }
        return t;
      })
    );

    return newBooking;
  };

  const addChatMessage = (tripId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `chat_${Date.now()}`,
      tripId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text,
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, newMsg]);

    // Automated reply from operator if user is customer
    if (currentUser.role === 'customer') {
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: `chat_${Date.now() + 1}`,
          tripId,
          senderId: 'usr_operator_1',
          senderName: 'Trip Captain / Operator Support',
          senderRole: 'operator',
          text: `Hi ${currentUser.name}! Thank you for reaching out. We are monitoring your trip live. How can we assist you further?`,
          timestamp: new Date().toISOString(),
        };
        setChatMessages((prevMsg) => [...prevMsg, autoReply]);
      }, 1200);
    }
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  // Smart Route Discovery Filter
  const searchRoute = (dep: string, dest: string, category?: string): RouteSearchResult => {
    const depClean = dep.trim().toLowerCase();
    const destClean = dest.trim().toLowerCase();

    const matching = trips.filter((t) => {
      if (category && category !== 'All' && t.category !== category) return false;

      // Direct origin and destination match
      const directMatch =
        t.departureCity.toLowerCase().includes(depClean) &&
        t.destinationCity.toLowerCase().includes(destClean);

      // Intermediate city match (e.g. searching Indore -> Goa finds trips passing through Indore)
      const depInIntermediate = t.intermediateCities.some((c) => c.toLowerCase().includes(depClean));
      const destInIntermediate = t.intermediateCities.some((c) => c.toLowerCase().includes(destClean));

      return directMatch || (depInIntermediate && destInIntermediate) || (depInIntermediate && destClean === '') || (depClean === '' && destInIntermediate);
    });

    const upcomingCount = matching.filter((t) => t.status === 'upcoming').length;
    const liveCount = matching.filter((t) => t.status === 'live').length;

    // Count trips currently near intermediate cities (progress between 20% and 75%)
    const nearIntermediateCount = matching.filter(
      (t) => t.status === 'live' && (telemetry[t.id]?.progressPercent || 0) >= 20 && (telemetry[t.id]?.progressPercent || 0) <= 75
    ).length;

    const nearDestinationCount = matching.filter(
      (t) => t.status === 'live' && (telemetry[t.id]?.progressPercent || 0) > 75
    ).length;

    return {
      departureCity: dep,
      destinationCity: dest,
      upcomingCount,
      liveCount,
      nearIntermediateCount,
      nearDestinationCount,
      matchingTrips: matching.length > 0 ? matching : trips, // Fallback to all trips if clean search
    };
  };

  return {
    currentUser,
    users,
    operatorKYC,
    trips,
    telemetry,
    bookings,
    reviews,
    chatMessages,
    switchUserRole,
    submitKYC,
    updateKYCStatus,
    createTrip,
    toggleLiveTrip,
    createBooking,
    addChatMessage,
    addReview,
    searchRoute,
  };
}

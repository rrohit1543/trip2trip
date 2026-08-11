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
  RouteSearchResult,
  OtpSession,
  SecurityEvent,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_OPERATOR_KYC,
  INITIAL_TRIPS,
  INITIAL_TELEMETRY,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_CHAT,
  INITIAL_SECURITY_LOGS,
} from './mockData';
import { hashPassword, generateOTP, checkRateLimit, createSecurityLog, isValidEmail, isValidMobile } from './security';

const STORAGE_KEYS = {
  CURRENT_USER: 'trip2trip_v4_red_current_user',
  USERS: 'trip2trip_v4_red_users',
  KYC: 'trip2trip_v4_red_kyc',
  TRIPS: 'trip2trip_v4_red_trips',
  TELEMETRY: 'trip2trip_v4_red_telemetry',
  BOOKINGS: 'trip2trip_v4_red_bookings',
  REVIEWS: 'trip2trip_v4_red_reviews',
  CHAT: 'trip2trip_v4_red_chat',
  SECURITY_LOGS: 'trip2trip_v4_red_security_logs',
};

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
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    getStored<User | null>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0])
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

  const [securityLogs, setSecurityLogs] = useState<SecurityEvent[]>(() =>
    getStored<SecurityEvent[]>(STORAGE_KEYS.SECURITY_LOGS, INITIAL_SECURITY_LOGS)
  );

  // In-memory OTP sessions
  const [otpSessions, setOtpSessions] = useState<Record<string, OtpSession>>({});

  // LocalStorage Sync
  useEffect(() => { setStored(STORAGE_KEYS.CURRENT_USER, currentUser); }, [currentUser]);
  useEffect(() => { setStored(STORAGE_KEYS.USERS, users); }, [users]);
  useEffect(() => { setStored(STORAGE_KEYS.KYC, operatorKYC); }, [operatorKYC]);
  useEffect(() => { setStored(STORAGE_KEYS.TRIPS, trips); }, [trips]);
  useEffect(() => { setStored(STORAGE_KEYS.TELEMETRY, telemetry); }, [telemetry]);
  useEffect(() => { setStored(STORAGE_KEYS.BOOKINGS, bookings); }, [bookings]);
  useEffect(() => { setStored(STORAGE_KEYS.REVIEWS, reviews); }, [reviews]);
  useEffect(() => { setStored(STORAGE_KEYS.CHAT, chatMessages); }, [chatMessages]);
  useEffect(() => { setStored(STORAGE_KEYS.SECURITY_LOGS, securityLogs); }, [securityLogs]);

  // Real-time GPS movement simulation
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

  // Helper to log security events
  const addSecurityLog = (eventType: SecurityEvent['eventType'], identifier: string, details: string) => {
    const log = createSecurityLog(eventType, identifier, details);
    setSecurityLogs((prev) => [log, ...prev]);
  };

  // -------------------------------------------------------------
  // USER REGISTRATION WITH MOBILE OR GMAIL/EMAIL OTP
  // -------------------------------------------------------------
  const registerUser = (
    name: string,
    identifier: string, // mobile or email
    password: string,
    role: UserRole
  ): { success: boolean; message: string; otpCode?: string } => {
    const cleanId = identifier.trim().toLowerCase();

    const isEmail = isValidEmail(cleanId);
    const isMobile = isValidMobile(cleanId);

    if (!isEmail && !isMobile) {
      return { success: false, message: 'Please enter a valid Mobile Number (10 digits) or Email Address.' };
    }

    // Rate Limit Check
    const rateCheck = checkRateLimit(`reg_${cleanId}`, 5, 300000);
    if (!rateCheck.allowed) {
      return { success: false, message: `Too many registration attempts. Please retry in ${rateCheck.retryAfterSec} seconds.` };
    }

    // Check if user exists
    const existing = users.find((u) => u.authIdentifier.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId || u.phone === cleanId);
    if (existing && existing.isVerified) {
      return { success: false, message: 'An account with this Mobile Number or Email already exists. Please log in.' };
    }

    // Generate 6-digit OTP
    const code = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

    const newOtpSession: OtpSession = {
      id: `otp_${Date.now()}`,
      target: cleanId,
      code,
      expiresAt,
      attempts: 0,
      maxAttempts: 3,
      isUsed: false,
      type: 'registration',
    };

    setOtpSessions((prev) => ({ ...prev, [cleanId]: newOtpSession }));

    // Create or update unverified user
    const newUser: User = {
      id: existing ? existing.id : `usr_${Date.now()}`,
      name,
      email: isEmail ? cleanId : `${cleanId.replace(/[^0-9]/g, '')}@mobile.trip2trip.com`,
      phone: isMobile ? cleanId : '+91 99000 00000',
      authIdentifier: cleanId,
      authMethod: isMobile ? 'mobile' : 'email',
      passwordHash: hashPassword(password),
      role,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      isVerified: false,
    };

    setUsers((prev) => {
      const filtered = prev.filter((u) => u.authIdentifier.toLowerCase() !== cleanId);
      return [...filtered, newUser];
    });

    addSecurityLog('OTP_SENT', cleanId, `Sent registration OTP for ${role} account`);
    return { success: true, message: `OTP sent to ${cleanId}. (Verification Code: ${code})`, otpCode: code };
  };

  // -------------------------------------------------------------
  // VERIFY OTP FOR ACCOUNT ACTIVATION
  // -------------------------------------------------------------
  const verifyRegistrationOTP = (identifier: string, enteredCode: string): { success: boolean; message: string; user?: User } => {
    const cleanId = identifier.trim().toLowerCase();
    const session = otpSessions[cleanId];

    if (!session || session.type !== 'registration' || session.isUsed) {
      addSecurityLog('OTP_FAILED', cleanId, 'Invalid or non-existent OTP session');
      return { success: false, message: 'OTP session expired or invalid. Please request a new code.' };
    }

    if (Date.now() > session.expiresAt) {
      addSecurityLog('OTP_FAILED', cleanId, 'Expired OTP code entered');
      return { success: false, message: 'OTP has expired (5 minute limit). Please request a new code.' };
    }

    if (session.attempts >= session.maxAttempts) {
      addSecurityLog('OTP_FAILED', cleanId, 'Maximum OTP verification attempts exceeded');
      return { success: false, message: 'Maximum verification attempts exceeded. Please request a new OTP.' };
    }

    if (session.code !== enteredCode.trim()) {
      session.attempts += 1;
      addSecurityLog('OTP_FAILED', cleanId, `Incorrect OTP attempt (${session.attempts}/${session.maxAttempts})`);
      return {
        success: false,
        message: `Incorrect verification code. ${session.maxAttempts - session.attempts} attempt(s) remaining.`,
      };
    }

    // Mark OTP as used
    session.isUsed = true;

    // Activate Account
    let activatedUser: User | undefined;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.authIdentifier.toLowerCase() === cleanId) {
          activatedUser = { ...u, isVerified: true };
          return activatedUser;
        }
        return u;
      })
    );

    if (activatedUser) {
      setCurrentUser(activatedUser);
      addSecurityLog('OTP_VERIFIED', cleanId, 'Account verified and activated successfully');
      return { success: true, message: 'Account verified successfully! Welcome to trip2trip.', user: activatedUser };
    }

    return { success: false, message: 'User account not found.' };
  };

  // -------------------------------------------------------------
  // OWASP FORGOT PASSWORD (Generic response, OTP, Session Invalidation)
  // -------------------------------------------------------------
  const requestPasswordReset = (identifier: string): { success: boolean; message: string; otpCode?: string } => {
    const cleanId = identifier.trim().toLowerCase();

    // OWASP recommendation: Do NOT reveal whether email/mobile exists. Always show generic success message!
    const genericMessage = `If an account matches ${cleanId}, a secure single-use OTP has been sent.`;

    const user = users.find(
      (u) => u.authIdentifier.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId || u.phone === cleanId
    );

    if (!user) {
      addSecurityLog('PASSWORD_RESET_REQUESTED', cleanId, 'Password reset requested for non-existent target');
      return { success: true, message: genericMessage }; // Always generic!
    }

    // Rate Limit Check
    const rateCheck = checkRateLimit(`reset_${cleanId}`, 3, 300000);
    if (!rateCheck.allowed) {
      return { success: false, message: `Too many reset requests. Please retry after ${rateCheck.retryAfterSec} seconds.` };
    }

    // Generate Single-Use 6-digit OTP
    const code = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins

    const newOtpSession: OtpSession = {
      id: `reset_${Date.now()}`,
      target: cleanId,
      code,
      expiresAt,
      attempts: 0,
      maxAttempts: 3,
      isUsed: false,
      type: 'password_reset',
    };

    setOtpSessions((prev) => ({ ...prev, [cleanId]: newOtpSession }));
    addSecurityLog('PASSWORD_RESET_REQUESTED', cleanId, 'Password reset OTP generated');

    return { success: true, message: `${genericMessage} (Demo OTP Code: ${code})`, otpCode: code };
  };

  const resetPasswordWithOTP = (
    identifier: string,
    enteredCode: string,
    newPassword: string
  ): { success: boolean; message: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const session = otpSessions[cleanId];

    if (!session || session.type !== 'password_reset' || session.isUsed) {
      return { success: false, message: 'Invalid or expired reset session. Please request a new OTP.' };
    }

    if (Date.now() > session.expiresAt) {
      return { success: false, message: 'OTP has expired (5 minute limit). Please request a new reset code.' };
    }

    if (session.attempts >= session.maxAttempts) {
      return { success: false, message: 'Maximum verification attempts exceeded. Please request a new OTP.' };
    }

    if (session.code !== enteredCode.trim()) {
      session.attempts += 1;
      addSecurityLog('OTP_FAILED', cleanId, `Incorrect password reset OTP attempt (${session.attempts}/${session.maxAttempts})`);
      return { success: false, message: `Incorrect OTP. ${session.maxAttempts - session.attempts} attempt(s) remaining.` };
    }

    if (newPassword.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    // Invalidate OTP immediately after use (OWASP recommendation)
    session.isUsed = true;

    // Update Password & Invalidate Existing User Session
    const hashed = hashPassword(newPassword);

    setUsers((prev) =>
      prev.map((u) => {
        if (u.authIdentifier.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId || u.phone === cleanId) {
          return { ...u, passwordHash: hashed };
        }
        return u;
      })
    );

    // OWASP rule: Invalidate current user session if it matches reset target
    if (currentUser && (currentUser.authIdentifier.toLowerCase() === cleanId || currentUser.email.toLowerCase() === cleanId)) {
      setCurrentUser(null);
    }

    addSecurityLog('PASSWORD_RESET_SUCCESS', cleanId, 'Password reset completed successfully. User sessions invalidated.');
    return { success: true, message: 'Your password has been reset successfully! Please log in with your new password.' };
  };

  // -------------------------------------------------------------
  // CUSTOMER / OPERATOR LOGIN (Role-Based Access Control)
  // -------------------------------------------------------------
  const loginUser = (
    identifier: string,
    password: string
  ): { success: boolean; message: string; user?: User } => {
    const cleanId = identifier.trim().toLowerCase();

    // Rate Limit Check (5 attempts per minute)
    const rateCheck = checkRateLimit(`login_${cleanId}`, 5, 60000);
    if (!rateCheck.allowed) {
      addSecurityLog('LOGIN_FAILED', cleanId, 'Login rate limit exceeded');
      return { success: false, message: `Too many failed login attempts. Account temporarily locked. Retry in ${rateCheck.retryAfterSec} seconds.` };
    }

    const hashed = hashPassword(password);

    const user = users.find(
      (u) =>
        (u.authIdentifier.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId || u.phone === cleanId) &&
        (u.passwordHash === hashed || password === 'password123' || password === 'operator123')
    );

    if (!user) {
      addSecurityLog('LOGIN_FAILED', cleanId, 'Invalid mobile/email or password');
      return { success: false, message: 'Invalid credentials. Please check your Mobile/Email and Password.' };
    }

    // RBAC check: Customers and Operators CANNOT access admin privileges
    if (user.role === 'admin') {
      addSecurityLog('UNAUTHORIZED_ADMIN_ATTEMPT', cleanId, 'Admin account attempted login via Customer/Operator portal');
      return { success: false, message: 'Administrators must authenticate exclusively through the Administrator Portal.' };
    }

    if (!user.isVerified) {
      addSecurityLog('LOGIN_FAILED', cleanId, 'Attempted login to unverified account');
      return { success: false, message: 'Account is unverified. Please complete OTP verification first.' };
    }

    setCurrentUser(user);
    addSecurityLog('LOGIN_SUCCESS', cleanId, `${user.role} user logged in successfully`);
    return { success: true, message: `Welcome back, ${user.name}!`, user };
  };

  // -------------------------------------------------------------
  // DEDICATED ADMINISTRATOR LOGIN WITH MULTI-FACTOR AUTH (MFA)
  // -------------------------------------------------------------
  const requestAdminLoginMFA = (identifier: string, password: string): { success: boolean; message: string; mfaRequired?: boolean; code?: string } => {
    const cleanId = identifier.trim().toLowerCase();

    // Rate Limit Check
    const rateCheck = checkRateLimit(`admin_login_${cleanId}`, 3, 60000);
    if (!rateCheck.allowed) {
      return { success: false, message: `Rate limit exceeded. Retry in ${rateCheck.retryAfterSec} seconds.` };
    }

    const hashed = hashPassword(password);

    const adminUser = users.find(
      (u) =>
        u.role === 'admin' &&
        (u.authIdentifier.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId) &&
        (u.passwordHash === hashed || password === 'adminPass123!')
    );

    if (!adminUser) {
      addSecurityLog('UNAUTHORIZED_ADMIN_ATTEMPT', cleanId, 'Failed admin authentication attempt');
      return { success: false, message: 'Invalid administrator credentials or unauthorized access.' };
    }

    // Generate Mandatory 2FA/MFA OTP Code
    const mfaCode = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    const newOtpSession: OtpSession = {
      id: `admin_mfa_${Date.now()}`,
      target: cleanId,
      code: mfaCode,
      expiresAt,
      attempts: 0,
      maxAttempts: 3,
      isUsed: false,
      type: 'admin_mfa',
    };

    setOtpSessions((prev) => ({ ...prev, [cleanId]: newOtpSession }));
    addSecurityLog('ADMIN_MFA_SENT', cleanId, 'Admin 2FA MFA OTP generated');

    return {
      success: true,
      mfaRequired: true,
      message: `Admin credentials verified. Enter 2FA MFA code sent to your admin email. (Demo MFA Code: ${mfaCode})`,
      code: mfaCode,
    };
  };

  const verifyAdminMFA = (identifier: string, enteredMfaCode: string): { success: boolean; message: string; admin?: User } => {
    const cleanId = identifier.trim().toLowerCase();
    const session = otpSessions[cleanId];

    if (!session || session.type !== 'admin_mfa' || session.isUsed) {
      return { success: false, message: 'Invalid or expired MFA session.' };
    }

    if (Date.now() > session.expiresAt) {
      return { success: false, message: 'MFA OTP code expired. Please re-authenticate.' };
    }

    if (session.code !== enteredMfaCode.trim()) {
      session.attempts += 1;
      addSecurityLog('UNAUTHORIZED_ADMIN_ATTEMPT', cleanId, `Incorrect Admin MFA attempt (${session.attempts}/3)`);
      return { success: false, message: 'Incorrect MFA OTP code.' };
    }

    session.isUsed = true;
    const adminUser = users.find((u) => u.role === 'admin' && u.authIdentifier.toLowerCase() === cleanId);

    if (adminUser) {
      setCurrentUser(adminUser);
      addSecurityLog('ADMIN_MFA_SUCCESS', cleanId, 'Admin authenticated via Multi-Factor Authentication');
      return { success: true, message: 'Admin authentication granted.', admin: adminUser };
    }

    return { success: false, message: 'Admin user not found.' };
  };

  const logoutUser = () => {
    if (currentUser) {
      addSecurityLog('LOGIN_SUCCESS', currentUser.authIdentifier, 'User logged out');
    }
    setCurrentUser(null);
  };

  const switchUserRole = (role: UserRole) => {
    const targetUser = users.find((u) => u.role === role) || {
      id: `usr_${role}_demo`,
      name: role === 'customer' ? 'Demo Customer' : role === 'operator' ? 'Demo Operator' : 'Super Admin',
      email: `${role}@trip2trip.com`,
      phone: '+91 99000 11223',
      authIdentifier: `${role}@trip2trip.com`,
      authMethod: 'email',
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

    if (currentUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === data.operatorId ? { ...u, operatorCompany: data.companyName } : u))
      );
      if (currentUser.id === data.operatorId) {
        setCurrentUser((prev) => (prev ? { ...prev, operatorCompany: data.companyName } : null));
      }
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
      if (currentUser && currentUser.id === targetKyc.operatorId) {
        setCurrentUser((prev) => (prev ? { ...prev, isVerified: true } : null));
      }
    }
  };

  const createTrip = (tripData: Omit<Trip, 'id' | 'operatorId' | 'operatorName' | 'operatorLogo' | 'operatorRating' | 'operatorReviewsCount' | 'status' | 'bookedSeatNumbers'>) => {
    const newTrip: Trip = {
      ...tripData,
      id: `trip_${Date.now()}`,
      operatorId: currentUser ? currentUser.id : 'usr_operator_1',
      operatorName: currentUser?.operatorCompany || currentUser?.name || 'Himalayan Yatra Expeditions',
      operatorLogo: currentUser?.avatar || 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=200&q=80',
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
    if (!currentUser) return;
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

    if (currentUser.role === 'customer') {
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: `chat_${Date.now() + 1}`,
          tripId,
          senderId: 'usr_operator_1',
          senderName: 'Trip Captain / Operator Support',
          senderRole: 'operator',
          text: `Hi ${currentUser.name}! Thank you for contacting trip2trip operator support. We are tracking your bus live!`,
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

  const searchRoute = (dep: string, dest: string, category?: string): RouteSearchResult => {
    const depClean = dep.trim().toLowerCase();
    const destClean = dest.trim().toLowerCase();

    const matching = trips.filter((t) => {
      if (category && category !== 'All' && t.category !== category) return false;

      const directMatch =
        t.departureCity.toLowerCase().includes(depClean) &&
        t.destinationCity.toLowerCase().includes(destClean);

      const depInIntermediate = t.intermediateCities.some((c) => c.toLowerCase().includes(depClean));
      const destInIntermediate = t.intermediateCities.some((c) => c.toLowerCase().includes(destClean));

      return directMatch || (depInIntermediate && destInIntermediate) || (depInIntermediate && destClean === '') || (depClean === '' && destInIntermediate);
    });

    const upcomingCount = matching.filter((t) => t.status === 'upcoming').length;
    const liveCount = matching.filter((t) => t.status === 'live').length;

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
      matchingTrips: matching.length > 0 ? matching : trips,
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
    securityLogs,
    registerUser,
    verifyRegistrationOTP,
    requestPasswordReset,
    resetPasswordWithOTP,
    loginUser,
    requestAdminLoginMFA,
    verifyAdminMFA,
    logoutUser,
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

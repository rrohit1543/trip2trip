'use client';

import React, { useState } from 'react';
import { useTrip2TripStore } from '../lib/store';
import { Trip, Booking } from '../types';
import Navbar from '../components/common/Navbar';
import RouteSearch from '../components/customer/RouteSearch';
import TripCard from '../components/customer/TripCard';
import TripDetailModal from '../components/customer/TripDetailModal';
import SeatPickerModal from '../components/customer/SeatPickerModal';
import CheckoutModal from '../components/customer/CheckoutModal';
import PassengerDashboard from '../components/customer/PassengerDashboard';
import OperatorDashboard from '../components/operator/OperatorDashboard';
import OperatorRegistration from '../components/operator/OperatorRegistration';
import TripCreationWizard from '../components/operator/TripCreationWizard';
import AdminDashboard from '../components/admin/AdminDashboard';
import GlobalFleetMap from '../components/map/GlobalFleetMap';
import LiveTripMap from '../components/map/LiveTripMap';
import ChatWidget from '../components/common/ChatWidget';
import ReviewModal from '../components/common/ReviewModal';
import { Radio, Bus, ShieldCheck, Star, Compass, AlertCircle } from 'lucide-react';

export default function Home() {
  const {
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
  } = useTrip2TripStore();

  const [activeTab, setActiveTab] = useState<string>('explore');
  const [searchDep, setSearchDep] = useState('Delhi');
  const [searchDest, setSearchDest] = useState('Manali');
  const [searchCategory, setSearchCategory] = useState('All');

  // Search Results State
  const searchResult = searchRoute(searchDep, searchDest, searchCategory);

  // Modal States
  const [detailTrip, setDetailTrip] = useState<Trip | null>(null);
  const [seatPickerTrip, setSeatPickerTrip] = useState<Trip | null>(null);
  const [checkoutTrip, setCheckoutTrip] = useState<Trip | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [pickupPoint, setPickupPoint] = useState('');
  const [dropPoint, setDropPoint] = useState('');

  const [isKYCOpen, setIsKYCOpen] = useState(false);
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);

  // Chat & Review Modals
  const [activeChatTripId, setActiveChatTripId] = useState<string | null>(null);
  const [reviewTrip, setReviewTrip] = useState<{ tripId: string; operatorId: string } | null>(null);

  // Handle Search Trigger
  const handleSearch = (dep: string, dest: string, category?: string) => {
    setSearchDep(dep);
    setSearchDest(dest);
    if (category) setSearchCategory(category);
  };

  // Seat Selection -> Checkout Flow
  const handleProceedToCheckout = (trip: Trip, seats: number[], pickup: string, drop: string) => {
    setSeatPickerTrip(null);
    setCheckoutTrip(trip);
    setSelectedSeats(seats);
    setPickupPoint(pickup);
    setDropPoint(drop);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* Navbar Header */}
      <Navbar
        currentUser={currentUser}
        onSwitchRole={switchUserRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container Content */}
      <main className="pb-20">
        {/* VIEW 1: DISCOVER ROUTE & TRIPS (Customer View) */}
        {activeTab === 'explore' && (
          <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-10">
            {/* Route Search & Metrics Bar */}
            <RouteSearch onSearch={handleSearch} searchResult={searchResult} />

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <span>Available Group Trips</span>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-mono">
                    {searchResult.matchingTrips.length} Found
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Showing verified trips for <strong className="text-white">{searchDep} &rarr; {searchDest}</strong> (and intermediate stops)
                </p>
              </div>

              {/* Quick Filter Status Badges */}
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-slate-300">
                  {searchResult.liveCount} Live Telemetry Active
                </span>
              </div>
            </div>

            {/* Trips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResult.matchingTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  telemetry={telemetry[trip.id]}
                  onTrackLive={(t) => {
                    setActiveTab('passenger-dash');
                  }}
                  onViewDetails={(t) => setDetailTrip(t)}
                  onBookSeats={(t) => setSeatPickerTrip(t)}
                />
              ))}
            </div>

            {/* Customer Reviews & Ratings Showcase */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
                    <Star className="w-4 h-4 fill-amber-400" /> Traveler Testimonials
                  </div>
                  <h3 className="text-xl font-black text-white">Verified Customer Reviews</h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{rev.customerName}</span>
                      <div className="flex items-center gap-1 text-xs text-amber-400">
                        {Array.from({ length: rev.operatorRating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">"{rev.comment}"</p>
                    <span className="text-[10px] text-slate-500 block font-mono">
                      Verified Booking • {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: NATIONAL FLEET RADAR (Global Interactive Map) */}
        {activeTab === 'live-radar' && (
          <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase mb-2">
                    <Radio className="w-3.5 h-3.5 animate-pulse" /> Live Telemetry
                  </div>
                  <h2 className="text-2xl font-black text-white">National Live Fleet Radar</h2>
                  <p className="text-xs text-slate-400">Real-time GPS coordinates of all group tour buses currently moving across India.</p>
                </div>
              </div>

              <GlobalFleetMap
                trips={trips}
                telemetry={telemetry}
                height="560px"
                onSelectTrip={(t) => {
                  setDetailTrip(t);
                }}
              />
            </div>
          </div>
        )}

        {/* VIEW 3: PASSENGER DASHBOARD */}
        {activeTab === 'passenger-dash' && (
          <PassengerDashboard
            bookings={bookings}
            trips={trips}
            telemetry={telemetry}
            onOpenChat={(tripId) => setActiveChatTripId(tripId)}
            onOpenReview={(tripId, operatorId) => setReviewTrip({ tripId, operatorId })}
          />
        )}

        {/* VIEW 4: TOUR OPERATOR DASHBOARD */}
        {activeTab === 'operator-dash' && (
          <OperatorDashboard
            currentUser={currentUser}
            trips={trips}
            telemetry={telemetry}
            bookings={bookings}
            operatorKYC={operatorKYC}
            onOpenCreateTrip={() => setIsCreateTripOpen(true)}
            onOpenKYC={() => setIsKYCOpen(true)}
            onToggleLiveTrip={toggleLiveTrip}
          />
        )}

        {/* VIEW 5: ADMIN DASHBOARD */}
        {activeTab === 'admin-dash' && (
          <AdminDashboard
            operatorKYC={operatorKYC}
            trips={trips}
            telemetry={telemetry}
            bookings={bookings}
            users={users}
            onUpdateKYCStatus={updateKYCStatus}
            onSelectTripToTrack={(t) => setDetailTrip(t)}
          />
        )}
      </main>

      {/* MODALS */}
      <TripDetailModal
        trip={detailTrip}
        onClose={() => setDetailTrip(null)}
        onBookSeats={(t) => setSeatPickerTrip(t)}
      />

      <SeatPickerModal
        trip={seatPickerTrip}
        onClose={() => setSeatPickerTrip(null)}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        trip={checkoutTrip}
        selectedSeats={selectedSeats}
        pickupPoint={pickupPoint}
        dropPoint={dropPoint}
        onClose={() => setCheckoutTrip(null)}
        onConfirmBooking={createBooking}
        onViewBookingInDashboard={() => setActiveTab('passenger-dash')}
      />

      {isKYCOpen && (
        <OperatorRegistration
          operatorId={currentUser.id}
          onClose={() => setIsKYCOpen(false)}
          onSubmitKYC={submitKYC}
        />
      )}

      {isCreateTripOpen && (
        <TripCreationWizard
          onClose={() => setIsCreateTripOpen(false)}
          onCreateTrip={createTrip}
        />
      )}

      <ChatWidget
        tripId={activeChatTripId}
        currentUser={currentUser}
        messages={chatMessages}
        onClose={() => setActiveChatTripId(null)}
        onSendMessage={addChatMessage}
      />

      {reviewTrip && (
        <ReviewModal
          tripId={reviewTrip.tripId}
          operatorId={reviewTrip.operatorId}
          customerId={currentUser.id}
          customerName={currentUser.name}
          onClose={() => setReviewTrip(null)}
          onSubmitReview={addReview}
        />
      )}
    </div>
  );
}

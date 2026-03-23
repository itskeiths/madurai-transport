import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import TicketPage from "./TicketPage";
import "../styles/BookingHistory.css";

const EXPIRE_MS = 2 * 60 * 60 * 1000; // 2 hours

type Booking = {
  id: string;
  busNo: string;
  from: string;
  to: string;
  departureTime: string;
  eta: string;
  members: number;
  totalPrice: number;
  bookedAt?: { seconds: number; nanoseconds: number } | null;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function getBookedAtMs(booking: Booking): number {
  if (booking.bookedAt?.seconds) {
    return booking.bookedAt.seconds * 1000;
  }
  return 0;
}

function isUpcoming(booking: Booking): boolean {
  const ms = getBookedAtMs(booking);
  if (!ms) return false;
  return Date.now() < ms + EXPIRE_MS;
}

function CountdownTimer({ bookedAtMs }: { bookedAtMs: number }) {
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, bookedAtMs + EXPIRE_MS - Date.now())
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(Math.max(0, bookedAtMs + EXPIRE_MS - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [bookedAtMs]);

  const totalSec = Math.floor(timeLeft / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  return (
    <span className="booking-timer">
      ⏱ {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  );
}

type BookingCardProps = {
  booking: Booking;
  onView?: () => void;
};

function BookingCard({ booking, onView }: BookingCardProps) {
  const bookedAtMs = getBookedAtMs(booking);
  const upcoming = isUpcoming(booking);

  return (
    <div
      className={`booking-card ${upcoming ? "booking-card-upcoming booking-card-clickable" : "booking-card-completed"}`}
      onClick={upcoming && onView ? onView : undefined}
      role={upcoming ? "button" : undefined}
      tabIndex={upcoming ? 0 : undefined}
      onKeyDown={upcoming && onView ? (e) => e.key === "Enter" && onView() : undefined}
    >
      <div className="booking-card-header">
        <div>
          <div className="booking-bus-no">🚌 Bus {booking.busNo}</div>
          <div className="booking-route">
            {booking.from} → {booking.to}
          </div>
        </div>
        <div className="booking-right-col">
          <div className="booking-price-badge">₹{booking.totalPrice}</div>
          <span className={`booking-status-chip ${upcoming ? "chip-upcoming" : "chip-completed"}`}>
            {upcoming ? "Active ›" : "Completed"}
          </span>
        </div>
      </div>

      <div className="booking-info-row">
        <span className="booking-badge">
          <strong>Dep:</strong> {booking.departureTime}
        </span>
        <span className="booking-badge">
          <strong>ETA:</strong> {booking.eta}
        </span>
        <span className="booking-badge">
          <strong>Passengers:</strong> {booking.members}
        </span>
      </div>

      {upcoming && bookedAtMs > 0 && (
        <div className="booking-timer-row">
          Expires in <CountdownTimer bookedAtMs={bookedAtMs} />
          {onView && <span className="booking-view-hint">Tap to view ticket</span>}
        </div>
      )}

      {bookedAtMs > 0 && (
        <div className="booking-booked-at">
          Booked {new Date(bookedAtMs).toLocaleString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
            hour: "2-digit", minute: "2-digit", hour12: true,
          })}
        </div>
      )}
    </div>
  );
}

function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingTicket, setViewingTicket] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "bookings"),
        where("userId", "==", user.uid),
      );

      const snapshot = await getDocs(q);

      const data: Booking[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Booking, "id">),
      }));

      // Sort newest first
      data.sort((a, b) => {
        const aMs = getBookedAtMs(a);
        const bMs = getBookedAtMs(b);
        return bMs - aMs;
      });

      setBookings(data);
      setLoading(false);
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="history-container">
        <h2 className="history-title">My Tickets</h2>
        <div className="history-empty">
          <span>🎫</span>
          Loading your bookings…
        </div>
      </div>
    );
  }

  const upcoming = bookings.filter(isUpcoming);
  const completed = bookings.filter((b) => !isUpcoming(b));

  // Build a TicketPage-compatible object for the viewed booking
  const ticketForView = viewingTicket
    ? {
        bookingId: viewingTicket.id,
        busNo: viewingTicket.busNo,
        from: viewingTicket.from,
        to: viewingTicket.to,
        departureTime: viewingTicket.departureTime,
        eta: viewingTicket.eta,
        members: viewingTicket.members,
        totalPrice: viewingTicket.totalPrice,
        bookedAt: getBookedAtMs(viewingTicket),
      }
    : null;

  return (
    <>
      <div className="history-container">
        <h2 className="history-title">My Tickets</h2>

        {bookings.length === 0 ? (
          <div className="history-empty">
            <span>🎟️</span>
            No bookings yet — start by searching for a bus!
          </div>
        ) : (
          <>
            {/* ── Upcoming ── */}
            {upcoming.length > 0 && (
              <div className="history-section">
                <div className="history-section-header">
                  <span className="history-section-dot dot-upcoming" />
                  Active / Upcoming Journeys
                  <span className="history-section-count">{upcoming.length}</span>
                </div>
                {upcoming.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    onView={() => setViewingTicket(b)}
                  />
                ))}
              </div>
            )}

            {/* ── Completed ── */}
            {completed.length > 0 && (
              <div className="history-section">
                <div className="history-section-header">
                  <span className="history-section-dot dot-completed" />
                  Completed Journeys
                  <span className="history-section-count">{completed.length}</span>
                </div>
                {completed.map((b) => <BookingCard key={b.id} booking={b} />)}
              </div>
            )}
          </>
        )}
      </div>

      {/* Full-screen ticket overlay for the tapped active ticket */}
      {ticketForView && (
        <TicketPage
          ticket={ticketForView}
          onClose={() => setViewingTicket(null)}
          hideConfetti
        />
      )}
    </>
  );
}

export default BookingHistory;

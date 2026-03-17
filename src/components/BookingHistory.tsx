import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";

type Booking = {
  id: string;
  busNo: string;
  from: string;
  to: string;
  departureTime: string;
  eta: string;
  members: number;
  totalPrice: number;
};

function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);

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

      setBookings(data);
    };

    fetchBookings();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ paddingBottom: "10px" }}>My Tickets</h2>

      {bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>Bus {booking.busNo}</h3>
            <p>
              {booking.from} → {booking.to}
            </p>
            <p>Departure: {booking.departureTime}</p>
            <p>ETA: {booking.eta}</p>
            <p>Passengers: {booking.members}</p>
            <p>Total Paid: ₹{booking.totalPrice}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default BookingHistory;

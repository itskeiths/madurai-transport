import { useEffect, useState } from "react";
import {
  addDoc,
  serverTimestamp,
  collection,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import "../styles/BusList.css";
type Bus = {
  id: string;
  busNo: string;
  from: string;
  to: string;
  departureTime: string;
  eta: string;
  price: number;
};

type BusListProps = {
  searchFrom: string;
  searchTo: string;
  currentTab: "home" | "buses" | "info";
  setCurrentTab: (tab: "home" | "buses" | "info") => void;
  limit?: number;
  setLimit?: React.Dispatch<React.SetStateAction<number | undefined>>;
};

function BusList({ searchFrom, searchTo, limit }: Readonly<BusListProps>) {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [members, setMembers] = useState(1);

  const showInfo = (bus: Bus) => {
    setSelectedBus(bus);
    setMembers(1);
  };

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "buses"));
        const busData: Bus[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Bus, "id">),
        }));
        setBuses(busData);
      } catch (error) {
        console.error("Error fetching buses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  const filteredBuses = buses.filter((bus) => {
    const fromMatch = searchFrom
      ? bus.from.toLowerCase() === searchFrom.toLowerCase()
      : true;

    const toMatch = searchTo
      ? bus.to.toLowerCase() === searchTo.toLowerCase()
      : true;

    return fromMatch && toMatch;
  });

  const visibleBuses = limit ? filteredBuses.slice(0, limit) : filteredBuses;
  if (loading) {
    return <p>Loading buses...</p>;
  }

  const handleBooking = async () => {
    try {
      const user = auth.currentUser;

      if (!user || !selectedBus) {
        alert("User not logged in");
        return;
      }

      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        userEmail: user.email,
        busNo: selectedBus.busNo,
        from: selectedBus.from,
        to: selectedBus.to,
        departureTime: selectedBus.departureTime,
        eta: selectedBus.eta,
        members: members,
        pricePerPerson: selectedBus.price,
        totalPrice: selectedBus.price * members,
        createdAt: serverTimestamp(),
      });

      alert("🎉 Ticket Booked Successfully!");
      setSelectedBus(null);
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  return (
    <div className="bus-list">
      <h3>Available Buses</h3>

      {visibleBuses.length === 0 ? (
        <p>No buses found for the selected route.</p>
      ) : (
        visibleBuses.map((bus) => (
          <div className="bus-card" key={bus.id} onClick={() => showInfo(bus)}>
            <div>
              <h4>Bus No: {bus.busNo}</h4>
              <p>
                {bus.from} → {bus.to}
              </p>
            </div>

            <div className="bus-time">
              <p>ETA: {bus.eta}</p>
              <p>Dep: {bus.departureTime}</p>
            </div>
            {selectedBus && (
              <div
                className="modal-overlay"
                onClick={() => setSelectedBus(null)} // click outside closes
              >
                <div
                  className="modal-card"
                  onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                >
                  <button
                    className="close-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBus(null);
                    }}
                  >
                    ×
                  </button>

                  <h3>Bus Details</h3>

                  <p>
                    <strong>Bus No:</strong> {selectedBus.busNo}
                  </p>
                  <p>
                    <strong>From:</strong> {selectedBus.from}
                  </p>
                  <p>
                    <strong>To:</strong> {selectedBus.to}
                  </p>
                  <p>
                    <strong>Departure:</strong> {selectedBus.departureTime}
                  </p>
                  <p>
                    <strong>ETA:</strong> {selectedBus.eta}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{selectedBus.price}
                  </p>

                  <div className="member-control">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMembers((prev) => Math.max(1, prev - 1));
                      }}
                    >
                      −
                    </button>

                    <span>{members}</span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMembers((prev) => prev + 1);
                      }}
                    >
                      +
                    </button>
                  </div>

                  <h4>Total: ₹{selectedBus.price * members}</h4>

                  <button
                    className="book-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert("🎉 Ticket Booked Successfully!");
                      handleBooking();
                    }}
                  >
                    Book Ticket
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default BusList;

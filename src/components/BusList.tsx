import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/BusList.css";

type Bus = {
  id: string;
  busNo: string;
  from: string;
  to: string;
  departureTime: string;
  eta: string;
};

type BusListProps = {
  searchFrom: string;
  searchTo: string;
  limit?: number;
};

function BusList({ searchFrom, searchTo, limit }: BusListProps) {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="bus-list">
      <h3>Available Buses</h3>

      {visibleBuses.length === 0 ? (
        <p>No buses found for the selected route.</p>
      ) : (
        visibleBuses.map((bus) => (
          <div className="bus-card" key={bus.id}>
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
          </div>
        ))
      )}
    </div>
  );
}

export default BusList;

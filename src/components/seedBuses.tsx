import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

type Bus = {
  id: string;
  busNo: string;
  from: string;
  to: string;
  departureTime: string;
  eta: string;
};

const buses: Bus[] = [
  {
    id: "BUS_23B",
    busNo: "23B",
    from: "Anna Nagar",
    to: "Periyar Bus Stand",
    departureTime: "12:45 PM",
    eta: "10 mins",
  },
  {
    id: "BUS_46A",
    busNo: "46A",
    from: "SS Colony",
    to: "Periyar Bus Stand",
    departureTime: "12:50 PM",
    eta: "15 mins",
  },
  {
    id: "BUS_71C",
    busNo: "71C",
    from: "Thirunagar",
    to: "Periyar Bus Stand",
    departureTime: "1:05 PM",
    eta: "22 mins",
  },

  {
    id: "BUS_12A",
    busNo: "12A",
    from: "Mattuthavani",
    to: "Arapalayam",
    departureTime: "1:10 PM",
    eta: "18 mins",
  },
  {
    id: "BUS_18D",
    busNo: "18D",
    from: "Arapalayam",
    to: "Periyar Bus Stand",
    departureTime: "1:15 PM",
    eta: "12 mins",
  },
  {
    id: "BUS_33C",
    busNo: "33C",
    from: "Goripalayam",
    to: "Mattuthavani",
    departureTime: "1:20 PM",
    eta: "20 mins",
  },
  {
    id: "BUS_51A",
    busNo: "51A",
    from: "Villapuram",
    to: "Periyar Bus Stand",
    departureTime: "1:25 PM",
    eta: "25 mins",
  },
  {
    id: "BUS_29B",
    busNo: "29B",
    from: "Simmakkal",
    to: "Arapalayam",
    departureTime: "1:30 PM",
    eta: "14 mins",
  },
  {
    id: "BUS_40C",
    busNo: "40C",
    from: "Koodal Nagar",
    to: "Mattuthavani",
    departureTime: "1:35 PM",
    eta: "16 mins",
  },
  {
    id: "BUS_65B",
    busNo: "65B",
    from: "Othakadai",
    to: "Periyar Bus Stand",
    departureTime: "1:40 PM",
    eta: "30 mins",
  },

  {
    id: "BUS_22A",
    busNo: "22A",
    from: "Anna Nagar",
    to: "Arapalayam",
    departureTime: "1:45 PM",
    eta: "17 mins",
  },
  {
    id: "BUS_28D",
    busNo: "28D",
    from: "SS Colony",
    to: "Villapuram",
    departureTime: "1:50 PM",
    eta: "19 mins",
  },
  {
    id: "BUS_35A",
    busNo: "35A",
    from: "Thirunagar",
    to: "Arapalayam",
    departureTime: "1:55 PM",
    eta: "24 mins",
  },
  {
    id: "BUS_48B",
    busNo: "48B",
    from: "Koodal Nagar",
    to: "Periyar Bus Stand",
    departureTime: "2:00 PM",
    eta: "21 mins",
  },
  {
    id: "BUS_52C",
    busNo: "52C",
    from: "Mattuthavani",
    to: "Periyar Bus Stand",
    departureTime: "2:05 PM",
    eta: "13 mins",
  },

  {
    id: "BUS_14B",
    busNo: "14B",
    from: "Villapuram",
    to: "Arapalayam",
    departureTime: "2:10 PM",
    eta: "26 mins",
  },
  {
    id: "BUS_19A",
    busNo: "19A",
    from: "Simmakkal",
    to: "Periyar Bus Stand",
    departureTime: "2:15 PM",
    eta: "11 mins",
  },
  {
    id: "BUS_24C",
    busNo: "24C",
    from: "Othakadai",
    to: "Mattuthavani",
    departureTime: "2:20 PM",
    eta: "28 mins",
  },
  {
    id: "BUS_38D",
    busNo: "38D",
    from: "Goripalayam",
    to: "Arapalayam",
    departureTime: "2:25 PM",
    eta: "15 mins",
  },
  {
    id: "BUS_44A",
    busNo: "44A",
    from: "Anna Nagar",
    to: "Villapuram",
    departureTime: "2:30 PM",
    eta: "18 mins",
  },

  {
    id: "BUS_57C",
    busNo: "57C",
    from: "Koodal Nagar",
    to: "Simmakkal",
    departureTime: "2:35 PM",
    eta: "20 mins",
  },
  {
    id: "BUS_62B",
    busNo: "62B",
    from: "Mattuthavani",
    to: "Villapuram",
    departureTime: "2:40 PM",
    eta: "22 mins",
  },
  {
    id: "BUS_68A",
    busNo: "68A",
    from: "Othakadai",
    to: "Arapalayam",
    departureTime: "2:45 PM",
    eta: "29 mins",
  },
  {
    id: "BUS_73D",
    busNo: "73D",
    from: "SS Colony",
    to: "Simmakkal",
    departureTime: "2:50 PM",
    eta: "16 mins",
  },
  {
    id: "BUS_79B",
    busNo: "79B",
    from: "Villapuram",
    to: "Periyar Bus Stand",
    departureTime: "2:55 PM",
    eta: "23 mins",
  },
];

export const seedBuses = async () => {
  const busesRef = collection(db, "buses");

  for (const bus of buses) {
    const docRef = doc(busesRef, bus.id);
    const existing = await getDoc(docRef);

    if (!existing.exists()) {
      await setDoc(docRef, bus);
      console.log(`✅ Added ${bus.busNo}`);
    } else {
      console.log(`⏭️ Skipped ${bus.busNo} (already exists)`);
    }
  }

  console.log("🚍 Bus seeding completed");
};

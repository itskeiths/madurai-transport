import { useState, useEffect } from "react";
import Header from "./components/Header";
import SearchPanel from "./components/SearchPanel";
import BusList from "./components/BusList";
import Footer from "./components/Footer";
import AuthPage from "./components/AuthPage";
import BookingHistory from "./components/BookingHistory";
import ProfilePage from "./components/ProfilePage";
import TicketPage from "./components/TicketPage";
import AboutPage from "./components/AboutPage";
import { auth } from "./firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import "./App.css";

type Tab = "home" | "buses" | "info" | "history" | "profile";

type BookedTicket = {
  bookingId: string;
  busNo: string;
  from: string;
  to: string;
  departureTime: string;
  eta: string;
  members: number;
  totalPrice: number;
  bookedAt: number;
};

function App() {
  const [user, setUser] = useState<User | null>(null);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");

  const [limit, setLimit] = useState<number | undefined>(3);
  const [currentTab, setCurrentTab] = useState<Tab>("home");
  const [confirmedTicket, setConfirmedTicket] = useState<BookedTicket | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = () => {
    setSearchFrom(from);
    setSearchTo(to);
  };

  const handleHomeClick = () => {
    setFrom("");
    setTo("");
    setSearchFrom("");
    setSearchTo("");
    setCurrentTab("home");
  };

  const handleBookingSuccess = (ticket: BookedTicket) => {
    setConfirmedTicket(ticket);
  };

  const handleTicketClose = () => {
    setConfirmedTicket(null);
    setCurrentTab("history");
  };

  if (!user) return <AuthPage />;

  return (
    <>
      <Header setCurrentTab={setCurrentTab} />

      <div className="app-container">
        {currentTab === "home" && (
          <>
            <SearchPanel
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              setFrom={setFrom}
              setTo={setTo}
              onSearch={handleSearch}
            />
            <BusList
              searchFrom={searchFrom}
              searchTo={searchTo}
              limit={limit}
              setLimit={setLimit}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              onBookingSuccess={handleBookingSuccess}
            />
          </>
        )}

        {currentTab === "buses" && (
          <BusList
            searchFrom=""
            searchTo=""
            limit={undefined}
            setLimit={setLimit}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            onBookingSuccess={handleBookingSuccess}
          />
        )}

        {currentTab === "history" && <BookingHistory />}

        {currentTab === "profile" && (
          <ProfilePage onBack={() => setCurrentTab("home")} />
        )}

        {currentTab === "info" && <AboutPage />}
      </div>

      <Footer
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onHomeClick={handleHomeClick}
      />

      {confirmedTicket && (
        <TicketPage ticket={confirmedTicket} onClose={handleTicketClose} />
      )}
    </>
  );
}

export default App;

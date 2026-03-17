import { useState, useEffect } from "react";
import Header from "./components/Header";
import SearchPanel from "./components/SearchPanel";
import BusList from "./components/BusList";
import Footer from "./components/Footer";
import AuthPage from "./components/AuthPage";
import BookingHistory from "./components/BookingHistory";
import { auth } from "./firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import "./App.css";

function App() {
  const [user, setUser] = useState<User | null>(null);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");

  const [limit, setLimit] = useState<number | undefined>(3);

  const [currentTab, setCurrentTab] = useState<
    "home" | "buses" | "info" | "history"
  >("home");

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

  // If user not logged in
  if (!user) {
    return <AuthPage />;
  }

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
          />
        )}

        {currentTab === "history" && <BookingHistory />}
      </div>

      <Footer
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onHomeClick={handleHomeClick}
      />
    </>
  );
}

export default App;

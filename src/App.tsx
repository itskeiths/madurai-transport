import { useState } from "react";
import Header from "./components/Header";
import SearchPanel from "./components/SearchPanel";
import BusList from "./components/BusList";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [limit, setLimit] = useState<number | undefined>(3);

  const [currentTab, setCurrentTab] = useState<"home" | "buses" | "info">(
    "home",
  );

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

  return (
    <>
      <Header />

      <div className="app-container">
        {currentTab === "home" && (
          <SearchPanel
            setFrom={setFrom}
            setTo={setTo}
            onSearch={handleSearch}
          />
        )}

        {currentTab === "home" && (
          <BusList
            searchFrom={searchFrom}
            searchTo={searchTo}
            limit={limit}
            setLimit={setLimit}
          />
        )}

        {currentTab === "buses" && (
          <BusList
            searchFrom=""
            searchTo=""
            limit={undefined}
            setLimit={setLimit}
          />
        )}
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

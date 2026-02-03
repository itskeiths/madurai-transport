import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/SearchPanel.css";

type SearchPanelProps = {
  setFrom: React.Dispatch<React.SetStateAction<string>>;
  setTo: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void; // ✅ added
};

function SearchPanel({ setFrom, setTo, onSearch }: Readonly<SearchPanelProps>) {
  // local input states
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");

  // dropdown options
  const [fromOptions, setFromOptions] = useState<string[]>([]);
  const [toOptions, setToOptions] = useState<string[]>([]);

  // dropdown visibility
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  // fetch FROM / TO values from Firestore
  useEffect(() => {
    const fetchLocations = async () => {
      const snapshot = await getDocs(collection(db, "buses"));
      const fromSet = new Set<string>();
      const toSet = new Set<string>();

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (typeof data.from === "string") fromSet.add(data.from);
        if (typeof data.to === "string") toSet.add(data.to);
      });

      setFromOptions([...fromSet]);
      setToOptions([...toSet]);
    };

    fetchLocations();
  }, []);

  return (
    <div className="search-panel">
      <h2 className="search-title">Find Bus Timings</h2>

      <div className="search-row">
        {/* FROM */}
        <div className="dropdown-wrapper">
          <input
            type="text"
            placeholder="From"
            value={fromInput}
            onChange={(e) => {
              const value = e.target.value;
              setFromInput(value);
              setFrom(value); // update parent
              setShowFrom(true);
            }}
          />

          {showFrom && fromInput && (
            <ul className="dropdown">
              {fromOptions
                .filter(
                  (loc) =>
                    typeof loc === "string" &&
                    loc.toLowerCase().includes(fromInput.toLowerCase()),
                )
                .map((loc) => (
                  <li key={loc}>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        setFromInput(loc);
                        setFrom(loc);
                        setShowFrom(false);
                      }}
                    >
                      {loc}
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* TO */}
        <div className="dropdown-wrapper">
          <input
            type="text"
            placeholder="To"
            value={toInput}
            onChange={(e) => {
              const value = e.target.value;
              setToInput(value);
              setTo(value); // update parent
              setShowTo(true);
            }}
          />

          {showTo && toInput && (
            <ul className="dropdown">
              {toOptions
                .filter(
                  (loc) =>
                    typeof loc === "string" &&
                    loc.toLowerCase().includes(toInput.toLowerCase()),
                )
                .map((loc) => (
                  <li key={loc}>
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={() => {
                        setToInput(loc);
                        setTo(loc);
                        setShowTo(false);
                      }}
                    >
                      {loc}
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* ✅ THIS IS THE MISSING PART */}
      <button
        className="search-btn"
        onClick={onSearch}
        disabled={!fromInput || !toInput}
      >
        Search Buses
      </button>
    </div>
  );
}

export default SearchPanel;

import "../styles/Header.css";
import { Bell, Search, Settings } from "lucide-react";

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <span className="bus-icon">🚌</span>
        <span className="title">Madurai Transport</span>
      </div>

      <div className="header-right">
        <Search
          className="header-icon"
          onClick={() => alert("Search coming soon")}
        />
        <Bell
          className="header-icon"
          onClick={() => alert("No notifications")}
        />
        <Settings
          className="header-icon"
          onClick={() => alert("Settings coming soon")}
        />
      </div>
    </header>
  );
}

export default Header;

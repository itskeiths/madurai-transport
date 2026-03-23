import "../styles/Header.css";
import { History, CircleUser, LogOut } from "lucide-react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

type Tab = "home" | "buses" | "info" | "history" | "profile";

type HeaderProps = {
  setCurrentTab: (tab: Tab) => void;
};

function Header({ setCurrentTab }: HeaderProps) {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="header">
      <div className="header-left">
        <span className="bus-icon">🚌</span>
        <span className="title">Madurai One</span>
      </div>

      <div className="header-right">
        {/* Profile icon → profile page */}
        <button
          id="header-profile-btn"
          className="header-icon-btn"
          onClick={() => setCurrentTab("profile")}
          aria-label="My Profile"
          title="My Profile"
        >
          <CircleUser size={26} />
        </button>

        {/* History icon */}
        <button
          id="header-history-btn"
          className="header-icon-btn"
          onClick={() => setCurrentTab("history")}
          aria-label="Booking History"
          title="Booking History"
        >
          <History size={26} />
        </button>

        {/* Logout */}
        <button
          id="header-logout-btn"
          className="header-icon-btn header-icon-btn--danger"
          onClick={handleLogout}
          aria-label="Sign Out"
          title="Sign Out"
        >
          <LogOut size={26} />
        </button>
      </div>
    </header>
  );
}

export default Header;

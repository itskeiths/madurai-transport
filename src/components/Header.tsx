import "../styles/Header.css";
import { History, CircleUser, LogOut } from "lucide-react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

type HeaderProps = {
  setCurrentTab: (tab: "home" | "buses" | "info" | "history") => void;
};

function Header({ setCurrentTab }: HeaderProps) {
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <header className="header">
      <div className="header-left">
        <span className="bus-icon">🚌</span>
        <span className="title">Madurai Transport</span>
      </div>

      <div className="header-right">
        <div className="profile-container">
          <CircleUser className="header-icon" />

          {user && (
            <div className="profile-card">
              <p className="profile-name">{user.displayName}</p>
              <p className="profile-email">{user.email}</p>
            </div>
          )}
        </div>

        <History
          className="header-icon"
          onClick={() => setCurrentTab("history")}
        />

        <LogOut className="header-icon" onClick={handleLogout} />
      </div>
    </header>
  );
}

export default Header;

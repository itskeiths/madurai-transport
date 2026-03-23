import "../styles/Footer.css";
import { Home, Bus, BookOpen, History } from "lucide-react";

type Tab = "home" | "buses" | "info" | "history" | "profile";

type FooterProps = {
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
  onHomeClick: () => void;
};

function Footer({ currentTab, setCurrentTab, onHomeClick }: Readonly<FooterProps>) {
  return (
    <footer className="footer">
      <div className="footer-nav">
        <div
          id="footer-home"
          className={`footer-item ${currentTab === "home" ? "active" : ""}`}
          onClick={onHomeClick}
        >
          <Home size={24} />
          <span>Home</span>
        </div>

        <div
          id="footer-buses"
          className={`footer-item ${currentTab === "buses" ? "active" : ""}`}
          onClick={() => setCurrentTab("buses")}
        >
          <Bus size={24} />
          <span>Buses</span>
        </div>

        <div
          id="footer-history"
          className={`footer-item ${currentTab === "history" ? "active" : ""}`}
          onClick={() => setCurrentTab("history")}
        >
          <History size={24} />
          <span>Tickets</span>
        </div>

        <div
          id="footer-info"
          className={`footer-item ${currentTab === "info" ? "active" : ""}`}
          onClick={() => setCurrentTab("info")}
        >
          <BookOpen size={24} />
          <span>About</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

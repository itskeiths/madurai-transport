import "../styles/Footer.css";
import { Home, Bus, Info } from "lucide-react";

type FooterProps = {
  currentTab: "home" | "buses" | "info" | "history";
  setCurrentTab: (tab: "home" | "buses" | "info") => void;
  onHomeClick: () => void;
};

function Footer({ currentTab, setCurrentTab }: Readonly<FooterProps>) {
  return (
    <footer className="footer">
      <div className="footer-nav">
        <div
          className={`footer-item ${currentTab === "home" ? "active" : ""}`}
          onClick={() => setCurrentTab("home")}
        >
          <Home size={20} />
          <span>Home</span>
        </div>

        <div
          className={`footer-item ${currentTab === "buses" ? "active" : ""}`}
          onClick={() => setCurrentTab("buses")}
        >
          <Bus size={20} />
          <span>Buses</span>
        </div>

        <div
          className={`footer-item ${currentTab === "info" ? "active" : ""}`}
          onClick={() => setCurrentTab("info")}
        >
          <Info size={20} />
          <span>Info</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

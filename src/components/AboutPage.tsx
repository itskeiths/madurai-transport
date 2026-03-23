import "../styles/AboutPage.css";

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* Hero */}
      <div className="about-hero">
        <div className="about-bus-badge">🚌</div>
        <h2 className="about-title">Madurai One</h2>
        <p className="about-sub">Smart Bus Travel · Madurai City</p>
      </div>

      {/* Mission card */}
      <div className="about-card">
        <h3 className="about-card-title">🎯 Our Mission</h3>
        <p className="about-card-body">
          Madurai One is built to make local bus travel in Madurai effortless.
          Find the right bus, book your seat instantly, and track your journey —
          all from the palm of your hand.
        </p>
      </div>

      {/* Features */}
      <div className="about-card">
        <h3 className="about-card-title">✨ Features</h3>
        <ul className="about-feature-list">
          <li>
            <span className="about-feature-icon">🔍</span>
            <div>
              <strong>Smart Search</strong>
              <p>Filter buses by origin and destination in seconds.</p>
            </div>
          </li>
          <li>
            <span className="about-feature-icon">🎫</span>
            <div>
              <strong>Instant Booking</strong>
              <p>Book tickets for multiple passengers with one tap.</p>
            </div>
          </li>
          <li>
            <span className="about-feature-icon">⏱</span>
            <div>
              <strong>Live Ticket Timer</strong>
              <p>2-hour validity window with a real-time countdown.</p>
            </div>
          </li>
          <li>
            <span className="about-feature-icon">📋</span>
            <div>
              <strong>Booking History</strong>
              <p>View active and completed journeys, tap active tickets to reopen them.</p>
            </div>
          </li>
          <li>
            <span className="about-feature-icon">🔒</span>
            <div>
              <strong>Secure Login</strong>
              <p>Email & password authentication with password reset support.</p>
            </div>
          </li>
        </ul>
      </div>

      {/* How to use */}
      <div className="about-card">
        <h3 className="about-card-title">📖 How to Use</h3>
        <ol className="about-steps">
          <li><span>1</span> Register or sign in to your account.</li>
          <li><span>2</span> Enter your origin and destination on the home screen.</li>
          <li><span>3</span> Browse available buses and tap one for details.</li>
          <li><span>4</span> Choose passenger count and tap <strong>Book Ticket</strong>.</li>
          <li><span>5</span> Your ticket appears instantly — valid for 2 hours.</li>
          <li><span>6</span> Access it anytime from the <strong>Tickets</strong> tab.</li>
        </ol>
      </div>

      {/* Coverage */}
      <div className="about-card">
        <h3 className="about-card-title">🗺️ Coverage</h3>
        <p className="about-card-body">
          Currently covering major routes within <strong>Madurai city</strong>,
          including Mattuthavani, Sattur, Thirumangalam, Alanganallur, Melur,
          and surrounding areas. More routes are added regularly.
        </p>
      </div>

      {/* Made by */}
      <div className="about-made-by">
        <div className="about-made-by-icon">💻</div>
        <p className="about-made-by-label">Designed & Developed by</p>
        <p className="about-made-by-name">Aravind V U</p>
        <p className="about-made-by-version">Madurai One · v1.0 · 2026</p>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import "../styles/TicketPage.css";

type TicketData = {
  bookingId: string;
  busNo: string;
  from: string;
  to: string;
  departureTime: string;
  eta: string;
  members: number;
  totalPrice: number;
  bookedAt: number; // epoch ms
};

type TicketPageProps = {
  ticket: TicketData;
  onClose: () => void;
  hideConfetti?: boolean;
};

const EXPIRE_MS = 2 * 60 * 60 * 1000; // 2 hours

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatCountdown(ms: number) {
  if (ms <= 0) return "Expired";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

// Pure-JS confetti – no extra package needed
function launchConfetti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;
  const W = canvas.width;
  const H = canvas.height;
  const COLORS = [
    "#ff512f", "#dd2476", "#ff7a55", "#34d399",
    "#60a5fa", "#f59e0b", "#a78bfa", "#fb7185",
  ];
  const pieces = Array.from({ length: 160 }, () => ({
    x: Math.random() * W,
    y: Math.random() * -H,
    w: 8 + Math.random() * 8,
    h: 4 + Math.random() * 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    r: Math.random() * Math.PI * 2,
    rSpeed: (Math.random() - 0.5) * 0.15,
    speed: 2 + Math.random() * 3,
    wobble: Math.random() * 10,
    wobbleSpeed: 0.05 + Math.random() * 0.08,
    wobbleT: 0,
    alpha: 1,
  }));

  let frame: number;
  let done = false;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    let allGone = true;
    for (const p of pieces) {
      if (p.y < H + 20) allGone = false;
      p.y += p.speed;
      p.r += p.rSpeed;
      p.wobbleT += p.wobbleSpeed;
      p.x += Math.sin(p.wobbleT) * p.wobble * 0.1;
      if (p.y > H * 0.7) p.alpha = Math.max(0, p.alpha - 0.012);
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
      ctx.rotate(p.r);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (!allGone && !done) {
      frame = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, W, H);
    }
  }

  frame = requestAnimationFrame(draw);
  // Stop after 4 seconds
  setTimeout(() => {
    done = true;
    cancelAnimationFrame(frame);
    ctx.clearRect(0, 0, W, H);
  }, 4000);
}

export default function TicketPage({ ticket, onClose, hideConfetti }: Readonly<TicketPageProps>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeLeft, setTimeLeft] = useState(() => {
    const expireAt = ticket.bookedAt + EXPIRE_MS;
    return Math.max(0, expireAt - Date.now());
  });

  // Launch confetti once on mount (skip when viewing from history)
  useEffect(() => {
    if (hideConfetti) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    launchConfetti(canvas);
  }, [hideConfetti]);

  // Countdown timer
  useEffect(() => {
    const id = setInterval(() => {
      const expireAt = ticket.bookedAt + EXPIRE_MS;
      setTimeLeft(Math.max(0, expireAt - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [ticket.bookedAt]);

  const expired = timeLeft <= 0;
  const bookedAtDate = new Date(ticket.bookedAt);
  const bookedAtStr = bookedAtDate.toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
  const bookedDateStr = bookedAtDate.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <div className="ticket-page-overlay">
      {/* Confetti canvas */}
      {!hideConfetti && <canvas ref={canvasRef} className="confetti-canvas" />}

      <div className="ticket-wrapper">
        {/* Success / view header */}
        <div className="ticket-success-badge">
          <span className="ticket-check">{hideConfetti ? "🎫" : "✓"}</span>
          <span>{hideConfetti ? "Your Active Ticket" : "Ticket Booked Successfully!"}</span>
        </div>

        {/* Main ticket card */}
        <div className="ticket-card">
          {/* Tear line top */}
          <div className="ticket-tear-top" />

          {/* Route header */}
          <div className="ticket-route-header">
            <div className="ticket-city">
              <span className="ticket-city-name">{ticket.from}</span>
              <span className="ticket-city-label">Origin</span>
            </div>
            <div className="ticket-route-arrow">
              <div className="ticket-bus-icon">🚌</div>
              <div className="ticket-dashed-line" />
            </div>
            <div className="ticket-city ticket-city-right">
              <span className="ticket-city-name">{ticket.to}</span>
              <span className="ticket-city-label">Destination</span>
            </div>
          </div>

          {/* Bus number strip */}
          <div className="ticket-bus-strip">
            <span className="ticket-bus-label">Bus No.</span>
            <span className="ticket-bus-value">{ticket.busNo}</span>
          </div>

          {/* Perforated divider */}
          <div className="ticket-perforation">
            <div className="ticket-perf-circle ticket-perf-left" />
            <div className="ticket-perf-dashes" />
            <div className="ticket-perf-circle ticket-perf-right" />
          </div>

          {/* Details grid */}
          <div className="ticket-details-grid">
            <div className="ticket-detail-item">
              <span className="ticket-detail-label">Departure</span>
              <span className="ticket-detail-value">{ticket.departureTime}</span>
            </div>
            <div className="ticket-detail-item">
              <span className="ticket-detail-label">ETA</span>
              <span className="ticket-detail-value">{ticket.eta}</span>
            </div>
            <div className="ticket-detail-item">
              <span className="ticket-detail-label">Passengers</span>
              <span className="ticket-detail-value">{ticket.members}</span>
            </div>
            <div className="ticket-detail-item">
              <span className="ticket-detail-label">Total Paid</span>
              <span className="ticket-detail-value ticket-price">₹{ticket.totalPrice}</span>
            </div>
          </div>

          {/* Booked at */}
          <div className="ticket-booked-at">
            Booked on {bookedDateStr} at {bookedAtStr}
          </div>

          {/* Perforated divider */}
          <div className="ticket-perforation">
            <div className="ticket-perf-circle ticket-perf-left" />
            <div className="ticket-perf-dashes" />
            <div className="ticket-perf-circle ticket-perf-right" />
          </div>

          {/* Expiry timer */}
          <div className={`ticket-expiry-section ${expired ? "ticket-expiry-expired" : ""}`}>
            <div className="ticket-expiry-label">
              {expired ? "⚠️ Ticket Expired" : "⏱ Ticket Expires In"}
            </div>
            <div className="ticket-timer">
              {expired ? "00:00:00" : formatCountdown(timeLeft)}
            </div>
            {!expired && (
              <div className="ticket-expiry-note">Valid for 2 hours from booking</div>
            )}
          </div>

          {/* Tear line bottom */}
          <div className="ticket-tear-bottom" />
        </div>

        {/* Actions */}
        <div className="ticket-actions">
          <button className="ticket-history-btn" onClick={onClose} id="go-to-history-btn">
            {hideConfetti ? "← Back to Tickets" : "View My Tickets →"}
          </button>
        </div>
      </div>
    </div>
  );
}

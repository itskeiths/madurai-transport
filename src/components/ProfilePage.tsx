import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import "../styles/ProfilePage.css";

type UserProfile = {
  displayName: string;
  email: string;
  phone: string;
  city: string;
  createdAt: string;
};

type ProfilePageProps = {
  onBack: () => void;
};

export default function ProfilePage({ onBack }: Readonly<ProfilePageProps>) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) { setLoading(false); return; }
      try {
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          // Fallback from Firebase Auth object (e.g. Google users)
          setProfile({
            displayName: user.displayName ?? "—",
            email: user.email ?? "—",
            phone: "—",
            city: "—",
            createdAt: "",
          });
        }
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const user = auth.currentUser;
  const initials = profile?.displayName
    ? profile.displayName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const joinedDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })
    : null;

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="profile-spinner" />
          Loading profile…
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Back button */}
      <button className="profile-back-btn" onClick={onBack} id="profile-back-btn">
        ← Back
      </button>

      {/* Avatar + name */}
      <div className="profile-hero">
        <div className="profile-avatar">{initials}</div>
        <h2 className="profile-name">{profile?.displayName ?? user?.displayName ?? "User"}</h2>
        <p className="profile-email-sub">{profile?.email ?? user?.email ?? ""}</p>
        {joinedDate && <p className="profile-joined">Member since {joinedDate}</p>}
      </div>

      {/* Details card */}
      <div className="profile-card">
        <h3 className="profile-section-title">My Details</h3>

        <div className="profile-field">
          <span className="profile-field-icon">👤</span>
          <div>
            <span className="profile-field-label">Full Name</span>
            <span className="profile-field-value">{profile?.displayName || "—"}</span>
          </div>
        </div>

        <div className="profile-divider" />

        <div className="profile-field">
          <span className="profile-field-icon">✉️</span>
          <div>
            <span className="profile-field-label">Email</span>
            <span className="profile-field-value">{profile?.email || user?.email || "—"}</span>
          </div>
        </div>

        <div className="profile-divider" />

        <div className="profile-field">
          <span className="profile-field-icon">📞</span>
          <div>
            <span className="profile-field-label">Phone</span>
            <span className="profile-field-value">{profile?.phone || "—"}</span>
          </div>
        </div>

        <div className="profile-divider" />

        <div className="profile-field">
          <span className="profile-field-icon">📍</span>
          <div>
            <span className="profile-field-label">City</span>
            <span className="profile-field-value">{profile?.city || "—"}</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button className="profile-logout-btn" onClick={handleLogout} id="profile-logout-btn">
        Sign Out
      </button>
    </div>
  );
}

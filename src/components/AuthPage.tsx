import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import "../styles/AuthPage.css";

const provider = new GoogleAuthProvider();

export default function AuthPage() {
  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="app-title">Madurai-One</h1>
        <p className="tagline">Book local buses in Madurai easily 🚍</p>

        <button className="google-btn" onClick={signIn}>
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
          />
          Continue with Google
        </button>

        <p className="footer-text">Fast • Simple • Local Bus Booking</p>
      </div>
    </div>
  );
}

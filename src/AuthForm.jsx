import { useNavigate } from "react-router-dom"; // 🟢 এটি যুক্ত করতে হবে
import "./AuthForm.css";

export default function AuthForm() {
  const navigate = useNavigate(); // 🟢 নেভিগেট করার হুক

  // লগইন বা সাইন আপ বাটনে ক্লিক করলে এই ফাংশনটি কাজ করবে
  const handleLogin = () => {
    // এখানে আপনি চাইলে ইমেইল/পাসওয়ার্ড চেক করার লজিক দিতে পারেন
    // আপাতত সরাসরি ড্যাশবোর্ডে পাঠিয়ে দিচ্ছি:
    navigate("/dashboard");
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="sign-in-container">
          <h1>Sign In</h1>
          <input type="email" placeholder="Email" className="input-field" />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
          />

          <a href="#" className="forgot-password">
            Forget Your Password?
          </a>
          <button className="primary-btn" onClick={handleLogin}>
            SIGN IN
          </button>
        </div>
        <div className="overlay-container">
          <h1 style={{ color: "white" }}>Hello, Friend!</h1>
          <p>Register with your personal details to use all of site features</p>

          <button className="ghost-btn" onClick={handleLogin}>
            SIGN UP
          </button>
        </div>
        <div className="reverseoverlay-container">
          <h1 style={{ color: "white" }}>Hello, Friend!</h1>
          <p>Register with your personal details to use all of site features</p>

          <button className="ghost-btn" onClick={handleLogin}>
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
}

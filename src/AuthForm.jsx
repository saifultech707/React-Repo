import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "./AuthForm.css";

export default function AuthForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role
  const [isSignUp, setIsSignUp] = useState(false);

  const loggedInRole = localStorage.getItem("userRole");

  // লগইন করার জন্য:
  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("লগইন সফল:", userCredential.user);

      // 🟢 রোল সেভ করা এবং নেভিগেট করা
      localStorage.setItem("userRole", role);
      navigate("/dashboard");
    } catch (error) {
      alert("লগইন ভুল হয়েছে: " + error.message);
    }
  };

  // পাবলিক ইউজার সাইন আপ:
  const handleUserSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      localStorage.setItem("userRole", "user");
      alert("Account created successfully!");
      navigate("/dashboard"); // Or wherever normal users should go
    } catch (error) {
      alert("সাইন-আপ ভুল হয়েছে: " + error.message);
    }
  };

  // সাইন আপ করার জন্য (Only accessible if already logged in as Admin to create Teacher):
  const handleAdminCreateTeacher = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // Create an initial empty profile document for the new teacher
      const { doc, setDoc } = await import("firebase/firestore");
      const { db } = await import("./firebase");
      await setDoc(doc(db, "profiles", userCredential.user.uid), {
        email: email,
        name: "",
        mobile: "",
        picture: null,
        certificateLink: "",
        cvLink: "",
      });
      alert("Teacher account created successfully!");
      setEmail("");
      setPassword("");
    } catch (error) {
      alert("সাইন-আপ ভুল হয়েছে: " + error.message);
    }
  };

  // If Admin is already logged in, show the Create Teacher Account form
  if (loggedInRole === "admin") {
    return (
      <div className="auth-wrapper">
        <div className="auth-container">
          <div
            className="sign-in-container"
            style={{
              width: "100%",
              padding: "40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1 style={{ marginBottom: "15px", fontSize: "28px" }}>
              Create Teacher Account
            </h1>
            <p style={{ marginBottom: "20px", color: "#666" }}>
              Enter email and password to register a new teacher.
            </p>

            <input
              type="email"
              placeholder="Teacher Email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ maxWidth: "400px" }}
            />
            <input
              type="password"
              placeholder="Teacher Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ maxWidth: "400px" }}
            />

            <button
              className="primary-btn"
              onClick={handleAdminCreateTeacher}
              style={{ maxWidth: "400px", marginTop: "10px" }}
            >
              Create Account
            </button>

            <button
              className="ghost-btn"
              onClick={() => navigate("/dashboard")}
              style={{
                color: "#2563EB",
                borderColor: "#2563EB",
                marginTop: "20px",
                maxWidth: "400px",
              }}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Regular Login/Signup View (For logged out users)
  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="sign-in-container">
          {/* 🟢 Role Selection Toggle */}
          <div style={toggleContainerStyle}>
            <button
              style={role === "user" ? activeBtnStyle : inactiveBtnStyle}
              onClick={() => {
                setRole("user");
                setIsSignUp(false);
              }}
            >
              User
            </button>
            <button
              style={role === "teacher" ? activeBtnStyle : inactiveBtnStyle}
              onClick={() => {
                setRole("teacher");
                setIsSignUp(false);
              }}
            >
              Teacher
            </button>
            <button
              style={role === "admin" ? activeBtnStyle : inactiveBtnStyle}
              onClick={() => {
                setRole("admin");
                setIsSignUp(false);
              }}
            >
              Admin
            </button>
          </div>

          {/* 🟢 Title based on role and mode */}
          <h1
            style={{
              marginBottom: "15px",
              fontSize: "28px",
              textAlign: "center",
            }}
          >
            {role === "admin"
              ? "Admin Sign In"
              : role === "teacher"
                ? "Teacher Sign In"
                : isSignUp
                  ? "User Sign Up"
                  : "User Sign In"}
          </h1>

          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!isSignUp && (
            <a href="#" className="forgot-password">
              Forget Your Password?
            </a>
          )}

          <button
            className="primary-btn"
            onClick={
              isSignUp && role === "user" ? handleUserSignUp : handleLogin
            }
          >
            {isSignUp && role === "user" ? "Sign Up" : "Log In"}
          </button>

          {role === "user" && (
            <p style={{ marginTop: "15px", fontSize: "14px", color: "#555" }}>
              {isSignUp
                ? "Already have an account? "
                : "Don't have an account? "}
              <span
                style={{
                  color: "#2563EB",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Log In" : "Sign Up"}
              </span>
            </p>
          )}
        </div>

        {/* Overlay Container */}
        <div className="overlay-container">
          <h1 style={{ color: "white" }}>Welcome!</h1>
          <p>
            {role === "admin"
              ? "Sign in as an Admin to manage the school portal and register teachers."
              : role === "teacher"
                ? "Sign in to view and edit your profile. Contact an Admin if you don't have an account."
                : "Sign in or create an account to access the platform and chat with our team."}
          </p>
        </div>
      </div>
    </div>
  );
}

// ================= CSS-in-JS Styles =================
const toggleContainerStyle = {
  display: "flex",
  background: "#eee",
  borderRadius: "30px",
  marginBottom: "20px",
  overflow: "hidden",
  width: "90%",
};

const activeBtnStyle = {
  flex: 1,
  padding: "10px 5px",
  border: "none",
  background: "#2563EB", // Theme Color
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.3s",
  fontSize: "13px",
};

const inactiveBtnStyle = {
  flex: 1,
  padding: "10px 5px",
  border: "none",
  background: "transparent",
  color: "#555",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.3s",
  fontSize: "13px",
};

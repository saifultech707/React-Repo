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
  const [role, setRole] = useState("teacher"); // Default role to teacher

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

  // সাইন আপ করার জন্য (Only accessible if already logged in as Admin):
  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Create an initial empty profile document for the new teacher
      const { doc, setDoc } = await import("firebase/firestore");
      const { db } = await import("./firebase");
      await setDoc(doc(db, "profiles", userCredential.user.uid), {
        email: email,
        name: "",
        mobile: "",
        picture: null,
        certificateLink: "",
        cvLink: ""
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
          <div className="sign-in-container" style={{ width: "100%", padding: "40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1 style={{ marginBottom: "15px", fontSize: "28px" }}>Create Teacher Account</h1>
            <p style={{ marginBottom: "20px", color: "#666" }}>Enter email and password to register a new teacher.</p>
            
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
            
            <button className="primary-btn" onClick={handleSignUp} style={{ maxWidth: "400px", marginTop: "10px" }}>
              Create Account
            </button>

            <button 
              className="ghost-btn" 
              onClick={() => navigate("/dashboard")}
              style={{ color: "#FE5D37", borderColor: "#FE5D37", marginTop: "20px", maxWidth: "400px" }}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Regular Login View (For logged out users)
  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="sign-in-container">
          {/* 🟢 Teacher / Admin সিলেকশন বাটন (Toggle) */}
          <div style={toggleContainerStyle}>
            <button
              style={role === "teacher" ? activeBtnStyle : inactiveBtnStyle}
              onClick={() => setRole("teacher")}
            >
              Teacher
            </button>
            <button
              style={role === "admin" ? activeBtnStyle : inactiveBtnStyle}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>
          </div>

          {/* 🟢 রোল অনুযায়ী টাইটেল পরিবর্তন হবে */}
          <h1 style={{ marginBottom: "15px", fontSize: "28px" }}>
            {role === "admin" ? "Admin Sign In" : "Teacher Sign In"}
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

          <a href="#" className="forgot-password">
            Forget Your Password?
          </a>

          <button className="primary-btn" onClick={handleLogin}>
            log in
          </button>
        </div>

        {/* ডানপাশের ওভারলে অংশ */}
        <div className="overlay-container">
          <h1 style={{ color: "white" }}>Welcome!</h1>
          <p>
            {role === "admin" 
              ? "Sign in as an Admin to manage the school portal and register teachers."
              : "Sign in to view and edit your profile. Contact an Admin if you don't have an account."}
          </p>
        </div>
      </div>
    </div>
  );
}

// ================= ইনলাইন স্টাইলস (টগল বাটনের জন্য) =================
const toggleContainerStyle = {
  display: "flex",
  background: "#eee",
  borderRadius: "30px",
  marginBottom: "20px",
  overflow: "hidden",
  width: "80%",
};

const activeBtnStyle = {
  flex: 1,
  padding: "10px",
  border: "none",
  background: "#FE5D37", // আপনার ওয়েবসাইটের থিম কালার
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.3s",
};

const inactiveBtnStyle = {
  flex: 1,
  padding: "10px",
  border: "none",
  background: "transparent",
  color: "#555",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.3s",
};
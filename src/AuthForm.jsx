import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase"; // আপনার firebase.js থেকে
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "./AuthForm.css";

export default function AuthForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  // 🟢 User নাকি Admin, সেটি ট্র্যাক করার জন্য State

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
      navigate("/");
    } catch (error) {
      alert("লগইন ভুল হয়েছে: " + error.message);
    }
  };

  // সাইন আপ করার জন্য:
  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("সাইন-আপ সফল! এখন লগইন করুন।");
    } catch (error) {
      alert("সাইন-আপ ভুল হয়েছে: " + error.message);
    }
  };
  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="sign-in-container">
          {/* 🟢 User / Admin সিলেকশন বাটন (Toggle) */}
          <div style={toggleContainerStyle}>
            <button
              style={role === "user" ? activeBtnStyle : inactiveBtnStyle}
              onClick={() => setRole("user")}
            >
              User
            </button>
            <button
              style={role === "admin" ? activeBtnStyle : inactiveBtnStyle}
              onClick={() => setRole("admin")}
            >
              Admin
            </button>
          </div>

          {/* 🟢 রোল অনুযায়ী টাইটেল পরিবর্তন হবে */}
          <h1 style={{ marginBottom: "15px" }}>
            {role === "admin" ? "Admin Sign In" : "User Sign In"}
          </h1>

          {/* 🟢 input গুলোতে value এবং onChange যোগ করা হয়েছে */}
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
          <h1 style={{ color: "white" }}>Hello, Friend!</h1>
          <p>Register with your personal details to use all of site features</p>

          <button className="ghost-btn" onClick={() => handleSignUp()}>
            sIGN UP
          </button>
        </div>

        {/* আপনি আগের কোডে একটি reverseoverlay-container রেখেছিলেন, সেটি যদি স্লাইড অ্যানিমেশনের জন্য হয় তবে থাকুক */}
        <div className="reverseoverlay-container" style={{ display: "none" }}>
          <h1 style={{ color: "white" }}>Welcome Back!</h1>
          <p>To keep connected with us please login with your personal info</p>
          <button className="ghost-btn" onClick={() => handleLogin()}>
            log in
          </button>
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

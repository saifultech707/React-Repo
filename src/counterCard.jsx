import { useState } from "react";

export default function CounterCard() {
  // ১. State (ডেটা ধরে রাখার জন্য)
  const [count, setCount] = useState(0);

  // ২. Functions (লজিক বা কাজ করার জন্য)
  const handleIncrease = () => {
    setCount(count + 1);
  };

  const handleDecrease = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  // ৩. UI (স্ক্রিনে যা দেখা যাবে)
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        
        <h2>Product Quantity</h2>
        
        {/* ডায়নামিক ডেটা দেখাচ্ছে */}
        <h1 style={{ fontSize: "60px", color: "#06021b", margin: "20px 0" }}>
          {count}
        </h1>

        <p style={{ color: "#666", marginBottom: "30px" }}>
          Select how many items you want to buy.
        </p>

        {/* ফাংশনগুলো বাটনের সাথে কানেক্ট করা হয়েছে */}
        <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
          <button style={btnStyle} onClick={handleDecrease}>
            ➖ Decrease
          </button>
          
          <button style={resetBtnStyle} onClick={handleReset}>
            🔄 Reset
          </button>

          <button style={btnStyle} onClick={handleIncrease}>
            ➕ Increase
          </button>
        </div>

      </div>
    </div>
  );
}

// UI ডিজাইনের স্টাইলগুলো
const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#e0f2fe", // হালকা নীল ব্যাকগ্রাউন্ড
};

const cardStyle = {
  background: "white",
  padding: "40px",
  borderRadius: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  textAlign: "center",
  width: "100%",
  maxWidth: "400px",
};

const btnStyle = {
  padding: "12px 20px",
  background: "#06021b",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
};

const resetBtnStyle = {
  ...btnStyle,
  background: "#ef4444", // লাল রঙের বাটন
};
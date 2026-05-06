import { useState } from "react";

export default function CounterCard() {
  const [count, setCount] = useState(7);
  const handleIncrease = () => {
    setCount(count + 1);
  };

  const handleDecrease = () => {
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const handleReset = () => {
    setCount(7);
  };
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2>Product Quantity</h2>

        <h1 style={{ fontSize: "60px", color: "#06021b", margin: "20px 0" }}>
          {count}
        </h1>

        <p style={{ color: "#666", marginBottom: "30px" }}>
          Select how many items you want to buy.
        </p>

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
      <div style={cardStyle}>
        <h2>product Quantity</h2>
        <h1 style={{ fontSize: "60px", color: "#06021b", margin: "20px 0" }}>
          {count}
        </h1>{" "}
        <p>slelle</p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "15px",
            justifyContent: "center",
          }}
        >
          <button style={btnStyle} onClick={handleDecrease}>
            {" "}
            ➖Descrease
          </button>
          <button style={resetBtnStyle} onClick={handleReset}>
            Reset
          </button>
          <button style={btnStyle} onClick={handleIncrease}>
            increase
          </button>
        </div>
      </div>
      <div style={cardStyle}>
        <h1>hu</h1>{" "}
      </div>
      <div style={cardStyle}>
        <h1>hu</h1>{" "}
      </div>
      <div style={cardStyle}>
        <h1>hu</h1>{" "}
      </div>
    </div>
  );
}

const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  // padding: "20px 40px",
  justifyContent: "center",
  alignItems: "flex-start",
  paddingTop: "12px",
  background: "#da2d2d",
  gap: "12px",
};

const cardStyle = {
  background: "white",

  padding: "40px",
  borderRadius: "15px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  textAlign: "center",
  width: "100%",
  minHeight: "100px",
  maxWidth: "400px",
  flexDirection: "column",
  justifyContent: "center",
};

const btnStyle = {
  padding: "12px 20px",
  background: "#06021b",
  color: "white",
  border: "1px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
};

const resetBtnStyle = {
  ...btnStyle,
  background: "#ee0e0e",
};

import { useState } from "react";

const generateData = () => {
  const hobbies = ["Coding", "Traveling", "Gaming", "Reading", "Photography"];
  const data = [];
  for (let i = 1; i <= 250; i++) {
    data.push({
      id: i,
      name: `User ${i}`,
      age: Math.floor(Math.random() * (40 - 18 + 1)) + 18,
      hobby: hobbies[i % hobbies.length],
      image: `https://ui-avatars.com/api/?name=User+${i}&background=random&color=fff`,
    });
  }
  return data;
};

const usersList = generateData();

export default function UserList() {
  const [searchTerm, setSearchTerm] = useState("");

  // 🟢 ১. মার্ক করা অংশ: আপনি বক্সে যা লিখছেন, সেখান থেকে সব স্পেস গায়েব করে দিচ্ছে
  // (যেমন: "user 23" হয়ে যাবে "user23")
  const normalizedTerm = searchTerm.replace(/\s+/g, "").toLowerCase();

  const displayedUsers = [...usersList].sort((a, b) => {
    if (!normalizedTerm) return 0;

    // 🟢 ২. মার্ক করা অংশ: ডেটার ভেতরে থাকা নামগুলো থেকে স্পেস গায়েব করছে
    // (যেমন: "User 23" হয়ে যাবে "user23")
    const aNameWithoutSpace = a.name.replace(/\s+/g, "").toLowerCase();
    const bNameWithoutSpace = b.name.replace(/\s+/g, "").toLowerCase();

    // 🟢 এখন স্পেস ছাড়া নাম (aNameWithoutSpace) এর সাথে আপনার স্পেস ছাড়া লেখা (normalizedTerm) মেলাচ্ছে
    const aMatch =
      aNameWithoutSpace.includes(normalizedTerm) ||
      a.id.toString().includes(normalizedTerm);
    const bMatch =
      bNameWithoutSpace.includes(normalizedTerm) ||
      b.id.toString().includes(normalizedTerm);

    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;

    return 0;
  });

  return (
    <div
      style={{
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        paddingBottom: "50px",
      }}
    >
      {/* স্টিকি সার্চ বার */}
      <div style={searchBarStyle}>
        <h2 style={{ margin: "0 0 10px 0", color: "#06021b" }}>
          User Directory
        </h2>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <input
            type="text"
            placeholder="Type any number or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      {/* ২৫০ জনের ডায়নামিক লিস্ট */}
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          marginTop: "120px",
          padding: "0 20px",
        }}
      >
        {displayedUsers.map((user) => {
          // 🟢 ৩. মার্ক করা অংশ: আইটেম হলুদ রং করার আগেও নাম থেকে স্পেস মুছে চেক করছে
          const userNameWithoutSpace = user.name
            .replace(/\s+/g, "")
            .toLowerCase();

          const isMatched =
            normalizedTerm &&
            (userNameWithoutSpace.includes(normalizedTerm) ||
              user.id.toString().includes(normalizedTerm));

          return (
            <div
              key={user.id}
              style={{
                ...rowStyle,
                backgroundColor: isMatched ? "#fef08a" : "white",
                transform: isMatched ? "scale(1.02)" : "scale(1)",
                border: isMatched ? "2px solid #eab308" : "1px solid #e2e8f0",
                zIndex: isMatched ? 10 : 1,
              }}
            >
              <div
                style={{ fontWeight: "bold", color: "#94a3b8", width: "40px" }}
              >
                #{user.id}
              </div>

              <img src={user.image} alt="avatar" style={imgStyle} />

              <div
                style={{
                  flex: 1,
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: "#1e293b",
                }}
              >
                {user.name}
              </div>

              <div style={{ width: "80px", color: "#64748b" }}>
                🎂 {user.age} yrs
              </div>

              <div
                style={{ width: "120px", color: "#0ea5e9", fontWeight: "500" }}
              >
                🎯 {user.hobby}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// CSS স্টাইলগুলো আগের মতোই আছে
const searchBarStyle = {
  position: "sticky",
  top: 0,
  left: 0,
  width: "100%",
  padding: "20px",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  zIndex: 100,
};

const inputStyle = {
  padding: "12px",
  width: "350px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
  outline: "none",
};

const rowStyle = {
  display: "flex",
  alignItems: "center",
  padding: "15px 20px",
  borderRadius: "12px",
  marginBottom: "10px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
};

const imgStyle = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  marginRight: "20px",
};

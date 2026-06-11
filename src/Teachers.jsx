import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "profiles"));
        const teacherList = [];
        querySnapshot.forEach((doc) => {
          teacherList.push({ id: doc.id, ...doc.data() });
        });
        setTeachers(teacherList);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <div
      className="mobile-padding"
      style={{
        padding: "40px",
        fontFamily: "'Poppins', sans-serif",
        background: "#f9f9f9",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1 style={{ color: "#103741" }}>Teachers Directory</h1>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "#FE5D37",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Back to Dashboard
        </button>
      </div>

      {loading ? (
        <p>Loading teachers...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={teacher.picture || "https://via.placeholder.com/100"}
                alt={teacher.name}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "15px",
                }}
              />
              <h3 style={{ margin: "0 0 5px 0", color: "#333" }}>
                {teacher.name || "Unnamed Teacher"}
              </h3>
              <p style={{ margin: "0 0 15px 0", color: "#666" }}>
                {teacher.email}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <button
                  onClick={() => navigate(`/profile/${teacher.id}?view=true`)}
                  style={{
                    background: "#103741",
                    color: "white",
                    padding: "8px 15px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  View Profile
                </button>
                {userRole === "admin" && (
                  <button
                    onClick={() => navigate(`/profile/${teacher.id}`)}
                    style={{
                      background: "#FE5D37",
                      color: "white",
                      padding: "8px 15px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          ))}
          {teachers.length === 0 && <p>No teachers found.</p>}
        </div>
      )}
    </div>
  );
}

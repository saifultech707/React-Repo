import { useEffect, useState } from "react";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
const InfoCard = ({ label, value, icon }) => (
  <div
    style={{
      background: "white",
      padding: "15px 20px",
      borderRadius: "12px",
      width: "100%",
      maxWidth: "400px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
      display: "flex",
      alignItems: "center",
      gap: "15px",
    }}
  >
    <div style={{ fontSize: "24px", color: "#5017b9" }}>{icon}</div>
    <div>
      <p
        style={{
          color: "#64748b",
          fontSize: "13px",
          margin: 0,
          fontWeight: "500",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontWeight: "600",
          fontSize: "16px",
          margin: "4px 0 0 0",
          color: "#1e293b",
          wordBreak: "break-all",
        }}
      >
        {value || "Not provided"}
      </p>
    </div>
  </div>
);

export default function Show() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        console.log("Firebase থেকে ডেটা আনার চেষ্টা করা হচ্ছে...");
        const docRef = doc(db, "profiles", "user1");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("ডেটা পাওয়া গেছে:", docSnap.data());
          setProfile(docSnap.data());
        } else {
          console.log("ডাটাবেসে user1 নামের কোনো ডকুমেন্ট নেই!");
          setErrorMsg(
            "ডাটাবেসে কোনো প্রোফাইল ডেটা পাওয়া যায়নি। আগে প্রোফাইল সেভ করুন।",
          );
        }
      } catch (error) {
        // যদি কোনো এরর হয়, তা এখানে ধরা পড়বে
        console.error("Firebase Error:", error);
        setErrorMsg("ডেটা লোড করতে সমস্যা হচ্ছে। কনসোল চেক করুন।");
      } finally {
        // ডেটা আসুক বা এরর হোক, লোডিং বন্ধ করতেই হবে
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading)
    return (
      <p style={{ padding: "40px", fontSize: "18px" }}>
        ডেটা লোড হচ্ছে, দয়া করে অপেক্ষা করুন...
      </p>
    );

  // যদি এরর থাকে, তবে এরর মেসেজ দেখাবে
  if (errorMsg)
    return (
      <p style={{ padding: "40px", color: "red", fontWeight: "bold" }}>
        {errorMsg}
      </p>
    );

  if (!profile) return <p style={{ padding: "40px" }}>কোনো profile নেই!</p>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px",
        gap: "20px",
      }}
    >
      <h2>My Profile</h2>

      {profile.picture ? (
        <img
          src={profile.picture}
          alt="Profile"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "3px solid #3b82f6",
          }}
        />
      ) : (
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "#007bff",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "50px",
          }}
        >
          👤
        </div>
      )}

      <div
        style={{
          background: "white",
          padding: "15px 30px",
          borderRadius: "10px",
          width: "300px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>নাম</p>
        <p
          style={{ fontWeight: "bold", fontSize: "18px", margin: "5px 0 0 0" }}
        >
          {profile.name || "নাম দেওয়া হয়নি"}
        </p>
      </div>

      <div
        style={{
          background: "white",
          padding: "15px 30px",
          borderRadius: "10px",
          width: "300px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        }}
      >
        <p style={{ color: "#888", fontSize: "12px", margin: 0 }}>মোবাইল</p>
        <p
          style={{ fontWeight: "bold", fontSize: "18px", margin: "5px 0 0 0" }}
        >
          {profile.mobile || "নম্বর দেওয়া হয়নি"}
        </p>
        <InfoCard icon="👤" label="Name" value={profile.name} />
        <InfoCard icon="📧" label="Email" value={profile.email} />
        <div
          style={{
            display: "flex",
            gap: "10px",
            width: "100%",
            maxWidth: "400px",
            marginTop: "10px",
          }}
        >
          {profile.cvLink && (
            <a
              href={profile.cvLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                padding: "12px",
                background: "#10b981",
                color: "white",
                textAlign: "center",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                boxShadow: "0 2px 5px rgba(16, 185, 129, 0.3)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
              }}
            >
              📄 View CV
            </a>
          )}

          {profile.certificateLink && (
            <a
              href={profile.certificateLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                padding: "12px",
                background: "#f59e0b",
                color: "white",
                textAlign: "center",
                textDecoration: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                boxShadow: "0 2px 5px rgba(245, 158, 11, 0.3)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
              }}
            >
              🎓 Certificate
            </a>
          )}
        </div>
        {!profile.cvLink && !profile.certificateLink && (
          <p
            style={{ color: "#94a3b8", fontSize: "14px", fontStyle: "italic" }}
          >
            No documents uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
}

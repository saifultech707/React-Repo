import { useSelector } from "react-redux";

export default function Show() {
  const profile = useSelector((state) => state.profile);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px", gap: "20px" }}>
      <h2>Profile দেখো</h2>

      {profile.picture ? (
        <img src={profile.picture} style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }} />
      ) : (
        <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "#007bff", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>
          👤
        </div>
      )}

      <p><strong>নাম:</strong> {profile.name || "দেওয়া হয়নি"}</p>
      <p><strong>মোবাইল:</strong> {profile.mobile || "দেওয়া হয়নি"}</p>
    </div>
  );
}